import { useOssSts } from "@/hooks/oss/use-oss-sts";
import { useEffect } from "react";

export interface StsToken {
    AccessKeyId: string;
    AccessKeySecret: string;
    Expiration: string;// ISO 8601 格式
    SecurityToken: string;
    userId: string;
}

export function useOssStore(options: { onStsTokenDataChanged?: (data: StsToken | undefined) => void; } = {}) {
    const { stsTokenData, isLoading, error, mutate } = useOssSts();

    useEffect(() => {
        options.onStsTokenDataChanged?.(stsTokenData);
    }, [stsTokenData]);

    const refresh = async () => {
        await mutate();
    }

    return {
        stsTokenData,
        isLoading,
        error,
        refresh,
    }
}