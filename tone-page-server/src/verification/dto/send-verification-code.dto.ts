import { IsEnum, IsString, Length, ValidateIf } from "class-validator";

export class SendVerificationCodeDto {
    @IsEnum(['phone', 'email'], { message: '请求类型错误' })
    targetType: 'phone' | 'email';

    @IsEnum(['login'], { message: '请求类型错误' })
    type: 'login'

    @ValidateIf(o => o.targetType === 'phone')
    @IsString({ message: '手机号必须输入' })
    @Length(11, 11, { message: '手机号异常' })// 中国大陆，11位数字
    phone?: string;

    @ValidateIf(o => o.targetType === 'email')
    @IsString({ message: '邮箱必须输入' })
    @Length(6, 254, { message: '邮箱异常' })// RFC 5321
    email?: string;
}