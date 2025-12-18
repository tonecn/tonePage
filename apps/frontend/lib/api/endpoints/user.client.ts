import { User } from "@/lib/types/user";
import { clientFetch } from "../client";
import { APIError } from "../common";

export async function me() {
    return clientFetch<User>('/api/user/me');
}

export async function updatePassword(password: string) {
    if (! /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:'",.<>/?]{6,32}$/.test(password)) {
        throw new APIError('新密码不符合规范，请重新输入')
    }

    return clientFetch<null>('/api/user/password', {
        method: 'PUT',
        body: JSON.stringify({
            password,
        }),
    })
}