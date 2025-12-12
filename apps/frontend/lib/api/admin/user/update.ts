import { User } from "@/lib/types/user";
import fetcher from "../../fetcher";

export type updateUser = {
    username: string ;
    nickname: string ;
    email: string | null;
    phone: string | null;
}

export async function update(userId: string, user: updateUser) {
    return fetcher<User>(`/api/admin/user/${userId}`, {
        body: JSON.stringify(user),
        method: "PUT",
    });
}