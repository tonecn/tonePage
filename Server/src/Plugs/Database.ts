/**
 * @file Database.ts
 * @version 1.0.0
 * @description PostgreSQL数据库连接池
 */
import pg from 'pg';
import Logger from "./Logger";
import config from "../config";

class DatabasePool {
    private pool: pg.Pool;
    private logger = new Logger('Database');

    constructor() {
        this.pool = this.createConnectPool();
        this.logger.info("数据库连接池已创建")

        this.pool.on('error', (err) => {
            this.logger.error(`数据库连接池发生错误：${err}`);
        });

        this.testConnection();
    }

    private createConnectPool() {
        return new pg.Pool({
            host: config.pg.host,
            database: config.pg.database,
            user: config.pg.user,
            password: config.pg.password,
            connectionTimeoutMillis: 5000,    // 连接超时时间
            max: 20,                          // 最大连接数
            idleTimeoutMillis: 30000,         // 空闲连接超时时间
            allowExitOnIdle: true             // 允许空闲时退出
        })
    }

    private async testConnection() {
        let res = await this.query<{ result: number }>("SELECT 1 + 1 As result");
        if (!res) {
            this.logger.error("数据库连接测试失败");
            return;
        }
        if (res[0].result == 2)
            return;
        this.logger.error("数据库连接测试失败?");
    }

    /**
     * 执行SQL查询
     * @param sql SQL语句
     * @param values 可选的查询参数列表
     * @param database 可选的数据库
     * @returns Promise<any | undefined> 查询结果
     */
    public async query<T>(sql: string, values?: any[]): Promise<T[] | undefined> {
        let connection;
        try {
            connection = await this.pool.connect();
            const res = await connection.query(sql, values);
            return res.rows;
        } catch (error) {
            if (!connection) {
                this.logger.error(`数据库连接失败：${error}`);
            } else {
                this.logger.error(`数据库查询发生错误：${error}`);
            }
            return undefined;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
}

const Database = new DatabasePool();
export default Database;