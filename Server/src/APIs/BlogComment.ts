import { API } from "../Plugs/API/API";
import ServerStdResponse from "../ServerStdResponse";
import Database from '../Plugs/Database'
import MountUserAgent from "../Plugs/Middleware/MountUserAgent";
import axios from "axios";
import MountIP from "../Plugs/Middleware/MountIP";
import { BlogComment as BlogCommentType } from "@/Types/Schema"

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
            let ipAddressRes = await axios.get(`https://mesh.if.iqiyi.com/aid/ip/info?version=1.1.1&ip=` + _ip);
            if (ipAddressRes.data && ipAddressRes.data.msg == 'success') {

                ip_address = ipAddressRes.data.data.countryCN == '中国' ? ipAddressRes.data.data.provinceCN : ipAddressRes.data.data.countryCN;
            }
        } catch (error) {
            this.logger.warn('获取IP属地失败', error);
        }

        let blogLikeRes = await Database.query<BlogCommentType>('INSERT INTO blog_comment (uuid, content, name, ip, ip_address, user_agent, display, created_at) VALUES ($1,$2,$3,$4,$5,$6,true,$7)', [bloguuid, content.trim(), name.trim(), _ip, ip_address, _userAgent, new Date()]);
        if (!blogLikeRes) {
            this.logger.error('发布博客评论时，数据库发生错误');
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json(ServerStdResponse.OK);
    }
}

export default BlogComment;