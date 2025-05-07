import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { RoleService } from "src/role/services/role.service";
import { UserRoleService } from "src/role/services/user-role.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly userRoleService: UserRoleService,
        private readonly roleService: RoleService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) return true;
        

        const request = context.switchToHttp().getRequest();
        const userId = request.user?.userId;

        if (!userId) return false;

        // 查询用户拥有的有效角色Id
        const userRoleIds = await this.userRoleService.findValidRoleIdsByUserId(userId);

        // 查询用户角色Id对应的角色名
        const userRoleNames = await this.roleService.findRoleNamesByRoleIds(userRoleIds);

        return requiredRoles.some(role => userRoleNames.includes(role));
    }
}