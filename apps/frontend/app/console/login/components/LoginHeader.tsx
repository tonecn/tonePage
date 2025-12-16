interface LoginHeaderProps {
    h1?: string;
    h2?: string;
}

export default function LoginHeader({ h1, h2 }: LoginHeaderProps) {
    return (
        <>
            <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{h1 || '欢迎回来'}</h1>
                <p className="text-muted-foreground text-balance">
                    {h2 || '登陆到您的账户'}
                </p>
            </div>
        </>
    )
}