import { API } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import MySQLConnection from '../../Plugs/MySQLConnection'
import MountUserAgent from "../../Plugs/Middleware/MountUserAgent";
import MountIP from "../../Plugs/Middleware/MountIP";
import CheckCaptchaPassed from "../../Plugs/Middleware/CheckCaptchaPassed";
import config from "../../config";
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

// 登录
class Login extends API {
    constructor() {
        super('POST', '/console/login', CheckCaptchaPassed, MountUserAgent, MountIP);
    }

    public async onRequset(data: any, res: any) {
        let { username, password, _ip, _userAgent } = data;
        if (!username || !password) {
            return res.json(ServerStdResponse.PARAMS_MISSING);
        }

        // 检查用户是否存在
        let userInfoRes = await MySQLConnection.execute('SELECT * FROM user WHERE username = ?', [username]);
        if(!userInfoRes){
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        if (userInfoRes.length != 1) {
            return res.json(ServerStdResponse.USER.NOTFOUND);
        }
        userInfoRes = userInfoRes[0];
        // 检查密码是否正确
        if(crypto.createHash('sha256').update(`${userInfoRes.salt}${password}`).digest('hex') != userInfoRes.password){
            return res.json(ServerStdResponse.USER.PASSWORD_ERROR);
        }

        // 准备jwtToken
        const jwtPayload = {
            uuid: userInfoRes.uuid,
            loginTime: Date.now()
        }
        let jwtToken = jwt.sign(jwtPayload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

        // 写入登录日志
        MySQLConnection.execute('INSERT INTO user_login_log (user_uuid, ip, user_agent, time) VALUES (?,?,?,?)', [userInfoRes.uuid, _ip, _userAgent, Date.now()]);
        return res.json({ ...ServerStdResponse.OK, data: { token: jwtToken } });
    }
}

export default Login;