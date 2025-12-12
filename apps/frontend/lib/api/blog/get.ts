import fetcher from "../fetcher";

export async function get(id: string, option: {
    password?: string;
} = {}) {
    const { password } = option;
    return fetcher<{
        id: string;
        title: string;
        createdAt: string;
        content: string;
    }>(`/api/blog/${id}` + (password ? `?p=${password}` : ''));
}