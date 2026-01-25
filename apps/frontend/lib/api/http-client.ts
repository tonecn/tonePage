/**
 * HTTP 客户端模块
 * 
 * 统一的 HTTP 请求封装，支持客户端和服务端环境
 * 
 * 特性：
 * - 自动检测运行环境（浏览器/服务端）
 * - 服务端自动转发 Cookie 和 Headers
 * - 统一的错误处理
 * - 类型安全
 */

import { getApiBase, isBrowser } from './config';
import { APIError, normalizeAPIError } from './common';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  /** 是否跳过错误规范化处理 */
  skipErrorHandling?: boolean;
  /** Next.js fetch 缓存配置 */
  cache?: RequestCache;
  /** Next.js revalidate 配置 */
  next?: { revalidate?: number | false; tags?: string[] };
}

/**
 * 获取服务端请求所需的 headers
 * 仅在服务端调用，自动转发客户端的 Cookie 和相关 headers
 */
async function getServerHeaders(): Promise<Record<string, string>> {
  // 动态导入以避免在客户端打包时报错
  const { headers, cookies } = await import('next/headers');
  
  const cookieStore = await cookies();
  const reqHeaders = new Headers(await headers());

  const forwardedHeaders: Record<string, string> = {};
  const headersToForward = [
    'user-agent',
    'x-forwarded-for',
    'x-real-ip',
    'x-forwarded-proto',
    'accept-language',
  ];

  headersToForward.forEach((key) => {
    const value = reqHeaders.get(key);
    if (value) {
      forwardedHeaders[key] = value;
    }
  });

  return {
    Cookie: cookieStore.toString(),
    ...forwardedHeaders,
  };
}

/**
 * 处理服务端响应的 Set-Cookie headers
 */
async function handleSetCookies(responseHeaders: Headers): Promise<void> {
  const setCookieHeaders = getSetCookieHeaders(responseHeaders);
  if (!setCookieHeaders.length) return;

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  setCookieHeaders.forEach((raw) => {
    const parsed = parseSetCookie(raw);
    if (!parsed) return;
    const { name, value, ...cookieOptions } = parsed;
    cookieStore.set(name, value, cookieOptions);
  });
}

/**
 * 统一的 API 请求函数
 * 
 * @example
 * // GET 请求
 * const user = await request<User>('/api/user/me');
 * 
 * @example
 * // POST 请求
 * const result = await request<{ user: User }>('/api/auth/login/password', {
 *   method: 'POST',
 *   body: { identifier, password },
 * });
 */
export async function request<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, skipErrorHandling = false, cache, next } = options;

  const apiBase = getApiBase();
  const url = new URL(endpoint, apiBase).href;

  // 构建请求头
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // 服务端环境：转发 Cookie 和 headers
  if (!isBrowser()) {
    const serverHeaders = await getServerHeaders();
    Object.assign(requestHeaders, serverHeaders);
  }

  try {
    const fetchOptions: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
      method,
      headers: requestHeaders,
      credentials: 'include', // 客户端自动携带 cookies
    };

    if (body !== undefined) {
      fetchOptions.body = JSON.stringify(body);
    }

    if (cache !== undefined) {
      fetchOptions.cache = cache;
    }

    if (next !== undefined) {
      fetchOptions.next = next;
    }

    const response = await fetch(url, fetchOptions);

    // 服务端环境：处理 Set-Cookie
    if (!isBrowser()) {
      await handleSetCookies(response.headers);
    }

    // 解析响应
    const contentType = response.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      throw new APIError(
        text || `HTTP ${response.status}`,
        response.status,
        -1
      );
    }

    const data = await response.json();

    // HTTP 错误状态
    if (!response.ok) {
      const error = new APIError(
        data.message || `HTTP ${response.status}`,
        response.status,
        data.code ?? -1,
        data.data
      );
      if (!skipErrorHandling) {
        throw error;
      }
      throw error;
    }

    // 检查 API 响应格式
    if (typeof data !== 'object' || data === null) {
      throw new APIError('Invalid API response format', 500, -1);
    }

    // 业务错误
    if (!data.success) {
      const error = new APIError(
        data.message || '请求失败',
        response.status,
        data.code ?? -1,
        data.data
      );
      if (!skipErrorHandling) {
        normalizeAPIError(error);
      }
      throw error;
    }

    return data.data as T;
  } catch (error) {
    if (!skipErrorHandling && !(error instanceof APIError)) {
      normalizeAPIError(error);
    }
    throw error;
  }
}

// ==================== 辅助函数 ====================

/**
 * 获取响应的 Set-Cookie headers
 */
function getSetCookieHeaders(headers: Headers): string[] {
  // 现代浏览器/Node.js 支持 getSetCookie 方法
  if (typeof (headers as unknown as { getSetCookie?: () => string[] }).getSetCookie === 'function') {
    return (headers as unknown as { getSetCookie: () => string[] }).getSetCookie() || [];
  }
  const raw = headers.get('set-cookie');
  return raw ? [raw] : [];
}

/**
 * 解析 Set-Cookie 字符串
 */
function parseSetCookie(raw: string): {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
} | null {
  const parts = raw.split(';').map((p) => p.trim());
  const [nameValue, ...attrs] = parts;
  if (!nameValue) return null;

  const eqIdx = nameValue.indexOf('=');
  if (eqIdx === -1) return null;

  const name = nameValue.slice(0, eqIdx);
  const value = nameValue.slice(eqIdx + 1);

  const options: Record<string, unknown> = {};

  attrs.forEach((attr) => {
    const [key, val] = attr.split('=').map((s) => s.trim());
    const lowerKey = key.toLowerCase();

    switch (lowerKey) {
      case 'path':
        options.path = val;
        break;
      case 'domain':
        options.domain = val;
        break;
      case 'max-age':
        options.maxAge = parseInt(val, 10);
        break;
      case 'expires':
        options.expires = new Date(val);
        break;
      case 'httponly':
        options.httpOnly = true;
        break;
      case 'secure':
        options.secure = true;
        break;
      case 'samesite':
        options.sameSite = val?.toLowerCase() as 'strict' | 'lax' | 'none';
        break;
    }
  });

  return { name, value, ...options } as ReturnType<typeof parseSetCookie>;
}
