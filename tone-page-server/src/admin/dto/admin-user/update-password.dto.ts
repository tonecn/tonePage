import { IsString, Length, Matches } from "class-validator";

export class UpdatePasswordDto {
    @IsString({ message: '密码不得为空' })
    @Length(6, 32, { message: '密码长度只能为6~32' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:'",.<>/?]{6,32}$/,
        { message: '密码必须包含字母和数字，且长度在6~32之间' }
    )
    password: string;
}