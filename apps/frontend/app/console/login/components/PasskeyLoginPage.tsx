import LoginHeader from "./LoginHeader";
import { Button } from "@/components/ui/button";
import { startAuthentication } from "@simplewebauthn/browser";
import { getLoginByPasskeyOptions, loginByPasskey } from "@/lib/api/client";

export default function PasskeyLoginPage() {
    return (
        <>
            <LoginHeader h2="使用通行证登录到您的账户" />
            <div className="h-37.5 flex justify-center items-center">
                <span className="text-sm text-zinc-500 border rounded-2xl p-5">还没想好这里放点啥捏～</span>
            </div>
            <Button type="submit" className="w-full">
                登录
            </Button>
        </>
    )
}

export async function handleSubmit() {
    const optionsJSON = await getLoginByPasskeyOptions();
    const credentialResponse = await startAuthentication({ optionsJSON });
    return loginByPasskey(credentialResponse);
}