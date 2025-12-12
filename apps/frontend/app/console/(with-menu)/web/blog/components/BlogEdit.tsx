"use client"

import React, { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { AdminApi } from "@/lib/api"
import useSWR from "swr"
import { ApiError } from "next/dist/server/api-utils"
import { BlogPermissionCheckBoxs } from "./BlogPermissionCheckBoxs"
import { BlogPermission } from "@/lib/types/Blog.Permission.enum"
import { SetPasswordDialog } from "./SetPasswordDialog"

interface BlogEditProps {
    id: string;
    children?: React.ReactNode;
    onRefresh: () => void;
}

export default function BlogEdit({ id, children, onRefresh }: BlogEditProps) {
    const [open, setOpen] = useState(false)
    const { data: blog, mutate } = useSWR(
        open ? `/api/admin/web/blog/${id}` : null,
        () => AdminApi.web.blog.get(id),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
            dedupingInterval: 5000,
        }
    )

    const handleSubmit = async () => {
        if (!blog) return;
        try {
            await AdminApi.web.blog.update(id, {
                title: blog.title,
                description: blog.description,
                contentUrl: blog.contentUrl,
                permissions: blog.permissions,
            });
            toast.success("更新成功")
            setOpen(false);
            onRefresh();
        } catch (error) {
            toast.error((error as ApiError).message || "更新失败")
        }
    }

    const handleDelete = async () => {
        try {
            await AdminApi.web.blog.remove(id);
            toast.success("删除成功")
            setOpen(false);
            onRefresh();
        } catch (error) {
            toast.error((error as ApiError).message || "删除失败")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>编辑博客</DialogTitle>
                    <DialogDescription>
                        保存前请确认博客信息填写正确、权限配置合理
                    </DialogDescription>
                </DialogHeader>
                {
                    blog && (
                        <>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">
                                        标题
                                    </Label>
                                    <Input
                                        id="title"
                                        className="col-span-3"
                                        value={blog.title}
                                        onChange={(e) => mutate({ ...blog, title: e.target.value }, false)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">
                                        描述
                                    </Label>
                                    <Input
                                        id="description"
                                        className="col-span-3"
                                        value={blog.description}
                                        onChange={(e) => mutate({ ...blog, description: e.target.value }, false)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="contentUrl" className="text-right">
                                        文章URL
                                    </Label>
                                    <Input
                                        id="contentUrl"
                                        className="col-span-3"
                                        value={blog.contentUrl}
                                        onChange={(e) => mutate({ ...blog, contentUrl: e.target.value }, false)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="permissions" className="text-right">
                                        文章权限
                                    </Label>
                                    <div className="col-span-3">
                                        <BlogPermissionCheckBoxs
                                            permissions={blog.permissions}
                                            onCheckedChange={(permission, newState) => {
                                                mutate({
                                                    ...blog,
                                                    permissions: newState ?
                                                        [...blog.permissions, permission] :
                                                        blog.permissions.filter(p => p !== permission)
                                                }, false)
                                            }}
                                        />
                                    </div>
                                </div>
                                {
                                    blog.permissions.includes(BlogPermission.ByPassword) &&
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="permissions" className="text-right">
                                            文章保护密码
                                        </Label>
                                        <SetPasswordDialog id={id}>
                                            <Button variant='outline'>修改</Button>
                                        </SetPasswordDialog>
                                    </div>
                                }
                            </div>
                            <DialogFooter>
                                <div className="w-full flex justify-between">
                                    <div>
                                        <Button variant='destructive' onClick={handleDelete}>删除</Button>
                                    </div>
                                    <div>
                                        <Button type="button" variant='secondary' onClick={() => setOpen(false)}>取消</Button>
                                        <Button type="button" onClick={handleSubmit} className="ml-5">保存</Button>
                                    </div>
                                </div>
                            </DialogFooter>
                        </>
                    )
                }
            </DialogContent>
        </Dialog>
    )
}