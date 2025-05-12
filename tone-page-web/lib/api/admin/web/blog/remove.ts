import fetcher from "@/lib/api/fetcher";

export async function remove(id: string) {
    return fetcher(`/api/admin/web/blog/${id}`, {
        method: 'DELETE',
    })
}