import { Resource } from "@/lib/types/resource";
import { apiFetch } from "../client";

export async function list() {
    return apiFetch<Resource[]>('/api/resource');
}