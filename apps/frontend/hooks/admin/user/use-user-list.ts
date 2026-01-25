"use client"

import { api, handleAPIError } from '@/lib/api'
import { useCallback } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

export function useUserList(params?: {
    page?: number
    pageSize?: number
}) {
    const { data, error, isLoading, mutate } = useSWR(
        ['/api/admin/user', params],
        () => api.admin.user.getAll(params),
        {
            onError: handleAPIError(({ message }) => toast.error(message))
        }
    )

    const refresh = useCallback(() => {
        return mutate()
    }, [mutate])

    return {
        users: data?.items ?? [],
        total: data?.total ?? 0,
        page: data?.page ?? 1,
        pageSize: data?.pageSize ?? 20,
        isLoading,
        error,
        mutate,
        refresh,
    }
}