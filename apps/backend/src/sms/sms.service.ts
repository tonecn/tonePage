import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import Dypnsapi, * as $Dypnsapi from '@alicloud/dypnsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import { randomInt } from 'crypto';
import { MoreThan, Repository } from 'typeorm';
import { SmsRecord } from './entity/sms-record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ErrorCode } from 'src/common/constants/error-codes';

const LoginSmsExpiredMin = 5;
const LoginSmsMaxTryCount = 5;

const devMode = process.env.NODE_ENV !== 'production';

@Injectable()
export class SmsService {

    private logger = new Logger(SmsService.name);

    private client: Dypnsapi;

    constructor(
        @InjectRepository(SmsRecord)
        private readonly smsRecordRepository: Repository<SmsRecord>
    ) {
        const config = new $OpenApi.Config({})
        config.accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID;
        config.accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET;

        this.client = new Dypnsapi(config as any);
    }

    private generateSmsCode(): string {
        // 生成 0 到 999999 的随机整数，补零到 6 位
        const code = randomInt(0, 1_000_000);
        return code.toString().padStart(6, '0');
    }

    async checkSendSmsLimit(phone: string, type: string): Promise<void> {
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // 1. 检查 1 分钟内是否已发送
        const recentRecord = await this.smsRecordRepository.findOne({
            where: {
                phone,
                type,
                createdAt: MoreThan(twentyFourHoursAgo),
            },
            order: { createdAt: 'DESC' },
        });

        if (recentRecord && recentRecord.createdAt > oneMinuteAgo) {
            throw new BusinessException({ message: '操作太快了，一分钟后重试吧' }); // 距离上一条不足 1 分钟
        }

        // 2. 检查 24 小时内是否超过 10 条
        const count = await this.smsRecordRepository.count({
            where: {
                phone,
                type,
                createdAt: MoreThan(twentyFourHoursAgo),
            },
        });

        if (count >= 10) {
            throw new BusinessException({ message: '操作太快了，稍后再重试吧' }); // 24 小时超过 10 条
        }
    }

    async sendSms(phone: string, type: 'login') {
        if (type === 'login') {
            // 检查限流
            await this.checkSendSmsLimit(phone, type);

            // 生成
            const code = this.generateSmsCode();
            const smsRecord = this.smsRecordRepository.create({
                phone,
                type,
                code,
                expiredAt: new Date(Date.now() + LoginSmsExpiredMin * 60 * 1000),
            });

            // 发送
            const request = new $Dypnsapi.SendSmsVerifyCodeRequest({});
            request.phoneNumber = phone;
            request.signName = '速通互联验证码';
            request.templateCode = '100001';
            request.templateParam = JSON.stringify({
                code,
                min: `${LoginSmsExpiredMin}`,
            })


            let success: boolean = false;

            if (devMode) {
                success = true;
                this.logger.debug(`${phone}:${code}`)
            } else {
                await this.client.sendSmsVerifyCode(request).then(a => {
                    success = a.body?.success || false;
                }, err => {
                    console.error(err);
                });
            }

            if (success) {
                this.smsRecordRepository.save(smsRecord).catch(e => {
                    this.logger.warn(e, 'sendSms:saveRecord');
                })
            }

            return success;
        } else {
            throw new InternalServerErrorException('未知的Sms类型');
        }
    }

    async checkSms(phone: string, type: 'login', code: string) {
        if (type === 'login') {
            const now = new Date();

            const record = await this.smsRecordRepository.findOne({
                where: {
                    phone,
                    type,
                    expiredAt: MoreThan(now),
                    usedAt: null,
                },
                order: { createdAt: 'DESC' },
            });

            if (!record) {
                throw new BusinessException({
                    code: ErrorCode.SMS_CODE_EXPIRED,
                    message: '验证码已失效，请重新获取',
                })
            }

            // 检查尝试次数
            if (record.tryCount >= LoginSmsMaxTryCount) {
                throw new BusinessException({
                    code: ErrorCode.SMS_CODE_EXPIRED,
                    message: '验证码已失效，请重新获取',
                })
            }

            // 检查是否匹配
            if (record.code !== code) {
                // 增加尝试次数
                record.tryCount = (record.tryCount || 0) + 1;
                await this.smsRecordRepository.save(record);

                if (record.tryCount >= LoginSmsMaxTryCount) {
                    throw new BusinessException({
                        code: ErrorCode.SMS_CODE_EXPIRED,
                        message: '验证码已失效，请重新获取',
                    })
                }

                throw new BusinessException({
                    code: ErrorCode.SMS_CODE_INCORRECT,
                    message: '验证码不对的喔～',
                })
            }

            record.usedAt = new Date();
            await this.smsRecordRepository.save(record);
        } else {
            throw new InternalServerErrorException('未知的Sms类型');
        }
    }
}
