'use client';
import { authApi, verificationApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { KeyRound, Phone, Mail } from "lucide-react";
import EmailLoginMode from "./components/EmailLoginMode";
import PasswordLoginMode from "./components/PasswordLoginMode";
import PhoneLoginMode from "./components/PhoneLoginMode";
import { LoginFormData, SendCodeFormData, SubmitMode } from "./components/types";
import { useCallback, useState } from "react";
import LoginBG from './components/login-bg.jpg';
import Image from "next/image";

export default function Login() {
    const router = useRouter();
    const [loginMode, setLoginMode] = useState<SubmitMode>('password');

    const handleForgetPassword = useCallback(() => {
        toast.warning('开发中，敬请期待！暂时可通过发送邮件至网站管理员进行密码重置。');
    }, []);

    const handleSendCode = async (data: SendCodeFormData) => {
        const res = await verificationApi.send({
            type: 'login',
            targetType: data.type,
            phone: data.phone,
            email: data.email,
        })

        if (res.statusCode === 200) {
            toast.success('验证码已发送，请注意查收');
            return true;
        } else {
            toast.error(res.message || '验证码发送失败，请稍后再试');
            return false;
        }
    }

    const handleSubmit = async (data: LoginFormData) => {
        const res = await authApi.login({
            ...data,
        });

        if (res.statusCode === 200 && res.data) {
            toast.success('登录成功');
            localStorage.setItem('token', res.data.token);
            router.replace('/console');
            return true;
        } else {
            toast.error(res.message || '登录失败，请稍后再试');
            return false;
        }
    }

    return (
        <>
            <Header />
            <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                    <div className={cn("flex flex-col gap-6")}>
                        <Card className="overflow-hidden p-0">
                            <CardContent className="grid p-0 md:grid-cols-2">
                                <form className="p-6 md:p-8" onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    handleSubmit({
                                        type: loginMode,
                                        account: formData.get('account')?.toString(),
                                        password: formData.get('password')?.toString(),
                                        phone: formData.get('phone')?.toString(),
                                        email: formData.get('email')?.toString(),
                                        code: formData.get('code')?.toString(),
                                    })
                                }}>
                                    <div className="flex flex-col gap-6">

                                        {loginMode === 'password' ? <PasswordLoginMode forgetPassword={handleForgetPassword} /> : null}
                                        {loginMode === 'phone' ? <PhoneLoginMode onSendCode={handleSendCode} /> : null}
                                        {loginMode === 'email' ? <EmailLoginMode onSendCode={handleSendCode} /> : null}

                                        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                            <span className="bg-card text-muted-foreground relative z-10 px-2">
                                                或者使用
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <Button variant={loginMode === 'password' ? 'default' : 'outline'} type="button" className="w-full" onClick={() => setLoginMode('password')}>
                                                <KeyRound />
                                            </Button>
                                            <Button variant={loginMode === 'phone' ? 'default' : 'outline'} type="button" className="w-full" onClick={() => setLoginMode('phone')}>
                                                <Phone />
                                            </Button>
                                            <Button variant={loginMode === 'email' ? 'default' : 'outline'} type="button" className="w-full" onClick={() => setLoginMode('email')}>
                                                <Mail />
                                            </Button>
                                        </div>

                                        <div className="text-center text-sm">
                                            还没有账号？{" "}
                                            <a className="underline underline-offset-4 cursor-pointer" onClick={() => setLoginMode('phone')}>
                                                注册
                                            </a>
                                        </div>
                                    </div>
                                </form>
                                <div className="bg-muted relative hidden md:block">
                                    <Image
                                        src={LoginBG.src}
                                        alt="Image"
                                        width={500}
                                        height={500}
                                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                                        priority
                                        quality={100}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                            登录即表示您同意我们的{" "}
                            <a href="#" className="underline underline-offset-4">
                                服务条款
                            </a>{" "}
                            和{" "}
                            <a href="#" className="underline underline-offset-4">
                                隐私政策
                            </a>
                        </div>
                    </div >
                </div>
            </div>
            <Footer />
        </>
    )
}