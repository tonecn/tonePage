import { API } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import Database from '../../Plugs/Database'
import Auth from "../../Plugs/Middleware/Auth";
import { Resource } from "@/Types/Schema";
import Crypto from 'crypto'

// 保存资源
class SaveResource extends API {
    constructor() {
        super('POST', '/console/saveResource', Auth);
    }

    public async onRequset(data: any, res: any) {
        let { uuid, type, recommand, title, describe, icon_src, addition, src } = data;
        if (!type || !recommand || !title || !describe || !icon_src || !addition || !src) {
            return res.json(ServerStdResponse.PARAMS_MISSING);
        }
        let execRes: any;
        if (uuid) {
            // 保存
            execRes = await Database.query<Resource>('UPDATE resource SET "type" = $1, "recommand" = $2, "title" = $3, "describe" = $4, "addition" = $5, "icon_src" = $6, "src" = $7 WHERE "uuid" = $8', [type, recommand, title, describe, addition, icon_src, src, uuid]);
        } else {
            // 新建
            uuid = Crypto.createHash('md5').update(`${Math.random()}${Date.now()}`).digest('hex');
            execRes = await Database.query<Resource>('INSERT INTO resource ("uuid","type", "recommand", "title", "describe", "addition", "icon_src", "src", "created_at") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [uuid, type, recommand, title, describe, addition, icon_src, src, new Date()]);
        }

        if (!execRes) {
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json({ ...ServerStdResponse.OK });
    }
}

export default SaveResource;