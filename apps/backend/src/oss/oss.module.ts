import { Module } from '@nestjs/common';
import { OssService } from './oss.service';
import { OssController } from './oss.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [OssService],
  controllers: [OssController],
  imports: [AuthModule, UserModule],
})
export class OssModule { }
