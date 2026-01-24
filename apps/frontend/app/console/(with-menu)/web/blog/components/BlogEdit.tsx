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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import useSWR from "swr"
import { ApiError } from "next/dist/server/api-utils"
import { BlogPermissionCheckBoxs } from "./BlogPermissionCheckBoxs"
import { BlogPermission } from "@/lib/types/Blog.Permission.enum"
import { SetPasswordDialog } from "./SetPasswordDialog"
import { copyShareURL } from "./utils"
import { adminDeleteBlog, adminGetBlog, adminUpdateBlog } from "@/lib/api/actions"

interface BlogEditProps {
    id: string;
    children?: React.ReactNode;
    onRefresh: () => void;
}

export default function BlogEdit({ id, children, onRefresh }: BlogEditProps) {
    const [open, setOpen] = useState(false)
    const { data: blog, mutate } = useSWR(
        open ? `/api/admin/web/blog/${id}` : null,
        () => adminGetBlog(id),
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
            await adminUpdateBlog(id, {
                title: blog.title,
                description: blog.description,
                slug: blog.slug,
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
            await adminDeleteBlog(id);
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
            <DialogContent className="sm:max-w-120">
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
                                    <Label htmlFor="slug" className="text-right">
                                        Slug
                                    </Label>
                                    <Input
                                        id="slug"
                                        className="col-span-3"
                                        value={blog.slug}
                                        onChange={(e) => mutate({ ...blog, slug: e.target.value }, false)}
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
                                        <SetPasswordDialog id={id} slug={blog.slug}>
                                            <Button variant='outline'>修改</Button>
                                        </SetPasswordDialog>
                                    </div>
                                }
                            </div>
                            <DialogFooter>
                                <div className="w-full flex justify-between">
                                    <div>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant='destructive'>删除</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>是否要删除该博客?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        该操作不可逆，删除后将无法恢复该博客
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <Button variant='outline' className="ml-2" onClick={() => copyShareURL({
                                            slug: blog.slug,
                                            permissions: blog.permissions,
                                            password: ''
                                        })}>复制链接</Button>
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