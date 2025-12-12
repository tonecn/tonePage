import { BlogComment } from "@/lib/types/blogComment";
import fetcher from "../fetcher";

export async function getComments(blogId: string) {
    return fetcher<BlogComment[]>(`/api/blog/${blogId}/comments`, { method: 'GET' });
}