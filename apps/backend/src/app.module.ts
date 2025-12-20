import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { VerificationModule } from './verification/verification.module';
import { NotificationModule } from './notification/notification.module';
import { ResourceModule } from './resource/resource.module';
import { BlogModule } from './blog/blog.module';
import { AdminModule } from './admin/admin.module';
import { OssModule } from './oss/oss.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CaptchaModule } from './captcha/captcha.module';
import { SmsModule } from './sms/sms.module';
import { CommonModule } from './common/common.module';
import { AppDataSource } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => AppDataSource.options,
    }),
    ThrottlerModule.forRoot({
      ignoreUserAgents: [/googlebot/i, /bingbot/i],
      throttlers: [
        {
          name: 'min',
          limit: 100,
          ttl: 60 * 1000,
        },
        {
          name: 'hour',
          limit: 500,
          ttl: 60 * 60 * 1000,
        },
        {
          name: 'day',
          limit: 10000,
          ttl: 24 * 60 * 60 * 1000,
        },
      ],
    }),
    UserModule,
    AuthModule,
    VerificationModule,
    NotificationModule,
    ResourceModule,
    BlogModule,
    AdminModule,
    OssModule,
    CaptchaModule,
    SmsModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
