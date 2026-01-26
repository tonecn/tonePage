"use client"

import { api, handleAPIError } from "@/lib/api";
import { useCallback } from "react";
import { toast } from "sonner";
import useSWR from "swr";

interface UseResourceListProps {
    page: number;
    pageSize: number;
    query?: string;
}

export function useResourceList({ page, pageSize, query }: UseResourceListProps) {
    const { data, error, isLoading, mutate } = useSWR(
        ['/admin/web/resource', page, pageSize, query],
        () => api.admin.resource.getAll(page, pageSize, query),
        {
            onError: handleAPIError(({ message }) => toast.error(message))
        }
    )

    const refresh = useCallback(() => {
        return mutate()
    }, [mutate])

    return {
        resources: data?.items || [],
        total: data?.total || 0,
        error,
        isLoading,
        mutate,
        refresh,
    }
}