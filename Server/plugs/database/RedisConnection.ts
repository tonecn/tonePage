const Redis = require('ioredis');
import Logger from "../Logger";

class _RedisConnection{
    pool: any;

    constructor(){
        this.pool = new Redis({
            host: 'server.tonesc.cn',
            password: '2Pj4Ss9al3mS1',
            connectionPoolSize: 10,
        });
        Logger.info('[Redis] 数据库连接池已创建')
        setTimeout(async () => {
            let res = await this.set('redis_test', '1');
            if(res)
                Logger.info('[Redis] 数据库测试成功')
            else
                Logger.error('[Redis] 数据库测试失败')
        }, 10);
    }

    /**
     * 设置键值对
     * @param {*} key 
     * @param {*} value 
     * @returns { Promise<Boolean> } 成功返回true，失败返回false
     */
    set(key: string, value: string){
        return new Promise((resolve) => {
            this.pool.set(key, value, (err: any, value: any) => {
                if (err) {
                    Logger.error('[Redis] 设置键时发生错误:' + err);
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        })
    }

    /**
     * 获取键值对，成功返回值，失败返回undefined
     * @param {string} key 
     * @returns { Promise<String> } 成功返回值，失败返回undefined
     */
    get(key: string): Promise<string> {
        return new Promise((resolve) => {
            this.pool.get(key, (err: any, value: any) => {
                if (err) {
                    Logger.error('[Redis] 获取键时发生错误:' + err);
                    throw new Error('Redis连接错误')
                } else {
                    resolve(value);
                }
            })
        })
    }

    /**
     * 删除键值对，成功返回true，失败返回false
     * @param {string} key
     * @returns { Promise<Boolean> } 成功返回true，失败返回false
     */
    del(key: string){
        return new Promise((resolve) => {
            this.pool.del(key, (err: any, value: any) => {
                if (err) {
                    Logger.error('[Redis] 删除键时发生错误:' + err);
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        })
    }

    /**
     * 设置键的过期时间
     * @param {*} key
     * @param {*} seconds
     * @returns { Promise<Boolean> } 成功返回true，失败返回false
     */
    expire(key: any, seconds:  number){
        return new Promise((resolve) => {
            this.pool.expire(key, seconds, (err: number, value: number) => {
                if (err) {
                    Logger.error('[Redis] 设置键过期时发生错误:' + err);
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        })
    }
}
const RedisConnection = new _RedisConnection();
export default RedisConnection;