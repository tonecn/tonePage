'use server'

/**
 * OSS 相关 Server Actions
 */

import { backendFetch } from '../internal/backend-client';

export interface StsToken {
  AccessKeyId: string;
  AccessKeySecret: string;
  Expiration: string;
  SecurityToken: string;
  userId: string;
}

/**
 * 获取 STS Token（用于直传 OSS）
 */
export async function getStsToken(): Promise<StsToken> {
  return await backendFetch<StsToken>('/api/oss/sts');
}
