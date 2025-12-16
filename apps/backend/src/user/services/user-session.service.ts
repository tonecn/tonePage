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

  /**
   * @throws string 无效原因
   */
  async isSessionValid(userId: string, sessionId: string): Promise<void> {
    const session = await this.userSessionRepository.findOne({
      where: {
        userId,
        sessionId,
      },
      withDeleted: true,
    });

    if (session === null) {
      throw '登陆凭证无效';
    }

    if (session.deletedAt !== null) {
      throw session.disabledReason || '登陆凭证无效';
    }

    return null;
  }

  async invalidateSession(userId: string, sessionId: string, reason?: string): Promise<void> {
    await this.userSessionRepository.update(
      { userId, sessionId, deletedAt: null },
      {
        deletedAt: new Date(),
        disabledReason: reason || null,
      }
    )
  }
}
