'use server'

/**
 * 资源相关 Server Actions
 */

import { Resource } from '@/lib/types/resource';
import { backendFetch } from '../internal/backend-client';

/**
 * 获取所有资源（公开接口）
 */
export async function getResources(): Promise<Resource[]> {
  return await backendFetch<Resource[]>('/api/resource');
}