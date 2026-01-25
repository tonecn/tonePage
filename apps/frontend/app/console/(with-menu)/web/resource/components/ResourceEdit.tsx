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
import useSWR from "swr"
import { ApiError } from "next/dist/server/api-utils"
import { Skeleton } from "@/components/ui/skeleton"
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
import { adminDeleteResource, adminGetResource, adminUpdateResource } from "@/lib/api/actions"

interface ResourceEditProps {
    children: React.ReactNode
    id: string;
    onRefresh: () => void;
}

export default function ResourceEdit({ children, id, onRefresh }: ResourceEditProps) {
    const [open, setOpen] = useState(false);

    const { data: resource, isLoading, mutate } = useSWR<Resource>(
        open ? [`/api/admin/web/resource/${id}`] : null,
        () => adminGetResource(id),
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
            await adminUpdateResource(id, {
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

    const handleRemove = async (id: string) => {
        try {
            await adminDeleteResource(id);
            toast.success("资源删除成功");
            onRefresh();
            setOpen(false);
        } catch (error) {
            toast.error((error as ApiError).message || "资源删除失败");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>编辑资源</DialogTitle>
                </DialogHeader>
                {
                    isLoading && (
                        [...Array(5)].map((_, index) => (
                            <Skeleton className="w-full h-14 rounded" key={index} />
                        ))
                    )
                }

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
                                <div className="col-span-3 w-full flex flex-wrap items-center gap-2 gap-y-1">
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
                            <div className="w-full flex justify-between">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant={'destructive'}>删除</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>是否要删除该资源?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                该操作不可逆，删除后将无法恢复该资源
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>取消</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleRemove(id)}>删除</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <div >
                                    <Button variant={'secondary'} onClick={() => setOpen(false)}>取消</Button>
                                    <Button type="button" onClick={handleSubmit} className="ml-3">保存</Button>
                                </div>
                            </div>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}