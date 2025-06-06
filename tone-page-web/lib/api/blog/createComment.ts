import fetcher from "../fetcher";

export async function createComment(blogId: string, content: string) {
    return fetcher<{
        blogId: string;
        content: string;
        createdAt: string
        deletedAt: null; // 原则上能看到就是null
        id: string;
        parentId: string | null;
    }>(`/api/blog/${blogId}/comment`, {
        method: 'POST',
        body: JSON.stringify({ content }),
    });
}