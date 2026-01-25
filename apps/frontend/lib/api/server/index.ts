/**
 * 服务端 API 模块
 * 
 * 仅在以下场景使用：
 * - Server Components (React Server Components)
 * - Route Handlers (app/api/)
 * - Server Actions (仅用于表单提交等 mutation 操作)
 * 
 * 不要在客户端组件中使用！
 */

import { User } from '@/lib/types/user';
import { Blog } from '@/lib/types/blog';
import { BlogComment } from '@/lib/types/blogComment';
import { Resource } from '@/lib/types/resource';
import { backendFetch } from './backend-client';
import { AuthValidators, UserValidators, BlogValidators, ResourceValidators, AdminValidators } from '../validators';
import type { AuthenticationResponseJSON, PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON, RegistrationResponseJSON } from '@simplewebauthn/browser';

// ==================== 认证相关 ====================

/**
 * 账密登录
 */
export async function loginByPassword(
  identifier: string,
  password: string
): Promise<{ user: User }> {
  const validated = AuthValidators.loginByPassword(identifier, password);
  return await backendFetch<{ user: User }>('/api/auth/login/password', {
    method: 'POST',
    body: JSON.stringify(validated),
  });
}

/**
 * 短信登录
 */
export async function loginBySms(
  phone: string,
  code: string
): Promise<{ user: User }> {
  const validated = AuthValidators.loginBySms(phone, code);
  return await backendFetch<{ user: User }>('/api/auth/login/sms', {
    method: 'POST',
    body: JSON.stringify(validated),
  });
}

/**
 * 登出
 */
export async function logout(): Promise<void> {
  await backendFetch('/api/auth/logout', {
    method: 'POST',
  });
}

/**
 * Passkey 注册选项
 */
export async function getPasskeyRegisterOptions(): Promise<PublicKeyCredentialCreationOptionsJSON> {
  return await backendFetch<PublicKeyCredentialCreationOptionsJSON>('/api/auth/passkey/register/options', {
    method: 'POST',
  });
}

/**
 * Passkey 注册
 */
export async function passkeyRegister(
  name: string,
  credentialResponse: RegistrationResponseJSON
): Promise<{ id: string; name: string; createdAt: string }> {
  const validated = AuthValidators.passkeyRegister(name);
  return await backendFetch<{ id: string; name: string; createdAt: string }>(
    '/api/auth/passkey/register',
    {
      method: 'POST',
      body: JSON.stringify({
        name: validated.name,
        credentialResponse,
      }),
    }
  );
}

/**
 * Passkey 列表
 */
export async function getPasskeys(): Promise<{ id: string; name: string; createdAt: string }[]> {
  return await backendFetch<{ id: string; name: string; createdAt: string }[]>('/api/auth/passkey');
}

/**
 * 删除 Passkey
 */
