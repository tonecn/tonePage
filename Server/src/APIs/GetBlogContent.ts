import { API } from "../Plugs/API/API";
import ServerStdResponse from "../ServerStdResponse";
import MySQLConnection from '../Plugs/MySQLConnection'
import { Buffer } from 'buffer';
import axios from "axios";


// 获取博客内容
class GetBlogContent extends API {
    constructor() {
        super('GET', '/blogContent');
    }
    private defaultAccessLevel = 6;

    public async onRequset(data: any, res: any) {
        let { bloguuid } = data;
        if (!bloguuid || bloguuid.length != 32) {
            return res.json(ServerStdResponse.INVALID_PARAMS);
        }

        let blogContentRes = await MySQLConnection.execute('SELECT * from blog WHERE access_level > ? AND uuid = ? ', [this.defaultAccessLevel, bloguuid]);
        if (!blogContentRes) {
            this.logger.error('查询时数据库发生错误');
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        if (blogContentRes.length != 1) {
            this.logger.warn('查询的博客不存在或不可见', bloguuid);
            return res.json(ServerStdResponse.BLOG.NOTFOUND);
        }
        // 返回处理后的数据
        try {
            const markdownUrl = blogContentRes[0].src;
            const response = await axios.get(markdownUrl);
            const base64Content = Buffer.from(response.data, 'utf-8').toString('base64');

            MySQLConnection.execute('UPDATE blog SET visit_count = visit_count + 1 WHERE uuid = ?', [bloguuid]);
            return res.json({
                ...ServerStdResponse.OK, data: {
                    data: base64Content,
                    info: {
                        title: blogContentRes[0].title,
                        description: blogContentRes[0].description,
                        publish_time: blogContentRes[0].publish_time,
                        visit_count: blogContentRes[0].visit_count,
                        like_count: blogContentRes[0].like_count
                    }
                }
            });
        } catch (error) {
            this.logger.error('获取博客文章内容时发生错误', error)
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
    }
}

export default GetBlogContent;