import { Request, Response, NextFunction } from "express";
import Logger from "../Logger";
import jwt from 'jsonwebtoken'

interface MiddlewareFunction {
    (req: Request, res: Response, next: NextFunction): void;
}

interface RequestData {
    [key: string | number | symbol] : any;
    _jwt?: any;
    _ip?: string;
}

abstract class API {

    protected logger: Logger;
    public middlewareFunc: Function[] = [];

    /**
     * @param method API方法
     * @param path API路由Path
     * @param func API中间件函数
     */
    constructor(public method: string, public path: string, ...func: MiddlewareFunction[]) {
        this.logger = new Logger('API][' + method + '][' + path);
        this.middlewareFunc.push(...func);
    }

    // to override
    public abstract onRequset(data: RequestData, res: any): void;
}

export { API };
export type { RequestData }