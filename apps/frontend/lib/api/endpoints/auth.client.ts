import { User } from "@/lib/types/user";
import { clientFetch } from "../client";
import { APIError } from "../common";
import { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON, RegistrationResponseJSON } from "@simplewebauthn/browser";

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

export async function logout() {
    return clientFetch('/api/auth/logout', { method: 'POST' });
}


// ======== PassKey ========
export async function getPasskeyRegisterOptions() {
    return clientFetch<PublicKeyCredentialCreationOptionsJSON>('/api/auth/passkey/register/options', {
        method: 'POST',
    });
}

export async function passkeyRegister(name: string, credentialResponse: RegistrationResponseJSON) {
    name = name.trim();
    if (name.length === 0) {
        throw new APIError('通行证名称不得为空');
    }

    return clientFetch<{ id: string; name: string; createdAt: string }>('/api/auth/passkey/register', {
        method: 'POST',
        body: JSON.stringify({
            name,
            credentialResponse,
        })
    });
}

export async function getLoginByPasskeyOptions() {
    return clientFetch<PublicKeyCredentialRequestOptionsJSON>('/api/auth/passkey/login/options', {
        method: 'POST',
    })
}

export async function loginByPasskey(credentialResponse: any) {
    return clientFetch<{ user: User }>('/api/auth/passkey/login', {
        method: 'POST',
        body: JSON.stringify({
            credentialResponse,
        })
    })
}