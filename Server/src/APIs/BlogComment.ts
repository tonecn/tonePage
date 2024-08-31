import { API } from "../Plugs/API/API";
import ServerStdResponse from "../ServerStdResponse";
import MySQLConnection from '../Plugs/MySQLConnection'
import MountUserAgent from "../Plugs/Middleware/mountUserAgent";
import axios from "axios";
import MountIP from "../Plugs/Middleware/mountIP";


// 提交博客评论
class BlogComment extends API {
    constructor() {
        super('POST', '/blogComment', MountUserAgent, MountIP);
    }

    public async onRequset(data: any, res: any) {
        let { bloguuid, content, name, _userAgent, _ip } = data;
        if (!bloguuid || bloguuid.length != 32 || typeof content != 'string' || typeof name != 'string'
            || content.trim() == '' || name.trim() == '') {
            return res.json(ServerStdResponse.INVALID_PARAMS);
        }

        // 处理数据
        content = content.trim();
        name = name.trim();
        _ip = (_ip as string).replace('::ffff:', '');
        // 获取IPAddress
        let ip_address = '未知'
        try {
            let ipAddressRes = await axios.get(`http://ip-api.com/json/${_ip}?lang=zh-CN`);
            if (ipAddressRes.data && ipAddressRes.data.status == 'success') {
                ip_address = ipAddressRes.data.country == '中国' ? ipAddressRes.data.city : ipAddressRes.data.country;
            }
        } catch (error) {
            this.logger.warn('获取IP属地失败', error);
        }

        let blogLikeRes = await MySQLConnection.execute('INSERT INTO blog_comment (uuid, content, name, ip, ip_address, user_agent, time) VALUES (?,?,?,?,?,?,?)', [bloguuid, content.trim(), name.trim(), _ip, ip_address, _userAgent, Date.now()]);
        if (!blogLikeRes || blogLikeRes.affectedRows != 1) {
            this.logger.error('发布博客评论时，数据库发生错误');
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json(ServerStdResponse.OK);
    }
}

export default BlogComment;