import { API } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import MySQLConnection from '../../Plugs/MySQLConnection'
import Auth from "../../Plugs/Middleware/Auth";
import crypto from 'crypto'

// 保存博客
class SaveBlog extends API {
    constructor() {
        super('POST', '/console/saveBlog', Auth);
    }

    public async onRequset(data: any, res: any) {
        let { id, uuid, title, description, publish_time, src, access_level } = data;
        if (!title || !description || !publish_time || !src || !access_level) {
            return res.json(ServerStdResponse.PARAMS_MISSING);
        }
        let execRes: any;
        if (id) {
            // 保存
            execRes = await MySQLConnection.execute('UPDATE blog SET title = ?, description = ?, publish_time = ?, src = ?, access_level = ? WHERE `id` = ?', [title, description, publish_time, src, access_level, id]);
        } else {
            // 新建
            const uuid = crypto.createHash('md5').update(`${Math.random()}${Date.now()}`).digest('hex');
            execRes = await MySQLConnection.execute('INSERT INTO blog (uuid, title, description, src, publish_time, access_level, visit_count, like_count) VALUES (?,?,?,?,?,?,?,?)', [uuid, title, description, src, publish_time, access_level, 0, 0]);
        }

        if (!execRes || execRes.affectedRows != 1) {
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json({ ...ServerStdResponse.OK });
    }
}

export default SaveBlog;