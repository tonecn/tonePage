'use client';
import * as React from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { AdminUser } from "@/lib/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserForm } from "./user-form";
import { CreateUserValues } from "./user-schema";

export function UserInfoEditor({
    onClose,
    onUserUpdate,
    userId,
}: {
    onClose: () => void,
    onUserUpdate: (user: AdminUser) => void,
    userId: string
}) {
    const [user, setUser] = React.useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);
    const isOpen = !!userId;

    // 每次 Sheet 打开时重新获取用户数据
    React.useEffect(() => {
        if (!isOpen || !userId) {
            setUser(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        api.admin.user.get(userId)
            .then(data => {
                setUser(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err);
                setIsLoading(false);
                toast.error(err.message || '获取用户信息失败');
            });
    }, [isOpen, userId]);

    const handleSave = async (values: CreateUserValues) => {
        try {
            const res = await api.admin.user.update(userId, {
                username: values.username,
                nickname: values.nickname,
                email: values.email,
                phone: values.phone,
            });
            if (res) {
                toast.success("保存成功");
                onUserUpdate(res);
                onClose();
            } else {
                throw new Error();
            }
        } catch (error) {
            toast.error((error as Error).message || "保存失败");
        }
    }

    return (
        <Sheet open={!!userId} onOpenChange={onClose} >
            <SheetContent className="sm:max-w-md flex flex-col h-full">
                <SheetHeader>
                    <SheetTitle>编辑用户信息</SheetTitle>
                    <SheetDescription>查看和修改用户详细资料</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-5">
                    {user ? (
                        <>
                            <div className="flex items-center gap-4 mb-6">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={user.avatar ?? ''} />
                                    <AvatarFallback>{user.nickname?.[0]?.toUpperCase() || user.username[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-medium">{user.nickname || user.username}</h3>
                                    <p className="text-sm text-muted-foreground">ID: {user.userId}</p>
                                </div>
                            </div>

                            <UserForm
                                isEdit
                                defaultValues={{
                                    username: user.username,
                                    nickname: user.nickname,
                                    email: user.email || '',
                                    phone: user.phone || '',
                                }}
                                onSubmit={handleSave}
                            />
                        </>
                    ) : isLoading ? (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-62.5" />
                                    <Skeleton className="h-4 w-50" />
                                </div>
                            </div>
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : null}

                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>出错啦!</AlertTitle>
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}