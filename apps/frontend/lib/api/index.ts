/**
 * 统一 API 模块
 * 
 * 可在客户端组件和服务端组件中使用
 * 
 * @example
 * // 客户端组件
 * 'use client'
 * import { api } from '@/lib/api'
 * 
 * const user = await api.auth.loginByPassword(identifier, password)
 * 
 * @example
 * // 服务端组件
 * import { api } from '@/lib/api'
 * 
 * const blogs = await api.blog.getAll()
 * 
 * @example
 * // SWR hooks
 * import useSWR from 'swr'
 * import { api } from '@/lib/api'
 * 
 * const { data } = useSWR('/blogs', () => api.blog.getAll())
 */

import { request } from './http-client';
import type { User, AdminUser } from '@/lib/types/user';
import type { Blog } from '@/lib/types/blog';
import type { BlogComment } from '@/lib/types/blogComment';
import type { Resource } from '@/lib/types/resource';
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/browser';
import { AdminValidators } from './validators';

// ==================== 类型定义 ====================

export interface StsToken {
  AccessKeyId: string;
  AccessKeySecret: string;
  Expiration: string;
  SecurityToken: string;
  region: string;
  bucket: string;
  userId: string;
}

export interface AdminUsersResponse {
  items: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UpdateUserData {
  username: string;
  nickname: string;
  email: string;
  phone: string;
}

export interface CreateUserData {
  username: string;
  nickname: string;
  email: string;
  phone: string;
  password: string;
}

export interface BlogDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  content: string;
}

export interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Passkey {
  id: string;
  name: string;
  createdAt: string;
}

// ==================== 认证 API ====================

export const authApi = {
  /**
   * 账密登录
   */
  loginByPassword: (identifier: string, password: string) =>
    request<{ user: User }>('/api/auth/login/password', {
      method: 'POST',
      body: { identifier, password },
    }),

  /**
   * 短信登录
   */
  loginBySms: (phone: string, code: string) =>
    request<{ user: User }>('/api/auth/login/sms', {
      method: 'POST',
      body: { phone, code },
    }),

  /**
   * 登出
   */
  logout: () =>
    request<void>('/api/auth/logout', { method: 'POST' }),

  /**
   * 获取 Passkey 注册选项
   */
  getPasskeyRegisterOptions: () =>
    request<PublicKeyCredentialCreationOptionsJSON>('/api/auth/passkey/register/options', {
      method: 'POST',
    }),

  /**
   * 注册 Passkey
   */
  passkeyRegister: (name: string, credentialResponse: RegistrationResponseJSON) =>
    request<Passkey>('/api/auth/passkey/register', {
      method: 'POST',
      body: { name, credentialResponse },
    }),

  /**
   * 获取 Passkey 列表
   */
  getPasskeys: () =>
    request<Passkey[]>('/api/auth/passkey'),

  /**
   * 删除 Passkey
   */
  passkeyDelete: (id: string) =>
    request<boolean>(`/api/auth/passkey/${id}`, { method: 'DELETE' }),

  /**
   * 获取 Passkey 登录选项
   */
  getLoginByPasskeyOptions: () =>
    request<PublicKeyCredentialRequestOptionsJSON>('/api/auth/passkey/login/options', {
      method: 'POST',
    }),

  /**
   * Passkey 登录
   */
  loginByPasskey: (credentialResponse: AuthenticationResponseJSON) =>
    request<{ user: User }>('/api/auth/passkey/login', {
      method: 'POST',
      body: { credentialResponse },
    }),
};

// ==================== 用户 API ====================

export const userApi = {
  /**
   * 获取当前用户信息
   */
  getMe: () =>
    request<User>('/api/user/me'),

  /**
   * 更新密码
   */
  updatePassword: (password: string) =>
    request<void>('/api/user/password', {
      method: 'PUT',
      body: { password },
    }),

  /**
   * 更新用户资料
   */
  updateProfile: (data: { nickname?: string; email?: string; avatar?: string }) =>
    request<User>('/api/user/profile', {
      method: 'PUT',
      body: data,
    }),
};

// ==================== 博客 API ====================

export const blogApi = {
  /**
   * 获取所有博客列表 (仅用于 Sitemap)
   */
  getAll: () =>
    request<{ items: BlogListItem[]; total: number; }>('/api/blog?withAll=true'),

  /**
   * 获取公开博客列表 (分页)
   */
  getPublicList: (page: number = 1, pageSize: number = 10) =>
    request<{ items: BlogListItem[]; total: number; }>(`/api/blog?page=${page}&pageSize=${pageSize}`),

  /**
   * 通过 slug 获取博客详情
   */
  getBySlug: (slug: string, password?: string) => {
    const url = `/api/blog/${slug}/slug${password ? `?p=${encodeURIComponent(password)}` : ''}`;
    return request<BlogDetail>(url);
  },

  /**
   * 获取博客评论
   */
  getComments: (blogId: string) =>
    request<BlogComment[]>(`/api/blog/${blogId}/comments`),

  /**
   * 创建博客评论
   */
  createComment: (blogId: string, content: string, parentId?: string) =>
    request<BlogComment>(`/api/blog/${blogId}/comment`, {
      method: 'POST',
      body: { content, parentId },
    }),
};

// ==================== 资源 API ====================

export const resourceApi = {
  /**
   * 获取所有资源
   */
  getAll: () =>
    request<Resource[]>('/api/resource'),
};

