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
import { SmsLoginDto } from './dto/sms-login.dto';
import { SmsService } from 'src/sms/sms.service';
import { UserSession } from 'src/user/entities/user-session.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly userSessionService: UserSessionService,
    private readonly smsService: SmsService,
  ) { }

  private setUserSession(res: Response, session: UserSession) {
    res.cookie('session', session.sessionId, {
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
    this.setUserSession(res, session);
    return {
      user: await this.userService.findById(session.userId),
    };
  }

  @Post('login/sms')
  async loginBySms(
    @Body() dto: SmsLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { phone, code } = dto;
    await this.smsService.checkSms(phone, 'login', code);
    // 验证通过，（注册并）登陆
    const session = await this.authService.loginWithPhone(phone);
    this.setUserSession(res, session);
    return {
      user: await this.userService.findById(session.userId),
    }
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
