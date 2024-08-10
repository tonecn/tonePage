import Logger from "@plugs/Logger";
import STANDARDRESPONSE from "STANDARDRESPONSE";

const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const fs = require('fs');
const path = require("path");
const { v4: uuidv4 } = require('uuid');

Logger.info(`[API][/hmv/rotationVerification] 加载成功`);
// 获取人机验证过程的图片，返回一个RVSession，用于后续的验证
router.get('/rotationVerification', async (req, res) => {
    // 读取图像文件
    try {
        // 获取随机图片路径
        const directoryPath = __dirname.slice(0, -8) + "/assets/RotationVerificationPicture/"
        let files = fs.readdirSync(directoryPath);
        files = files.filter(file => path.extname(file).toLowerCase() === '.jpg');
        let filePath= directoryPath + files[Math.floor(Math.random() * files.length)]
        Logger.info("[API][/hmv/rotationVerification] 获取人机验证图片：" + filePath)
        // 生成session和角度信息
        let session_uuid = uuidv4().replace(/-/g,'');// 32 个字符
        const rotateDeg = 60 + Math.floor(Math.random() * 240 );// 限制角度范围 60 ~ 300
        // 加入验证池
        let RVAddRes = await RotationVerificationService.add(session_uuid, rotateDeg);
        if(!RVAddRes){
            Logger.err("[API][/hmv/rotationVerification] 添加验证信息到验证池中失败")
            res.json({...STANDARDRESPONSE.SERVER_ERROR});
            return;
        }
        // 图片旋转处理
        const rotatedImage = await sharp(filePath)
            .rotate(-rotateDeg)
            .toBuffer();
        // 转换为Base64编码
        let imageBase64 = "data:image/jpg;base64," + rotatedImage.toString('base64');
        Logger.info(`[API][/hmv/rotationVerification] session[${session_uuid}] 验证码图片已生成，角度[${rotateDeg}]`)
        res.json({...STANDARDRESPONSE.OK,'data': imageBase64,'session': session_uuid})
    } catch (error) {
        Logger.err("[API][/hmv/rotationVerification] 获取人机验证图片错误：" + error)
        res.json({...STANDARDRESPONSE.SERVER_ERROR})
    }
})
module.exports = router;