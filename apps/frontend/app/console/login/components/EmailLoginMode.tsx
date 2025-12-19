// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
// import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
// import { useState, useCallback } from "react";
// import { toast } from "sonner";
// import LoginHeader from "./LoginHeader";
// import { SendCodeFormData } from "./types";
// import { Label } from "@/components/ui/label";

// export default function EmailLoginMode({ onSendCode }: { onSendCode: (data: SendCodeFormData) => Promise<boolean> }) {
//     const [email, setEmail] = useState("");
//     const handleSendCode = useCallback(() => {
//         if (!email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
//             toast.error('请输入正确的邮箱地址');
//             return;
//         }
//         onSendCode({
//             type: 'email',
//             email,
//         })
//     }, [email, onSendCode]);

//     return (
//         <>
//             <LoginHeader />
//             <div className="grid gap-3">
//                 <Label htmlFor="email">电子邮箱</Label>
//                 <Input
//                     id="email-login-mode-email"
//                     name="email"
//                     type="text"
//                     placeholder="电子邮箱"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required />
//             </div>
//             <div className="grid gap-3">
//                 <div className="flex items-center h-4">
//                     <Label htmlFor="code">验证码</Label>
//                 </div>
//                 <div className="flex gap-5">
//                     <InputOTP
//                         id="email-login-mode-code"
//                         name="code"
//                         maxLength={6}
//                         pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
//                         required
//                     >
//                         <InputOTPGroup>
//                             <InputOTPSlot index={0} />
//                             <InputOTPSlot index={1} />
//                             <InputOTPSlot index={2} />
//                             <InputOTPSlot index={3} />
//                             <InputOTPSlot index={4} />
//                             <InputOTPSlot index={5} />
//                         </InputOTPGroup>
//                     </InputOTP>
//                     <Button type="button" variant="secondary" onClick={handleSendCode}>获取验证码</Button>
//                 </div>
//             </div>
//             <Button type="submit" className="w-full">
//                 注册并登录
//             </Button>
//         </>
//     )
// }