export async function passkeyDelete(id: string): Promise<boolean> {
  return await backendFetch<boolean>(`/api/auth/passkey/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 获取 Passkey 登录选项
 */
export async function getLoginByPasskeyOptions(): Promise<PublicKeyCredentialRequestOptionsJSON> {
  return await backendFetch<PublicKeyCredentialRequestOptionsJSON>('/api/auth/passkey/login/options', {
    method: 'POST',
  });
}

/**
 * Passkey 登录
 */
export async function loginByPasskey(credentialResponse: AuthenticationResponseJSON): Promise<{ user: User }> {
  return await backendFetch<{ user: User }>('/api/auth/passkey/login', {
    method: 'POST',
    body: JSON.stringify({ credentialResponse }),
  });
}

// ==================== 用户相关 ====================

/**
 * 获取当前登录用户信息
 */
export async function getMe(): Promise<User> {
  return await backendFetch<User>('/api/user/me');
}

/**
 * 更新密码
 */
export async function updatePassword(password: string): Promise<void> {
  const validated = UserValidators.updatePassword(password);
  await backendFetch<null>('/api/user/password', {
    method: 'PUT',
    body: JSON.stringify(validated),
  });
}

/**
 * 更新用户信息
 */
export async function updateUserProfile(data: {
  nickname?: string;
  email?: string;
  avatar?: string;
}): Promise<User> {
  const validated = UserValidators.updateUserProfile(data);
  return await backendFetch<User>('/api/user/profile', {
    method: 'PUT',
    body: JSON.stringify(validated),
  });
}

// ==================== 博客相关 ====================

/**
 * 获取博客详情
 */
export async function getBlogBySlug(
  slug: string,
  password?: string
): Promise<{
  id: string;
  slug: string;
  title: string;
  description: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  content: string;
}> {
  const url = `/api/blog/${slug}/slug${password ? `?p=${encodeURIComponent(password)}` : ''}`;
  return await backendFetch(url);
}

/**
 * 获取所有博客列表
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
  return await backendFetch<BlogComment[]>(`/api/blog/${blogId}/comments`);
}

/**
 * 创建博客评论
 */
export async function createBlogComment(
  blogId: string,
  content: string,
  parentId?: string
): Promise<BlogComment> {
  const validated = BlogValidators.createComment(content, parentId);
  return await backendFetch<BlogComment>(`/api/blog/${blogId}/comment`, {
    method: 'POST',
    body: JSON.stringify(validated),
  });
}

// ==================== 资源相关 ====================

/**
 * 获取所有资源（公开）
 */
export async function getResources(): Promise<Resource[]> {
  return await backendFetch<Resource[]>('/api/resource');
}

// ==================== SMS 相关 ====================

/**
 * 发送登录短信
 */
export async function sendLoginSms(phone: string): Promise<void> {
  const validated = AuthValidators.sendLoginSms(phone);
  await backendFetch('/api/captcha/sms/login', {
    method: 'POST',
    body: JSON.stringify(validated),
  });
}

/**
 * 发送验证短信
 */
export async function sendVerificationSms(phone: string, type: 'bind' | 'unbind' | 'change'): Promise<void> {
  const validated = AuthValidators.sendVerificationSms(phone, type);
  await backendFetch('/api/captcha/sms/verification', {
    method: 'POST',
    body: JSON.stringify(validated),
  });
}

// ==================== OSS 相关 ====================

export interface StsToken {
  AccessKeyId: string;
  AccessKeySecret: string;
  Expiration: string;
  SecurityToken: string;
  region: string;
  bucket: string;
  userId: string;
}

/**
 * 获取 STS Token
 */
export async function getStsToken(): Promise<StsToken> {
  return await backendFetch<StsToken>('/api/oss/sts');
}

// ==================== 管理员相关 ====================

/**
 * 管理员：获取所有资源
 */
export async function adminGetResources(): Promise<Resource[]> {
  return await backendFetch<Resource[]>('/api/admin/web/resource');
}

/**
 * 管理员：创建资源
 */
export async function adminCreateResource(data: {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  tags: { name: string; type: string }[];
}): Promise<Resource> {
  const validated = ResourceValidators.createResource(data);
  return await backendFetch<Resource>('/api/admin/web/resource', {
    method: 'POST',
    body: JSON.stringify(validated),
  });
}

/**
 * 管理员：获取单个资源
 */
export async function adminGetResource(id: string): Promise<Resource> {
  return await backendFetch<Resource>(`/api/admin/web/resource/${id}`);
}

/**
 * 管理员：更新资源
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
  const validated = ResourceValidators.updateResource(data);
  return await backendFetch<Resource>(`/api/admin/web/resource/${id}`, {
    method: 'PUT',
    body: JSON.stringify(validated),
  });
}

/**
 * 管理员：删除资源
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
  const validated = BlogValidators.createBlog(data);
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
  const validated = BlogValidators.updateBlog(data);
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
  const { password: validatedPassword } = BlogValidators.setBlogPassword(password);
  return await backendFetch<boolean>(`/api/admin/web/blog/${id}/password`, {
    method: 'POST',
    body: JSON.stringify({ password: validatedPassword }),
  });
}

/**
 * 管理员：创建用户
 */
export async function adminCreateUser(data: {
  username: string | null;
  nickname: string | null;
  email: string | null;
  phone: string | null;
  password: string | null;
}): Promise<{ id: string; email: string }> {
  const validated = AdminValidators.createUser(data);
  return await backendFetch<{ id: string; email: string }>('/api/admin/user', {
    method: 'POST',
    body: JSON.stringify(validated),
  });
}

import type { AdminUser } from '@/lib/types/user';
import type { Role } from '@/lib/types/role';

/**
 * 用户列表响应类型
 */
export type AdminUsersResponse = {
  items: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
};

/**
 * 管理员：获取用户列表
 */
export async function adminGetUsers(params?: {
  page?: number;
  pageSize?: number;
}): Promise<AdminUsersResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));
  const queryString = query.toString();
  return await backendFetch<AdminUsersResponse>(`/api/admin/user${queryString ? `?${queryString}` : ''}`);
}

// AdminUser 类型已从 @/lib/types/user 导入
export type { AdminUser } from '@/lib/types/user';

/**
 * 管理员：获取单个用户
 */
export async function adminGetUser(id: string): Promise<AdminUser> {
  return await backendFetch<AdminUser>(`/api/admin/user/${id}`);
}

/**
 * 更新用户参数
 */
export type UpdateUser = Partial<{
  username: string;
  nickname: string;
  email: string | null;
  phone: string | null;
  avatar: string;
  roles: string[];
}>;

/**
 * 管理员：更新用户
 */
export async function adminUpdateUser(id: string, data: UpdateUser): Promise<AdminUser> {
  const validated = AdminValidators.updateUser(data);
  return await backendFetch<AdminUser>(`/api/admin/user/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(validated),
  });
}

/**
 * 管理员：删除用户
 */
export async function adminRemoveUser(id: string, soft: boolean = false): Promise<void> {
  const query = soft ? '?soft=true' : '';
  await backendFetch(`/api/admin/user/${id}${query}`, {
    method: 'DELETE',
  });
}

/**
 * 管理员：设置用户密码
 */
export async function adminSetUserPassword(id: string, password: string): Promise<void> {
  const validated = AdminValidators.setUserPassword(password);
  await backendFetch(`/api/admin/user/${id}/password`, {
    method: 'PUT',
    body: JSON.stringify(validated),
  });
}
