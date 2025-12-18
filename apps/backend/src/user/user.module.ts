import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule), // 解决循环依赖问题
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [
    UserService,
    TypeOrmModule.forFeature([User]),
  ],
})
export class UserModule { }
