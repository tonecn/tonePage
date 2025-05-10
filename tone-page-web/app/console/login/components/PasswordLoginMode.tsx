import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoginHeader from "./LoginHeader";
import { Label } from "@/components/ui/label"

export default function PasswordLoginMode({ forgetPassword }: { forgetPassword: () => void }) {
    return (
        <>
            <LoginHeader />
            <div className="grid gap-3">
                <Label htmlFor="email">电子邮箱/手机号/账号</Label>
                <Input
                    id="password-login-mode-account"
                    name="account"
                    type="text"
                    placeholder="电子邮箱/手机号/账号"
                    required
                />
            </div>
            <div className="grid gap-3">
                <div className="flex items-center h-4">
                    <Label htmlFor="password">密码</Label>
                    <a
                        onClick={forgetPassword}
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