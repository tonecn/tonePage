"use client"

import { AdminAPI } from '@/lib/api/client'
import { UserListParams, UserListResponse } from '@/lib/api/endpoints/admin.client'
import { useCallback } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

export function useUserList(params?: UserListParams) {
    const { data, error, isLoading, mutate } = useSWR<UserListResponse>(
        ['/api/admin/user', params],
        () => AdminAPI.listUsers(params),
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