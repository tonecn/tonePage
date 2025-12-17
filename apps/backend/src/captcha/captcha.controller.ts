import { Controller, Get } from '@nestjs/common';
import { GetCaptchaDto } from './dto/get-captcha.dto';

@Controller('captcha')
export class CaptchaController {
    @Get()
    async getCaptcha(dto: GetCaptchaDto) {
        
    }
}
