import fetcher from "@/lib/api/fetcher";

export async function list() {
    return fetcher('/api/admin/web/blog')
}