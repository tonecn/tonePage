import { API } from "../Plugs/API/API";
import ServerStdResponse from "../ServerStdResponse";
import MySQLConnection from '../Plugs/MySQLConnection'

// 获取资源列表
class GetResourceList extends API {
    constructor() {
        super('GET', '/resourceList');
    }
    private typeList = ['resource', 'download']

    public async onRequset(data: any, res: any) {
        let { type } = data;
        if(!type){
            return res.json(ServerStdResponse.PARAMS_MISSING);
        }
        if(!this.typeList.includes(type)){
            return res.json(ServerStdResponse.INVALID_PARAMS);
        }
        let resourceListRes = await MySQLConnection.execute('SELECT * from resource WHERE type = ? ORDER BY recommand ASC',[type]);
        if(!resourceListRes){
            this.logger.error('查询时数据库发生错误');
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json({...ServerStdResponse.OK, data: resourceListRes});
    }
}

export default GetResourceList;