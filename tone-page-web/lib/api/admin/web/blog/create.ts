import fetcher from "@/lib/api/fetcher";

type CreateBlogParams = {

}

export async function create(data: CreateBlogParams) {
    return fetcher('/admin/web/blog', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}