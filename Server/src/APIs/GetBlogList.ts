import { API } from "../Plugs/API/API";
import ServerStdResponse from "../ServerStdResponse";
import MySQLConnection from '../Plugs/MySQLConnection'

// 获取博客列表
class GetBlogList extends API {
    constructor() {
        super('GET', '/blogList');
    }
    private defaultAccessLevel = 6;

    public async onRequset(data: any, res: any) {
        let blogListRes = await MySQLConnection.execute('SELECT uuid, title, description, publish_time, visit_count, like_count from blog WHERE access_level > ? ORDER BY publish_time DESC',[this.defaultAccessLevel]);
        if(!blogListRes){
            this.logger.error('查询时数据库发生错误');
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        return res.json({...ServerStdResponse.OK, data: blogListRes});
    }
}

export default GetBlogList;