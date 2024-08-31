import { API } from "../Plugs/API/API";
import ServerStdResponse from "../ServerStdResponse";
import MySQLConnection from '../Plugs/MySQLConnection'

// 获取博客评论
class GetBlogComment extends API {
    constructor() {
        super('GET', '/blogComment');
    }

    private pageSize = 100;

    public async onRequset(data: any, res: any) {
        let { bloguuid, page = 1 } = data;
        if (!bloguuid || bloguuid.length != 32 || page < 1) {
            return res.json(ServerStdResponse.INVALID_PARAMS);
        }

        let blogCommentRes = await MySQLConnection.execute('SELECT content, name, ip_address, time FROM blog_comment WHERE uuid = ? AND display = 1 ORDER BY time DESC LIMIT ? OFFSET ?;', [bloguuid, this.pageSize, (page - 1) * this.pageSize]);
        if (!blogCommentRes) {
            this.logger.error('获取博客评论时，数据库发生错误');
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json({ ...ServerStdResponse.OK, data: blogCommentRes });
    }
}

export default GetBlogComment;