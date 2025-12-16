'use client';
// import { authApi, verificationApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { KeyRound, Phone, FileKey2 } from "lucide-react";
import EmailLoginMode from "./components/EmailLoginMode";
import PasswordLoginMode from "./components/PasswordLoginMode";
import PhoneLoginMode from "./components/PhoneLoginMode";
import { LoginFormData, SendCodeFormData, SubmitMode } from "./components/types";
import { useCallback, useState } from "react";
import LoginBG from './components/login-bg.jpg';
import Image from "next/image";
import { handleAPIError } from "@/lib/api/common";
// import { ApiError } from "@/lib/api/fetcher";

export default function Login() {
    const router = useRouter();
    const [loginMode, setLoginMode] = useState<SubmitMode>('password');

    // const handleSendCode = async (data: SendCodeFormData) => {
    //     try {
    //         const res = await verificationApi.send({
    //             type: 'login',
    //             targetType: data.type,
    //             phone: data.phone,
    //             email: data.email,
    //         })

    //         if (res) {
    //             toast.success('验证码已发送，请注意查收');
    //             return true;
    //         } else {
    //             throw new Error();
    //         }
    //     } catch (error) {
    //         toast.error((error as ApiError).message || '验证码发送失败，请稍后再试');
    //         return false;
    //     }
    // }

    // const handleSubmit = async (data: LoginFormData) => {
    //     try {
    //         const res = await authApi.login({
    //             ...data,
    //         });

    //         if (res.token) {
    //             toast.success('登录成功');
    //             localStorage.setItem('token', res.token);
    //             router.replace('/console');
    //             return true;
    //         } else {
    //             throw new Error();
    //         }
    //     } catch (error) {
    //         toast.error((error as ApiError).message || '登录失败，请稍后再试');
    //         return false;
    //     }
    // }

    return (
        <>
            <Header />
            <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                    <div className={cn("flex flex-col gap-6")}>
                        <Card className="overflow-hidden p-0">
                            <CardContent className="grid p-0 md:grid-cols-2">
                                <form className="p-6 md:p-8" onSubmit={async e => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);

                                    let handler = (await (async () => {
                                        if (loginMode === 'password') {
                                            return import('./components/PasswordLoginMode');
                                        }
                                    })())?.handleSubmit;
                                    if (!handler) {
                                        return toast.error('登陆状态异常');
                                    }

                                    handler(formData).then((user) => {
                                        localStorage.setItem('user_profile', JSON.stringify(user));
                                        // to main page
                                    }, (e) => {
                                        handleAPIError(e, ({ message }) => toast.error(message))
                                    })
                                }}>
                                    <div className="flex flex-col gap-6">

                                        {loginMode === 'password' ? <PasswordLoginMode /> : null}
                                        {/* {loginMode === 'phone' ? <PhoneLoginMode onSendCode={handleSendCode} /> : null} */}
                                        {/* {loginMode === 'email' ? <EmailLoginMode onSendCode={handleSendCode} /> : null} */}

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
                                                <FileKey2 />
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
            </div >
            <Footer />
        </>
    )
}