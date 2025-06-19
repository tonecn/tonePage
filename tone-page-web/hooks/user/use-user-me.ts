import { UserApi } from "@/lib/api";
import useSWR from "swr";

export function useUserMe({ onError }: { onError?: (e: any) => void } = {}) {
    const isClientSide = typeof window !== 'undefined';

    const { data: user, isLoading, error } = useSWR(
        '/api/user/me',
        async () => UserApi.me(),
        {
            onError: (error) => {
                if (error.statusCode === 401) {
                    if (isClientSide) {
                        localStorage.removeItem('token');
                    }
                }

                onError?.(error);
            },
            revalidateIfStale: false,
            revalidateOnFocus: false,
            shouldRetryOnError: (err) => {
                if (err.statusCode === 401) {
                    return false;
                }
                return true;
            },
        }
    );

    return {
        user,
        isLoading,
        error
    }
}