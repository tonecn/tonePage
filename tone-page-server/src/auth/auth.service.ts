import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    async loginWithPassword(loginDto: LoginDto) {
        const { account, password } = loginDto;
        if (!account || !password) {
            throw new BadRequestException('account and password are required');
        }

        return { message: 'Logged in with password', data: loginDto };
    }

    async loginWithPhone(loginDto: LoginDto) {
        const { phone, code } = loginDto;
        if (!phone || !code) {
            throw new BadRequestException('Phone number and code are required');
        }

        return { message: 'Logged in with phone', data: loginDto };
    }

    async loginWithEmail(loginDto: LoginDto) {
        const { email, code } = loginDto;
        if (!email || !code) {
            throw new BadRequestException('Email and code are required');
        }

        return { message: 'Logged in with email', data: loginDto };
    }
}