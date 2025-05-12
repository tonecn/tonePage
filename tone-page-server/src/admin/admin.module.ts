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
import { AdminWebResourceController } from './controller/web/admin-web-resource.controller';
import { AdminWebBlogController } from './controller/web/admin-web-blog.controller';
import { ResourceModule } from 'src/resource/resource.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
    UserModule,
    RoleModule,
    ResourceModule,
  ],
  controllers: [
    AdminController,
    AdminUserController,
    AdminRoleController,
    AdminPermissionController,
    AdminRolePermissionController,
    AdminUserRoleController,
    AdminWebResourceController,
    AdminWebBlogController,
  ],
  providers: [
    AdminUserService,
  ]
})
export class AdminModule { }
