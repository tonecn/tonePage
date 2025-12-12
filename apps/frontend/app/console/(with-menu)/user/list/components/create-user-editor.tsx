import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { useState } from "react";
import { AdminApi } from "@/lib/api";
import { toast } from "sonner";
import { ApiError } from "next/dist/server/api-utils";

interface CreateUserEditorProps {
    children: React.ReactNode;
    onRefresh: () => void;
}

export function CreateUserEditor({ children, onRefresh }: CreateUserEditorProps) {
    const [open, setOpen] = useState(false);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            await AdminApi.user.create({
                username: formData.get("username")?.toString() || null,
                nickname: formData.get("nickname")?.toString() || null,
                email: formData.get("email")?.toString() || null,
                phone: formData.get("phone")?.toString() || null,
                password: formData.get("password")?.toString() || null,
            });
            setOpen(false);
            toast.success('创建成功')
            onRefresh();
        } catch (error) {
            toast.error((error as ApiError).message || '创建失败')
        }
    }

    return (
        <>
            <div onClick={() => setOpen(true)} className="cursor-pointer">
                {children}
            </div>
            <Drawer open={open} onClose={() => setOpen(false)}>
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle>新增用户</DrawerTitle>
                        <DrawerDescription>确保你在保存之前检查所有更改</DrawerDescription>
                    </DrawerHeader>

                    <form className="grid items-start gap-4 px-4" onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            <Label htmlFor="username">账户</Label>
                            <Input id="username" name="username" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nickname">昵称</Label>
                            <Input id="nickname" name="nickname" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">电子邮箱</Label>
                            <Input id="email" name="email" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">手机号</Label>
                            <Input id="phone" name="phone" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">密码</Label>
                            <Input id="password" name="password" />
                        </div>
                        <Button type="submit">创建</Button>
                    </form>

                    <DrawerFooter className="pt-2">
                        <DrawerClose asChild>
                            <Button variant="outline">关闭</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}