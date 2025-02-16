import { API, RequestData } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import Database from '../../Plugs/Database'
import Auth from "../../Plugs/Middleware/Auth";
import jwt from "jsonwebtoken";
import config from "../../config";

// 获取登录状态
class GetLoginStatus extends API {
    constructor() {
        super('GET', '/console/loginStatus', Auth);
    }

    public async onRequset(data: RequestData, res: any) {
        const { uuid } = data._jwt;
        const jwtPayload = {
            uuid,
            loginTime: Date.now()
        }

        const token = jwt.sign(jwtPayload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
        return res.json({
            ...ServerStdResponse.OK,
            data: {
                token
            }
        });
    }
}

export default GetLoginStatus;