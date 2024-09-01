import { API } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import MySQLConnection from '../../Plugs/MySQLConnection'
import Auth from "../../Plugs/Middleware/Auth";

// 保存资源
class SaveResource extends API {
    constructor() {
        super('POST', '/console/saveResource', Auth);
    }

    public async onRequset(data: any, res: any) {
        let { id, type, recommand, title, describe, icon_src, addition, src } = data;
        if (!type || !recommand || !title || !describe || !icon_src || !addition || !src) {
            return res.json(ServerStdResponse.PARAMS_MISSING);
        }
        let execRes: any;
        if (id) {
            // 保存
            execRes = await MySQLConnection.execute('UPDATE resource SET `type` = ?, `recommand` = ?, `title` = ?, `describe` = ?, `addition` = ?, `icon_src` = ?, `src` = ? WHERE `id` = ?', [type, recommand, title, describe, addition, icon_src, src, id]);
        } else {
            // 新建
            execRes = await MySQLConnection.execute('INSERT INTO resource (`type`, `recommand`, `title`, `describe`, `addition`, `icon_src`, `src`) VALUES (?,?,?,?,?,?,?)', [type, recommand, title, describe, addition, icon_src, src]);
        }

        if (!execRes || execRes.affectedRows != 1) {
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json({ ...ServerStdResponse.OK });
    }
}

export default SaveResource;