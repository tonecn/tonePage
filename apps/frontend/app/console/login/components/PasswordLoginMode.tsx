import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoginHeader from "./LoginHeader";
import { Label } from "@/components/ui/label"
import { useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function PasswordLoginMode() {
    const handleForgetPassword = useCallback(() => {
        toast.warning('开发中，敬请期待！暂时可通过发送邮件至网站管理员进行密码重置。');
    }, []);

    return (
        <>
            <LoginHeader />
            <div className="grid gap-3">
                <Label htmlFor="password-login-mode-identifier">电子邮箱/手机号/账号</Label>
                <Input
                    id="password-login-mode-identifier"
                    name="identifier"
                    type="text"
                    placeholder="电子邮箱/手机号/账号"
                    required
                />
            </div>
            <div className="grid gap-3">
                <div className="flex items-center h-4">
                    <Label htmlFor="password-login-mode-password">密码</Label>
                    <a
                        onClick={handleForgetPassword}
                        className="ml-auto text-sm underline-offset-2 hover:underline cursor-pointer"
                    >
                        忘记密码？
                    </a>
                </div>
                <Input
                    id="password-login-mode-password"
                    name="password"
                    type="password"
                    required />
            </div>
            <Button type="submit" className="w-full">
                登录
            </Button>
        </>
    )
}

export async function handleSubmit(formData: FormData) {
    const identifier = formData.get('identifier')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    return api.auth.loginByPassword(identifier, password)
}