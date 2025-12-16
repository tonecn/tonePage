import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserSessionService } from 'src/user/services/user-session.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
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

    await this.userSessionService.isSessionValid(
      userId,
      sessionId,
    ).catch((e) => {
      throw new UnauthorizedException(`${e}`);
    });

    const user = await this.userService.findOne({ userId });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    return {
      ...user,
      sessionId,
    };
  }
}
