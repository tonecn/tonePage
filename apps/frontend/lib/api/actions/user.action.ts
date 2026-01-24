'use server'

/**
 * 用户相关 Server Actions
 */

import { User } from '@/lib/types/user';
import { backendFetch } from '../internal/backend-client';
import { UserValidators } from '../internal/validators';

/**
 * 获取当前登录用户信息
 */
export async function getMe(): Promise<User> {
  return await backendFetch<User>('/api/user/me');
}

/**
 * 更新密码
 */
export async function updatePassword(password: string): Promise<void> {
  // 参数验证
  const validated = UserValidators.updatePassword(password)

  await backendFetch<null>('/api/user/password', {
    method: 'PUT',
    body: JSON.stringify(validated),
  });
}

/**
 * 更新用户信息
 */
export async function updateUserProfile(data: {
  nickname?: string;
  email?: string;
  avatar?: string;
}): Promise<User> {
  const validated = UserValidators.updateUserProfile(data)

  return await backendFetch<User>('/api/user/profile', {
    method: 'PUT',
    body: JSON.stringify(validated),
  });
}
