"use client"

import { adminGetResources } from "@/lib/api/actions";
import { handleAPIError } from "@/lib/api/common";
import { useCallback } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export function useResourceList() {
    const { data, error, isLoading, mutate } = useSWR(
        ['/admin/web/resource'],
        () => adminGetResources(),
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