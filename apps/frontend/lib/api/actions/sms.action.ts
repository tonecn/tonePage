'use server'

/**
 * 短信相关 Server Actions
 */

import { backendFetch } from '../internal/backend-client';
import { SMSValidators } from '../internal/validators';

/**
 * 发送登录短信
 */
export async function sendLoginSms(phone: string): Promise<void> {
  // 参数验证
  const validated = SMSValidators.sendLoginSms(phone)

  await backendFetch('/api/sms/send/login', {
    method: 'POST',
    body: JSON.stringify(validated),
  });
}

/**
 * 发送验证短信
 */
export async function sendVerificationSms(phone: string, type: 'register' | 'reset'): Promise<void> {
  // 参数验证
  const validated = SMSValidators.sendVerificationSms(phone, type)

  await backendFetch('/api/sms/send/verification', {
    method: 'POST',
    body: JSON.stringify(validated),
  });
}
