import { clientFetch } from "../client";
import { APIError } from "../common";

export async function sendLoginSms(phone: string) {
    phone = phone.trim();

    if (!/^1[3-9]\d{9}$/.test(phone)) {
        throw new APIError('请输入合法的中国大陆手机号');
    }

    return clientFetch('/api/sms/send/login', {
        method: 'POST',
        body: JSON.stringify({ phone })
    })
}