import { createHash } from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserSessionService } from 'src/user/services/user-session.service';
import { VerificationService } from 'src/verification/verification.service';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ErrorCode } from 'src/common/constants/error-codes';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userSessionService: UserSessionService,
    private readonly verificationService: VerificationService,
  ) { }

  async loginWithPassword(identifier: string, password: string) {
    // 依次使用邮箱、手机号、账号登陆（防止有大聪明给账号改成别人的邮箱或手机号）
    const user = await this.userService.findOne(
      [{ email: identifier }, { phone: identifier }, { username: identifier }],
      {
        withDeleted: true,
      },
    );

    if (user && user.deletedAt !== null) {
      throw new BusinessException({
        message: '该账号注销中',
        code: ErrorCode.USER_ACCOUNT_DEACTIVATED,
      });
    }

    if (user === null || !user.password_hash || !user.salt) {
      throw new BusinessException({
        message: '账户或密码错误',
        code: ErrorCode.AUTH_INVALID_CREDENTIALS
      });
    }

    // 判断密码是否正确
    const hashedPassword = this.hashPassword(password, user.salt);
    if (hashedPassword !== user.password_hash) {
      throw new BusinessException({
        message: '账户或密码错误',
        code: ErrorCode.AUTH_INVALID_CREDENTIALS
      });
    }

    // 登录成功，颁发token
    return {
      token: await this.generateToken(user),
      userId: user.userId,
    };
  }

  async loginWithPhone(data: { phone: string; code: string; }) {
    const { phone, code } = data;
    // 先判断验证码是否正确
    const isValid = this.verificationService.verifyPhoneCode(
      phone,
      code,
      'login',
    );
    switch (isValid) {
      case 0:
        break;
      case -1:
        throw new BadRequestException('验证码已过期');
      case -2:
        throw new BadRequestException('验证码错误');
      case -3:
        throw new BadRequestException('验证码已失效');
      default:
        throw new BadRequestException('验证码错误');
    }

    // 判断用户是否存在，若不存在则进行注册
    let user = await this.userService.findOne({ phone }, { withDeleted: true });
    if (user && user.deletedAt !== null) {
      throw new BadRequestException('该账号注销中，请使用其他手机号');
    }

    if (!user) {
      // 执行注册操作
      user = await this.userService.create({ phone: phone });
    }

    if (!user || !user.userId) {
      // 注册失败或用户信息错误
      throw new BadRequestException('请求失败，请稍后再试');
    }

    // 登录，颁发token
    return {
      token: await this.generateToken(user),
    };
  }

  private hashPassword(password: string, salt: string): string {
    return createHash('sha256').update(`${password}${salt}`).digest('hex');
  }

  private async generateToken(user: User) {
    // 存储
    const sessionRes = await this.userSessionService.createSession(
      user.userId,
    );

    const payload = {
      userId: user.userId,
      sessionId: sessionRes.sessionId,
    };

    // 颁发token
    return this.jwtService.sign(payload);
  }
}
