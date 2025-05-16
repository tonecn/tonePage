import fetcher from "@/lib/api/fetcher";

type UpdateBlogParams = {
    title: string;
    description: string;
    contentUrl: string;
}

export async function update(id: string, data: UpdateBlogParams) {
    return fetcher(`/api/admin/web/blog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
}