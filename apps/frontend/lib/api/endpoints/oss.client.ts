import { clientFetch } from "../client";

export interface StsToken {
    AccessKeyId: string;
    AccessKeySecret: string;
    Expiration: string;// ISO 8601 格式
    SecurityToken: string;
    userId: string;
}

export async function getStsToken() {
    return clientFetch<StsToken>('/api/oss/sts');
}