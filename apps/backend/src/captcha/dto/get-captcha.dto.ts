import { IsEnum, IsOptional, IsUUID } from "class-validator";

export enum CaptchaContext {
    SEND_SMS = 'send_sms',
    PASSKEY = 'passkey',
}

export class GetCaptchaDto {

    @IsEnum(CaptchaContext, { message: '无效的context' })
    context: string;

    @IsOptional()
    @IsUUID('4', { message: 'userId不合法' })
    userId?: string;
}