"use client"

import { list, UserListParams, UserListResponse } from '@/lib/api/admin/user'
import { useCallback } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

export function useUserList(params?: UserListParams) {
    const { data, error, isLoading, mutate } = useSWR<UserListResponse>(
        ['/api/admin/user', params],
        () => list(params),
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