import { Blog } from "@/lib/types/blog";
import fetcher from "../fetcher";

export async function get(id: string) {
    return fetcher<{
        id: string;
        title: string;
        createdAt: string;
        content: string;
    }>(`/api/blog/${id}`);
}