import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { VerificationService } from './verification.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) { }

  // @Post('send')
  // @UseGuards(ThrottlerGuard)
  // @Throttle({ default: { limit: 20, ttl: 60000 } })
  // async sendVerificationCode(@Body() dto: SendVerificationCodeDto) {
  //   switch (dto.type) {
  //     case 'login':
  //       switch (dto.targetType) {
  //         case 'phone':
  //           return this.verificationService.sendPhoneCode(dto.phone, dto.type);
  //         case 'email':
  //           return this.verificationService.sendEmailCode(dto.email, dto.type);
  //         default:
  //           throw new BadRequestException('不支持的目标类型');
  //       }
  //     default:
  //       throw new BadRequestException('不支持的验证码类型');
  //   }
  // }
}
