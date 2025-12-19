import { AdminAPI } from "@/lib/api/client";
import { UserEntity } from "@/lib/api/endpoints/admin.client";
import { toast } from "sonner";
import useSWR from "swr";

export function useUser(userId: string) {
    const { data, error, isLoading, mutate } = useSWR<UserEntity>(
        ['/api/admin/user', userId],
        () => AdminAPI.getUser(userId),
        {
            revalidateOnReconnect: false,
            revalidateIfStale: false,
            dedupingInterval: 0,
            onError: (e) => {
                toast.error(`${e.message || e}`)
            }
        }
    )

    return {
        user: data,
        isLoading,
        error,
        mutate,
    }
}