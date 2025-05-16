'use client'

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminApi } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

interface AddBlogProps {
    children: React.ReactNode;
    onRefresh: () => void;
}

export default function AddBlog({ children, onRefresh }: AddBlogProps) {
    const [open, setOpen] = useState(false);
    const [blog, setBlog] = useState({
        title: "",
        description: "",
        contentUrl: "",
    });

    const handleSubmit = async () => {
        try {
            const res = await AdminApi.web.blog.create({
                ...blog,
            });
            if (res) {
                setOpen(false);
                onRefresh();
                toast.success("添加成功");
            } else {
                throw new Error();
            }
        } catch (error) {
            toast.error((error as Error).message || "添加失败");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>添加博客</DialogTitle>
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
                        <Label htmlFor="contentUrl" className="text-right">
                            文章URL
                        </Label>
                        <Input
                            id="contentUrl"
                            className="col-span-3"
                            value={blog.contentUrl}
                            onChange={(e) => setBlog({ ...blog, contentUrl: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant='secondary' onClick={() => setOpen(false)}>取消</Button>
                    <Button type="button" onClick={handleSubmit}>保存</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}