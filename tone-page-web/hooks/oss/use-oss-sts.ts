import { OssApi } from "@/lib/api";
import useSWR from "swr";

export function useOssSts() {
    const { data: stsTokenData, isLoading, error } = useSWR(
        '/api/oss/sts',
        () => OssApi.getStsToken(),
        {
            shouldRetryOnError: false,
            refreshInterval: 59 * 60 * 1000,
            revalidateOnFocus: false,
        }
    );

    return {
        stsTokenData,
        isLoading,
        error,
    }
}