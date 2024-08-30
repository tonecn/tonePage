import fs from "fs";
import { API } from "../Plugs/API/API";
import ServerStdResponse from "../ServerStdResponse";
import captchaSession from "../Plugs/Service/captchaSession";
import path from "path";
import sharp from "sharp";
import crypto from 'crypto'

// 获取人机验证图片及标识符
class GetCaptcha extends API {
    constructor() {
        super('GET', '/captcha');
    }

    public async onRequset(data: any, res: any) {
        const imgsPath = path.join(__dirname, '../assets/captchaImgs');
        const fileList = fs.readdirSync(imgsPath)
        const imgPath = path.join(imgsPath, fileList[Math.floor(Math.random() * fileList.length)]);
        const rotateDeg = Math.floor(Math.random() * 240) + 60;
        const img = Buffer.from(await sharp(imgPath).rotate(-rotateDeg).toBuffer()).toString('base64')
        const session = crypto.createHash('md5').update(`${Math.random()} ${Date.now()}`).digest('hex');
        if (await captchaSession.add(session, rotateDeg)) {
            return res.json({
                ...ServerStdResponse.OK, data: {
                    img: img,
                    session: session,
                    imgPreStr: 'data:image/jpeg;base64,'
                }
            });
        } else {
            return res.json(ServerStdResponse.SERVER_ERROR)
        }
    }
}

export default GetCaptcha;