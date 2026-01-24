/**
 * 内部后端通信客户端
 * 
 * 职责：
 * - 隐藏后端地址（API_BASE 仅在此模块可见）
 * - 处理 Server Actions 中的 HTTP 请求
 * - 转发 Cookie 和 Header
 * - 统一错误处理
 * 
 * 使用位置：仅在 lib/api/actions/ 中使用
 * 不允许在客户端代码中导入
 */

import { headers, cookies } from 'next/headers';
import { normalizeAPIError } from '../common';

const API_BASE = process.env.API_BASE;

if (!API_BASE) {
  throw new Error('API_BASE environment variable is not set');
}

export interface BackendFetchOptions extends RequestInit {
  skipErrorHandling?: boolean; // 某些场景可跳过统一错误处理
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
    'x-forwarded-host',
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

    // 将后端返回的 Set-Cookie 同步到当前响应，确保浏览器写入
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
export function buildRequestBody<T extends Record<string, any>>(data: T): string {
  return JSON.stringify(data);
}

// 解析并收集后端返回的 Set-Cookie header
function getSetCookieHeaders(headers: Headers): string[] {
  if (typeof (headers as any).getSetCookie === 'function') {
    return (headers as any).getSetCookie() || [];
  }

  const raw = headers.get('set-cookie');
  if (!raw) return [];

  // 尝试拆分多个 cookie，避免被 Expires 中的逗号误切分
  return raw.split(/,(?=[^;]+?=)/).map((item) => item.trim()).filter(Boolean);
}

// 粗解析单个 Set-Cookie 字符串，提取必要属性
function parseSetCookie(setCookie: string): {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  expires?: Date;
  maxAge?: number;
} | null {
  const parts = setCookie.split(';').map((p) => p.trim());
  const [nameValue, ...attrParts] = parts;
  const eqIndex = nameValue.indexOf('=');
  if (eqIndex <= 0) return null;

  const name = nameValue.slice(0, eqIndex).trim();
  const value = nameValue.slice(eqIndex + 1).trim();
  if (!name) return null;

  const result: {
    name: string;
    value: string;
    path?: string;
    domain?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
    expires?: Date;
    maxAge?: number;
  } = { name, value };

  attrParts.forEach((attr) => {
    if (!attr) return;
    const [rawKey, ...rawValParts] = attr.split('=');
    const key = rawKey.trim().toLowerCase();
    const val = rawValParts.join('=').trim();

    switch (key) {
      case 'path':
        result.path = val || undefined;
        break;
      case 'domain':
        result.domain = val || undefined;
        break;
      case 'httponly':
        result.httpOnly = true;
        break;
      case 'secure':
        result.secure = true;
        break;
      case 'samesite': {
        const normalized = val.toLowerCase();
        if (normalized === 'lax' || normalized === 'strict' || normalized === 'none') {
          result.sameSite = normalized as 'lax' | 'strict' | 'none';
        }
        break;
      }
      case 'expires': {
        const date = new Date(val);
        if (!isNaN(date.getTime())) {
          result.expires = date;
        }
        break;
      }
      case 'max-age': {
        const parsed = parseInt(val, 10);
        if (!Number.isNaN(parsed)) {
          result.maxAge = parsed;
        }
        break;
      }
      default:
        break;
    }
  });

  return result;
}
