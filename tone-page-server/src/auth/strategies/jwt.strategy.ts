import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserSessionService } from 'src/user/services/user-session.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userSessionService: UserSessionService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'tone-page'),
    });
  }

  async validate(payload: any) {
    const { userId, sessionId } = payload ?? {};

    const isValidSession = await this.userSessionService.isSessionValid(
      userId,
      sessionId,
    );
    if (!isValidSession) {
      throw new UnauthorizedException('登录凭证已过期，请重新登录');
    }

    return {
      userId,
      sessionId,
    };
  }
}
