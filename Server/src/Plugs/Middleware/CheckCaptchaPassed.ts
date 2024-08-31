import { Request, Response, NextFunction } from "express";
import ServerStdResponse from "../../ServerStdResponse";
import Logger from "../Logger";
import captchaSession from "../Service/captchaSession";
const logger = new Logger("CheckCaptcha");
const CheckCaptchaPassed = async (req: Request, res: Response, next: NextFunction) => {
    let session = req.query.session || req.body.session || '';
    if (session) {
        if (await captchaSession.isPassed(session))
            return next();
    }
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    logger.info(`API[${req.method}][${req.url.split('?')[0]}] 请求人机验证未通过[${ip}]`);
    res.json(ServerStdResponse.AUTH_ERROR);
}

export default CheckCaptchaPassed;