import fetcher from "../fetcher";

interface SendVerificationCodeParam {
    targetType: 'phone' | 'email';
    type: 'login';
    phone?: string;
    email?: string;
}

export const send = async (data: SendVerificationCodeParam) => {
    return fetcher<boolean>('/api/verification/send', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}