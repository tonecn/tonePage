import {
  BadRequestException,
  Body,
  Controller,
  NotImplementedException,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginByPasswordDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { UserSessionService } from 'src/user/services/user-session.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly userSessionService: UserSessionService,
  ) { }

  // @Post('login')
  // @UseGuards(ThrottlerGuard)
  // @Throttle({ default: { limit: 20, ttl: 60000 } })
  // async login(@Body() loginDto: LoginDto) {
  //   switch (loginDto.type) {
  //     case 'password':
  //       return this.authService.loginWithPassword(loginDto);
  //     case 'phone':
  //       return this.authService.loginWithPhone(loginDto);
  //     case 'email':
  //       return this.authService.loginWithEmail(loginDto);
  //     default:
  //       throw new BadRequestException('服务器错误');
  //   }
  // }

  private setUserSession(res: Response, sessionId: string) {
    res.cookie('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      // 永不过期，不用设置maxAge
      path: '/',
    })
  }

  @Post('login/password')
  async loginByPassword(
    @Body() loginDto: LoginByPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { identifier, password } = loginDto;
    const session = await this.authService.loginWithPassword(identifier, password);
    this.setUserSession(res, session.sessionId);
    return {
      user: await this.userService.findById(session.userId),
    };
  }

  @Post('sms/send')
  async sendSms() {
    throw new NotImplementedException();
  }

  @Post('login/sms')
  async loginBySms() {
    throw new NotImplementedException();
  }

  @Post('passkey/login/options')
  async loginByPasskeyOptions() {
    throw new NotImplementedException();
  }

  @Post('passkey/login')
  async loginByPasskey() {
    throw new NotImplementedException();
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    const { userId, sessionId } = req.user;
    await this.userSessionService.invalidateSession(userId, sessionId);

    return true;
  }
}
