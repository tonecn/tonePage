'use server'

/**
 * 认证相关 Server Actions
 * 
 * 特点：
 * - 在服务端执行，后端地址完全隐藏
 * - 直接返回数据，无需客户端再次 fetch
 * - 自动处理 Cookie（HttpOnly）
 * - 支持内置验证
 */

import { User } from '@/lib/types/user';
import { backendFetch } from '../internal/backend-client';
import { AuthValidators } from '../internal/validators';
import { AuthenticationResponseJSON, PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON, RegistrationResponseJSON } from '@simplewebauthn/browser';

/**
 * 账密登录
 */
export async function loginByPassword(
  identifier: string,
  password: string
): Promise<{ user: User }> {
  // 参数验证
  const validated = AuthValidators.loginByPassword(identifier, password)

  // 调用后端 API
  return await backendFetch<{ user: User }>('/api/auth/login/password', {
    method: 'POST',
    body: JSON.stringify(validated),
  });
}

/**
 * 短信登录
 */
export async function loginBySms(
  phone: string,
  code: string
): Promise<{ user: User }> {
  // 参数验证
  const validated = AuthValidators.loginBySms(phone, code)

  return await backendFetch<{ user: User }>('/api/auth/login/sms', {
    method: 'POST',
    body: JSON.stringify(validated),
  });
}

/**
 * 登出
 */
export async function logout(): Promise<void> {
  await backendFetch('/api/auth/logout', {
    method: 'POST',
  });
}

/**
 * Passkey 注册选项
 */
export async function getPasskeyRegisterOptions() {
  return await backendFetch<PublicKeyCredentialCreationOptionsJSON>('/api/auth/passkey/register/options', {
    method: 'POST',
  });
}

/**
 * Passkey 注册
 */
export async function passkeyRegister(
  name: string,
  credentialResponse: RegistrationResponseJSON
) {
  // 参数验证
  const validated = AuthValidators.passkeyRegister(name)

  return await backendFetch<{ id: string; name: string; createdAt: string }>(
    '/api/auth/passkey/register',
    {
      method: 'POST',
      body: JSON.stringify({
        name: validated.name,
        credentialResponse,
      }),
    }
  );
}

/*
 * Passkey 列表
 */
export async function getPasskeys() {
  return await backendFetch<{ id: string; name: string; createdAt: string }[]>(
    '/api/auth/passkey',
  );
}

/**
 * 删除 Passkey
 */
export async function passkeyDelete(id: string) {
  return await backendFetch<boolean>(`/api/auth/passkey/${id}` , {
    method: 'DELETE',
  });
}

/**
 * 获取 Passkey 登录选项
 */
export async function getLoginByPasskeyOptions() {
  return await backendFetch<PublicKeyCredentialRequestOptionsJSON>('/api/auth/passkey/login/options', {
    method: 'POST',
  });
}

/**
 * Passkey 登录
 */
export async function loginByPasskey(credentialResponse: AuthenticationResponseJSON) {
  return await backendFetch<{ user: User }>('/api/auth/passkey/login', {
    method: 'POST',
    body: JSON.stringify({ credentialResponse }),
  });
}
