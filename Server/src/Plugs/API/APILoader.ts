import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import Logger from "../Logger";
import { API } from "./API";
import ServerStdResponse from "../../ServerStdResponse";
class APILoader {
    private app = express();
    private logger = new Logger('APILoader');
    constructor(private port?: number) {
        this.logger.info('API服务加载中...');
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors({
            origin: ['http://localhost:5173', 'http://www.tonesc.cn', 'https://www.tonesc.cn', 'http://tonesc.cn', 'https://tonesc.cn'],
            methods: ['GET', 'POST', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', ''],
        }));
    }

    add(api: { new(): API }) {
        const instance = new api();
        for (let func of instance.middlewareFunc) {
            this.app[instance.method.toLowerCase() as keyof express.Application](instance.uri, (req: Request, res: Response, next: NextFunction) => {
                func(req, res, next);
            });
            this.logger.info(`[${instance.method}][${instance.uri}] 已启用中间件[${func.name}]`);
        }

        this.app[instance.method.toLowerCase() as keyof express.Application](instance.uri, (req: Request, res: Response) => {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
            this.logger.info(`[${instance.method}][${instance.uri}] 被请求[${(ip as string).replace('::ffff:', '')}]`);
            const data = Object.assign({}, req.query, req.body);
            instance.onRequset(data, res);
        });
        this.logger.info(`[${instance.method}][${instance.uri}] 加载成功`);
    }

    start(port?: number) {
        if (this.port == undefined && port == undefined)
            throw new Error('未指定API端口')
        this.app.use((req: Request, res: Response) => {
            this.logger.info(`[${req.method}][${req.url.split('?')[0]}] 该API不存在`);
            res.json(ServerStdResponse.API_NOT_FOUND)
        })
        this.app.listen(port || this.port, () => {
            this.logger.info(`已全部加载完成，API服务开放在端口：${port || this.port}`);
        });
    }
}

export {
    APILoader,
}