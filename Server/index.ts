import Logger from "./plugs/Logger";
Logger.info('====== 服务器开始启动 ======');
require('./plugs/Settingconfig');
require('./plugs/database/MySQLConnection');
require('./plugs/database/RedisConnection');
const express = require('express');
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type','Authorization','Access-Control-Allow-Origin'],
    credentials: true,
}))

app.use((req: any, res: any, next: Function) => {
    Logger.info(`[API][${req.method}][${req.url}] 被请求`);
    next();
});

// 注册接口
import resourceList from './apis/resource/list';
import downloadList from './apis/download/list';

app.use('/resource', resourceList);
app.use('/download', downloadList);

app.listen(8080, () => {
    Logger.info('[Server] API服务已开放在http://localhost:8080');
});