import { Request, Response, NextFunction } from "express";
import Logger from "../Logger";
const logger = new Logger("Unbind");
const Unbind = (req: Request, res: Response, next: NextFunction) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    logger.info(`API[${req.method}][${req.url.split('?')[0]}] 请求了未绑定的接口[${ip}]`);
}

export default Unbind;