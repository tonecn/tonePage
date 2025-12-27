import { Resource } from "@/lib/types/resource";
import { clientFetch } from "../client";
import { Blog } from "@/lib/types/blog";
import { BlogPermission } from "@/lib/types/Blog.Permission.enum";
import { Role } from "@/lib/types/role";
import { APIError } from "../common";

export interface UserEntity {
    userId: string;
    username: string;
    nickname: string;
    email?: string;
    phone?: string;
    avatar?: string;
    createdAt: string;
    deletedAt: string | null;
    roles: Role[];
}

// ======== Resource ========
export async function listResources() {
    return clientFetch<Resource[]>('/api/admin/web/resource')
}

interface CreateResourceParams {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    tags: {
        name: string;
        type: string;
    }[];
}
export async function createResource(data: CreateResourceParams) {
    data.title = data.title.trim();
    data.description = data.description.trim();
    data.imageUrl = data.imageUrl.trim();
    data.link = data.link.trim();
    for (const tag of data.tags) {
        tag.name = tag.name.trim();
    }

    return clientFetch('/api/admin/web/resource', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export async function getResource(id: string) {
    return clientFetch<Resource>(`/api/admin/web/resource/${id}`)
}

export async function removeResource(id: string) {
    return clientFetch<void>(`/api/admin/web/resource/${id}`, {
        method: 'DELETE',
    })
}

interface UpdateResourceParams {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    tags: {
        name: string;
        type: string;
    }[];
}
export async function updateResource(id: string, data: UpdateResourceParams) {
    data.title = data.title.trim();
    data.description = data.description.trim();
    data.imageUrl = data.imageUrl.trim();
    data.link = data.link.trim();
    for (const tag of data.tags) {
        tag.name = tag.name.trim();
    }

    return clientFetch<Resource>(`/api/admin/web/resource/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
}



// ======== Blog ========
interface CreateBlogParams {
    title: string;
    description: string;
    slug: string;
    contentUrl: string;
    permissions: BlogPermission[];
    password: string;
}
export async function createBlog(data: CreateBlogParams) {
    data.title = data.title.trim()
    data.description = data.description.trim()
    data.slug = data.slug.trim()
    data.contentUrl = data.contentUrl.trim()
    data.password = data.password.trim()

    if (data.title.length === 0) {
        throw new APIError('标题不得为空')
    }
    if (data.description.length === 0) {
        throw new APIError('描述不得为空')
    }
    if (data.contentUrl.length === 0) {
        throw new APIError('文章链接不得为空')
    }

    return clientFetch<Blog>('/api/admin/web/blog', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export async function getBlog(id: string) {
    return clientFetch<Blog>(`/api/admin/web/blog/${id}`)
}

export async function listBlogs() {
    return clientFetch<Blog[]>('/api/admin/web/blog')
}

export async function removeBlog(id: string) {
    // ? Blog
    return clientFetch<Blog>(`/api/admin/web/blog/${id}`, {
        method: 'DELETE',
    })
}


interface UpdateBlogParams {
    title: string;
    description: string;
    contentUrl: string;
    permissions: BlogPermission[],
}
export async function updateBlog(id: string, data: UpdateBlogParams) {
    data.title = data.title.trim();
    data.description = data.description.trim();
    data.contentUrl = data.contentUrl.trim();

    return clientFetch<Blog>(`/api/admin/web/blog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
}

export async function setBlogPassword(id: string, password: string) {
    password = password.trim();
    return clientFetch<boolean>(`/api/admin/web/blog/${id}/password`, {
        method: 'POST',
        body: JSON.stringify({
            password,
        })
    })
}



// ======== User ========
interface CreateUserParams {
    username: string | null;
    nickname: string | null;
    email: string | null;
    phone: string | null;
    password: string | null;
}
export async function createUser(data: CreateUserParams) {
    type Keys = keyof CreateUserParams;
    for (const key in data) {
        data[key as Keys] = data[key as Keys]?.trim() || null;
    }

    return clientFetch<UserEntity>("/api/admin/user", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function getUser(id: string) {
    return clientFetch<UserEntity>(`/api/admin/user/${id}`);
}

export interface UserListParams {
    page?: number
    pageSize?: number
}
export interface UserListResponse {
    items: UserEntity[],
    total: number
    page: number
    pageSize: number
}
export function listUsers(params?: UserListParams): Promise<UserListResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString())

    return clientFetch<UserListResponse>('/api/admin/user')
}

export async function removeUser(userId: string, soft: boolean = true) {
    /** 我也不知道后端返回的是个啥...没报错就当成功吧 */
    return clientFetch<unknown>(`/api/admin/user/${userId}?soft=${soft}`, {
        method: 'DELETE',
    })
}

export async function setUserPassword(userId: string, password: string) {
    password = password.trim();

    return clientFetch<void>(`/api/admin/user/${userId}/password`, {
        method: 'POST',
        body: JSON.stringify({
            password,
        }),
    })
}

export interface updateUser {
    username: string;
    nickname: string;
    email: string | null;
    phone: string | null;
}
export async function updateUser(userId: string, user: updateUser) {
    user.username = user.username.trim();
    user.nickname = user.nickname.trim();
    user.email = user.email?.trim() || null;
    user.phone = user.phone?.trim() || null;

    return clientFetch<UserEntity>(`/api/admin/user/${userId}`, {
        body: JSON.stringify(user),
        method: "PUT",
    });
}