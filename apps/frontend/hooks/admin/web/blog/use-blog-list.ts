"use client"

import { api, handleAPIError } from "@/lib/api";
import { useCallback } from "react";
import { toast } from "sonner";
import useSWR from "swr";

interface UseBlogListProps {
    page: number;
    pageSize: number;
    query?: string;
}

export function useBlogList({ page, pageSize, query }: UseBlogListProps) {
    const { data, error, isLoading, mutate } = useSWR(
        ['/admin/web/blog', page, pageSize, query],
        () => api.admin.blog.getAll(page, pageSize, query),
        {
            onError: handleAPIError(({ message }) => toast.error(message))
        }
    )

    const refresh = useCallback(() => {
        return mutate()
    }, [mutate])

    return {
        blogs: data?.items || [],
        total: data?.total || 0,
        error,
        isLoading,
        mutate,
        refresh,
    }
}