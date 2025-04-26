'use client';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, Phone, Mail } from "lucide-react"
import { useCallback, useState } from "react"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import LoginBG from './login-bg.jpg';
import { toast } from "sonner";

export type SubmitMode = 'password' | 'phone' | 'email' | 'register';
export type LoginFormData = {
  type: SubmitMode;
  account?: string;
  password?: string;
  phone?: string;
  email?: string;
  code?: string;
}

export type SendCodeMode = 'phone' | 'email';
export type SendCodeFormData = {
  type: SendCodeMode;
  codeType: 'login' | 'register';
  phone?: string;
  email?: string;
}


export function useLoginForm(onSubmit: (data: LoginFormData) => Promise<void>, onSendCode: (data: SendCodeFormData) => Promise<void>) {
  const [loginMode, setLoginMode] = useState<SubmitMode>('password');

  const handleForgetPassword = useCallback(() => {
    toast.warning('开发中，敬请期待！暂时可通过发送邮件至网站管理员进行密码重置。');
  }, []);

  const handleSubmit = useCallback(async (formData: LoginFormData) => {
    try {
      await onSubmit({ ...formData, type: loginMode });
    } catch (error) {
      toast.error('登录失败，请重试');
    }
  }, [loginMode, onSubmit]);

  const handleSendCode = useCallback(async (formData: SendCodeFormData) => {
    try {
      await onSendCode(formData);
    } catch (error) {
      toast.error('发送验证码失败，请重试');
    }
  }, [loginMode, onSendCode]);

  return {
    loginMode,
    setLoginMode,
    handleForgetPassword,
    handleSendCode,
    handleSubmit
  };
}



function LoginHeader() {
  return (
    <>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">欢迎回来</h1>
        <p className="text-muted-foreground text-balance">
          登陆到您的账户
        </p>
      </div>
    </>
  )
}

function RegisterHeader() {
  return (
    <>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">欢迎注册</h1>
        <p className="text-muted-foreground text-balance">
          注册您的账号
        </p>
      </div>
    </>
  )
}

function PasswordLoginMode({ forgetPassword }: { forgetPassword: () => void }) {
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

function PhoneLoginMode({ onSendCode }: { onSendCode: (data: SendCodeFormData) => Promise<void> }) {
  const [phone, setPhone] = useState("");
  const handleSendCode = useCallback(() => {
    if (phone.trim().length !== 11) {
      toast.error('请输入正确的手机号');
      return;
    }
    onSendCode({
      type: 'phone',
      codeType: 'login',
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
      <Button type="submit" className="w-full">
        登录
      </Button>
    </>
  )
}

function EmailLoginMode({ onSendCode }: { onSendCode: (data: SendCodeFormData) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const handleSendCode = useCallback(() => {
    if (!email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('请输入正确的邮箱地址');
      return;
    }
    onSendCode({
      type: 'email',
      codeType: 'login',
      email,
    })
  }, [email, onSendCode]);

  return (
    <>
      <LoginHeader />
      <div className="grid gap-3">
        <Label htmlFor="email">电子邮箱</Label>
        <Input
          id="email-login-mode-email"
          name="email"
          type="text"
          placeholder="电子邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required />
      </div>
      <div className="grid gap-3">
        <div className="flex items-center h-4">
          <Label htmlFor="code">验证码</Label>
        </div>
        <div className="flex gap-5">
          <InputOTP
            id="email-login-mode-code"
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
      <Button type="submit" className="w-full">
        登录
      </Button>
    </>
  )
}

function RegisterMode({ onSendCode }: { onSendCode: (data: SendCodeFormData) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const handleSendCode = useCallback(() => {
    if (!email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('请输入正确的邮箱地址');
      return;
    }
    onSendCode({
      type: 'email',
      codeType: 'register',
      email,
    })
  }, [email, onSendCode]);

  return (
    <>
      <RegisterHeader />
      <div className="grid gap-3">
        <Label htmlFor="email">账户名</Label>
        <Input
          id="register-mode-account"
          name="account"
          type="text"
          placeholder="账户名"
          required />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="email">电子邮箱</Label>
        <Input
          id="register-mode-email"
          name="email"
          type="text"
          placeholder="电子邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required />
      </div>
      <div className="grid gap-3">
        <div className="flex items-center h-4">
          <Label htmlFor="code">验证码</Label>
        </div>
        <div className="flex gap-5">
          <InputOTP
            id="register-mode-code"
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
      <Button type="submit" className="w-full">
        注册
      </Button>
    </>
  )
}

export function LoginForm({
  onSubmit,
  onSendCode,
  className,
}: {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onSendCode: (data: SendCodeFormData) => Promise<void>;
  className?: string;
}) {
  const {
    loginMode,
    setLoginMode,
    handleForgetPassword,
    handleSendCode,
    handleSubmit,
  } = useLoginForm(onSubmit, onSendCode);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
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
              {loginMode === 'register' ? <RegisterMode onSendCode={handleSendCode} /> : null}

              {
                loginMode !== 'register' && (
                  <>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                      <span className="bg-card text-muted-foreground relative z-10 px-2">
                        或者使用
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Button variant="outline" type="button" className="w-full" onClick={() => setLoginMode('password')}>
                        <KeyRound />
                      </Button>
                      <Button variant="outline" type="button" className="w-full" onClick={() => setLoginMode('phone')}>
                        <Phone />
                      </Button>
                      <Button variant="outline" type="button" className="w-full" onClick={() => setLoginMode('email')}>
                        <Mail />
                      </Button>
                    </div>
                  </>
                )
              }

              {
                loginMode === 'register' ? (
                  <>
                    <div className="text-center text-sm">
                      已有账号？{" "}
                      <a className="underline underline-offset-4 cursor-pointer" onClick={() => setLoginMode('password')}>
                        直接登录
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center text-sm">
                      还没有账号？{" "}
                      <a className="underline underline-offset-4 cursor-pointer" onClick={() => setLoginMode('register')}>
                        注册
                      </a>
                    </div>
                  </>
                )
              }
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={LoginBG.src}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
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
  )
}
