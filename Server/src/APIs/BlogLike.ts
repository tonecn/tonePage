import { API } from "../Plugs/API/API";
import ServerStdResponse from "../ServerStdResponse";
import MySQLConnection from '../Plugs/MySQLConnection'
import { Buffer } from 'buffer';
import axios from "axios";


// 点赞
class BlogLike extends API {
    constructor() {
        super('POST', '/blogLike');
    }
    private defaultAccessLevel = 6;

    public async onRequset(data: any, res: any) {
        let { bloguuid } = data;
        if (!bloguuid || bloguuid.length != 32) {
            return res.json(ServerStdResponse.INVALID_PARAMS);
        }

        let blogLikeRes = await MySQLConnection.execute('UPDATE blog SET like_count = like_count + 1 WHERE access_level > ? AND uuid = ? ', [this.defaultAccessLevel, bloguuid]);
        if (!blogLikeRes) {
            this.logger.error('点赞博客时，数据库发生错误');
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        if (blogLikeRes.affectedRows != 1) {
            this.logger.warn('查询的博客不存在或不可见', bloguuid);
            return res.json(ServerStdResponse.BLOG.NOTFOUND);
        }
        return res.json(ServerStdResponse.OK);
    }
}

export default BlogLike;