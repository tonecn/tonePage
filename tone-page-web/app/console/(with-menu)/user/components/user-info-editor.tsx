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

export function UserInfoEditor({
    onClose,
    userId,
}: {
    onClose: () => void,
    userId: string
}) {
    const { user, isLoading, error } = userId ? useUser(userId) : {};

    return (
        <Drawer open={!!userId} onClose={onClose} >
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>编辑用户信息</DrawerTitle>
                    <DrawerDescription>确保你在保存之前检查所有更改</DrawerDescription>
                </DrawerHeader>

                {user && <ProfileForm className="px-4" user={user} onSubmit={(e) => {
                    e.preventDefault();
                }} />}

                {isLoading &&
                    [...Array(5)].map((_, i) => (
                        <Skeleton className="h-20 mx-4 my-1" key={i} />
                    ))
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

function ProfileForm({ className, user, ...props }: React.ComponentProps<"form"> & { user: User }) {
    return (
        <form className={cn("grid items-start gap-4", className)} {...props}>
            <div className="grid gap-2">
                <Label htmlFor="email">UserId</Label>
                <Input id="email" defaultValue={user.userId} disabled />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="username">账户</Label>
                <Input id="username" defaultValue={user.username} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="nickname">昵称</Label>
                <Input id="nickname" defaultValue={user.nickname} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">电子邮箱</Label>
                <Input id="email" defaultValue={user.email} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">手机号</Label>
                <Input id="phone" defaultValue={user.phone} />
            </div>
            <Button type="submit">保存</Button>
        </form>
    )
}