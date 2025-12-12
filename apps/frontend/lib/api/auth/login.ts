import fetcher, { ApiError } from "../fetcher"

interface LoginParams {
    type: 'password' | 'phone' | 'email';
    account?: string;
    password?: string;
    phone?: string;
    email?: string;
    code?: string;
}

export const login = async (data: LoginParams): Promise<{ token: string }> => {
    if (data.type === 'password') {
        if (!data.account || !data.password) {
            throw new ApiError(400, '请输入账户和密码')
        }
        if (data.account.length < 1 || data.account.length > 254) {
            throw new ApiError(400, '请输入正确的账户')
        }
        if (data.password.length < 6 || data.password.length > 32) {
            throw new ApiError(400, '请输入正确的密码')
        }
    } else if (data.type === 'phone') {
        if (!data.phone || !data.code) {
            throw new ApiError(400, '请输入手机号和验证码')
        }
        if (data.phone.length !== 11) {
            throw new ApiError(400, '请输入正确的手机号')
        }
        if (data.code.length != 6) {
            throw new ApiError(400, '请输入正确的验证码')
        }
    } else if (data.type === 'email') {
        if (!data.email || !data.code) {
            throw new ApiError(400, '请输入邮箱和验证码')
        }
        if (data.email.length < 1 || data.email.length > 254) {
            throw new ApiError(400, '请输入正确的邮箱')
        }
        if (data.code.length != 6) {
            throw new ApiError(400, '请输入正确的验证码')
        }
    } else {
        throw new ApiError(400, '登录方式异常')
    }

    return fetcher<{
        token: string;
    }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}