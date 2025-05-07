import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { UserSession } from "../entities/user-session.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserSessionService {
    constructor(
        @InjectRepository(UserSession)
        private readonly userSessionRepository: Repository<UserSession>,
    ) { }


    async createSession(userId: string, sessionId: string): Promise<UserSession> {
        const session = this.userSessionRepository.create({
            userId,
            sessionId,
        });
        return await this.userSessionRepository.save(session);
    }

    async isSessionValid(userId: string, sessionId: string): Promise<boolean> {
        const session = await this.userSessionRepository.findOne({
            where: {
                userId,
                sessionId,
                deletedAt: null,
            }
        });

        return !!session;
    }
}