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

export function handleAPIError(error: unknown, handler: (e: APIError) => void): void {
    if (error instanceof APIError) {
        return handler(error);
    }

    try {
        normalizeAPIError(error)
    } catch (error) {
        if (error instanceof APIError) {
            return handler(error);
        }

        throw error;
    }
}

export function GeneralErrorHandler(e: APIError) {
    toast.error(`${e.message}`)
}