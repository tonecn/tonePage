import { API } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import Database from '../../Plugs/Database'
import Auth from "../../Plugs/Middleware/Auth";
import { Resource } from "@/Types/Schema";

// 获取资源列表
class GetResources extends API {
    constructor() {
        super('GET', '/console/resources', Auth);
    }

    public async onRequset(data: any, res: any) {
        // const { uuid } = data._jwt;
        let resourcesRes = await Database.query<Resource>("SELECT * FROM resource ORDER BY type, recommand, created_at  DESC");
        if (!resourcesRes) {
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json({ ...ServerStdResponse.OK, data: resourcesRes });
    }
}

export default GetResources;