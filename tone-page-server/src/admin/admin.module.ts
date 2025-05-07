import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminUserController } from './controller/admin-user.controller';
import { AdminUserService } from './service/admin-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ])
  ],
  controllers: [
    AdminController,
    AdminUserController,
  ],
  providers: [
    AdminUserService,
  ]
})
export class AdminModule { }
