import { Resource } from "@/lib/types/resource";
import fetcher from "../fetcher";

export async function list() {
    return fetcher<Resource[]>('/api/resource');
}