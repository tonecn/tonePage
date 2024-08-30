import Redis from 'ioredis';
import config from '../config';
import Logger from './Logger';

class RedisConnection {
    private pool?: Redis
    private logger = new Logger('Redis')

    constructor() {
        try {
            this.pool = new Redis({
                port: config.redis.port,
                host: config.redis.host,
                password: config.redis.password,
                maxRetriesPerRequest: 10,
            });
            this.logger.info('数据库连接池已创建')
        } catch (error) {
            this.logger.error('数据库连接池创建失败：' + error)
        }
        setTimeout(async () => {
            if(this.pool == undefined)
                return;
            try {
                let res = await this.pool.set('redis_test', '1');
                if (res)
                    this.logger.info('数据库测试成功')
                else
                    throw new Error('返回值错误')
            } catch (error) {
                this.logger.error('数据库测试失败：' + error)
            }

        }, 10);
    }

    public getPool(): Redis {
        return <Redis>this.pool;
    }
}

const redisConnection = new RedisConnection();
export default redisConnection.getPool();