import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from 'src/auth/entity/user-session.entity';
import { ConfigModule } from '@nestjs/config';
import { VerificationModule } from 'src/verification/verification.module';
import { AuthGuard } from './guards/auth.guard';
import { OptionalAuthGuard } from './guards/optional-auth.guard';
import { SmsModule } from 'src/sms/sms.module';
import { PasskeyCredential } from './entity/passkey-credential.entity';
import { UserSessionService } from './service/user-session.service';
import { PasskeyService } from './service/passkey.service';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([UserSession, PasskeyCredential]),
    VerificationModule,
    SmsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserSessionService, PasskeyService, AuthGuard, OptionalAuthGuard],
  exports: [AuthService, UserSessionService, PasskeyService, AuthGuard, OptionalAuthGuard],
})
export class AuthModule { }
