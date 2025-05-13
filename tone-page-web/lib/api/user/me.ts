import { User } from "@/lib/types/user";
import fetcher from "../fetcher";

export async function me() {
    return fetcher<User>('/api/user/me');
}