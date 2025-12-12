import { User } from "@/lib/types/user"
import fetcher from "../../fetcher"

export interface UserListParams {
    page?: number
    pageSize?: number
}

export interface UserListResponse {
    items: User[],
    total: number
    page: number
    pageSize: number
}

export function list(params?: UserListParams): Promise<UserListResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString())

    return fetcher<UserListResponse>('/api/admin/user')
}