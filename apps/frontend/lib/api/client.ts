import { APIResponse, HttpMethod, normalizeAPIError } from './common';

interface ClientFetchRequestOptions extends RequestInit {
    method?: HttpMethod;
    body?: any;
}

export async function clientFetch<T = unknown>(
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
            body: options.body ?? JSON.stringify(options.body),
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




export * as AuthAPI from './endpoints/auth.client'
export * as UserAPI from './endpoints/user.client'
export * as SmsAPI from './endpoints/sms.client'
export * as AdminAPI from './endpoints/admin.client'