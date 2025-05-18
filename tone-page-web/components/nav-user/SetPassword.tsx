'use client';

import { SeparatorProps } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FC } from "react";
import { DialogProps } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { UserApi } from "@/lib/api";
import { ApiError } from "next/dist/server/api-utils";

export default function SetPassword({ onOpenChange, ...props }: React.ComponentProps<FC<DialogProps>>) {
    async function handleSetPassword(password: string) {
        if (! /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:'",.<>/?]{6,32}$/.test(password)) {
            toast.error('新密码不符合规范，请重新输入');
            return;
        }

        try {
            await UserApi.updatePassword(password);
            toast.success('新密码设置成功');
            onOpenChange?.(false);
        } catch (error) {
            toast.error((error as ApiError).message || '新密码设置失败');
        }
    }

    return (
        <Dialog onOpenChange={onOpenChange} {...props}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>修改密码</DialogTitle>
                    <DialogDescription>
                        新密码长度在6-32位之间，且至少包含一个字母和一个数字，可以包含特殊字符
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={e => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const password = formData.get('password') as string;

                    handleSetPassword(password);
                }}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                新密码
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                defaultValue=""
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant='secondary' onClick={() => onOpenChange?.(false)}>取消</Button>
                        <Button type="submit">保存密码</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}