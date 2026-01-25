/**
 * 客户端 API 模块
 * 
 * 仅在客户端组件中使用！
 * 
 * 通过 Next.js Route Handlers 调用后端 API，
 * 避免 Server Actions 在边缘环境下的 host header 不匹配问题。
 */

import { APIError, normalizeAPIError } from '../common';
import type { User } from '@/lib/types/user';
import type { Blog } from '@/lib/types/blog';
import type { BlogComment } from '@/lib/types/blogComment';
import type { Resource } from '@/lib/types/resource';
import type { AuthenticationResponseJSON, PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON, RegistrationResponseJSON } from '@simplewebauthn/browser';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * 客户端 fetch 封装
 * 调用 Next.js Route Handlers (app/api/*)
 */
async function clientFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(endpoint, {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new APIError(
        data.message || `HTTP ${response.status}`,
        response.status,
        data.code ?? -1,
        data.data
      );
    }

    return data.data as T;
  } catch (error) {
    normalizeAPIError(error);
  }
}

// ==================== 认证相关 ====================

export async function loginByPassword(identifier: string, password: string): Promise<{ user: User }> {
  return clientFetch<{ user: User }>('/api/auth/login/password', {
    method: 'POST',
    body: { identifier, password },
  });
}

export async function loginBySms(phone: string, code: string): Promise<{ user: User }> {
  return clientFetch<{ user: User }>('/api/auth/login/sms', {
    method: 'POST',
    body: { phone, code },
  });
}

export async function logout(): Promise<void> {
  await clientFetch<void>('/api/auth/logout', { method: 'POST' });
}

export async function getPasskeyRegisterOptions(): Promise<PublicKeyCredentialCreationOptionsJSON> {
  return clientFetch<PublicKeyCredentialCreationOptionsJSON>('/api/auth/passkey/register/options', {
    method: 'POST',
  });
}

export async function passkeyRegister(
  name: string,
  credentialResponse: RegistrationResponseJSON
): Promise<{ id: string; name: string; createdAt: string }> {
  return clientFetch<{ id: string; name: string; createdAt: string }>('/api/auth/passkey/register', {
    method: 'POST',
    body: { name, credentialResponse },
  });
}

export async function getPasskeys(): Promise<{ id: string; name: string; createdAt: string }[]> {
  return clientFetch<{ id: string; name: string; createdAt: string }[]>('/api/auth/passkey');
}

export async function passkeyDelete(id: string): Promise<boolean> {
  return clientFetch<boolean>(`/api/auth/passkey/${id}`, { method: 'DELETE' });
}

export async function getLoginByPasskeyOptions(): Promise<PublicKeyCredentialRequestOptionsJSON> {
  return clientFetch<PublicKeyCredentialRequestOptionsJSON>('/api/auth/passkey/login/options', {
    method: 'POST',
  });
}

export async function loginByPasskey(credentialResponse: AuthenticationResponseJSON): Promise<{ user: User }> {
  return clientFetch<{ user: User }>('/api/auth/passkey/login', {
    method: 'POST',
    body: { credentialResponse },
  });
}

// ==================== 用户相关 ====================

export async function getMe(): Promise<User> {
  return clientFetch<User>('/api/user/me');
}

export async function updatePassword(password: string): Promise<void> {
  await clientFetch<void>('/api/user/password', {
    method: 'PUT',
    body: { password },
  });
}

export async function updateUserProfile(data: {
  nickname?: string;
  email?: string;
  avatar?: string;
}): Promise<User> {
  return clientFetch<User>('/api/user/profile', {
    method: 'PUT',
    body: data,
  });
}

// ==================== 博客相关 ====================

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
  return clientFetch(url);
}

export async function getAllBlogs(): Promise<Pick<
  Blog,
  'id' | 'title' | 'slug' | 'description' | 'viewCount' | 'createdAt' | 'updatedAt'
>[]> {
  return clientFetch('/api/blog');
}

export async function getBlogComments(blogId: string): Promise<BlogComment[]> {
  return clientFetch<BlogComment[]>(`/api/blog/${blogId}/comments`);
}

export async function createBlogComment(
  blogId: string,
  content: string,
  parentId?: string
): Promise<BlogComment> {
  return clientFetch<BlogComment>(`/api/blog/${blogId}/comment`, {
    method: 'POST',
    body: { content, parentId },
  });
}

