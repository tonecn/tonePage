import { API } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import Database from '../../Plugs/Database'
import Auth from "../../Plugs/Middleware/Auth";
import { Blog } from "@/Types/Schema";

// 获取博客列表
class GetBlogs extends API {
    constructor() {
        super('GET', '/console/blogs', Auth);
    }

    public async onRequset(data: any, res: any) {
        let resourcesRes = await Database.query<Blog>("SELECT * FROM blog ORDER BY created_at DESC");
        if (!resourcesRes) {
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json({ ...ServerStdResponse.OK, data: resourcesRes });
    }
}

export default GetBlogs;