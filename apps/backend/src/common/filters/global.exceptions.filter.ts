import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { BusinessException } from "../exceptions/business.exception";

export class GlobalExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorResponse = {
            success: false,
            message: '服务器内部错误',
            code: -1,
            data: null as any,
        };

        if (exception instanceof BusinessException) {
            statusCode = exception.statusCode;
            const { message, code, data } = exception;
            errorResponse = {
                ...errorResponse,
                message, code, data,
            }
        } else if (exception instanceof HttpException) {
            // 当HttpException传入类型为string时，响应data为null，message为传入的string
            // 其他请况（object/number），响应为传入数据，message为HttpException的错误码
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse() as Record<string, any>;
            if (exceptionResponse.message) {
                errorResponse.message = exceptionResponse.message;
            } else {
                errorResponse.message = '请求失败';
                errorResponse.data = exceptionResponse;
            }

            if (statusCode === HttpStatus.UNAUTHORIZED && request.cookies?.['session']) {
                response.clearCookie('session', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                });
            }
        } else {
            Logger.warn(exception, request.path);
        }

        response.status(statusCode).json(errorResponse);
    }
}