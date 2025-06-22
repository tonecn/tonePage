'use client';

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminApi } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface SetPasswordDialogProps {
    id: string;
    children: React.ReactNode;
}

export function SetPasswordDialog({ id, children }: SetPasswordDialogProps) {
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        if (!password) {
            return toast.error('请输入密码');
        }

        await AdminApi.web.blog.setPassword(id, password).then(() => {
            toast.success('修改成功');
            setOpen(false);
        }).catch(e => {
            toast.error(`${e.message || e || '请求失败'}`)
        });
    }

    useEffect(() => {
        if (open) {
            setPassword('');
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={v => setOpen(v)}>
            <form>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>修改密码</DialogTitle>
                        <DialogDescription>
                            通过密码访问受保护的文章，需开启“受密码保护”权限
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="new-password">新密码</Label>
                            <Input
                                id="new-password"
                                name="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">取消</Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleSubmit}>保存</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}