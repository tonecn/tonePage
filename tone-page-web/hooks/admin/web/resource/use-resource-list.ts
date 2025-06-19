"use client"

import { AdminApi } from "@/lib/api";
import { useCallback } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export function useResourceList() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/admin/web/resource'],
        () => AdminApi.web.resource.list(),
        {
            onError: (e) => {
                toast.error(`${e.message || e}`)
            }
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