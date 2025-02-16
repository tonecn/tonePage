import { API } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import Database from '../../Plugs/Database'
import Auth from "../../Plugs/Middleware/Auth";

// 删除资源
class DelResource extends API {
    constructor() {
        super('DELETE', '/console/resource', Auth);
    }

    public async onRequset(data: any, res: any) {
        let { uuid } = data;
        if (!uuid) {
            return res.json(ServerStdResponse.PARAMS_MISSING);
        }
        let execRes = await Database.query('DELETE FROM resource  WHERE uuid = $1', [uuid]);

        if (!execRes) {
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json({ ...ServerStdResponse.OK });
    }
}

export default DelResource;