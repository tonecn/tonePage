import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SendLoginSmsDto } from './dto/send-login-sms.dto';
import { SmsService } from './sms.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('sms')
export class SmsController {

    constructor(private readonly smsService: SmsService) { }

    @Post('send/login')
    @UseGuards(ThrottlerGuard)
    @Throttle({
        'min': { limit: 3, ttl: 60 * 1000 },
        'hour': { limit: 10, ttl: 60 * 60 * 1000 },
        'day': { limit: 20, ttl: 24 * 60 * 60 * 1000 }
    })
    async sendLoginSms(@Body() dto: SendLoginSmsDto) {
        await this.smsService.sendSms(dto.phone, 'login');
        return null;
    }
}
