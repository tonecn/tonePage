import { useOssSts } from "@/hooks/oss/use-oss-sts";
import { StsToken } from "@/lib/api/endpoints/oss.client";
import { useEffect } from "react";

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