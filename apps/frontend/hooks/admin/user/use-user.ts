import { api, handleAPIError } from "@/lib/api";
import { toast } from "sonner";
import useSWR from "swr";

export function useUser(userId: string) {
    const { data, error, isLoading, mutate } = useSWR(
        ['/api/admin/user', userId],
        () => api.admin.user.get(userId),
        {
            revalidateOnReconnect: false,
            revalidateIfStale: false,
            dedupingInterval: 0,
            onError: handleAPIError(({ message }) => toast.error(message))
        }
    )

    return {
        user: data,
        isLoading,
        error,
        mutate,
    }
}