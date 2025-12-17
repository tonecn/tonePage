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

export async function loginBySms(phone: string, code: string) {
    phone = phone.trim();
    code = code.trim();
    if (phone.length === 0 || code.length === 0) {
        throw new APIError('请输入手机号及短信验证码')
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
        throw new APIError('请输入合法的中国大陆手机号');
    }


    if (! /\d{6}/.test(code)) {
        throw new APIError('密码长度只能为6~32位')
    }

    return clientFetch<{ user: User }>('/api/auth/login/sms', {
        method: 'POST',
        body: JSON.stringify({
            phone,
            code,
        })
    });
}