// ==================== 资源相关 ====================

export async function getResources(): Promise<Resource[]> {
  return clientFetch<Resource[]>('/api/resource');
}

// ==================== SMS 相关 ====================

export async function sendLoginSms(phone: string): Promise<void> {
  await clientFetch('/api/sms/login', {
    method: 'POST',
    body: { phone },
  });
}

export async function sendVerificationSms(phone: string, type: 'bind' | 'unbind' | 'change'): Promise<void> {
  await clientFetch('/api/sms/verification', {
    method: 'POST',
    body: { phone, type },
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

export async function getStsToken(): Promise<StsToken> {
  return clientFetch<StsToken>('/api/oss/sts');
}

// ==================== 管理员相关 ====================

export async function adminGetResources(): Promise<Resource[]> {
  return clientFetch<Resource[]>('/api/admin/web/resource');
}

export async function adminCreateResource(data: {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  tags: { name: string; type: string }[];
}): Promise<Resource> {
  return clientFetch<Resource>('/api/admin/web/resource', {
    method: 'POST',
    body: data,
  });
}

export async function adminGetResource(id: string): Promise<Resource> {
  return clientFetch<Resource>(`/api/admin/web/resource/${id}`);
}

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
  return clientFetch<Resource>(`/api/admin/web/resource/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function adminDeleteResource(id: string): Promise<void> {
  await clientFetch(`/api/admin/web/resource/${id}`, { method: 'DELETE' });
}

export async function adminCreateBlog(data: {
  title: string;
  description: string;
  slug: string;
  contentUrl: string;
  permissions: string[];
  password: string;
}): Promise<Blog> {
  return clientFetch<Blog>('/api/admin/web/blog', {
    method: 'POST',
    body: data,
  });
}

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
  return clientFetch<Blog>(`/api/admin/web/blog/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function adminDeleteBlog(id: string): Promise<void> {
  await clientFetch(`/api/admin/web/blog/${id}`, { method: 'DELETE' });
}

export async function adminGetBlog(id: string): Promise<Blog> {
  return clientFetch<Blog>(`/api/admin/web/blog/${id}`);
}

export async function adminGetBlogs(): Promise<Blog[]> {
  return clientFetch<Blog[]>('/api/admin/web/blog');
}

export async function adminSetBlogPassword(id: string, password: string): Promise<boolean> {
  return clientFetch<boolean>(`/api/admin/web/blog/${id}/password`, {
    method: 'POST',
    body: { password },
  });
}

export async function adminCreateUser(data: {
  username: string | null;
  nickname: string | null;
  email: string | null;
  phone: string | null;
  password: string | null;
}): Promise<{ id: string; email: string }> {
  return clientFetch<{ id: string; email: string }>('/api/admin/user', {
    method: 'POST',
    body: data,
  });
}

import type { AdminUser } from '@/lib/types/user';
import type { Role } from '@/lib/types/role';

export type AdminUsersResponse = {
  items: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
};

export async function adminGetUsers(params?: {
  page?: number;
  pageSize?: number;
}): Promise<AdminUsersResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));
  const queryString = query.toString();
  return clientFetch<AdminUsersResponse>(`/api/admin/user${queryString ? `?${queryString}` : ''}`);
}

// AdminUser 类型已从 @/lib/types/user 导入
export type { AdminUser } from '@/lib/types/user';

export async function adminGetUser(id: string): Promise<AdminUser> {
  return clientFetch<AdminUser>(`/api/admin/user/${id}`);
}

export type UpdateUser = Partial<{
  username: string;
  nickname: string;
  email: string | null;
  phone: string | null;
  avatar: string;
  roles: string[];
}>;

export async function adminUpdateUser(id: string, data: UpdateUser): Promise<AdminUser> {
  return clientFetch<AdminUser>(`/api/admin/user/${id}`, {
    method: 'PATCH',
    body: data,
  });
}

export async function adminRemoveUser(id: string, soft: boolean = false): Promise<void> {
  const query = soft ? '?soft=true' : '';
  await clientFetch(`/api/admin/user/${id}${query}`, { method: 'DELETE' });
}

export async function adminSetUserPassword(id: string, password: string): Promise<void> {
  await clientFetch(`/api/admin/user/${id}/password`, {
    method: 'PUT',
    body: { password },
  });
}
