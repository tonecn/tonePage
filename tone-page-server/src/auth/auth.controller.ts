import { BadRequestException, Body, Controller, Get, Post, Request } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        switch (loginDto.type) {
            case 'password':
                return this.authService.loginWithPassword(loginDto);
            case 'phone':
                return this.authService.loginWithPhone(loginDto);
            case 'email':
                return this.authService.loginWithEmail(loginDto);
            default:
                throw new BadRequestException('服务器错误');
        }
    }
}
