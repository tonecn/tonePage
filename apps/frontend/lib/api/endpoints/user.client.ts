import { User } from "@/lib/types/user";
import { clientFetch } from "../client";

export async function me() {
    return clientFetch<User>('/api/user/me');
}