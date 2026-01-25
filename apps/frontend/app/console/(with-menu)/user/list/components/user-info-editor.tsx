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
import { AdminUser } from "@/lib/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/api";

export function UserInfoEditor({
    onClose,
    onUserUpdate,
    onUserSoftDelete,
    userId,
}: {
    onClose: () => void,
    onUserUpdate: (user: AdminUser) => void,
    onUserSoftDelete: (userId: string) => void,
    userId: string
}) {
    const { user, isLoading, error } = useUser(userId);

    // const [saveLoading, setSaveLoading] = React.useState(false);
    const handleSave = async (user: {
        username: string;
        nickname: string;
        email: string | null;
        phone: string | null;
    }) => {
        try {
            // setSaveLoading(true);
            const res = await api.admin.user.update(userId, user);
            if (res) {
                toast.success("保存成功");
                onUserUpdate(res);
                onClose();
            } else {
                throw new Error();
            }
        } catch (error) {
            toast.error((error as Error).message || "保存失败");
        } finally {
            // setSaveLoading(false);
        }
    }

    // const [removeLoading, setRemoveLoading] = React.useState(false);
    const handleRemove = async (userId: string) => {
        try {
            // setRemoveLoading(true);
            await api.admin.user.delete(userId, true);
            toast.success("注销成功");
            onUserSoftDelete(userId);
            onClose();
        } catch (error) {
            toast.error((error as Error).message || "注销失败");
        } finally {
            // setRemoveLoading(false);
        }
    }

    const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);
    // const [setPasswordLoading, setSetPasswordLoading] = React.useState(false);
    const handleSetPassword = async (userId: string, password: string) => {
        try {
            // setSetPasswordLoading(true);
            await api.admin.user.setPassword(userId, password);
            toast.success("密码修改成功");
            setPasswordDialogOpen(false);
        } catch (error) {
            toast.error((error as Error).message || "密码修改失败");
        } finally {
            // setSetPasswordLoading(false);
        }
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
                    passwordDialogOpen={passwordDialogOpen}
                    setPasswordDialogOpen={setPasswordDialogOpen}
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget);
                        handleSave({
                            username: formData.get("username")?.toString() as unknown as string,
                            nickname: formData.get("nickname")?.toString() as unknown as string,
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

function ProfileForm({ className, user, onSetPassword, onRemove, passwordDialogOpen, setPasswordDialogOpen, ...props }:
    React.ComponentProps<"form"> & {
        user: AdminUser;
        onSetPassword: (userId: string, password: string) => Promise<void>;
        onRemove: (userId: string) => Promise<void>;
        passwordDialogOpen: boolean;
        setPasswordDialogOpen: (s: boolean) => void;
    }) {
    const [newPassword, setNewPassword] = React.useState<string>("");

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
                <Input id="email" name="email" defaultValue={user.email ?? ''} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">手机号</Label>
                <Input id="phone" name="phone" defaultValue={user.phone ?? ''} />
            </div>
            <div className="w-full flex gap-5">
                <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                    <DialogTrigger asChild>
                        <Button type="button" variant="secondary" className="flex-1" onClick={() => setNewPassword('')}>修改密码</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-106" >
                        <DialogHeader>
                            <DialogTitle>修改密码</DialogTitle>
                            <DialogDescription>
                                新密码长度在6-32位之间，且至少包含一个字母和一个数字，可以包含特殊字符
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    新密码
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={() => onSetPassword(user.userId, newPassword)}>保存密码</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button" variant="destructive" className="flex-1">注销</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>是否要注销该账号?</AlertDialogTitle>
                            <AlertDialogDescription>
                                该操作无法撤销，稍后可通过删除来彻底清理该用户信息
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onRemove(user.userId)}>注销</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <Button type="submit">保存</Button>
        </form>
    )
}