import { IsOptional, IsString, IsUUID } from 'class-validator';

export class createBlogCommentDto {
  @IsString({ message: '评论内容不能为空' })
  content: string;

  @IsOptional()
  @IsUUID('4', { message: '父评论ID格式错误' })
  parentId?: string;
}
