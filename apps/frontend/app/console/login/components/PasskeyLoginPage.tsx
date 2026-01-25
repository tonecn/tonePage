import LoginHeader from "./LoginHeader";
import { Button } from "@/components/ui/button";
import { startAuthentication } from "@simplewebauthn/browser";
import { api } from "@/lib/api";
import { Fingerprint } from "lucide-react";

export default function PasskeyLoginPage() {
    return (
        <>
            <LoginHeader h2="使用通行证登录到您的账户" />
            <div className="h-37.5 flex flex-col justify-center items-center gap-4">
                <div className="rounded-full bg-primary/5 p-4 ring-1 ring-primary/20">
                    <Fingerprint className="size-8 text-primary" strokeWidth={1.5} />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-foreground">无需密码</p>
                    <p className="text-xs text-muted-foreground">
                        使用指纹、面容或安全密钥进行验证
                    </p>
                </div>
            </div>
            <Button type="submit" className="w-full">
                进行验证
            </Button>
        </>
    )
}

export async function handleSubmit() {
    const optionsJSON = await api.auth.getLoginByPasskeyOptions();
    const credentialResponse = await startAuthentication({ optionsJSON });
    return api.auth.loginByPasskey(credentialResponse);
}