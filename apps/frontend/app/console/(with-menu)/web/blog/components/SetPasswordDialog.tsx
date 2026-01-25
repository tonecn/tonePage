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
import { api } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface SetPasswordDialogProps {
    id: string;
    slug: string;
    children: React.ReactNode;
}

export function SetPasswordDialog({ id, slug, children }: SetPasswordDialogProps) {
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        if (!password) {
            return toast.error('请输入密码');
        }

        await api.admin.blog.setPassword(id, password).then(() => {
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

    const handleCopyShareURL = () => {
        if (!password) {
            return toast.warning('请先填写新密码');
        }
        const url = `${window.location.origin}/blog/${slug}?p=${password}`;
        navigator.clipboard.writeText(url);
        toast.success('分享链接复制成功，请点击保存按钮以提交新密码');
    }

    return (
        <Dialog open={open} onOpenChange={v => setOpen(v)}>
            <form>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-100">
                    <DialogHeader>
                        <DialogTitle>修改密码</DialogTitle>
                        <DialogDescription>
                            通过密码访问受保护的文章，需开启“受密码保护”权限。注意复制URL需要填写完新密码后再点击
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
                        <div className="w-full flex justify-between">
                            <div>
                                <Button variant='secondary' onClick={handleCopyShareURL}>复制URL</Button>
                            </div>
                            <div className="flex gap-5">
                                <DialogClose asChild>
                                    <Button variant="outline">取消</Button>
                                </DialogClose>
                                <Button type="submit" onClick={handleSubmit}>保存</Button>
                            </div>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}