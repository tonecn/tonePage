import Logger from "@plugs/Logger";
import SettingConfig from "@plugs/Settingconfig";
import RedisConnection from "@plugs/database/RedisConnection";

class RotationVerificationService{

    constructor(){
        Logger.info('[Service][RotationVerificationService] 旋转图像验证服务已启动')
    }

    async #get(session: string){
        // 通过session获取单个存储对象，无需手动调用
        try {
            let result:  = await RedisConnection.get('RotationVerificationService:' + session);
            return JSON.parse(result);// 由于RVService的值为JSON字符串，因此需要解析
        } catch (error) {
            // 不一定是数据库出错，有可能是已过期
            Logger.warn(`[Service][RotationVerificationService] 获取session[${session}]时发生错误：${error}`);
            return undefined;
        }
    }

    async #remove(session: string){
        // 删除session，无需手动调用
        let res = await RedisConnection.del('RotationVerificationService:' + session);
        if(!res)
            Logger.err(`[Service][RotationVerificationService] 删除session[${session}]失败`);
    }
    
    /**
     * 将session和角度信息存储，便于后续验证
     * @param {*} session
     * @param {*} rotateDeg
     */
    async add(session: string,rotateDeg: number){
        let result = {
            rotateDeg: rotateDeg,
            tryCount: 0,
            isPassed: false
        }
        let res = await RedisConnection.set('RotationVerificationService:' + session, JSON.stringify(result));
        if(!res)
        {
            Logger.err(`[Service][RotationVerificationService] 存储session[${session}]失败`);
            return false;
        }
        // 设置过期时间
        RedisConnection.expire('RotationVerificationService:' + session, this.ExpriedTimeSec);
        return true;
    }

    /**
     * 查询该session是否已通过验证，使用后自动实效
     * @param {*} session 
     * @returns {Boolean} 验证通过结果
     */
    async isPassed(session){
        // 通过后，有效期60s
        let result = await this.#get(session);
        if(!result)
            return false;
        let res = result.isPassed;
        if(res)
            // 验证通过，该session失效，防止重复验证
            this.#remove(session);
        return res;
    }

    /**
     * 检查session和角度信息
     * @param {*} session 
     * @param {*} rotateDeg 
     * @returns {Number} 0,已过期(或未加入验证池) -1,超过最大尝试次数 1,验证通过 -2,角度差异过大
     */
    async check(session,rotateDeg){
        let result = await this.#get(session);
        if(!result)
            return 0;// 已过期(或未加入验证池)
        if(Math.abs(result.rotateDeg - rotateDeg) <= this.AllowMaxAngleDiff)
        {                                   
            // 验证通过，标识为已通过，并设定有效期为60s
            result.isPassed = true;
            await RedisConnection.del('RotationVerificationService:' + session);
            await RedisConnection.set('RotationVerificationService:' + session, JSON.stringify(result));
            RedisConnection.expire('RotationVerificationService:' + session, this.ExpriedTimeSec);
            return 1;
        }
        result.tryCount++;// 浪费一次尝试次数
        if(result.tryCount >= this.AllowMaxTryCount)
        {
            this.#remove(session);
            return -1;// 超过最大尝试次数
        }
        // 保存尝试次数
        RedisConnection.set('RotationVerificationService:' + session, JSON.stringify(result));
        return -2;// 角度差异过大
    }
}
let _RotationVerificationService = new RotationVerificationService();
module.exports.RotationVerificationService = _RotationVerificationService;
