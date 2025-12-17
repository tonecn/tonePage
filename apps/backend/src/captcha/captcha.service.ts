import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/common/constants/error-codes';
import { BusinessException } from 'src/common/exceptions/business.exception';

export enum CaptchaContext {
    SEND_SMS = 'send_sms',
    PASSKEY = 'passkey',
}

@Injectable()
export class CaptchaService {
    public async generate(context: CaptchaContext, ip: string, userId?: string) {
        await this.checkRateLimit(ip, context)
    }

    public async verify(token: string, ip: string, userId?: string) {

    }

    private async checkRateLimit(ip: string, context: CaptchaContext) {
        /** @todo */
        throw new BusinessException({
            code: ErrorCode.CAPTCHA_RARE_LIMIT,
            message: '服务器处理不过来了，过会儿再试试吧',
        });
    }
}
