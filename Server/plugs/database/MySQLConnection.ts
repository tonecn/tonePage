// MYSQL数据库连接池
// 版本：v0.1
const mysql = require('mysql2/promise');
import Logger from "../Logger";
import SettingConfig from "../Settingconfig";

class MySQLConnectPool{
    pool: any;

    constructor()
    {
        this.pool = this.createConnectPool();
        Logger.info("[MySQL] 数据库连接池已创建")
        setTimeout(async () => {
            let res = await this.testConnection();
            if(res)
                Logger.info("[MySQL] 数据库测试成功")
            else
                Logger.error("[MySQL] 数据库测试失败")
        }, 10);
    }

    // 内部函数，无需手动调用
    createConnectPool(){
        return mysql.createPool({
            host: SettingConfig.mysql.host,
            database: SettingConfig.mysql.database,
            user: SettingConfig.mysql.user,
            password: SettingConfig.mysql.password,
            waitForConnections:true,
            connectionLimit:10,
            queueLimit:0
        })
    }

    // 内部函数，无需手动调用
    async testConnection(){
        try {
            let res = await this.execute("SELECT 1 + 1 As result");
            if(res[0].result == 2)
                return 1;
            else
                return 0;
        } catch (error) {
            Logger.error(`[MYSQL] 数据库测试发生了错误：`+error);
            return 0;
        }
        
    }

    // 执行SQL语句
    async execute(sql: string,values = undefined){
        let connection;
        try {
            connection = await this.pool.getConnection();
            let [rows, fields] = await connection.execute(sql,values);
            return rows;
        } catch (error) {
            Logger.error("[MYSQL] 数据库发生错误:"+error);
            return undefined;
        } finally{
            if(connection)
                connection.release();
        }
    }
}

let MySQLConnection = new MySQLConnectPool();
export default MySQLConnection;