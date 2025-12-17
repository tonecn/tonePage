import { User } from "@/lib/types/user";
import { clientFetch } from "../client";
import { APIError } from "../common";

export async function loginByPassword(identifier: string, password: string) {
    identifier = identifier.trim();
    password = password.trim();
    if (identifier.length === 0 || password.length === 0) {
        throw new APIError('请输入账户和密码')
    }

    if (identifier.length < 1 || identifier.length > 254) {
        throw new APIError('账户长度只能为1~254位')
    }

    if (password.length < 6 || password.length > 32) {
        throw new APIError('密码长度只能为6~32位')
    }

    return clientFetch<{ user: User }>('/api/auth/login/password', {
        method: 'POST',
        body: JSON.stringify({
            identifier,
            password,
        })
    });
}