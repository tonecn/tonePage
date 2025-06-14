import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateDto {
  @IsString({ message: '用户名不得为空' })
  @Length(4, 32, { message: '用户名长度只能为4~32' })
  username: string;

  @IsString({ message: '昵称不得为空' })
  @Length(1, 30, { message: '昵称长度只能为1~30' })
  nickname: string;

  @IsOptional()
  @IsEmail({}, { message: '请输入有效的邮箱地址', always: false })
  @Length(6, 254, {
    message: '邮箱长度只能为6~254',
    // 仅在值不为 null 或 undefined 时验证
    always: false,
  })
  email?: string;

  @IsOptional() // 标记字段为可选
  @IsString({ message: '手机号不得为空', always: false })
  @Matches(/^1[3456789]\d{9}$/, {
    message: '请输入有效的手机号码',
    // 仅在值不为 null 或 undefined 时验证
    always: false,
  })
  phone?: string;
}
