import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    async loginWithPassword(loginDto: LoginDto) {
        const { account, password } = loginDto;
        // 依次使用账号、手机号、邮箱登录

        return { message: 'Logged in with password', data: loginDto };
    }

    async loginWithPhone(loginDto: LoginDto) {
        const { phone, code } = loginDto;
        // 先判断验证码是否正确


        // 判断用户是否存在，若不存在则进行注册


        // 登录，颁发token

        return { message: 'Logged in with phone', data: loginDto };
    }

    async loginWithEmail(loginDto: LoginDto) {
        const { email, code } = loginDto;
        // 先判断验证码是否正确


        // 判断用户是否存在，若不存在则进行注册


        // 登录，颁发token

        return { message: 'Logged in with email', data: loginDto };
    }
}