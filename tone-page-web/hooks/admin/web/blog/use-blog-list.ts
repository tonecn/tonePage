"use client"

import { AdminApi } from "@/lib/api";
import { useCallback } from "react";
import useSWR from "swr";

export function useBlogList() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/admin/web/blog'],
        () => AdminApi.web.blog.list()
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