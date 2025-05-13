import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { createHash, ECDH } from 'crypto';
import { v4 as uuid } from 'uuid';

type UserFindOptions = Partial<Pick<User, 'userId' | 'username' | 'phone' | 'email'>>;

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findOne(options: UserFindOptions | UserFindOptions[]): Promise<User | null> {
        if (Object.keys(options).length === 0) {
            throw new BadRequestException('查询条件不能为空');
        }
        return this.userRepository.findOne({ where: options });
    }

    async create(user: Partial<User>): Promise<User> {
        try {
            const newUser = this.userRepository.create(user);
            return await this.userRepository.save(newUser);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new ConflictException(this.getDuplicateErrorMessage(error));
            }
            throw new BadRequestException('创建用户失败');
        }
    }

    async update(userId: string, user: Partial<User>): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { userId } });
        if (!existingUser) {
            throw new BadRequestException('User not found');
        }
        try {
            Object.assign(existingUser, user);
            return await this.userRepository.save(existingUser);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new ConflictException(this.getDuplicateErrorMessage(error));
            }
        }
    }

    async delete(userId: string): Promise<void> {
        const existingUser = await this.userRepository.findOne({ where: { userId } });
        if (!existingUser) {
            throw new BadRequestException('User not found');
        }
        await this.userRepository.softDelete(existingUser.userId);
    }

    hashPassword(password: string, salt: string): string {
        return createHash('sha256').update(`${password}${salt}`).digest('hex');
    }

    generateSalt(): string {
        return uuid().replace(/-/g, '');
    }

    async setPassword(userId: string, password: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { userId } });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const salt = this.generateSalt();
        user.password_hash = this.hashPassword(password, salt);
        user.salt = salt;
        return this.userRepository.save(user);
    }

    private getDuplicateErrorMessage(error: QueryFailedError): string {
        // 根据具体的错误信息返回友好的提示
        if (error.message.includes('IDX_user_username')) {
            return '账户名已被使用';
        }
        if (error.message.includes('IDX_user_email')) {
            return '邮箱已被使用';
        }
        if (error.message.includes('IDX_user_phone')) {
            return '手机号已被使用';
        }
        return '数据已存在，请检查输入';
    }
}
