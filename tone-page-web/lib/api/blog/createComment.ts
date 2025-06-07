import { BlogComment } from "@/lib/types/blogComment";
import fetcher from "../fetcher";

export async function createComment(blogId: string, content: string) {
    return fetcher<BlogComment>(`/api/blog/${blogId}/comment`, {
        method: 'POST',
        body: JSON.stringify({ content }),
    });
}