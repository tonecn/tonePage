// 读取上级目录的Settingconfig.json文件
import * as fs from 'fs';
import * as path from 'path';
import Logger from './Logger';

interface MySqlConfig {
    host: string;
    user: string;
    password: string;
    database: string;
}

interface ServiceRotationVerificationType{
    AllowMaxTryCount: number;
    AllowMaxAngleDiff: number;
    ExpriedTimeSec: number;
}

interface ServiceType {
    rotationVerification: ServiceRotationVerificationType
}

interface SettingConfigType {
    mysql: MySqlConfig;
    service: ServiceType;
}

const SettingConfig: SettingConfigType = {
    mysql:{
        host: "server.tonesc.cn",
        user: "root",
        password: "245565",
        database: "tonecn"
    },
    service: {
        rotationVerification: {
            AllowMaxTryCount: 5,// 最大允许尝试次数
            AllowMaxAngleDiff: 10,// 允许的最大角度差异
            ExpriedTimeSec: 60// 单次session过期时间,单位秒
        }
    }
};
// (async () => {
//     const filePath = path.join(__dirname, '..', 'Settingconfig.json');
//     let readRes = fs.readFileSync(filePath, 'utf-8');
//     try {
//         let config = JSON.parse(readRes);
//         Object.assign(SettingConfig, config);
//     } catch (error) {
//         Logger.error(`配置文件出错 ${error}`)
//         throw new Error('配置文件格式错误');
//     }
// })()
export default SettingConfig