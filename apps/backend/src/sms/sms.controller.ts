import { Body, Controller, Post } from '@nestjs/common';
import { SendLoginSmsDto } from './dto/send-login-sms.dto';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {

    constructor(private readonly smsService: SmsService) { }

    @Post('send/login')
    async sendLoginSms(@Body() dto: SendLoginSmsDto) {
        await this.smsService.sendSms(dto.phone, 'login');
        return null;
    }
}
