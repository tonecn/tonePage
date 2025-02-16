import { API } from "../Plugs/API/API";
import ServerStdResponse from "../ServerStdResponse";
import Database from '../Plugs/Database'
import { Buffer } from 'buffer';
import axios from "axios";
import crypto from 'crypto'
import MountIP from "../Plugs/Middleware/MountIP";
import { Blog } from "@/Types/Schema";

// 获取博客内容
class GetBlogContent extends API {
    constructor() {
        super('GET', '/blogContent', MountIP);
    }
    private AccessLevelRule = {
        allow: [8, 10],
        encrypt_allow: [7, 9]
    };

    public async onRequset(data: any, res: any) {
        let { bloguuid, passwd } = data;
        if (!bloguuid || bloguuid.length != 32) {
            return res.json(ServerStdResponse.INVALID_PARAMS);
        }

        let blogContentRes = await Database.query<Blog>(`SELECT * from blog WHERE access_level in (${this.AccessLevelRule.allow.join(',')}) AND uuid = $1 `, [bloguuid]);
        if (!blogContentRes) {
            this.logger.error('查询时数据库发生错误');
            return res.json(ServerStdResponse.SERVER_ERROR);
        }
        if (blogContentRes.length == 0) {
            // 公开范围不可见，查询允许无连接加密查看的数据
            blogContentRes = await Database.query<Blog>(`SELECT * from blog WHERE access_level in (${this.AccessLevelRule.encrypt_allow.join(',')}) AND uuid = $1 `, [bloguuid]);
            if (!blogContentRes) {
                this.logger.error('查询时数据库发生错误');
                return res.json(ServerStdResponse.SERVER_ERROR);
            }
            if (blogContentRes.length != 1) {
                this.logger.warn('查询的博客不存在或不可见', bloguuid);
                return res.json(ServerStdResponse.BLOG.NOTFOUND);
            }

            // 验证密码是否存在和正确
            if (!passwd) {
                this.logger.warn(`客户端[${data._ip}]尝试访问受限制的博客，但并未提供密码`)
                return res.json(ServerStdResponse.BLOG.PROTECT_FLAG)
            }
            if (crypto.createHash('sha256').update(passwd).digest('hex') != blogContentRes[0].encrypt_p){
                this.logger.warn(`客户端[${data._ip}]尝试访问受限制的博客，并提供了错误的密码：${passwd}`)
                return res.json(ServerStdResponse.BLOG.PASSWD_ERROR)
            }
            this.logger.info(`客户端[${data._ip}]访问了受限制的博客`)
        }
        // 返回处理后的数据
        try {
            const markdownUrl = blogContentRes[0].src;
            const response = await axios.get(markdownUrl);
            const base64Content = Buffer.from(response.data, 'utf-8').toString('base64');

            // 访问次数+1
            Database.query('UPDATE blog SET visit_count = visit_count + 1 WHERE uuid = $1', [bloguuid]);
            return res.json({
                ...ServerStdResponse.OK, data: {
                    data: base64Content,
                    info: {
                        title: blogContentRes[0].title,
                        description: blogContentRes[0].description,
                        created_at: blogContentRes[0].created_at,
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