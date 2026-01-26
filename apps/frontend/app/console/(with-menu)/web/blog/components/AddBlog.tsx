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
import { BlogPermission } from "@/lib/types/Blog.Permission.enum";
import { useState } from "react";
import { toast } from "sonner";
import { BlogPermissionCheckBoxs } from "./BlogPermissionCheckBoxs";
import { api } from "@/lib/api";
import { Edit3 } from "lucide-react";
import { BlogContentEditor } from "./BlogContentEditor";
import { copyShareURL } from "./utils";

interface AddBlogProps {
    children: React.ReactNode;
    onRefresh: () => void;
}

export default function AddBlog({ children, onRefresh }: AddBlogProps) {
    const [open, setOpen] = useState(false);
    const [editorOpen, setEditorOpen] = useState(false);
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

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px]">
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
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">
                                内容
                            </Label>
                            <div className="col-span-3 flex items-center justify-between border rounded-md px-3 py-2 bg-muted/20">
                                <div className="text-sm text-muted-foreground">
                                    {blog.content ? `已输入 ${blog.content.length} 个字符` : '暂无内容'}
                                </div>
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => setEditorOpen(true)}
                                    type="button"
                                >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    编辑内容
                                </Button>
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

        <BlogContentEditor 
            open={editorOpen} 
            onOpenChange={setEditorOpen}
            initialContent={blog.content} 
            onSave={(content) => setBlog({...blog, content})}
            title="编辑博客内容"
        />
        </>
    )
}