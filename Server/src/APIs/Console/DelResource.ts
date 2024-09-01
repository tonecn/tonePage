import { API } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import MySQLConnection from '../../Plugs/MySQLConnection'
import Auth from "../../Plugs/Middleware/Auth";

// 删除资源
class DelResource extends API {
    constructor() {
        super('DELETE', '/console/resource', Auth);
    }

    public async onRequset(data: any, res: any) {
        let { id } = data;
        if (!id) {
            return res.json(ServerStdResponse.PARAMS_MISSING);
        }
        let execRes = await MySQLConnection.execute('DELETE FROM resource  WHERE `id` = ?', [id]);

        if (!execRes || execRes.affectedRows != 1) {
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json({ ...ServerStdResponse.OK });
    }
}

export default DelResource;