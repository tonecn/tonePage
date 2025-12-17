import { cookies, headers } from 'next/headers';
import { APIResponse, HttpMethod, normalizeAPIError } from './common';

interface ServerFetchRequestOptions extends RequestInit {
    method?: HttpMethod;
    body?: any;
}

export async function serverFetch<T = unknown>(
    endpoint: string,
    options: ServerFetchRequestOptions = {}
): Promise<T> {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const reqHeaders = new Headers(await headers());
    const forwardedHeaders: Record<string, string> = {};
    ['user-agent', 'x-forwarded-for', 'x-real-ip'].forEach((key) => {
        const value = reqHeaders.get(key);
        if (value) forwardedHeaders[key] = value;
    });

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...forwardedHeaders,
    };

    try {
        const response = await fetch(new URL(endpoint, process.env.API_BASE).href, {
            method: options.method || 'GET',
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
            body: options.body ?? JSON.stringify(options.body),
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



export * as BlogAPI from './endpoints/blog.server';
export * as ResourceAPI from './endpoints/resource.server';
export * as UserAPI from './endpoints/user.server';