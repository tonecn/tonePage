import { Blog } from "@/lib/types/blog";
import fetcher from "../fetcher";

export async function list() {
    return fetcher<Blog[]>('/api/blog');
}