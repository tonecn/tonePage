import { API } from "../Plugs/API/API";
import ServerStdResponse from "../ServerStdResponse";
import Database from '../Plugs/Database'
import { BlogComment } from "@/Types/Schema";

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

        let blogCommentRes = await Database.query<BlogComment>('SELECT content, name, ip_address, created_at FROM blog_comment WHERE uuid = $1 AND display = true ORDER BY created_at DESC LIMIT $2 OFFSET $3;', [bloguuid, this.pageSize, (page - 1) * this.pageSize]);
        if (!blogCommentRes) {
            this.logger.error('获取博客评论时，数据库发生错误');
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json({ ...ServerStdResponse.OK, data: blogCommentRes });
    }
}

export default GetBlogComment;