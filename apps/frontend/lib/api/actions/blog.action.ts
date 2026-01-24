'use server'

/**
 * 博客相关 Server Actions
 * 
 * 包含：
 * - 读取博客（支持密码保护）
 * - 评论管理
 * - 内容管理（需要权限）
 */

import { Blog } from '@/lib/types/blog';
import { BlogComment } from '@/lib/types/blogComment';
import { backendFetch } from '../internal/backend-client';
import { BlogValidators } from '../internal/validators';

/**
 * 获取博客详情（公开接口但需要在服务端获取）
 */
export async function getBlogBySlug(
  slug: string,
  password?: string
): Promise<{
  id: string;
  title: string;
  description: string;
  createdAt: string;
  content: string;
}> {
  const url = `/api/blog/${slug}/slug${password ? `?p=${encodeURIComponent(password)}` : ''}`;

  return await backendFetch(url);
}

/**
 * 获取所有博客列表（用于 SSG）
 */
export async function getAllBlogs(): Promise<Pick<
  Blog,
  'id' | 'title' | 'slug' | 'description' | 'viewCount' | 'createdAt' | 'updatedAt'
>[]> {
  return await backendFetch('/api/blog');
}

/**
 * 获取博客评论
 */
export async function getBlogComments(blogId: string): Promise<BlogComment[]> {
  return await backendFetch<BlogComment[]>(
    `/api/blog/${blogId}/comments`
  );
}

/**
 * 创建博客评论
 */
export async function createBlogComment(
  blogId: string,
  content: string,
  parentId?: string
): Promise<BlogComment> {
  // 参数验证
  const validated = BlogValidators.createComment(content, parentId)

  return await backendFetch<BlogComment>(
    `/api/blog/${blogId}/comment`,
    {
      method: 'POST',
      body: JSON.stringify(validated),
    }
  );
}