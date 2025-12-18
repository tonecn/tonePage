import { createHash } from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserSessionService } from 'src/auth/service/user-session.service';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ErrorCode } from 'src/common/constants/error-codes';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userSessionService: UserSessionService,
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

    const { userId } = user;

    return this.userSessionService.createSession(userId);
  }

  async loginWithPhone(phone: string) {
    // 判断用户是否存在，若不存在则进行注册
    let user = await this.userService.findOne({ phone }, { withDeleted: true });
    if (user && user.deletedAt !== null) {
      throw new BadRequestException('该账号注销中，请使用其他手机号');
    }

    if (!user) {
      // 执行注册操作
      user = await this.userService.register({ phone });
    }

    if (!user || !user.userId) {
      // 注册失败或用户信息错误
      throw new BadRequestException('请求失败，请稍后再试');
    }

    return this.userSessionService.createSession(user.userId);
  }

  private hashPassword(password: string, salt: string): string {
    return createHash('sha256').update(`${password}${salt}`).digest('hex');
  }

}
