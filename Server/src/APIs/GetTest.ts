import { API } from "../Plugs/API/API";
import ServerStdResponse from "../ServerStdResponse";
import MySQLConnection from '../Plugs/MySQLConnection'

// 测试接口
class GetTest extends API {
    constructor() {
        super('GET', '/test');
    }

    public async onRequset(data: any, res: any) {
        res.json(ServerStdResponse.OK);
    }
}

export default GetTest;