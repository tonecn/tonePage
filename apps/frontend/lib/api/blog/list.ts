import { Blog } from "@/lib/types/blog";
import { apiFetch } from "../client";

export async function list() {
    return apiFetch<Blog[]>('/api/blog');
}