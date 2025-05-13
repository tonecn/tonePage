export interface StanderResponse<T> {
    statusCode: number;
    message: string;
    data?: T;
}

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public data?: unknown,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

const fetcher = async<T>(url: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 自动带上 token
            ...(typeof window !== 'undefined' && localStorage.getItem('token')
                ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
                : {}),
        },
        ...options,
    });

    const result = await res.json();
    if (result.statusCode !== 200) {
        throw new ApiError(result.statusCode, result.message, result.data);
    }

    return result.data as T;
}

export default fetcher