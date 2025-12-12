import { User } from "@/lib/types/user";
import fetcher from "../../fetcher";

interface createUserParams {
    username: string | null;
    nickname: string | null;
    email: string | null;
    phone: string | null;
    password: string | null;
}

export async function create(data: createUserParams) {
    return fetcher<User>("/api/admin/user", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
}