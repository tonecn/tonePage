import { API } from "../Plugs/API/API";
import ServerStdResponse from "../ServerStdResponse";
import Database from '../Plugs/Database'
import { Buffer } from 'buffer';
import axios from "axios";
import { Blog } from "@/Types/Schema";


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

        let blogLikeRes = await Database.query<Blog>('UPDATE blog SET like_count = like_count + 1 WHERE access_level > $1 AND uuid = $2 ', [this.defaultAccessLevel, bloguuid]);
        if (!blogLikeRes) {
            this.logger.error('点赞博客时，数据库发生错误');
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json(ServerStdResponse.OK);
    }
}

export default BlogLike;