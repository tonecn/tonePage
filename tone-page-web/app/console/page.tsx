import { LoginForm } from "@/components/login-form";

export default function Console() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <LoginForm />
            </div>
        </div>
    )
}