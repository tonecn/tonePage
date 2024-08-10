const express = require('express');
const router = express.Router();
import STANDARDRESPONSE from "../../STANDARDRESPONSE";
import Logger from "../../plugs/Logger";
import MySQLConnection from "../../plugs/database/MySQLConnection";
Logger.info('[API][/resource/list] 加载成功')
router.get('/list', async (req: any, res: any) => {
    let listRes = await MySQLConnection.execute('SELECT `id`,`recommand`,`title`,`describe`,`addition`,`icon_src`,`src` FROM `resource` WHERE `type` = "resource"');
    if(!listRes){
        res.json(STANDARDRESPONSE.SERVER_ERROR)
        return;
    }

    res.json({
        ...STANDARDRESPONSE.OK,
        data: listRes
    })
});
export default router;