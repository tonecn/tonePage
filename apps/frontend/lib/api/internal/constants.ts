/**
 * 常量配置
 */

/**
 * API 请求常量
 */
export const API_CONSTANTS = {
  // 默认超时时间（毫秒）
  DEFAULT_TIMEOUT_MS: 30000,

  // 重试次数
  DEFAULT_RETRY_COUNT: 0,

  // HTTP 方法
  HTTP_METHODS: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
  } as const,

  // 内容类型
  CONTENT_TYPES: {
    JSON: 'application/json',
    FORM: 'application/x-www-form-urlencoded',
    MULTIPART: 'multipart/form-data',
  } as const,
};

/**
 * API 端点常量
 */
export const API_ENDPOINTS = {
  // 认证
  AUTH: {
    LOGIN_PASSWORD: '/api/auth/login/password',
    LOGIN_SMS: '/api/auth/login/sms',
    LOGIN_PASSKEY: '/api/auth/passkey/login',
    LOGOUT: '/api/auth/logout',
    PASSKEY_REGISTER_OPTIONS: '/api/auth/passkey/register/options',
    PASSKEY_REGISTER: '/api/auth/passkey/register',
    PASSKEY_LOGIN_OPTIONS: '/api/auth/passkey/login/options',
  },

  // 用户
  USER: {
    ME: '/api/user/me',
    PASSWORD: '/api/user/password',
    PROFILE: '/api/user/profile',
  },

  // 博客
  BLOG: {
    LIST: '/api/blog',
    GET_BY_SLUG: (slug: string) => `/api/blog/${slug}/slug`,
    GET_BY_ID: (id: string) => `/api/blog/${id}`,
    COMMENTS: (id: string) => `/api/blog/${id}/comments`,
    CREATE_COMMENT: (id: string) => `/api/blog/${id}/comment`,
  },

  // 短信
  SMS: {
    SEND_LOGIN: '/api/sms/send/login',
    SEND_VERIFICATION: '/api/sms/send/verification',
  },

  // OSS
  OSS: {
    GET_STS_TOKEN: '/api/oss/sts',
  },

  // 管理员
  ADMIN: {
    RESOURCES: '/api/admin/web/resource',
    RESOURCE_GET: (id: string) => `/api/admin/web/resource/${id}`,
    BLOGS: '/api/admin/blog',
    BLOG_GET: (id: string) => `/api/admin/blog/${id}`,
  },
} as const;

/**
 * 错误代码常量
 */
export const ERROR_CODES = {
  UNKNOWN: -1,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
