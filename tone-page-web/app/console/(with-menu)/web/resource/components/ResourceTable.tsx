"use client"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Resource } from "@/lib/types/resource";
import { ResourceBadge } from "@/components/resource";
import { Button } from "@/components/ui/button";
import ResourceEdit from "./ResourceEdit";

interface ResourceTableProps {
    resources: Resource[];
    errorMessage?: string;
    onRefresh: () => void;
}

export default function ResourceTable({ resources, errorMessage, onRefresh }: ResourceTableProps) {
    return (
        <>
            <Table>
                {errorMessage && <TableCaption>{errorMessage}</TableCaption>}
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Id</TableHead>
                        <TableHead>标题</TableHead>
                        <TableHead>描述</TableHead>
                        <TableHead>图标URL</TableHead>
                        <TableHead>链接</TableHead>
                        <TableHead>标签</TableHead>
                        <TableHead className="text-right w-10">操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resources.length > 0 ? resources.map((resource) => (
                        <TableRow key={resource.id}>
                            <TableCell className="font-medium">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="max-w-[100px] overflow-hidden text-ellipsis">{resource.id}</div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{resource.id}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                            <TableCell className="whitespace-normal break-all">{resource.title}</TableCell>
                            <TableCell className="whitespace-normal break-all">{resource.description}</TableCell>
                            <TableCell className="whitespace-normal break-all">{resource.imageUrl}</TableCell>
                            <TableCell className="whitespace-normal break-all">{resource.link}</TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {resource.tags.map((tag, index) => (
                                        <ResourceBadge tag={tag} key={index} />
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <ResourceEdit id={resource.id} onRefresh={() => onRefresh()}>
                                    <Button variant={'outline'} size={'sm'}>编辑</Button>
                                </ResourceEdit>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                <div className="my-5 text-zinc-500">暂无数据</div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}