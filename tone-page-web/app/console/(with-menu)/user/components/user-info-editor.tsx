'use client';
import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/hooks/admin/user/use-user";
import { User } from "@/lib/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import { updateUser } from "@/lib/api/admin/user";
import { AdminApi } from "@/lib/api";
import { toast } from "sonner";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircle } from "lucide-react";

export function UserInfoEditor({
    onClose,
    onUserUpdate,
    userId,
}: {
    onClose: () => void,
    onUserUpdate: (user: User) => void,
    userId: string
}) {
    const { user, isLoading, error } = userId ? useUser(userId) : {};
    const handleSave = async (user: updateUser) => {
        try {
            const res = await AdminApi.user.update(userId, user);
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

    const handleRemove = async () => {

    }

    const handleSetPassword = async () => {

    }

    return (
        <Drawer open={!!userId} onClose={onClose} >
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>编辑用户信息</DrawerTitle>
                    <DrawerDescription>确保你在保存之前检查所有更改</DrawerDescription>
                </DrawerHeader>

                {user && <ProfileForm className="px-4"
                    user={user}
                    onSetPassword={handleSetPassword}
                    onRemove={handleRemove}
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget);
                        handleSave({
                            username: formData.get("username")?.toString()!,
                            nickname: formData.get("nickname")?.toString()!,
                            email: formData.get("email")?.toString() || null,
                            phone: formData.get("phone")?.toString() || null,
                        })
                    }} />}

                {isLoading &&
                    [...Array(5)].map((_, i) => (
                        <Skeleton className="h-20 mx-4 my-1" key={i} />
                    ))
                }

                {
                    error && (
                        <Alert variant="destructive" className="mx-4">
                            <AlertCircle className="h-6 w-6" />
                            <AlertTitle>出错啦!</AlertTitle>
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    )
                }

                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">关闭</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function ProfileForm({ className, user, onSetPassword, onRemove, ...props }:
    React.ComponentProps<"form"> & {
        user: User,
        onSetPassword: () => Promise<void>,
        onRemove: () => Promise<void>,
    }) {
    return (
        <form className={cn("grid items-start gap-4", className)} {...props}>
            <div className="grid gap-2">
                <Label htmlFor="userId">UserId</Label>
                <Input id="userId" name="userId" defaultValue={user.userId} disabled />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="username">账户</Label>
                <Input id="username" name="username" defaultValue={user.username} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="nickname">昵称</Label>
                <Input id="nickname" name="nickname" defaultValue={user.nickname} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">电子邮箱</Label>
                <Input id="email" name="email" defaultValue={user.email} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">手机号</Label>
                <Input id="phone" name="phone" defaultValue={user.phone} />
            </div>
            <div className="w-full flex gap-5">
                <Button type="button" variant="secondary" className="flex-1" onClick={onSetPassword}>修改密码</Button>
                <Button type="button" variant="destructive" className="flex-1" onClick={onRemove}>删除用户</Button>
            </div>
            <Button type="submit">保存</Button>
        </form>
    )
}