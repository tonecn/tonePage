/**
 * 通用 API 代理路由
 * 
 * 将客户端请求代理到后端 API
 * 支持所有 HTTP 方法
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';

// 延迟获取 API_BASE，避免在边缘环境初始化时出错
function getApiBase(): string {
  const apiBase = process.env.API_BASE;
  if (!apiBase) {
    throw new Error('API_BASE environment variable is not set');
  }
  return apiBase;
}

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

/**
 * 创建统一的请求处理函数
 */
async function handleRequest(request: NextRequest, context: RouteContext) {
  let API_BASE: string;
  try {
    API_BASE = getApiBase();
  } catch (error) {
    console.error('[API Proxy] API_BASE not configured:', error);
    return NextResponse.json(
      {
        success: false,
        code: -1,
        message: 'Server configuration error',
        data: null,
      },
      { status: 500 }
    );
  }

  const { path } = await context.params;
  const endpoint = '/api/' + path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = new URL(endpoint + (searchParams ? `?${searchParams}` : ''), API_BASE).href;

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
    'content-type',
  ];

  headersToForward.forEach((key) => {
    const value = reqHeaders.get(key);
    if (value) {
      forwardedHeaders[key] = value;
    }
  });

  // Default Content-Type to application/json if not present
  if (!forwardedHeaders['content-type']) {
    forwardedHeaders['content-type'] = 'application/json';
  }

  // 构建请求头
  const fetchHeaders: HeadersInit = {
    Cookie: cookieStore.toString(),
    ...forwardedHeaders,
  };

  // 获取请求体
  let body: BodyInit | undefined;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      const arrayBuffer = await request.arrayBuffer();
      if (arrayBuffer.byteLength > 0) {
        body = arrayBuffer;
      }
    } catch {
      body = undefined;
    }
  }

  try {
    const response = await fetch(url, {
      method: request.method,
      headers: fetchHeaders,
      body,
    });

    // 处理 Set-Cookie
    const setCookieHeaders = getSetCookieHeaders(response.headers);
    if (setCookieHeaders.length) {
      for (const raw of setCookieHeaders) {
        const parsed = parseSetCookie(raw);
        if (parsed) {
          const { name, value, ...cookieOptions } = parsed;
          cookieStore.set(name, value, cookieOptions);
        }
      }
    }

    // 返回响应
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      // 非 JSON 响应
      const text = await response.text();
      console.error(`[API Proxy] Non-JSON response from ${url} (${response.status})`);
      console.error(`[API Proxy] Response preview: ${text.slice(0, 500)}`);

      return NextResponse.json(
        {
          success: false,
          code: -1,
          message: text || `HTTP ${response.status}`,
          data: null,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('[API Proxy Error]', url, error);
    return NextResponse.json(
      {
        success: false,
        code: -1,
        message: error instanceof Error ? error.message : '请求失败',
        data: null,
      },
      { status: 500 }
    );
  }
}

// GET 请求
export async function GET(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context);
}

// POST 请求
export async function POST(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context);
}

// PUT 请求
export async function PUT(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context);
}

// PATCH 请求
export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context);
}

// DELETE 请求
export async function DELETE(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context);
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
