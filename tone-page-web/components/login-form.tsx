'use client';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, Phone, Mail } from "lucide-react"
import { useState } from "react"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

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

function PasswordMode() {
  return (
    <>
      <LoginHeader />
      <div className="grid gap-3">
        <Label htmlFor="email">电子邮箱/手机号/账号</Label>
        <Input
          id="account"
          type="text"
          placeholder="电子邮箱/手机号/账号"
          required
        />
      </div>
      <div className="grid gap-3">
        <div className="flex items-center h-4">
          <Label htmlFor="password">密码</Label>
          <a
            href="#"
            className="ml-auto text-sm underline-offset-2 hover:underline"
          >
            忘记密码？
          </a>
        </div>
        <Input id="password" type="password" required />
      </div>
      <Button type="submit" className="w-full">
        登录
      </Button>
    </>
  )
}

function PhoneMode() {
  return (
    <>
      <LoginHeader />
      <div className="grid gap-3">
        <Label htmlFor="phone">手机号</Label>
        <Input id="phone" type="text" placeholder="手机号" required />
      </div>
      <div className="grid gap-3">
        <div className="flex items-center h-4">
          <Label htmlFor="code">验证码</Label>
        </div>
        <div className="flex gap-5">
          <InputOTP
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
          <Button variant="secondary">获取验证码</Button>
        </div>
      </div>
      <Button type="submit" className="w-full">
        登录
      </Button>
    </>
  )
}

function EmailMode() {
  return (
    <>
      <LoginHeader />
      <div className="grid gap-3">
        <Label htmlFor="email">电子邮箱</Label>
        <Input id="email" type="text" placeholder="电子邮箱" required />
      </div>
      <div className="grid gap-3">
        <div className="flex items-center h-4">
          <Label htmlFor="code">验证码</Label>
        </div>
        <div className="flex gap-5">
          <InputOTP
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
          <Button variant="secondary">获取验证码</Button>
        </div>
      </div>
      <Button type="submit" className="w-full">
        登录
      </Button>
    </>
  )
}

function RegisterMode() {
  return (
    <>
      <RegisterHeader />
      <div className="grid gap-3">
        <Label htmlFor="email">账户名</Label>
        <Input id="account" type="text" placeholder="账户名" required />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="email">电子邮箱</Label>
        <Input id="email" type="text" placeholder="电子邮箱" required />
      </div>
      <div className="grid gap-3">
        <div className="flex items-center h-4">
          <Label htmlFor="code">验证码</Label>
        </div>
        <div className="flex gap-5">
          <InputOTP
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
          <Button variant="secondary">获取验证码</Button>
        </div>
      </div>
      <Button type="submit" className="w-full">
        注册
      </Button>
    </>
  )
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loginMode, setLoginMode] = useState<'password' | 'phone' | 'email' | 'register'>('password');

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">

              {loginMode === 'password' ? <PasswordMode /> : null}
              {loginMode === 'phone' ? <PhoneMode /> : null}
              {loginMode === 'email' ? <EmailMode /> : null}
              {loginMode === 'register' ? <RegisterMode /> : null}

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
              src="/placeholder.svg"
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
