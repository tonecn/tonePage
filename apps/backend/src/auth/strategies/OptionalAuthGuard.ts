import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);
      return true;
    } catch (error) {
      console.error('OptionalAuthGuard error:', error);
      return true; // 如果验证失败，仍然允许访问
    }
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    // info: any,
    // context: ExecutionContext,
    // status?: any,
  ): TUser {
    if (err || !user) {
      return null; // 如果没有用户信息，返回null
    }
    return user; // 如果有用户信息，返回用户对象
  }
}
