import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginByPasswordDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { UserSessionService } from 'src/auth/service/user-session.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './guards/auth.guard';
import { SmsLoginDto } from './dto/sms-login.dto';
import { SmsService } from 'src/sms/sms.service';
import { UserSession } from 'src/auth/entity/user-session.entity';
import { PasskeyService } from './service/passkey.service';
import { v4 as uuidv4 } from 'uuid';
import { PasskeyLoginDto } from './dto/passkey-login.dto';
import { AuthUser, CurrentUser } from './decorator/current-user.decorator';
import { PasskeyRegisterDto } from './dto/passkey-register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly userSessionService: UserSessionService,
    private readonly smsService: SmsService,
    private readonly passkeyService: PasskeyService,
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
  async loginByPasskeyOptions(
    @Res({ passthrough: true }) res: Response,
  ) {
    const tempSessionId = uuidv4();
    const options = await this.passkeyService.getAuthenticationOptions(tempSessionId);

    res.cookie('passkey_temp_session', tempSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/passkey/login',
      maxAge: 1 * 60 * 1000,
    });
    return options;
  }

  @Post('passkey/login')
  async loginByPasskey(
    @Req() req: Request,
    @Body() body: PasskeyLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tempSessionId = req.cookies?.passkey_temp_session;
    if (!tempSessionId) {
      throw new BadRequestException('登录失败，请重试');
    }

    try {
      const user = await this.passkeyService.login(tempSessionId, body.credentialResponse);

      const session = await this.userSessionService.createSession(user.userId);

      this.setUserSession(res, session);

      return {
        user: await this.userService.findById(user.userId),
      };
    } catch (error) {
      throw error;
    } finally {
      res.clearCookie('passkey_temp_session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/auth/passkey/login',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('passkey/register/options')
  async getPasskeyRegisterOptions(
    @CurrentUser() user: AuthUser,
  ) {
    const { userId } = user;
    return this.passkeyService.getRegistrationOptions(userId);
  }

  @UseGuards(AuthGuard)
  @Post('passkey/register')
  async registerPasskey(
    @CurrentUser() user: AuthUser,
    @Body() dto: PasskeyRegisterDto,
  ) {
    const { userId } = user;
    const { credentialResponse, name } = dto;

    const passkey = await this.passkeyService.register(userId, credentialResponse, name.trim());

    return {
      id: passkey.id,
      name: passkey.name,
      createdAt: passkey.createdAt,
    };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: AuthUser, @Res({ passthrough: true }) res: Response) {
    const { sessionId } = user;
    await this.userSessionService.invalidateSession(sessionId, '用户主动登出');
    res.clearCookie('session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
    return true;
  }
}
