"use client"

import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ResourceBadge } from "@/components/resource"
import AddResourceTag from "./AddResourceTag"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { Resource } from "@/lib/types/resource"
import { AdminApi } from "@/lib/api"
import useSWR from "swr"
import { ApiError } from "next/dist/server/api-utils"
interface ResourceEditProps {
    children: React.ReactNode
    id: string;
    onRefresh: () => void;
}

export default function ResourceEdit({ children, id, onRefresh }: ResourceEditProps) {
    const [open, setOpen] = useState(false);

    const { data: resource, error, isLoading, mutate } = useSWR<Resource>(
        open ? [`/api/admin/web/resource/${id}`] : null,
        () => AdminApi.web.resource.get(id),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
            dedupingInterval: 5000,
        }
    )

    const handleSubmit = async () => {
        if (!resource) return;
        try {
            await AdminApi.web.resource.update(id, {
                title: resource.title,
                description: resource.description,
                imageUrl: resource.imageUrl,
                link: resource.link,
                tags: resource.tags,
            });
            toast.success("资源更新成功");
            onRefresh();
            setOpen(false);
        } catch (error) {
            toast.error((error as ApiError).message || "资源更新失败");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-300">
                <DialogHeader>
                    <DialogTitle>编辑资源</DialogTitle>
                </DialogHeader>
                {resource && (
                    <>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="admin-web-resource-add-title" className="text-right">
                                    标题
                                </Label>
                                <Input
                                    id="admin-web-resource-add-title"
                                    value={resource.title}
                                    onChange={(e) => mutate({ ...resource, title: e.target.value }, false)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="admin-web-resource-add-description" className="text-right">
                                    描述
                                </Label>
                                <Textarea
                                    id="admin-web-resource-add-description"
                                    value={resource.description}
                                    onChange={(e) => mutate({ ...resource, description: e.target.value }, false)}
                                    className="col-span-3 max-h-15"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="admin-web-resource-add-imageUrl" className="text-right">
                                    图标URL
                                </Label>
                                <Input
                                    id="admin-web-resource-add-imageUrl"
                                    value={resource.imageUrl}
                                    onChange={(e) => mutate({ ...resource, imageUrl: e.target.value }, false)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="admin-web-resource-add-link" className="text-right">
                                    链接
                                </Label>
                                <Input
                                    id="admin-web-resource-add-link"
                                    value={resource.link}
                                    onChange={(e) => mutate({ ...resource, link: e.target.value }, false)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="admin-web-resource-add-tags" className="text-right">
                                    标签
                                </Label>
                                <div className="flex items-center gap-2">
                                    {
                                        resource.tags.map((tag, index) => (
                                            <ResourceBadge tag={tag} key={index} editMode={true} onClose={name => mutate({ ...resource, tags: resource.tags.filter(tag => tag.name !== name) }, false)} />
                                        ))
                                    }

                                    <AddResourceTag onTagAdd={(tag) => {
                                        if (!tag.name) return;
                                        if (resource.tags.find(t => t.name === tag.name)) {
                                            toast.error("标签已存在");
                                            return;
                                        }
                                        mutate({
                                            ...resource,
                                            tags: [...resource.tags, tag],
                                        }, false)
                                    }}>
                                        <Button size='sm' variant='outline'>
                                            <Plus />
                                        </Button>
                                    </AddResourceTag>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleSubmit}>保存</Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}