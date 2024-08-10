const express = require('express');
const router = express.Router();
const { Logger } = require('@plugs/Logger');
const { STANDARDRESPONSE } = require('@root/STANDARDRESPONSE')
const { RotationVerificationService } = require('@plugs/Service/RotationVerificationService');
Logger.info(`[API][/hmv/checkRotationVerification] 加载成功`);
// 验证旋转验证，传入RVSession和用户旋转角度，返回验证结果
router.post('/checkRotationVerification', async (req, res) => {
    let { session, angle } = req.body;
    // session为RVSession(32位UUID)，angle为用户旋转角度
    if(!session || !angle || session.length != 32){
        Logger.warn(`[API][/hmv/checkRotationVerification]参数缺失或错误(session=${session}, angle=${angle})`);
        res.json({...STANDARDRESPONSE.PARAMETER_MISSING});
        return;
    }
    let result = await RotationVerificationService.check(session,angle);
    switch(result){
        case 0:
            Logger.info(`[API][/hmv/checkRotationVerification] session[${session}]已过期，验证未通过`);
            res.json({...STANDARDRESPONSE.ROTATION_VERIFICATION_EXPIRED, endpoint: result});
            return;
        case -1:
            Logger.info(`[API][/hmv/checkRotationVerification] session[${session}]验证次数已达上限，验证未通过`);
            res.json({...STANDARDRESPONSE.ROTATION_VERIFICATION_MAX_ATTEMPTS, endpoint: result});
            return;
        case -2:
            Logger.info(`[API][/hmv/checkRotationVerification] session[${session}]验证角度差异过大，验证未通过`);
            res.json({...STANDARDRESPONSE.ROTATION_VERIFICATION_ANGLE_DIFFERENCE, endpoint: result});
            return;
    }
    Logger.info(`[API][/hmv/checkRotationVerification] session[${session}]验证通过`);
    res.json({...STANDARDRESPONSE.OK});
})
module.exports = router;