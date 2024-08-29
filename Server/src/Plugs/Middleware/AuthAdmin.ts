import { Request, Response, NextFunction } from "express";
import config from "../../config";
import ServerStdResponse from "../../ServerStdResponse";
import Logger from "../Logger";
const logger = new Logger("AuthAdmin");
const AuthAdmin = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;
    if (token === config.adminToken) {
        next();
    } else {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
        logger.info(`API[${req.method}][${req.url.split('?')[0]}] 请求鉴权不通过[${token}][${ip}]`);
        res.json(ServerStdResponse.AUTH_ERROR);
    }
}

export default AuthAdmin;