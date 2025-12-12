// import { headers } from 'next/headers'

export async function apiFetch<T extends unknown>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    // const nextHeaders = await headers()

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        // ...nextHeaders,
    }

    try {
        const res = await fetch(new URL(url, process.env.API_BASE), {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
            cache: 'no-store',
        });
        if (res.status === 200) {
            const data = await res.json();
            if (data.statusCode === 200) {
                return data.data;
            }
            throw new Error(data.message ?? '未知错误');
        }
        throw new Error('请求失败');
    } catch (error) {
        throw error;
    }
}