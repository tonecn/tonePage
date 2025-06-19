import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import LoginHeader from "./LoginHeader";
import { SendCodeFormData } from "./types";
import { Label } from "@/components/ui/label"

export default function PhoneLoginMode({ onSendCode }: { onSendCode: (data: SendCodeFormData) => Promise<boolean> }) {
    const [phone, setPhone] = useState("");
    const handleSendCode = useCallback(() => {
        if (phone.trim().length !== 11) {
            toast.error('请输入正确的手机号');
            return;
        }
        onSendCode({
            type: 'phone',
            phone,
        })
    }, [phone, onSendCode]);

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
                <div className="flex gap-5">
                    <InputOTP
                        id="phone-login-mode-code"
                        name="code"
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        required
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <Button type="button" variant="secondary" onClick={handleSendCode}>获取验证码</Button>
                </div>
            </div>
            <Button type="submit" className="w-full" disabled>
                该方式不可用
            </Button>
        </>
    )
}