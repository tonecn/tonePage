import { IsPhoneNumber, Matches } from "class-validator";

export class SmsLoginDto {
    @IsPhoneNumber('CN', {
        message: '请输入有效的中国大陆手机号',
    })
    phone: string;

    @Matches(/^\d{6}$/, {
        message: '验证码必须是6位数字',
    })
    code: string;
}