// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserSessionService } from 'src/user/services/user-session.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private userSessionService: UserSessionService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        // 从 Cookie 读取 session
        const sessionId = request.cookies?.['session'];
        if (!sessionId) {
            throw new UnauthorizedException('登陆凭证无效，请重新登陆');
        }

        // 验证 session
        const session = await this.userSessionService.getSession(sessionId);
        if (!session) {
            throw new UnauthorizedException('登陆凭证无效，请重新登陆');
        }

        // 附加 user 到 req
        const user = await this.userService.findOne({ userId: session.userId });
        if (!user) {
            throw new UnauthorizedException('用户不存在');
        }

        (request as any).user = { ...user, sessionId };
        return true;
    }
}