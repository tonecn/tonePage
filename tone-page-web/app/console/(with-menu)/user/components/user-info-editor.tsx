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

export function UserInfoEditor({
    onClose,
    userId,
}: {
    onClose: () => void,
    userId: string
}) {
    return (
        <Drawer open={!!userId} onClose={onClose} >
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>编辑用户信息</DrawerTitle>
                    <DrawerDescription>确保你在保存之前检查所有更改</DrawerDescription>
                </DrawerHeader>
                <ProfileForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">关闭</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
    return (
        <form className={cn("grid items-start gap-4", className)}>
            <div className="grid gap-2">
                <Label htmlFor="email">UserId</Label>
                <Input id="email" defaultValue="adijasiodjoi2q" disabled />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="username">账户</Label>
                <Input id="username" defaultValue="username" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="nickname">昵称</Label>
                <Input id="nickname" defaultValue="nickname" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">电子邮箱</Label>
                <Input id="email" defaultValue="email" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">手机号</Label>
                <Input id="phone" defaultValue="phone" />
            </div>
            <Button type="submit">保存</Button>
        </form>
    )
}