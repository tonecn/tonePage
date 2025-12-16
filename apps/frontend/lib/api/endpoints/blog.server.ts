import { Blog } from "@/lib/types/blog";
import { serverFetch } from "../server";

export async function list() {
    return serverFetch<Blog[]>('/api/blog')
}