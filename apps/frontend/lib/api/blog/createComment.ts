import { BlogComment } from "@/lib/types/blogComment";
import fetcher from "../fetcher";

export async function createComment(blogId: string, content: string, parentId?: string) {
    return fetcher<BlogComment>(`/api/blog/${blogId}/comment`, {
        method: 'POST',
        body: JSON.stringify({
            content,
            parentId: parentId || null,
        }),
    });
}