// ==================== SMS API ====================

export const smsApi = {
  /**
   * 发送登录短信
   */
  sendLoginCode: (phone: string) =>
    request<void>('/api/sms/login', {
      method: 'POST',
      body: { phone },
    }),

  /**
   * 发送验证短信
   */
  sendVerificationCode: (phone: string, type: 'bind' | 'unbind' | 'change') =>
    request<void>('/api/sms/verification', {
      method: 'POST',
      body: { phone, type },
    }),
};

// ==================== OSS API ====================

export const ossApi = {
  /**
   * 获取 STS Token
   */
  getStsToken: () =>
    request<StsToken>('/api/oss/sts'),
};

// ==================== 管理员 API ====================

export const adminApi = {
  // ===== 资源管理 =====
  resource: {
    getAll: (page: number = 1, pageSize: number = 20, query: string = '') => {
      const queryString = new URLSearchParams();
      queryString.set('page', String(page));
      queryString.set('pageSize', String(pageSize));
      if (query) queryString.set('query', query);
      return request<{ items: Resource[], total: number }>(`/api/admin/web/resource?${queryString.toString()}`);
    },

    get: (id: string) =>
      request<Resource>(`/api/admin/web/resource/${id}`),

    create: (data: {
      title: string;
      description: string;
      imageUrl: string;
      link: string;
      tags: { name: string; type: string }[];
    }) =>
      request<Resource>('/api/admin/web/resource', {
        method: 'POST',
        body: data,
      }),

    update: (id: string, data: Partial<{
      title: string;
      description: string;
      imageUrl: string;
      link: string;
      tags: { name: string; type: string }[];
    }>) =>
      request<Resource>(`/api/admin/web/resource/${id}`, {
        method: 'PUT',
        body: data,
      }),

    delete: (id: string) =>
      request<void>(`/api/admin/web/resource/${id}`, { method: 'DELETE' }),
  },

  // ===== 博客管理 =====
  blog: {
    getAll: (page: number = 1, pageSize: number = 20, query: string = '') => {
      const queryString = new URLSearchParams();
      queryString.set('page', String(page));
      queryString.set('pageSize', String(pageSize));
      if (query) queryString.set('query', query);
      return request<{ items: Blog[], total: number }>(`/api/admin/web/blog?${queryString.toString()}`);
    },

    get: (id: string) =>
      request<Blog>(`/api/admin/web/blog/${id}`),

    create: (data: {
      title: string;
      description: string;
      slug: string;
      content?: string;
      permissions: string[];
      password: string;
    }) =>
      request<Blog>('/api/admin/web/blog', {
        method: 'POST',
        body: data,
      }),

    update: (id: string, data: Partial<{
      title: string;
      description: string;
      slug: string;
      content: string;
      permissions: string[];
      password: string;
    }>) =>
      request<Blog>(`/api/admin/web/blog/${id}`, {
        method: 'PUT',
        body: data,
      }),

    delete: (id: string) =>
      request<void>(`/api/admin/web/blog/${id}`, { method: 'DELETE' }),

    setPassword: (id: string, password: string) =>
      request<boolean>(`/api/admin/web/blog/${id}/password`, {
        method: 'POST',
        body: { password },
      }),
  },

  // ===== 用户管理 =====
  user: {
    getAll: (params?: { page?: number; pageSize?: number; query?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.pageSize) query.set('pageSize', String(params.pageSize));
      if (params?.query) query.set('query', params.query);
      const queryString = query.toString();
      return request<AdminUsersResponse>(`/api/admin/user${queryString ? `?${queryString}` : ''}`);
    },

    get: (id: string) =>
      request<AdminUser>(`/api/admin/user/${id}`),

    create: (data: CreateUserData) =>
      request<null>('/api/admin/user', {
        method: 'POST',
        body: AdminValidators.createUser(data),
      }),

    update: (id: string, data: UpdateUserData) =>
      request<AdminUser>(`/api/admin/user/${id}`, {
        method: 'PUT',
        body: AdminValidators.updateUser(data),
      }),

    delete: (id: string, soft: boolean = true) => {
      const query = `soft=${soft}`;
      return request<void>(`/api/admin/user/${id}?${query}`, { method: 'DELETE' });
    },

    setPassword: (id: string, password: string) =>
      request<void>(`/api/admin/user/${id}/password`, {
        method: 'PUT',
        body: AdminValidators.setUserPassword(password),
      }),
  },
};

// ==================== 统一导出 ====================

/**
 * 统一的 API 对象
 * 
 * 使用方式：
 * ```typescript
 * import { api } from '@/lib/api'
 * 
 * // 认证
 * await api.auth.loginByPassword(identifier, password)
 * 
 * // 用户
 * await api.user.getMe()
 * 
 * // 博客
 * await api.blog.getAll()
 * 
 * // 管理员
 * await api.admin.blog.create(data)
 * ```
 */
export const api = {
  auth: authApi,
  user: userApi,
  blog: blogApi,
  resource: resourceApi,
  sms: smsApi,
  oss: ossApi,
  admin: adminApi,
};

// 重新导出通用模块
export { APIError, normalizeAPIError, handleAPIError, safeCall } from './common';
export { request } from './http-client';
export { getApiBase, isBrowser, buildApiUrl } from './config';
export type { RequestOptions, HttpMethod } from './http-client';
