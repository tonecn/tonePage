import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { RolePermissionService } from './services/role-permission.service';
import { RoleService } from './services/role.service';
import { UserRoleService } from './services/user-role.service';
import { UserRole } from './entities/user-role.entity';
import { PermissionService } from './services/permission.service';

@Module({
    imports: [TypeOrmModule.forFeature([Role, Permission, RolePermission, UserRole])],
    providers: [RolePermissionService, RoleService, UserRoleService, PermissionService],
    exports: [RolePermissionService, RoleService, UserRoleService, PermissionService],
})
export class RoleModule { }
