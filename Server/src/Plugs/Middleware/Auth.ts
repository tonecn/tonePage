import { Request, Response, NextFunction } from "express";
import config from "../../config";
import ServerStdResponse from "../../ServerStdResponse";
import Logger from "../Logger";
import jwt from 'jsonwebtoken'
const logger = new Logger("Auth");
const Auth = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;
    try {
        if (!token) {
            throw new Error('空Token')
        }
        if(typeof token != 'string' || token.indexOf('Bearer ') == -1){
            throw new Error('格式错误的Token')
        }
        req.body._jwt = jwt.verify(token.replace('Bearer ',''), config.jwt.secret);
        next()
    } catch (error) {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
        logger.info(`API[${req.method}][${req.url.split('?')[0]}] 请求鉴权不通过[${token}][${ip}] ${error}`);
        res.json(ServerStdResponse.AUTH_ERROR);
    }
}

export default Auth;