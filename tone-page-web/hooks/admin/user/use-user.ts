import { AdminApi } from "@/lib/api";
import { User } from "@/lib/types/user";
import useSWR from "swr";

export function useUser(userId: string) {
    const { data, error, isLoading, mutate } = useSWR<User>(
        ['/api/admin/user', userId],
        () => AdminApi.user.get(userId),
        {
            revalidateOnReconnect: false,
            revalidateIfStale: false,
            dedupingInterval: 0,
        }
    )

    return {
        user: data,
        isLoading,
        error,
        mutate,
    }
}