"use client"

import { adminGetUsers } from '@/lib/api/actions/admin.action'
import { handleAPIError } from '@/lib/api/common'
import { UserListParams } from '@/lib/api/endpoints/admin.client'
import { useCallback } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

export function useUserList(params?: UserListParams) {
    const { data, error, isLoading, mutate } = useSWR(
        ['/api/admin/user', params],
        () => adminGetUsers(),
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