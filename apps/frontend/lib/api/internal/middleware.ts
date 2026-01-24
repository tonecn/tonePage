/**
 * 请求/响应中间件
 * 
 * 职责：
 * - 请求拦截和转换
 * - 响应拦截和转换
 * - 日志记录（可选）
 * - 超时处理（可选）
 */

export interface RequestContext {
  method: string;
  endpoint: string;
  headers: Record<string, string>;
  body?: any;
  timestamp: number;
}

export interface ResponseContext {
  status: number;
  body: any;
  timestamp: number;
  duration: number;
}

/** 请求拦截器列表 */
const requestInterceptors: ((ctx: RequestContext) => Promise<RequestContext> | RequestContext)[] = [];

/** 响应拦截器列表 */
const responseInterceptors: ((ctx: ResponseContext) => Promise<ResponseContext> | ResponseContext)[] = [];

/**
 * 添加请求拦截器
 */
export function addRequestInterceptor(
  interceptor: (ctx: RequestContext) => Promise<RequestContext> | RequestContext
) {
  requestInterceptors.push(interceptor);
}

/**
 * 添加响应拦截器
 */
export function addResponseInterceptor(
  interceptor: (ctx: ResponseContext) => Promise<ResponseContext> | ResponseContext
) {
  responseInterceptors.push(interceptor);
}

/**
 * 执行请求拦截器链
 */
export async function processRequestInterceptors(
  ctx: RequestContext
): Promise<RequestContext> {
  let processedCtx = ctx;
  for (const interceptor of requestInterceptors) {
    processedCtx = await interceptor(processedCtx);
  }
  return processedCtx;
}

/**
 * 执行响应拦截器链
 */
export async function processResponseInterceptors(
  ctx: ResponseContext
): Promise<ResponseContext> {
  let processedCtx = ctx;
  for (const interceptor of responseInterceptors) {
    processedCtx = await interceptor(processedCtx);
  }
  return processedCtx;
}

/**
 * 日志拦截器示例
 */
export function createLoggingInterceptor(isDev = process.env.NODE_ENV === 'development') {
  if (!isDev) return;

  addRequestInterceptor(async (ctx) => {
    console.log(`[API Request] ${ctx.method} ${ctx.endpoint}`);
    return ctx;
  });

  addResponseInterceptor(async (ctx) => {
    console.log(
      `[API Response] Status: ${ctx.status}, Duration: ${ctx.duration}ms`
    );
    return ctx;
  });
}

/**
 * 超时处理示例
 */
export function createTimeoutInterceptor(timeoutMs = 30000) {
  addRequestInterceptor(async (ctx) => {
    ctx.headers['X-Request-Timeout'] = String(timeoutMs);
    return ctx;
  });
}
