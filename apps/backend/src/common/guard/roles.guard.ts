import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthUser } from 'src/auth/decorator/current-user.decorator';
import { Role } from 'src/auth/role.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {

  private logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const authUser = request.user as AuthUser;

    if (!authUser) {
      this.logger.warn(
        `Path: ${request.path} has RolesGuard enabled, but it seems AuthGuard was forgotten.`
      )
      throw new InternalServerErrorException('服务器内部错误');
    }

    const { userId } = authUser;
    const user = await this.userService.findOne({ userId })
    if (!user) {
      this.logger.warn(
        `UserId: ${user.userId} has a valid login credential, but the user information does not exist.`
      )
      throw new UnauthorizedException('用户不存在');
    }

    if (!requiredRoles.some((role) => user.roles.includes(role))) {
      throw new ForbiddenException('权限不足');
    }

    return true;
  }
}
