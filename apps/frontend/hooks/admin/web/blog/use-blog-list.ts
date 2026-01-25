"use client"

import { adminGetBlogs } from "@/lib/api/client";
import { useCallback } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export function useBlogList() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/admin/web/blog'],
        () => adminGetBlogs(),
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
        blogs: data,
        error,
        isLoading,
        mutate,
        refresh,
    }
}