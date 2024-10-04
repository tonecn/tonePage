import { API } from "../../Plugs/API/API";
import ServerStdResponse from "../../ServerStdResponse";
import { STS } from 'ali-oss'
import Auth from "../../Plugs/Middleware/Auth";
import config from "../../config";

// 获取OSS Token
class GetOSSToken extends API {
    constructor() {
        super('GET', '/console/ossToken', Auth);
    }

    public async onRequset(data: any, res: any) {
        // 进行OSS_Upload_STS_Token获取
        let sts = new STS({
            accessKeyId: config.oss.accessKeyId,
            accessKeySecret: config.oss.accessKeySecret
        });
        let policy = {
            "Version": "1",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        // "oss:GetObject",
                        // "oss:PutObject",
                        // "oss:ListObject"
                        "oss:*"
                    ],
                    "Resource": [
                        // `acs:oss:*:*:tone-personal/${config.oss.dir}/*`.toString()
                        "*"
                        // `acs:oss:*:tone-personal/*`.toString()
                    ]
                }
            ]
        };
        try {
            let sts_res = await sts.assumeRole(config.oss.roleArn, policy, config.oss.stsExpirationSec);
            let sts_token: any = {
                AccessKeyId: sts_res.credentials.AccessKeyId,
                AccessKeySecret: sts_res.credentials.AccessKeySecret,
                SecurityToken: sts_res.credentials.SecurityToken,
                OSSRegion: config.oss.region,
                Bucket: config.oss.bucket,
                ExpirationSec: config.oss.stsExpirationSec,
            }
            this.logger.info('STS AssumeRol 成功');
            res.json({ ...ServerStdResponse.OK, data: sts_token });
            return;
        } catch (error: any) {
            this.logger.error('STS AssumeRole 获取时发生错误', error.message);
            res.json(ServerStdResponse.SERVER_ERROR);
            return;
        }
    }
}

export default GetOSSToken;