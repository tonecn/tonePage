import { toast } from "sonner";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface APIResponse<T = unknown> {
    success: boolean;
    code: number;
    message: string;
    data: T;
}

export class APIError extends Error {
    constructor(
        message: string,
        public status: number = 400,
        public code: number = -1,
        public data: unknown = null
    ) {
        super(message);
        this.name = 'APIError';
    }
}

export function normalizeAPIError(error: unknown): never {
    if (error instanceof APIError) {
        throw error;
    }

    if (error instanceof Error) {
        throw new APIError(
            error.message || '未知错误',
            400,
        )
    }

    if (typeof error === 'object' && error !== null) {
        const { message, status, code, data } = {
            message: '未知错误',
            status: 400,
            code: -1,
            data: null,
            ...error
        };

        throw new APIError(
            message,
            status,
            code,
            data
        );
    }

    throw new APIError((error instanceof Error ? `${error.message}` : '') || '未知错误', 400);
}

function processError<T>(error: unknown, handler: (e: APIError) => T): T {
    if (error instanceof APIError) {
        return handler(error);
    }

    try {
        normalizeAPIError(error);
    } catch (err) {
        if (err instanceof APIError) {
            return handler(err);
        }
        throw err;
    }
}

export function handleAPIError<T>(error: unknown, handler: (e: APIError) => T): T;
export function handleAPIError<T>(handler: (e: APIError) => T): (error: unknown) => T;
export function handleAPIError<T>(
    errorOrHandler: unknown | ((e: APIError) => T),
    handler?: (e: APIError) => T
): T | ((error: unknown) => T) {
    if (handler !== undefined) {
        return processError(errorOrHandler, handler);
    }

    const handlerFn = errorOrHandler as (e: APIError) => T;
    return (error: unknown): T => processError(error, handlerFn);
}

export function generalErrorHandler(error: unknown) {
    if (error instanceof APIError) {
        return toast.error(`${error.message}`);
    }

    try {
        normalizeAPIError(error)
    } catch (error) {
        if (error instanceof APIError) {
            return toast.error(`${error.message}`);
        }

        return toast.error(`未知错误`);
    }
}

export async function safeCall<T>(
    fn: () => Promise<T>
): Promise<{ data: T | null; error: APIError | null }> {
    try {
        const data = await fn()
        return { data, error: null }
    } catch (err) {
        try {
            normalizeAPIError(err)
        } catch (apiError) {
            if (apiError instanceof APIError) {
                return { data: null, error: apiError }
            }
            throw apiError
        }
    }
}