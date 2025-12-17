import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UserSession } from '../entities/user-session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) { }

  async createSession(userId: string): Promise<UserSession> {
    const session = this.userSessionRepository.create({
      userId,
    });
    return this.userSessionRepository.save(session);
  }

  async getSession(sessionId: string) {
    const session = await this.userSessionRepository.findOne({
      where: {
        sessionId,
      },
    });

    return session;
  }

  async invalidateSession(sessionId: string, reason?: string): Promise<void> {
    await this.userSessionRepository.update(
      { sessionId, deletedAt: null },
      {
        deletedAt: new Date(),
        disabledReason: reason || null,
      }
    )
  }
}
