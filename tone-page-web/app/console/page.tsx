'use client';

import { LoginForm, LoginFormData } from "@/components/login-form";

const handleSubmit = async (data: LoginFormData) => {
    console.log(data)
}

const handleSendCode = async (data: LoginFormData) => {
    console.log(data)
}

export default function Console() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <LoginForm onSubmit={handleSubmit} onSendCode={handleSendCode} />
            </div>
        </div>
    )
}