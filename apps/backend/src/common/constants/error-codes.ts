/**
 * 全局业务错误码规范：
 * - 每个模块分配一个 1000 起始的段（如 USER: -1000~1999, AUTH: -2000~2999）
 * - 代码结构：{ 模块名大写 }_{ 错误语义 }
 */

export const ErrorCode = {
    // 通用错误（0 ~ 999）
    COMMON_INTERNAL_ERROR: -1,
    COMMON_INVALID_PARAM: -2,
    COMMON_NOT_FOUND: -3,

    // 用户模块（1000 ~ 1999）
    USER_NOT_FOUND: -1001,
    USER_ALREADY_EXISTS: -1002,
    USER_ACCOUNT_DISABLED: -1003,
    USER_FIND_OPTIONS_EMPTY: -1004,
    USER_ACCOUNT_DEACTIVATED: -1005,

    // 认证模块
    AUTH_INVALID_CREDENTIALS: -2001,
    AUTH_PASSKEY_NOT_REGISTERED: -2002,
    AUTH_SESSION_EXPIRED: -2003,

    // 博客模块
    BLOG_NOT_FOUND: -3001,
    BLOG_PERMISSION_DENIED: -3002,

    // 验证模块
    CAPTCHA_RARE_LIMIT: -4001,

    // 通知模块
    NOTIFICATION_SEND_FAILED: -5001,

    // Sms模块
    SMS_CODE_INCORRECT: -6001,
    SMS_CODE_EXPIRED: -6002,

    // 资源模块
    RESOURCE_UPLOAD_FAILED: -7001,
    RESOURCE_NOT_FOUND: -7002,

    // 管理员模块
    ADMIN_FORBIDDEN: -8001,
} as const;

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode];