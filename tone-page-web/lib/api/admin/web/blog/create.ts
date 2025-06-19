import fetcher from "@/lib/api/fetcher";

type CreateBlogParams = {
    title: string;
    description: string;
    contentUrl: string;
}

export async function create(data: CreateBlogParams) {
    return fetcher('/api/admin/web/blog', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}