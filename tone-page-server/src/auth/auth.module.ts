import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from 'src/user/entities/user-session.entity';
import { UserSessionService } from 'src/user/services/user-session.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserSession]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'tone-page',
      signOptions: {
        expiresIn: process.env.EXPIRES_IN || '1d',
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UserSessionService],
})
export class AuthModule { }
