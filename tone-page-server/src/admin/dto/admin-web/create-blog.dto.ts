import { IsEnum, IsString } from 'class-validator';
import { BlogPermission } from 'src/blog/bloga.permission.enum';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  contentUrl: string;

  @IsEnum(BlogPermission, { each: true, message: '请求类型错误' })
  permissions: BlogPermission[];

  @IsString()
  password: string; // 允许空串
}
