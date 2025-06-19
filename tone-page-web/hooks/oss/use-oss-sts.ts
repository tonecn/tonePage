import { OssApi } from "@/lib/api";
import { toast } from "sonner";
import useSWR from "swr";

export function useOssSts() {
    const { data: stsTokenData, isLoading, error } = useSWR(
        '/api/oss/sts',
        () => OssApi.getStsToken(),
        {
            shouldRetryOnError: false,
            refreshInterval: 59 * 60 * 1000,
            revalidateOnFocus: false,
            onError: (e) => {
                toast.error(`${e.message || e}`)
            }
        }
    );

    return {
        stsTokenData,
        isLoading,
        error,
    }
}