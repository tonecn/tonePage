import { IsEnum, IsString } from 'class-validator';
import { BlogPermission } from 'src/blog/blog.permission.enum';

export class UpdateBlogDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  contentUrl: string;

  @IsEnum(BlogPermission, { each: true, message: '请求类型错误' })
  permissions: BlogPermission[];
}
