import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BlogPermission } from 'src/blog/blog.permission.enum';

export class UpdateBlogDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(BlogPermission, { each: true, message: '请求类型错误' })
  permissions: BlogPermission[];
}
