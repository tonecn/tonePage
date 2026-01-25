import { IsString, Length, Matches } from 'class-validator';
import { OptionalString } from 'src/common/decorators/optional-string.decorator';

export class CreateDto {
  @OptionalString()
  @IsString({ message: '用户名不得为空' })
  @Length(4, 32, { message: '用户名长度为4-32位，仅支持字母、数字、下划线' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: '用户名仅允许字母、数字、下划线' })
  username: string | null;

  @OptionalString()
  @IsString({ message: '昵称不得为空' })
  @Length(1, 30, { message: '昵称长度为1-30位' })
  nickname: string | null;

  @OptionalString()
  @IsString({ message: '邮箱不得为空' })
  @Length(6, 254, { message: '邮箱长度只能为6~254' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: '请输入有效的邮箱地址' })
  email: string | null;

  @OptionalString()
  @IsString({ message: '手机号不得为空' })
  @Matches(/^1[3456789]\d{9}$/, { message: '请输入有效的中国大陆手机号' })
  phone: string | null;

  @OptionalString()
  @IsString({ message: '密码不得为空' })
  @Length(6, 32, { message: '密码长度为6-32位' })
  @Matches(
    /^[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:'",.<>/?]{6,32}$/,
    { message: '密码支持字母、数字及常见特殊字符，且长度在6~32之间' },
  )
  password: string | null;
}