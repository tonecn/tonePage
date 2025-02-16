import { API } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import Database from '../../Plugs/Database'
import MountUserAgent from "../../Plugs/Middleware/MountUserAgent";
import MountIP from "../../Plugs/Middleware/MountIP";
import config from "../../config";
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { User } from "@/Types/Schema";

// 登录
class Login extends API {
    constructor() {
        super('POST', '/console/login', MountUserAgent, MountIP);
    }

    public async onRequset(data: any, res: any) {
        let { username, password, _ip, _userAgent } = data;
        if (!username || !password) {
            return res.json(ServerStdResponse.PARAMS_MISSING);
        }

        // 检查用户是否存在
        let userInfoRes = await Database.query<User>('SELECT * FROM user WHERE username = $1', [username]);
        if (!userInfoRes) {
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        if (userInfoRes.length != 1) {
            return res.json(ServerStdResponse.USER.NOTFOUND);
        }
        const UserInfo = userInfoRes[0];
        // 检查密码是否正确
        if (crypto.createHash('sha256').update(`${UserInfo.salt}${password}`).digest('hex') != UserInfo.password) {
            return res.json(ServerStdResponse.USER.PASSWORD_ERROR);
        }

        // 准备jwtToken
        const jwtPayload = {
            uuid: UserInfo.uuid,
            loginTime: Date.now()
        }
        let jwtToken = jwt.sign(jwtPayload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

        // 写入登录日志
        Database.query('INSERT INTO user_login_log (user_uuid, ip, user_agent, time) VALUES ($1,$2,$3,$4)', [UserInfo.uuid, _ip, _userAgent, Date.now()]);
        return res.json({ ...ServerStdResponse.OK, data: { token: jwtToken } });
    }
}

export default Login;