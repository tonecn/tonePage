import { IsString, Length, ValidateIf } from "class-validator";

export class CreateDto {
    @ValidateIf(o => o.username !== null)
    @IsString({ message: '用户名不得为空' })
    @Length(6, 32, { message: '用户名长度只能为6~32' })
    username: string | null;

    @ValidateIf(o => o.username !== null)
    @IsString({ message: '昵称不得为空' })
    @Length(6, 30, { message: '昵称长度只能为6~30' })
    nickname: string | null;

    @ValidateIf(o => o.username !== null)
    @IsString({ message: '邮箱不得为空' })
    @Length(6, 254, { message: '邮箱长度只能为6~254' })
    email: string | null;

    @ValidateIf(o => o.username !== null)
    @IsString({ message: '手机号不得为空' })
    @Length(11, 11, { message: '手机号长度只能为11' })
    phone: string | null;
}