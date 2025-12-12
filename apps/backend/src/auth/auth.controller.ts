import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserSessionService } from 'src/user/services/user-session.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userSessionService: UserSessionService,
  ) {}

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
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

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Request() req) {
    const { userId, sessionId } = req.user;
    await this.userSessionService.invalidateSession(userId, sessionId);

    return true;
  }
}
