import fetcher from "@/lib/api/fetcher";

export async function setPassword(id: string, password: string) {
    return fetcher<boolean>(`/api/admin/web/blog/${id}/password`, {
        method: 'POST',
        body: JSON.stringify({
            password,
        })
    })
}