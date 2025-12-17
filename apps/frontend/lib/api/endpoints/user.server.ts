import { User } from "@/lib/types/user";
import { serverFetch } from "../server";

export async function me() {
    return serverFetch<User>('/api/user/me');
}