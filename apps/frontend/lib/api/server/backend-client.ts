/**
 * 服务端后端通信客户端
 * 
 * 职责：
 * - 隐藏后端地址（API_BASE 仅在此模块可见）
 * - 处理服务端组件/Route Handlers 中的 HTTP 请求
 * - 转发 Cookie 和 Header
 * - 统一错误处理
 * 
 * 使用位置：
 * - 仅在 Server Components 中使用
 * - 仅在 Route Handlers (app/api/) 中使用
 * - 不允许在客户端代码中导入
 */

import { headers, cookies } from 'next/headers';
import { normalizeAPIError } from '../common';

const API_BASE = process.env.API_BASE;

if (!API_BASE) {
  throw new Error('API_BASE environment variable is not set');
}

export interface BackendFetchOptions extends RequestInit {
  skipErrorHandling?: boolean;
}

/**
 * 服务端后端通信函数
 * 
 * 特点：
 * - 自动转发客户端 Cookie
 * - 自动转发客户端 Headers (User-Agent, X-Forwarded-For等)
 * - 自动添加 Content-Type
 * - 统一错误处理
 */
export async function backendFetch<T = unknown>(
  endpoint: string,
  options: BackendFetchOptions = {}
): Promise<T> {
  const cookieStore = await cookies();
  const reqHeaders = new Headers(await headers());

  // 提取需要转发的 header
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

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Cookie: cookieStore.toString(),
    ...forwardedHeaders,
  };

  const url = new URL(endpoint, API_BASE).href;

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      body: options.body,
      ...options,
    });

    // 将后端返回的 Set-Cookie 同步到当前响应
    const setCookieHeaders = getSetCookieHeaders(response.headers);
    if (setCookieHeaders.length) {
      setCookieHeaders.forEach((raw) => {
        const parsed = parseSetCookie(raw);
        if (!parsed) return;
        const { name, value, ...cookieOptions } = parsed;
        cookieStore.set(name, value, cookieOptions);
      });
    }

    // 处理 HTTP 错误状态
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      const errorBody = contentType?.includes('application/json')
        ? await response.json()
        : await response.text();

      const error = typeof errorBody === 'object' ? errorBody : {
        message: errorBody || `HTTP ${response.status}`,
        status: response.status,
      };

      if (!options.skipErrorHandling) {
        normalizeAPIError(error);
      }
      throw error;
    }

    // 解析响应
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('Invalid response content type');
    }

    const data = await response.json();

    // 检查 API 响应格式
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid API response format');
    }

    // 处理业务错误
    if (!data.success) {
      if (!options.skipErrorHandling) {
        normalizeAPIError(data);
      }
      throw data;
    }

    return data.data as T;
  } catch (error) {
    if (!options.skipErrorHandling) {
      normalizeAPIError(error);
    }
    throw error;
  }
}

/**
 * 便利函数：构建完整的请求体
 */
export function buildRequestBody<T extends Record<string, unknown>>(data: T): string {
  return JSON.stringify(data);
}

// 解析并收集后端返回的 Set-Cookie header
function getSetCookieHeaders(headers: Headers): string[] {
  if (typeof (headers as unknown as { getSetCookie?: () => string[] }).getSetCookie === 'function') {
    return (headers as unknown as { getSetCookie: () => string[] }).getSetCookie() || [];
  }
  const raw = headers.get('set-cookie');
  return raw ? [raw] : [];
}

// 解析 Set-Cookie 字符串
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
