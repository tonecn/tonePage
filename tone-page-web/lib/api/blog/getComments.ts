import fetcher from "../fetcher";

export async function getComments(blogId: string) {
    return fetcher<{
        blogId: string;
        content: string;
        createdAt: string;
        deletedAt: string | null;// 原则上能看到就是null，
        id: string;
        parentId: string | null; // 如果是回复，则有parentId
        user: null;// TODO需要完善
    }[]>(`/api/blog/${blogId}/comments`, { method: 'GET' });
}