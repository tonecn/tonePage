import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import LoginHeader from "./LoginHeader";
import { Label } from "@/components/ui/label"
import { HumanVerification } from "@/components/human-verification";
import { handleAPIError } from "@/lib/api/common";
import { loginBySms, sendLoginSms } from "@/lib/api/client";

export default function SmsLoginMode() {
    const [phone, setPhone] = useState("");
    const handleSendCode = useCallback(async () => {
        await sendLoginSms(phone)
            .then(() => toast.success('验证码已发送！'),
                handleAPIError(({ message }) => toast.error(message)))
    }, [phone]);

    return (
        <>
            <LoginHeader />
            <div className="grid gap-3">
                <Label htmlFor="phone">手机号</Label>
                <Input
                    id="phone-login-mode-phone"
                    name="phone"
                    type="text"
                    placeholder="+86 手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required />
            </div>
            <div className="grid gap-3">
                <div className="flex items-center h-4">
                    <Label htmlFor="code">验证码</Label>
                </div>
                <div className="flex gap-1 overflow-hidden items-center flex-row-reverse">
                    <HumanVerification onSuccess={handleSendCode} >
                        <Button type="button" variant="secondary" disabled>
                            获取验证码
                        </Button>
                    </HumanVerification>
                    <div className="flex-1 min-w-0">
                        <InputOTP
                            id="phone-login-mode-code"
                            name="code"
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                            required
                        >
                            <InputOTPGroup className="w-full flex justify-between">
                                {[...Array(6)].map((_, i) => (
                                    <InputOTPSlot
                                        key={i}
                                        index={i}
                                        className="flex-1 aspect-square"
                                    />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                </div>
            </div>
            <Button type="submit" className="w-full" disabled>
                控制台还在施工，暂不开放注册功能噢～
            </Button>
            <div className="hidden" aria-hidden>
                oi! 当你看到这里，如果有兴趣可以试试绕过前端校验进行注册，后端接口没封，不过登陆之后也确实没啥好玩的
                玩的开心，如果发现重大漏洞，请手下留情喔～网站右下角有我的邮箱，告之后将以“哈基米（BNB）”答谢～
            </div>
        </>
    )
}

export async function handleSubmit(formData: FormData) {
    const phone = formData.get('phone')?.toString() || '';
    const code = formData.get('code')?.toString() || '';

    return loginBySms(phone, code)
}