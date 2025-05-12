import fetcher from "@/lib/api/fetcher";

type UpdateBlogParams = {

}

export async function update(id: string, data: UpdateBlogParams) {
    return fetcher(`/api/admin/web/blog/${id}`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
}