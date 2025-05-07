import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { PermissionService } from "src/role/services/permission.service";
import { RolePermissionService } from "src/role/services/role-permission.service";
import { UserRoleService } from "src/role/services/user-role.service";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly userRoleService: UserRoleService,
        private readonly rolePermissionService: RolePermissionService,
        private readonly permissionService: PermissionService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions) return true;

        const request = context.switchToHttp().getRequest();
        const userId = request.user?.userId;

        if (!userId) return false;

        // 查询用户拥有的有效角色ID
        const userRoleIds = await this.userRoleService.findValidRoleIdsByUserId(userId);

        // 查询用户拥有的有效角色ID对应的权限ID
        const userPermissionIds = await this.rolePermissionService.findPermissionIdsByRoleIds(userRoleIds);

        // 查询用户拥有的权限ID对应的权限名
        const userPermissionNames = await this.permissionService.findPermissionNamesByPermissionIds(userPermissionIds);

        return requiredPermissions.every(permission => userPermissionNames.includes(permission))
    }
}