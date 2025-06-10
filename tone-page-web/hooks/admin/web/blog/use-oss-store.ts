import { useOssSts } from "@/hooks/oss/use-oss-sts";
import OSS from "ali-oss";

export function useOssStore() {
    const { stsTokenData, isLoading, error } = useOssSts();

    return {
        stsTokenData,
        isLoading,
        error,
        store: stsTokenData ? new OSS({
            region: 'oss-cn-chengdu',
            bucket: 'tone-personal',
            accessKeyId: stsTokenData.AccessKeyId,
            accessKeySecret: stsTokenData.AccessKeySecret,
            stsToken: stsTokenData.SecurityToken,
            refreshSTSToken: () => new Promise(resolve => {
                resolve({
                    accessKeyId: stsTokenData.AccessKeyId,
                    accessKeySecret: stsTokenData.AccessKeySecret,
                    stsToken: stsTokenData.SecurityToken,
                })
            }),
        }) : undefined,
    }
}