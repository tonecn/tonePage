import { BlogComment } from "@/lib/types/blogComment";
import { clientFetch } from "../client";

export async function getBlog(id: string, password?: string) {
    return clientFetch<{
        id: string;
        title: string;
        description: string;
        createdAt: string;
        content: string;
    }>(`/api/blog/${id}` + (password ? `?p=${password}` : ''));
}

export async function getComments(id: string) {
    return clientFetch<BlogComment[]>(`/api/blog/${id}/comments`);
}

export async function createComment(blogId: string, content: string, parentId?: string) {
    return clientFetch<BlogComment>(`/api/blog/${blogId}/comment`, {
        method: 'POST',
        body: JSON.stringify({
            content,
            parentId: parentId || null,
        }),
    });
}