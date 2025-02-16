import { API } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import Database from '../../Plugs/Database'
import Auth from "../../Plugs/Middleware/Auth";
import crypto from 'crypto'
import { Blog } from "@/Types/Schema";

// 保存博客
class SaveBlog extends API {
    constructor() {
        super('POST', '/console/saveBlog', Auth);
    }

    public async onRequset(data: any, res: any) {
        let { uuid, title, description, created_at, src, access_level } = data;
        if (!title || !description || !created_at || !src || !access_level) {
            return res.json(ServerStdResponse.PARAMS_MISSING);
        }
        let execRes: any;
        if (uuid) {
            // 保存
            execRes = await Database.query<Blog>('UPDATE blog SET title = $1, description = $2, created_at = $3, src = $4, access_level = $5 WHERE uuid = $6', [title, description, created_at, src, access_level, uuid]);
        } else {
            // 新建
            const uuid = crypto.createHash('md5').update(`${Math.random()}${Date.now()}`).digest('hex');
            execRes = await Database.query<Blog>('INSERT INTO blog (uuid, title, description, src, created_at, access_level, visit_count, like_count) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [uuid, title, description, src, created_at, access_level, 0, 0]);
        }

        if (!execRes) {
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json({ ...ServerStdResponse.OK });
    }
}

export default SaveBlog;