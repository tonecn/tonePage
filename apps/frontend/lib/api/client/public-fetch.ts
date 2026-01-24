/**
 * 客户端公开接口
 * 
 * 场景：
 * - 博客列表、详情（公开接口）
 * - 资源列表（公开接口）
 * - 其他不需要认证的接口
 * 
 * 注意：
 * - 仅在客户端使用
 * - 大多数情况应使用 Server Actions，这里仅作备选
 */

import { APIResponse, HttpMethod, normalizeAPIError } from '../common';

interface ClientFetchRequestOptions extends RequestInit {
    method?: HttpMethod;
    body?: string;
}

export async function publicFetch<T = unknown>(
    endpoint: string,
    options: ClientFetchRequestOptions = {}
): Promise<T> {
    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(endpoint, {
            method: options.method || 'GET',
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
            body: options.body ?? (options.body ? JSON.stringify(options.body) : undefined),
            credentials: 'include',
            ...options,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw JSON.parse(errorText);
        }

        const data: APIResponse<T> = await response.json();

        if (!data.success) {
            throw data;
        }

        return data.data as T;
    } catch (error) {
        normalizeAPIError(error);
    }
}
