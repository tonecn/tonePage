'use server'

/**
 * 管理员相关 Server Actions
 */

import { Resource } from '@/lib/types/resource';
import { backendFetch } from '../internal/backend-client';
import { ResourceValidators, AdminValidators, BlogValidators } from '../internal/validators';
import { AdminUser } from '@/lib/types/user';
import { Blog } from '@/lib/types/blog';

/**
 * 获取所有资源
 */
export async function adminGetResources(): Promise<Resource[]> {
  return await backendFetch<Resource[]>('/api/admin/web/resource');
}

/**
 * 创建资源
 */
export async function adminCreateResource(data: {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  tags: { name: string; type: string }[];
}): Promise<Resource> {
  // 参数验证
  const validated = ResourceValidators.createResource(data)

  return await backendFetch<Resource>('/api/admin/web/resource', {
    method: 'POST',
    body: JSON.stringify(validated),
  });
}

/**
 * 获取单个资源
 */
export async function adminGetResource(id: string): Promise<Resource> {
  return await backendFetch<Resource>(`/api/admin/web/resource/${id}`);
}

/**
 * 更新资源
 */
export async function adminUpdateResource(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    tags: { name: string; type: string }[];
  }>
): Promise<Resource> {
  // 参数验证
  const validated = ResourceValidators.updateResource(data)

  return await backendFetch<Resource>(`/api/admin/web/resource/${id}`, {
    method: 'PUT',
    body: JSON.stringify(validated),
  });
}

/**
 * 删除资源
 */
export async function adminDeleteResource(id: string): Promise<void> {
  await backendFetch(`/api/admin/web/resource/${id}`, {
    method: 'DELETE',
  });
}


/**
 * 管理员：创建博客
 */
export async function adminCreateBlog(data: {
  title: string;
  description: string;
  slug: string;
  contentUrl: string;
  permissions: string[];
  password: string;
}): Promise<Blog> {
  // 参数验证
  const validated = BlogValidators.createBlog(data)

  return await backendFetch<Blog>('/api/admin/web/blog', {
    method: 'POST',
    body: JSON.stringify(validated),
  });
}

/**
 * 管理员：更新博客
 */
export async function adminUpdateBlog(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    slug: string;
    contentUrl: string;
    permissions: string[];
    password: string;
  }>
): Promise<Blog> {
  // 参数验证
  const validated = BlogValidators.updateBlog(data)

  return await backendFetch<Blog>(`/api/admin/web/blog/${id}`, {
    method: 'PUT',
    body: JSON.stringify(validated),
  });
}

/**
 * 管理员：删除博客
 */
export async function adminDeleteBlog(id: string): Promise<void> {
  await backendFetch(`/api/admin/web/blog/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 管理员：获取单个博客
 */
export async function adminGetBlog(id: string): Promise<Blog> {
  return await backendFetch<Blog>(`/api/admin/web/blog/${id}`);
}

/**
 * 管理员：获取博客列表
 */
export async function adminGetBlogs(): Promise<Blog[]> {
  return await backendFetch<Blog[]>('/api/admin/web/blog');
}

/**
 * 管理员：设置博客密码
 */
export async function adminSetBlogPassword(id: string, password: string): Promise<boolean> {
  // 参数验证
  const { password: validatedPassword } = BlogValidators.setBlogPassword(password)

  return await backendFetch<boolean>(`/api/admin/web/blog/${id}/password`, {
    method: 'POST',
    body: JSON.stringify({
      password: validatedPassword,
    }),
  });
}


/**
 * 创建用户
 */
export async function adminCreateUser(data: {
  username: string | null,
  nickname: string | null,
  email: string | null,
  phone: string | null,
  password: string | null,
}): Promise<{ id: string; email: string }> {
  const validated = AdminValidators.createUser(data)

  return await backendFetch<{ id: string; email: string }>('/api/admin/user', {
    method: 'POST',
    body: JSON.stringify(validated),
  });
}

/**
 * 用户项类型
 */
type AdminUserItem = {
  userId: string;
  username: string;
  nickname: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  roles: string[];
};

/**
 * 用户列表响应类型
 */
type AdminUsersResponse = {
  items: AdminUserItem[];
  total: number;
  page: number;
  pageSize: number;
};

/**
 * 获取用户列表
 */
export async function adminGetUsers(): Promise<AdminUsersResponse> {
  return await backendFetch<AdminUsersResponse>('/api/admin/user');
}

/**
 * 获取用户列表
 */
export async function adminGetUser(userId: string): Promise<AdminUser> {
  return await backendFetch<AdminUser>(`/api/admin/user/${userId}`);
}

/**
 * 编辑用户信息
 */
export interface UpdateUser {
  username: string;
  nickname: string;
  email: string | null;
  phone: string | null;
}

export async function adminUpdateUser(userId: string, user: UpdateUser): Promise<AdminUser> {
  // 参数验证
  const validated = AdminValidators.updateUser(user)

  return await backendFetch<AdminUser>(`/api/admin/user/${userId}`, {
    body: JSON.stringify(validated),
    method: "PUT",
  });
}

/**
 * 删除用户
 */
export async function adminRemoveUser(userId: string, soft: boolean = true): Promise<unknown> {
  return await backendFetch<unknown>(`/api/admin/user/${userId}?soft=${soft}`, {
    method: 'DELETE',
  });
}

/**
 * 设置用户密码
 */
export async function adminSetUserPassword(userId: string, password: string): Promise<void> {
  // 参数验证
  const { password: validatedPassword } = AdminValidators.setUserPassword(password)

  return await backendFetch<void>(`/api/admin/user/${userId}/password`, {
    method: 'POST',
    body: JSON.stringify({
      password: validatedPassword,
    }),
  });
}
