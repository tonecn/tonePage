import fetcher from "@/lib/api/fetcher";
import { Blog } from "@/lib/types/blog";

export async function get(id: string) {
    return fetcher<Blog>(`/api/admin/web/blog/${id}`)
}