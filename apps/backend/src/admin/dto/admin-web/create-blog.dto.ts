import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BlogPermission } from 'src/blog/blog.permission.enum';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;// 允许空串，但如果为空则需要手动设置为null，防止数据库唯一键冲突

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(BlogPermission, { each: true, message: '请求类型错误' })
  permissions: BlogPermission[];

  @IsString()
  password: string; // 允许空串
}
