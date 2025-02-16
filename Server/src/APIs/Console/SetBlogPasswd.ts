import { API } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import Database from '../../Plugs/Database'
import Auth from "../../Plugs/Middleware/Auth";
import crypto from 'crypto'
import { Blog } from "@/Types/Schema";

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
        Database.query<Blog>('UPDATE blog SET encrypt_p = $1 WHERE uuid = $2', [encrypt_p, uuid]);
        return res.json({ ...ServerStdResponse.OK });
    }
}

export default SetBlogPasswd;