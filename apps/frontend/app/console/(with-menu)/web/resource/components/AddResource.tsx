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
import { ApiError } from "next/dist/server/api-utils"
import { ResourceBadge } from "@/components/resource"
import AddResourceTag from "./AddResourceTag"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { AdminAPI } from "@/lib/api/client"
import { adminCreateResource } from "@/lib/api/actions"


interface AddResourceProps {
    children: React.ReactNode;
    refresh: () => void;
}

export default function AddResource({ children, refresh }: AddResourceProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageUrl: "",
        link: "",
        tags: [] as { type: string, name: string }[],
    });

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await adminCreateResource({
                ...formData,
            });
            toast.success("添加成功");
            setOpen(false);
            refresh();
        } catch (error) {
            toast.error((error as ApiError).message || "添加失败");
        }
    }

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        if (open) {
            setFormData({
                title: "",
                description: "",
                imageUrl: "",
                link: "",
                tags: [] as { type: string, name: string }[],
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-300">
                <DialogHeader>
                    <DialogTitle>添加资源</DialogTitle>
                    <DialogDescription>
                        添加一个新的资源到资源列表中
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="admin-web-resource-add-title" className="text-right">
                            标题
                        </Label>
                        <Input
                            id="admin-web-resource-add-title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="admin-web-resource-add-description" className="text-right">
                            描述
                        </Label>
                        <Textarea
                            id="admin-web-resource-add-description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="col-span-3 max-h-15"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="admin-web-resource-add-imageUrl" className="text-right">
                            图标URL
                        </Label>
                        <Input
                            id="admin-web-resource-add-imageUrl"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="admin-web-resource-add-link" className="text-right">
                            链接
                        </Label>
                        <Input
                            id="admin-web-resource-add-link"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="admin-web-resource-add-tags" className="text-right">
                            标签
                        </Label>
                        <div className="flex items-center gap-2">
                            {
                                formData.tags.map((tag, index) => (
                                    <ResourceBadge tag={tag} key={index} editMode={true} onClose={name => setFormData({ ...formData, tags: formData.tags.filter(tag => tag.name !== name) })} />
                                ))
                            }

                            <AddResourceTag onTagAdd={(tag) => {
                                if (!tag.name) return;
                                if (formData.tags.find(t => t.name === tag.name)) {
                                    toast.error("标签已存在");
                                    return;
                                }
                                setFormData({
                                    ...formData,
                                    tags: [...formData.tags, tag],
                                })
                            }}>
                                <Button size='sm' variant='outline'>
                                    <Plus />
                                </Button>
                            </AddResourceTag>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit} disabled={loading}>保存</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}