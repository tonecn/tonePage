"use client"

import { AdminApi } from "@/lib/api";
import { useCallback } from "react";
import useSWR from "swr";

export function useResourceList() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/admin/web/resource'],
        () => AdminApi.web.resource.list()
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