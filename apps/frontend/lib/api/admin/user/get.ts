import { User } from "@/lib/types/user";
import fetcher from "../../fetcher";

export function get(userId: string) {
    return fetcher<User>(`/api/admin/user/${userId}`);
}