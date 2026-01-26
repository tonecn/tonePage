'use client'

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BlogPermission } from "@/lib/types/Blog.Permission.enum";
import { useState } from "react";
import { toast } from "sonner";
import { BlogPermissionCheckBoxs } from "./BlogPermissionCheckBoxs";
import { copyShareURL } from "./utils";
import { api } from "@/lib/api";
import { Upload, FileText } from "lucide-react";

interface AddBlogProps {
    children: React.ReactNode;
    onRefresh: () => void;
}

export default function AddBlog({ children, onRefresh }: AddBlogProps) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'write' | 'upload'>('write');
    const [blog, setBlog] = useState({
        title: "",
        slug: "",
        description: "",
        content: "",
        permissions: [] as BlogPermission[],
        password: "",
    });

    const handleSubmit = async () => {
        try {
            const res = await api.admin.blog.create({
                ...blog,
            });
            if (res) {
                setOpen(false);
                onRefresh();
                toast.success("添加成功");
                setBlog({
                    title: '',
                    slug: '',
                    description: '',
                    content: '',
                    permissions: [],
                    password: '',
                })
            } else {
                throw new Error();
            }
        } catch (error) {
            toast.error((error as Error).message || "添加失败");
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                setBlog(prev => ({ ...prev, content: text }));
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
                    <DialogTitle>添加博客</DialogTitle>
                    <DialogDescription>
                        保存前请确认博客信息填写正确、权限配置合理
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            标题
                        </Label>
                        <Input
                            id="title"
                            className="col-span-3"
                            value={blog.title}
                            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
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
                            onChange={(e) => setBlog({ ...blog, description: e.target.value })}
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
                            onChange={(e) => setBlog({ ...blog, slug: e.target.value })}
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
                                    上传 Markdown
                                </Button>
                            </div>
                            
                            {mode === 'write' ? (
                                <Textarea
                                    className="min-h-[300px] font-mono"
                                    placeholder="# Markdown content here..."
                                    value={blog.content}
                                    onChange={(e) => setBlog({ ...blog, content: e.target.value })}
                                />
                            ) : (
                                <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-2">
                                    <Input 
                                        type="file" 
                                        accept=".md,.markdown,.txt" 
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="md-upload"
                                    />
                                    <Label htmlFor="md-upload" className="cursor-pointer block">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                            <Upload className="w-8 h-8" />
                                            <span>点击选择 Markdown 文件</span>
                                            <span className="text-xs">支持 .md, .markdown, .txt</span>
                                        </div>
                                    </Label>
                                    {blog.content && (
                                        <div className="text-xs text-green-600 font-medium mt-2">
                                            已读取文件内容 ({blog.content.length} 字符)
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                            文章权限
                        </Label>
                        <div className="col-span-3">
                            {
                                <BlogPermissionCheckBoxs
                                    permissions={blog.permissions}
                                    onCheckedChange={(p, n) => {
                                        let nextPermissions = n ?
                                            [...blog.permissions, p] :
                                            blog.permissions.filter(item => item !== p);

                                        if (n) {
                                            if (p === BlogPermission.Public) {
                                                nextPermissions = nextPermissions.filter(item => item !== BlogPermission.ByPassword);
                                            } else if (p === BlogPermission.ByPassword) {
                                                nextPermissions = nextPermissions.filter(item => item !== BlogPermission.Public);
                                            }
                                        }

                                        setBlog({
                                            ...blog,
                                            permissions: Array.from(new Set(nextPermissions)),
                                        });
                                    }}
                                />
                            }
                        </div>
                    </div>
                    {
                        blog.permissions.includes(BlogPermission.ByPassword) &&
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                密码
                            </Label>
                            <Input
                                id="password"
                                className="col-span-3"
                                value={blog.password}
                                onChange={(e) => setBlog({ ...blog, password: e.target.value })}
                            />
                        </div>
                    }
                </div>
                <DialogFooter >
                    <div className="flex justify-between w-full">
                        <Button type="button" variant='outline' onClick={() => copyShareURL({
                            slug: blog.slug,
                            password: blog.password,
                            permissions: blog.permissions,
                        })}>复制分享链接</Button>
                        <div>
                            <Button type="button" variant='secondary' onClick={() => setOpen(false)}>取消</Button>
                            <Button type="button" onClick={handleSubmit}>保存</Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}