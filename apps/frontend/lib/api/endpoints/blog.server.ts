import { Blog } from "@/lib/types/blog";
import { serverFetch } from "../server";

export async function list() {
    return serverFetch<Pick<Blog,
        'id' | 'title' | 'description' | 'viewCount' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >[]>('/api/blog')
}