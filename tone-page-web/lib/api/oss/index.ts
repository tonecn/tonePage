import fetcher from "../fetcher";

export async function getStsToken() {
    return fetcher<{
        AccessKeyId: string;
        AccessKeySecret: string;
        Expiration: string;// ISO 8601 格式
        SecurityToken: string;
        userId: string;
    }>('/api/oss/sts', { method: 'GET' });
}