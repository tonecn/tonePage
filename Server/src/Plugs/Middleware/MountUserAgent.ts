import { Request, Response, NextFunction } from "express"
import Logger from "../Logger";
const logger = new Logger('MountUserAgent')

let MountUserAgent = (req: Request, res: Response, next: NextFunction) => {
    req.body._userAgent = req.headers['user-agent'];
    logger.info(`[${req.method}][${req.url.split('?')[0]}] 用户代理解析成功：${req.body._userAgent}`);
    next();
}

export default MountUserAgent;