import { API } from "../Plugs/API/API";
import ServerStdResponse from "../ServerStdResponse";
import captchaSession from "../Plugs/Service/captchaSession";

// 检查人机验证
class CheckCaptcha extends API {
    constructor() {
        super('POST', '/checkCaptcha');
    }

    public async onRequset(data: any, res: any) {
        let { session, rotateDeg } = data;
        if (!session || !rotateDeg) {
            return res.json(ServerStdResponse.PARAMS_MISSING);
        }
        switch (await captchaSession.check(session, rotateDeg)) {
            case 0:
                // 验证码已过期或服务器错误
                res.json(ServerStdResponse.CAPTCHA.NOTFOUND);
                break;
            case 1:
                // 验证通过
                res.json(ServerStdResponse.OK);
                break;
            case -1:
                // 超过最大尝试次数
                res.json(ServerStdResponse.CAPTCHA.MAX_TRY_COUNT);
                break;
            case -2:
                // 角度不正确
                res.json(ServerStdResponse.CAPTCHA.NOTRIGHT);
                break;
            default:
                // 未知错误
                res.json(ServerStdResponse.SERVER_ERROR);
                break;
        }
    }
}

export default CheckCaptcha;