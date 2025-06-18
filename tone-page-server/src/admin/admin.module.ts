import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminUserController } from './controller/admin-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { AdminWebResourceController } from './controller/web/admin-web-resource.controller';
import { AdminWebBlogController } from './controller/web/admin-web-blog.controller';
import { ResourceModule } from 'src/resource/resource.module';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    RoleModule,
    ResourceModule,
    BlogModule,
  ],
  controllers: [
    AdminController,
    AdminUserController,
    AdminWebResourceController,
    AdminWebBlogController,
  ],
})
export class AdminModule {}
