import { Module } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { CaptchaController } from './captcha.controller';
import { CaptchaRateLimitService } from './service/rate-limit';

@Module({
  providers: [CaptchaService, CaptchaRateLimitService],
  controllers: [CaptchaController],
  imports: [],
})
export class CaptchaModule { }
