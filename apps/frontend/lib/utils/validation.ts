/**
 * 通用验证函数
 * 
 * 在 Server Actions 中复用验证逻辑，减少重复代码
 */

/**
 * 验证邮箱
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证手机号（中国大陆）
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 验证密码
 * 要求：6-32位，包含字母和数字
 */
export function validatePassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:'",.<>/?]{6,32}$/;
  return passwordRegex.test(password);
}

/**
 * 验证用户名
 * 要求：3-20位，只允许字母、数字、下划线
 */
export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * 验证 URL
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证 slug（用于博客等）
 * 要求：3-50位，只允许小写字母、数字、连字符
 */
export function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9-]{3,50}$/;
  return slugRegex.test(slug);
}
