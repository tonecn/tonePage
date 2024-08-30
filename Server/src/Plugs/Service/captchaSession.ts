import Logger from '../Logger';
import RedisConnection from '../RedisConnection';

class _captchaSession {
    private logger = new Logger('Service][captchaSession');
    private AllowMaxTryCount: number = 5;
    private AllowMaxAngleDiff: number = 8;
    private ExpriedTimeSec: number = 60;
    private RedisCommonKey: string = 'Service:captchaSession:';

    constructor() {
        this.logger.info('旋转图像验证服务已启动');
    }

    private async get(session: string) {
        try {
            const result = await RedisConnection.get(this.RedisCommonKey + session);
            if(result === null)
                return;
            return JSON.parse(result);
        } catch (error) {
            this.logger.error(`获取session[${session}]时发生错误：${error}`);
            return;
        }
    }
    
    private async remove(session: string) {
        try {
            await RedisConnection.del(this.RedisCommonKey + session);
        } catch (error) {
            this.logger.error(`删除session[${session}]失败`);
        }
    }

    /**
     * 
     * @param session 验证会话标识符
     * @param rotateDeg 图片旋转角度
     * @returns true存储成功 false存储失败
     */
    public async add(session: string, rotateDeg: number): Promise<boolean> {
        const result = {
            rotateDeg: rotateDeg,
            tryCount: 0,
            isPassed: false
        }
        try {
            const res = await RedisConnection.set(this.RedisCommonKey + session, JSON.stringify(result));
            if(res && res === 'OK') {
                RedisConnection.expire(this.RedisCommonKey + session, this.ExpriedTimeSec);
                this.logger.info(`session[${session}]及角度[${rotateDeg}]已存储`);
                return true;
            }
            this.logger.error(`session[${session}]及角度[${rotateDeg}]存储失败`);
            return false;
        } catch (error) {
            this.logger.error(`session[${session}]及角度[${rotateDeg}]存储失败：${error}`);
            return false;
        }
    }

    /**
     * 
     * @param session 验证会话标识符
     * @returns true已验证过期 false未通过
     */
    public async isPassed(session: string): Promise<boolean> {
        const result = await this.get(session);
        if(!result)
            return false;
        if(result.isPassed)
            this.remove(session);
        return result.isPassed;
    }

    /**
     * 
     * @param session 验证会话标识符
     * @param rotateDeg 图片旋转角度
     * @returns 0验证已过期或服务器错误 1通过验证 -1超过最大允许尝试次数 -2角度差异过大
     */
    public async check(session: string, rotateDeg: number): Promise<number> {
        try {
            let result = await this.get(session);
            if(!result){
                return 0;
            }
            if(result.isPassed){
                this.logger.info(`session[${session}]已通过验证，无需重复验证`);
                return 1;
            }
            if(Math.abs(result.rotateDeg - rotateDeg) <= this.AllowMaxAngleDiff) {
                result.isPassed = true;
                await RedisConnection.del(this.RedisCommonKey + session);
                await RedisConnection.set(this.RedisCommonKey + session, JSON.stringify(result));
                RedisConnection.expire(this.RedisCommonKey + session, this.ExpriedTimeSec);
                return 1;
            }
            result.tryCount++;
            if(result.tryCount >= this.AllowMaxTryCount) {
                this.remove(session);
                return -1;
            }
            RedisConnection.set(this.RedisCommonKey + session, JSON.stringify(result));
            return -2;
        } catch (error) {
            this.logger.error(`检查session[${session}]时发生错误：${error}`);
            return 0;
        }
    }
}

const captchaSession = new _captchaSession();
export default captchaSession;