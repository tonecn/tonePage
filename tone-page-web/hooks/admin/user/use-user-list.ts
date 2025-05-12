"use client"

import { list, UserListParams, UserListResponse } from '@/lib/api/admin/user'
import { ApiError } from '@/lib/api/fetcher'
import { toast } from 'sonner'
import useSWR from 'swr'

export function useUserList(params?: UserListParams) {
    const { data, error, isLoading, mutate } = useSWR<UserListResponse>(
        ['/api/admin/user', params],
        () => list(params),
    )

    return {
        users: data?.items ?? [],
        total: data?.total ?? 0,
        page: data?.page ?? 1,
        pageSize: data?.pageSize ?? 20,
        isLoading,
        error,
        mutate,
    }
}