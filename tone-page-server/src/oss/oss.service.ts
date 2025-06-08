import { Injectable } from '@nestjs/common';
import { STS } from 'ali-oss';

@Injectable()
export class OssService {

    private sts = new STS({
        accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
        accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    });

    async getStsToken(session: string) {
        return this.sts.assumeRole(
            process.env.ALIYUN_OSS_STS_ROLE_ARN, ``, 3600, `${session}`,
        ).then((res) => {
            return res.credentials;
        }).catch(err => {
            console.error('获取STS Token失败:', err);
            throw new Error('获取STS Token失败');
        })
    }

}
