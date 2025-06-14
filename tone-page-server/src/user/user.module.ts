import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSession } from './entities/user-session.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserSessionService } from './services/user-session.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSession]),
    forwardRef(() => AuthModule), // 解决循环依赖问题
  ],
  controllers: [UserController],
  providers: [UserService, UserSessionService],
  exports: [UserService, UserSessionService],
})
export class UserModule {}
