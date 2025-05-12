import fetcher from "@/lib/api/fetcher";
import { Resource } from "@/lib/types/resource";

export async function list() {
    return fetcher<Resource[]>('/admin/web/resource')
}