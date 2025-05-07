import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { VerificationModule } from './verification/verification.module';
import { NotificationModule } from './notification/notification.module';
import { PassportModule } from '@nestjs/passport';
import { ResourceModule } from './resource/resource.module';
import { BlogModule } from './blog/blog.module';
import { RoleModule } from './role/role.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      entities: [],
      synchronize: process.env.NODE_ENV !== 'production', // Set to false in production
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    AuthModule,
    VerificationModule,
    NotificationModule,
    ResourceModule,
    BlogModule,
    RoleModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
