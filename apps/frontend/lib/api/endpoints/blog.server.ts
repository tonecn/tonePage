import { Blog } from "@/lib/types/blog";
import { serverFetch } from "../server";

export async function list() {
    return serverFetch<Pick<Blog,
        'id' | 'title' | 'slug' | 'description' | 'viewCount' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >[]>('/api/blog')
}

export async function getBlogBySlug(slug: string, password?: string) {
    return serverFetch<{
        id: string;
        title: string;
        description: string;
        createdAt: string;
        content: string;
    }>(`/api/blog/${slug}/slug` + (password ? `?p=${password}` : ''));
}

