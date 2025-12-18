import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PasskeyCredential } from "../entity/passkey-credential.entity";
import { Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { randomBytes } from 'crypto';
import { generateAuthenticationOptions, GenerateAuthenticationOptionsOpts, generateRegistrationOptions, GenerateRegistrationOptionsOpts, VerifiedAuthenticationResponse, VerifiedRegistrationResponse, verifyAuthenticationResponse, verifyRegistrationResponse } from "@simplewebauthn/server";


interface ChallengeEntry {
    value: string;
    expiresAt: number;
}

class MemoryChallengeStore {
    private store = new Map<string, ChallengeEntry>();
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor(private ttlMs: number = 5 * 60 * 100) {
        this.startCleanup();
    }

    set(key: string, value: string): void {
        this.store.set(key, {
            value,
            expiresAt: Date.now() + this.ttlMs,
        });
    }

    get(key: string): string | null {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return entry.value;
    }

    delete(key: string): void {
        this.store.delete(key);
    }

    private startCleanup(): void {
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            for (const [key, entry] of this.store.entries()) {
                if (now > entry.expiresAt) {
                    this.store.delete(key);
                }
            }
        }, 60_000); // 每分钟清理一次
    }

    stopCleanup(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
}

const registrationChallenges = new MemoryChallengeStore(5 * 60 * 1000); // 5 分钟过期
const authenticationChallenges = new MemoryChallengeStore(5 * 60 * 1000);


@Injectable()
export class PasskeyService implements OnModuleDestroy {

    private readonly rpID: string;
    private readonly origin: string;
    private readonly rpName: string;

    constructor(
        @InjectRepository(PasskeyCredential)
        private readonly passkeyRepo: Repository<PasskeyCredential>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        this.rpID = process.env.WEBAUTHN_RP_ID;
        this.origin = process.env.WEBAUTHN_ORIGIN;
        this.rpName = process.env.WEBAUTHN_RP_NAME;

        if (!this.rpID || !this.origin || !this.rpName) {
            throw new Error('Missing required env: WEBAUTHN_RP_ID or WEBAUTHN_ORIGIN');
        }
    }

    onModuleDestroy() {
        registrationChallenges.stopCleanup();
        authenticationChallenges.stopCleanup();
    }

    private generateChallenge(length: number = 32): string {
        return randomBytes(length).toString('base64');
    }

    async getRegistrationOptions(userId: string) {
        const user = await this.userRepository.findOneBy({ userId });
        if (!user) {
            throw new NotFoundException('用户不存在');
        }

        const challenge = this.generateChallenge();

        const opts: GenerateRegistrationOptionsOpts = {
            rpName: this.rpName,
            rpID: this.rpID,
            userID: Buffer.from(userId),
            userName: user.username || 'user',
            userDisplayName: user.nickname || 'User',
            challenge,
            authenticatorSelection: {
                residentKey: 'required', // 必须是可发现凭证（Passkey）
                userVerification: 'preferred',
            },
            supportedAlgorithmIDs: [-7], // ES256
            timeout: 60000,
        };

        const options = await generateRegistrationOptions(opts);
        registrationChallenges.set(userId, options.challenge)
        return options;
    }

    async register(userId: string, credentialResponse: any, name: string): Promise<PasskeyCredential> {
        const expectedChallenge = registrationChallenges.get(userId);
        if (!expectedChallenge) {
            throw new BadRequestException('注册失败，请重试');
        }

        let verification: VerifiedRegistrationResponse;
        try {
            verification = await verifyRegistrationResponse({
                response: credentialResponse,
                expectedChallenge,
                expectedOrigin: this.origin,
                expectedRPID: this.rpID,
                requireUserVerification: false,
            });
        } catch (err) {
            throw new BadRequestException('注册失败');
        }

        if (!verification.verified) {
            throw new BadRequestException('注册失败');
        }

        const { credential } = verification.registrationInfo;
        if (!credential) {
            throw new InternalServerErrorException('服务器内部错误');
        }

        // 保存凭证到数据库
        const passkey = this.passkeyRepo.create({
            user: { userId } as User,
            name: name || '新的通行证',
            credentialId: credential.id,
            publicKey: credential.publicKey.toString(),
            signCount: credential.counter,
            verified: true,
        });

        await this.passkeyRepo.save(passkey);
        registrationChallenges.delete(userId);

        return passkey;
    }

    async getAuthenticationOptions(sessionId: string) {
        const challenge = this.generateChallenge();
        authenticationChallenges.set(sessionId, challenge);

        const opts: GenerateAuthenticationOptionsOpts = {
            rpID: this.rpID,
            challenge,
            timeout: 60000,
            userVerification: 'preferred',
        };

        return generateAuthenticationOptions(opts);
    }

    async login(sessionId: string, credentialResponse: any): Promise<User> {
        const expectedChallenge = authenticationChallenges.get(sessionId);
        if (!expectedChallenge) {
            throw new BadRequestException('认证失败，请重试');
        }

        const credentialId = credentialResponse.id;
        const passkey = await this.passkeyRepo.findOne({
            where: { credentialId, verified: true },
            relations: ['user'],
        });

        if (!passkey) {
            throw new NotFoundException('未找到可用的通信证');
        }

        let verification: VerifiedAuthenticationResponse;
        try {
            verification = await verifyAuthenticationResponse({
                response: credentialResponse,
                expectedChallenge,
                expectedOrigin: this.origin,
                expectedRPID: this.rpID,
                credential: {
                    id: passkey.credentialId,
                    publicKey: Buffer.from(passkey.publicKey),
                    counter: passkey.signCount,
                },
                requireUserVerification: false,
            });
        } catch (err) {
            throw new BadRequestException('认证失败');
        }

        if (!verification.verified) {
            throw new BadRequestException('认证失败');
        }

        const newSignCount = verification.authenticationInfo.newCounter;
        if (newSignCount !== passkey.signCount) {
            passkey.signCount = newSignCount;
            await this.passkeyRepo.save(passkey);
        }

        authenticationChallenges.delete(sessionId);
        return passkey.user;
    }

    async listUserPasskeys(userId: string): Promise<PasskeyCredential[]> {
        return this.passkeyRepo.find({
            where: { user: { userId }, verified: true },
            select: ['id', 'name', 'createdAt'],
        });
    }

    async removePasskey(userId: string, passkeyId: string): Promise<void> {
        const result = await this.passkeyRepo.delete({
            id: passkeyId,
            user: { userId },
        });

        if (result.affected === 0) {
            throw new NotFoundException('未找到对应的通行证');
        }
    }
}