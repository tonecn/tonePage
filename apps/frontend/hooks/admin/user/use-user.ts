import { adminGetUser } from "@/lib/api/client";
import { handleAPIError } from "@/lib/api/common";
import { toast } from "sonner";
import useSWR from "swr";

export function useUser(userId: string) {
    const { data, error, isLoading, mutate } = useSWR(
        ['/api/admin/user', userId],
        () => adminGetUser(userId),
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