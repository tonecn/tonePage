"use client"

import { api, handleAPIError } from "@/lib/api";
import { useCallback } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export function useBlogList() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/admin/web/blog'],
        () => api.admin.blog.getAll(),
        {
            onError: handleAPIError(({ message }) => toast.error(message))
        }
    )

    const refresh = useCallback(() => {
        return mutate()
    }, [mutate])

    return {
        blogs: data,
        error,
        isLoading,
        mutate,
        refresh,
    }
}