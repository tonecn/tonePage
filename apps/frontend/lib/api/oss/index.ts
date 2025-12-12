import fetcher from "../fetcher";

export interface StsToken {
    AccessKeyId: string;
    AccessKeySecret: string;
    Expiration: string;// ISO 8601 格式
    SecurityToken: string;
    userId: string;
}

export async function getStsToken() {
    return fetcher<StsToken>('/api/oss/sts', { method: 'GET' });
}