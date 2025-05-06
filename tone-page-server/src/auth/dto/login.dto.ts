import { IsEnum, IsString, Length, ValidateIf } from 'class-validator';

export class LoginDto {
    @IsEnum(['password', 'phone', 'email'], { message: '请求类型错误' })
    type: 'password' | 'phone' | 'email';

    @ValidateIf(o => o.type === 'password')
    @IsString({ message: '账户必须输入' })
    @Length(1, 254, { message: '账户长度错误' })// 用户名、邮箱、手机号
    account?: string;

    @ValidateIf(o => o.type === 'password')
    @IsString({ message: '密码必须输入' })
    @Length(6, 32, { message: '密码长度错误' })// 6-32位
    password?: string;

    @ValidateIf(o => o.type === 'phone')
    @IsString({ message: '手机号必须输入' })
    @Length(11, 11, { message: '手机号长度错误' })// 中国大陆，11位数字
    phone?: string;

    @ValidateIf(o => o.type === 'email')
    @IsString({ message: '邮箱必须输入' })
    @Length(6, 254, { message: '邮箱长度错误' })// RFC 5321
    email?: string;

    @ValidateIf(o => o.type === 'phone' || o.type === 'email')
    @IsString({ message: '验证码必须输入' })
    @Length(6, 6, { message: '验证码长度错误' })// 6位数字
    code?: string;
}