import { API } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import MySQLConnection from '../../Plugs/MySQLConnection'
import Auth from "../../Plugs/Middleware/Auth";

// 获取博客列表
class GetBlogs extends API {
    constructor() {
        super('GET', '/console/blogs', Auth);
    }

    public async onRequset(data: any, res: any) {
        // const { uuid } = data._jwt;
        let resourcesRes = await MySQLConnection.execute("SELECT * FROM blog ORDER BY id DESC");
        if (!resourcesRes) {
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json({ ...ServerStdResponse.OK, data: resourcesRes });
    }
}

export default GetBlogs;