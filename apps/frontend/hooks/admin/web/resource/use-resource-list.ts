"use client"

import { api, handleAPIError } from "@/lib/api";
import { useCallback } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export function useResourceList() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/admin/web/resource'],
        () => api.admin.resource.getAll(),
        {
            onError: handleAPIError(({ message }) => toast.error(message))
        }
    )

    const refresh = useCallback(() => {
        return mutate()
    }, [mutate])

    return {
        resources: data,
        error,
        isLoading,
        mutate,
        refresh,
    }
}