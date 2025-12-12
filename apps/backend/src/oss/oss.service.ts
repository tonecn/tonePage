import { Injectable } from '@nestjs/common';
import { STS } from 'ali-oss';

@Injectable()
export class OssService {
  private sts = new STS({
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
  });

  private stsCache: {
    [session: string]: {
      credentials: {
        AccessKeyId: string;
        AccessKeySecret: string;
        SecurityToken: string;
        Expiration: string;
      };
      expireTime: number; // 时间戳，单位为毫秒
    };
  } = {};

  /** @todo 该方法存在缓存穿透问题，待优化 */
  async getStsToken(session: string) {
    if (this.stsCache[session]) {
      const cached = this.stsCache[session];
      // 检查缓存是否过期
      if (cached.expireTime > Date.now()) {
        return cached.credentials;
      } else {
        // 如果过期，删除缓存
        delete this.stsCache[session];
      }
    }

    return this.sts
      .assumeRole(process.env.ALIYUN_OSS_STS_ROLE_ARN, ``, 3600, `${session}`)
      .then((res) => {
        // 缓存
        this.stsCache[session] = {
          credentials: res.credentials,
          expireTime:
            new Date(res.credentials.Expiration).getTime() - 5 * 60 * 1000, // 提前5分钟过期,
        };

        return res.credentials;
      })
      .catch((err) => {
        console.error('获取STS Token失败:', err);
        throw new Error('获取STS Token失败');
      });
  }
}
