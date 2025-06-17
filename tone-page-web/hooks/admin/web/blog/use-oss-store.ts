import { useOssSts } from "@/hooks/oss/use-oss-sts";
import { StsToken } from "@/lib/api/oss";
import OSS from "ali-oss";
import { useEffect } from "react";

export function useOssStore(options: { region: string; bucket: string; onStsTokenDataChanged?: (data: StsToken | undefined) => void; }) {
    const { stsTokenData, isLoading, error } = useOssSts();

    useEffect(() => {
        options.onStsTokenDataChanged?.(stsTokenData);
    }, [stsTokenData])

    return {
        stsTokenData,
        isLoading,
        error,
        store: stsTokenData ? new OSS({
            region: options.region,
            bucket: options.bucket,
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