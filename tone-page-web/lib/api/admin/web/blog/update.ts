import fetcher from "@/lib/api/fetcher";
import { BlogPermission } from "@/lib/types/Blog.Permission.enum";

type UpdateBlogParams = {
    title: string;
    description: string;
    contentUrl: string;
    permissions: BlogPermission[],
}

export async function update(id: string, data: UpdateBlogParams) {
    return fetcher(`/api/admin/web/blog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
}