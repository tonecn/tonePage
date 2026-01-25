import { IsString, Length, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: '密码不得为空' })
  @Length(6, 32, { message: '密码长度为6-32位' })
  @Matches(
    /^[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:'",.<>/?]{6,32}$/,
    { message: '密码支持字母、数字及常见特殊字符，且长度在6~32之间' },
  )
  password: string;
}
