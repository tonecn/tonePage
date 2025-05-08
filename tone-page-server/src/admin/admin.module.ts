import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminUserController } from './controller/admin-user.controller';
import { AdminUserService } from './service/admin-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { AdminRoleController } from './controller/admin-role.controller';
import { AdminPermissionController } from './controller/admin-permission.controller';
import { AdminRolePermissionController } from './controller/admin-role-permission.controller';
import { AdminUserRoleController } from './controller/admin-user-role.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
    UserModule,
    RoleModule,
  ],
  controllers: [
    AdminController,
    AdminUserController,
    AdminRoleController,
    AdminPermissionController,
    AdminRolePermissionController,
    AdminUserRoleController,
  ],
  providers: [
    AdminUserService,
  ]
})
export class AdminModule { }
