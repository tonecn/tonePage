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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import useSWR from "swr"
import { ApiError } from "next/dist/server/api-utils"
import { BlogPermissionCheckBoxs } from "./BlogPermissionCheckBoxs"
import { BlogPermission } from "@/lib/types/Blog.Permission.enum"
import { SetPasswordDialog } from "./SetPasswordDialog"
import { copyShareURL } from "./utils"
import { api } from "@/lib/api"
import { Upload, FileText } from "lucide-react"

interface BlogEditProps {
    id: string;
    children?: React.ReactNode;
    onRefresh: () => void;
}

export default function BlogEdit({ id, children, onRefresh }: BlogEditProps) {
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState<'write' | 'upload'>('write');
    const { data: blog, mutate } = useSWR(
        open ? `/api/admin/web/blog/${id}` : null,
        () => api.admin.blog.get(id),
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
            await api.admin.blog.update(id, {
                title: blog.title,
                description: blog.description,
                slug: blog.slug,
                content: blog.content,
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
            await api.admin.blog.delete(id);
            toast.success("删除成功")
            setOpen(false);
            onRefresh();
        } catch (error) {
            toast.error((error as ApiError).message || "删除失败")
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!blog) return;
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                mutate({ ...blog, content: text }, false);
            }
        };
        reader.readAsText(file);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
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

                                <div className="grid grid-cols-4 items-start gap-4">
                                    <Label className="text-right mt-2">
                                        内容
                                    </Label>
                                    <div className="col-span-3 space-y-4">
                                        <div className="flex gap-2">
                                            <Button 
                                                size="sm" 
                                                variant={mode === 'write' ? 'default' : 'outline'}
                                                onClick={() => setMode('write')}
                                            >
                                                <FileText className="w-4 h-4 mr-2" />
                                                直接编辑
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant={mode === 'upload' ? 'default' : 'outline'}
                                                onClick={() => setMode('upload')}
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                上传/替换 Markdown
                                            </Button>
                                        </div>
                                        
                                        {mode === 'write' ? (
                                            <Textarea
                                                className="min-h-[300px] font-mono"
                                                placeholder="# Markdown content here..."
                                                value={blog.content || ''}
                                                onChange={(e) => mutate({ ...blog, content: e.target.value }, false)}
                                            />
                                        ) : (
                                            <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-2">
                                                <Input 
                                                    type="file" 
                                                    accept=".md,.markdown,.txt" 
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                    id="md-upload-edit"
                                                />
                                                <Label htmlFor="md-upload-edit" className="cursor-pointer block">
                                                    <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                                        <Upload className="w-8 h-8" />
                                                        <span>点击选择 Markdown 文件</span>
                                                        <span className="text-xs">支持 .md, .markdown, .txt</span>
                                                    </div>
                                                </Label>
                                                <div className="text-xs text-muted-foreground mt-2">
                                                    当前内容长度: {blog.content?.length || 0} 字符
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="permissions" className="text-right">
                                        文章权限
                                    </Label>
                                    <div className="col-span-3">
                                        <BlogPermissionCheckBoxs
                                            permissions={blog.permissions}
                                            onCheckedChange={(permission, newState) => {
                                                let nextPermissions = newState ?
                                                    [...blog.permissions, permission] :
                                                    blog.permissions.filter(p => p !== permission);

                                                if (newState) {
                                                    if (permission === BlogPermission.Public) {
                                                        nextPermissions = nextPermissions.filter(p => p !== BlogPermission.ByPassword);
                                                    } else if (permission === BlogPermission.ByPassword) {
                                                        nextPermissions = nextPermissions.filter(p => p !== BlogPermission.Public);
                                                    }
                                                }

                                                mutate({
                                                    ...blog,
                                                    permissions: Array.from(new Set(nextPermissions))
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