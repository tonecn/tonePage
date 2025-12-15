import { HttpStatus } from '@nestjs/common';

export class BusinessException {

    public statusCode: HttpStatus;
    public message: string;
    public code: number;
    public data: any;

    constructor(args: {
        statusCode?: HttpStatus,
        message?: string,
        code?: number,
        data?: any,
    }) {
        const { statusCode, message, code, data } = args;
        this.statusCode = statusCode || HttpStatus.BAD_REQUEST;
        this.message = message || '请求错误';
        this.code = code || -1;
        this.data = data || null;
    }
}