/**
 * API 配置模块
 * 
 * 统一管理 API 基础地址和运行时环境检测
 */

/**
 * 判断当前代码是否在浏览器中运行
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * 获取 API 基础地址
 * 
 * 客户端：使用 NEXT_PUBLIC_API_BASE（暴露给浏览器）
 * 服务端：优先使用 API_BASE（内网地址），回退到 NEXT_PUBLIC_API_BASE
 * 
 * 这种设计允许：
 * - 生产环境服务端使用内网地址访问后端（更快、更安全）
 * - 客户端使用公网地址直接访问后端
 */
export function getApiBase(): string {
  if (isBrowser()) {
    // 客户端：必须使用 NEXT_PUBLIC_ 前缀的环境变量
    const clientBase = process.env.NEXT_PUBLIC_API_BASE;
    if (!clientBase) {
      throw new Error('NEXT_PUBLIC_API_BASE environment variable is not set');
    }
    return clientBase;
  } else {
    // 服务端：优先使用内网地址
    const serverBase = process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE;
    if (!serverBase) {
      throw new Error('API_BASE or NEXT_PUBLIC_API_BASE environment variable is not set');
    }
    return serverBase;
  }
}

/**
 * 构建完整的 API URL
 */
export function buildApiUrl(endpoint: string, params?: Record<string, string>): string {
  const base = getApiBase();
  const url = new URL(endpoint, base);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }
  
  return url.href;
}
