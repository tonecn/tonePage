import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SendLoginSmsDto } from './dto/send-login-sms.dto';
import { SmsService } from './sms.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('sms')
export class SmsController {

    constructor(private readonly smsService: SmsService) { }

    @Post('send/login')
    @UseGuards(ThrottlerGuard)
    @Throttle({ sms_login: { limit: 10, ttl: 60000 } })
    async sendLoginSms(@Body() dto: SendLoginSmsDto) {
        await this.smsService.sendSms(dto.phone, 'login');
        return null;
    }
}
