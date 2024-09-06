/**
 * @file MySQLConnection.ts
 * @version 1.0.0
 * @description MySQL数据库连接池
 */
import mysql from "mysql2/promise";
import Logger from "./Logger";
import config from "../config";

class MySQLConnectPool {
    private pool: any;
    private logger = new Logger('MySQLConnection');

    constructor() {
        this.pool = this.createConnectPool();
        this.logger.info("数据库连接池已创建")
        setTimeout(async () => {
            let res = await this.testConnection();
            if (res)
                this.logger.info("数据库测试成功")
            else
                this.logger.error("数据库测试失败")
        }, 10);
    }

    private createConnectPool() {
        return mysql.createPool({
            host: config.mysql.host,
            database: config.mysql.database,
            user: config.mysql.user,
            password: config.mysql.password,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        })
    }

    private async testConnection() {
        try {
            let res = await this.execute("SELECT 1 + 1 As result");
            if (res[0].result == 2)
                return 1;
            else
                return 0;
        } catch (error) {
            this.logger.error(`数据库测试发生了错误：` + error);
            return 0;
        }

    }

    /**
     * 执行SQL查询
     * @param sql SQL语句
     * @param values 可选的查询参数列表
     * @param database 可选的数据库
     * @returns Promise<any | undefined> 查询结果
     */
    public async execute(sql: string, values?: any[], database?: string): Promise<any | undefined> {
        let connection: any;
        try {
            connection = await this.pool.getConnection();

            // 如果指定了数据库，则更改当前连接的数据库
            if (database) {
                await connection.changeUser({ database });
            }

            let [rows, fields] = await connection.execute(sql, values);
            return rows;
        } catch (error) {
            this.logger.error("数据库发生错误:" + error, '\n##', sql, '\n##', JSON.stringify(values));
            return undefined;
        } finally {
            if (database)
                await connection.changeUser({ database: config.mysql.database });// 恢复默认数据库
            if (connection)
                connection.release();
        }
    }
}

const MySQLConnection = new MySQLConnectPool();
export default MySQLConnection;