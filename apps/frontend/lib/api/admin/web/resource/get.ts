import fetcher from "@/lib/api/fetcher";
import { Resource } from "@/lib/types/resource";

export async function get(id: string) {
    return fetcher<Resource>(`/api/admin/web/resource/${id}`)
}