import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(private readonly notificationService: NotificationService) { }

  private pool: Map<
    string,
    {
      code: string;
      createdAt: number;
      expiredAt: number;
      tryCount: number;
      maxTryCount: number;
    }
  > = new Map();

  /**
   * @deprecated 该方法暂时弃用，因为没有申请到签名
   */
  async sendPhoneCode(phone: string, type: 'login') {
    const key = `phone:${phone}:${type}`;
    // 检测是否在冷却时间内
    // TODO

    // 生成验证码
    const code = this.generateCode();
    this.logger.log(`Phone[${phone}] code: ${code}`);

    // 发送验证码
    // await this.notificationService.sendSMS(phone, type, code);
    // 存储验证码
    this.saveCode(key, code);
    throw new Error('不允许的登陆方式');
    return true;
  }

  async sendEmailCode(email: string, type: 'login') {
    const key = `email:${email}:${type}`;
    // 检测是否在冷却时间内
    if (this.isInCooldownPeriod(key)) {
      throw new BadRequestException('发送过于频繁，请稍后再试');
    }

    // 生成验证码
    const code = this.generateCode();
    // 存储验证码
    this.saveCode(key, code);
    this.logger.log(`Email[${email}] code: ${code}`);
    // 发送验证码
    await this.notificationService
      .sendMail({ type: 'login-verify', targetMail: email, code })
      .catch(() => {
        this.clearCode(key);
        throw new BadRequestException('发送失败，请稍后再试');
      });

    return true;
  }

  private isInCooldownPeriod(key: string) {
    const item = this.pool.get(key);
    if (!item) {
      return false;
    }

    // 冷却60秒
    if (Date.now() - item.createdAt > 60 * 1000) {
      return false;
    }

    return true;
  }

  private saveCode(key: string, code: string) {
    this.pool.set(key, {
      code: code,
      createdAt: Date.now(),
      expiredAt: Date.now() + 10 * 60 * 1000, // 10分钟过期
      tryCount: 0,
      maxTryCount: 5,
    });
  }

  private clearCode(key: string) {
    this.pool.delete(key);
  }

  verifyPhoneCode(phone: string, code: string, type: 'login') {
    const key = `phone:${phone}:${type}`;
    return this.verifyCode(key, code);
  }

  verifyEmailCode(email: string, code: string, type: 'login') {
    const key = `email:${email}:${type}`;
    return this.verifyCode(key, code);
  }

  /**
   * @returns 0: 验证码正确, -1: 验证码不存在或已过期, -2: 验证码错误, -3: 超过最大尝试次数
   */
  private verifyCode(key: string, code: string) {
    const data = this.pool.get(key);
    if (!data) {
      return -1;
    }
    if (data.tryCount >= data.maxTryCount) {
      return -3;
    }
    if (data.expiredAt < Date.now()) {
      return -1;
    }
    if (data.code !== code) {
      data.tryCount++;
      return -2;
    }
    this.pool.delete(key);
    return 0;
  }

  /**
   * 生成100000～999999的随机纯数字验证码
   */
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
