import { API } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import Database from '../../Plugs/Database'
import Auth from "../../Plugs/Middleware/Auth";

// 删除博客
class DelBlog extends API {
    constructor() {
        super('DELETE', '/console/blog', Auth);
    }

    public async onRequset(data: any, res: any) {
        let { uuid } = data;
        if (!uuid) {
            return res.json(ServerStdResponse.PARAMS_MISSING);
        }
        let execRes = await Database.query('DELETE FROM blog WHERE uuid = $1', [uuid]);

        if (!execRes) {
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json({ ...ServerStdResponse.OK });
    }
}

export default DelBlog;