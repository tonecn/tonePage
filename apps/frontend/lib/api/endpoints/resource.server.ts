import { PublicResource } from "@/lib/types/resource";
import { serverFetch } from "../server";

export async function list() {
    return serverFetch<PublicResource[]>('/api/resource')
}