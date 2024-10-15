import { API } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import MySQLConnection from '../../Plugs/MySQLConnection'
import Auth from "../../Plugs/Middleware/Auth";
import crypto from 'crypto'

// 设置博客密码
class SetBlogPasswd extends API {
    constructor() {
        super('POST', '/console/setBlogPasswd', Auth);
    }

    public async onRequset(data: any, res: any) {
        let { uuid, passwd } = data;
        if (!uuid || !passwd) {
            return res.json(ServerStdResponse.PARAMS_MISSING);
        }
        const encrypt_p = crypto.createHash('sha256').update(passwd).digest('hex');
        MySQLConnection.execute('UPDATE blog SET encrypt_p = ? WHERE uuid = ?', [encrypt_p, uuid]);
        return res.json({ ...ServerStdResponse.OK });
    }
}

export default SetBlogPasswd;