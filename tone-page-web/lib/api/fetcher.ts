export interface StanderResponse<T> {
    statusCode: number;
    message: string;
    data?: T;
}

const fetcher = async<T>(url: string, options?: RequestInit): Promise<StanderResponse<T>> => {
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

    if (!res.ok) {
        return await res.json();
    }

    return await res.json();
}

export default fetcher