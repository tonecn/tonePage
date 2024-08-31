import { Request, Response, NextFunction } from "express"
import Logger from "../Logger";
const logger = new Logger('MountIP')

let MountIP = (req: Request, res: Response, next: NextFunction) => {
    req.body._ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    logger.info(`[${req.method}][${req.url.split('?')[0]}] IP解析成功：${req.body._ip}`);
    next();
}

export default MountIP;