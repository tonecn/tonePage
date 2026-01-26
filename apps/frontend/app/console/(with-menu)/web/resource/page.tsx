"use client";

import { useState } from "react";
import { useResourceList } from "@/hooks/admin/web/resource/use-resource-list";
import { Button } from "@/components/ui/button";
import AddResource from "./components/AddResource";
import ResourceEdit from "./components/ResourceEdit";
import { Search, Plus, ExternalLink, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResourceBadge } from "@/components/resource";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ApiError } from "next/dist/server/api-utils";

export default function Page() {
    // State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchInput, setSearchInput] = useState('');
    const [query, setQuery] = useState('');
    const [deleteResourceId, setDeleteResourceId] = useState<string>('');

    const { resources, total, isLoading, refresh } = useResourceList({
        page,
        pageSize,
        query
    });

    const totalPages = Math.ceil(total / pageSize);

    // Handlers
    const handleSearch = () => {
        setPage(1);
        setQuery(searchInput);
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setQuery('');
        setPage(1);
    };

    const handleDelete = async () => {
        if (!deleteResourceId) return;
        try {
            await api.admin.resource.delete(deleteResourceId);
            toast.success("资源删除成功");
            refresh();
        } catch (error) {
            toast.error((error as ApiError).message || "资源删除失败");
        } finally {
            setDeleteResourceId('');
        }
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink isActive={page === i} onClick={() => setPage(i)} className="cursor-pointer h-9 w-9">
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink isActive={page === 1} onClick={() => setPage(1)} className="cursor-pointer h-9 w-9">1</PaginationLink>
                </PaginationItem>
            );

            if (page > 3) items.push(<PaginationItem key="sep1"><PaginationEllipsis /></PaginationItem>);

            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) {
                if (i === 1 || i === totalPages) continue;
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink isActive={page === i} onClick={() => setPage(i)} className="cursor-pointer h-9 w-9">
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (page < totalPages - 2) items.push(<PaginationItem key="sep2"><PaginationEllipsis /></PaginationItem>);

            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink isActive={page === totalPages} onClick={() => setPage(totalPages)} className="cursor-pointer h-9 w-9">{totalPages}</PaginationLink>
                </PaginationItem>
            );
        }
        return items;
    };

    return (
        <div className="space-y-4 h-full flex flex-col min-h-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">资源管理</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        管理用于展示的各类资源链接
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="搜索资源标题、描述..."
                            className="pl-9"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <Button onClick={handleSearch} variant="secondary">搜索</Button>
                    <AddResource refresh={refresh}>
                        <Button><Plus className="mr-2 h-4 w-4" /> 新增</Button>
                    </AddResource>
                </div>
            </div>

            {/* Content */}
            <div className="border rounded-lg shadow-sm bg-card flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-20 whitespace-nowrap">ID</TableHead>
                                <TableHead className="w-75 whitespace-nowrap">资源信息</TableHead>
                                <TableHead className="w-50 whitespace-nowrap">链接</TableHead>
                                <TableHead className="w-50 whitespace-nowrap">标签</TableHead>
                                <TableHead className="w-37.5 whitespace-nowrap">更新时间</TableHead>
                                <TableHead className="text-right whitespace-nowrap">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                        <TableCell>
                                            <div className="flex gap-3 items-center">
                                                <Skeleton className="h-10 w-10 rounded-md" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-48" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><div className="flex gap-1"><Skeleton className="h-5 w-12 rounded-full" /><Skeleton className="h-5 w-12 rounded-full" /></div></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : resources.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        暂无资源数据
                                        {query && <Button variant="link" onClick={handleClearSearch} className="ml-2">清除搜索</Button>}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                resources.map((resource) => (
                                    <TableRow key={resource.id}>
                                        <TableCell className="font-medium text-xs text-muted-foreground">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="cursor-help">#{resource.id.substring(0, 4)}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>ID: {resource.id}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-start gap-3">
                                                <Avatar className="h-10 w-10 rounded-md border">
                                                    <AvatarImage src={resource.imageUrl} alt={resource.title} />
                                                    <AvatarFallback className="rounded-md">{resource.title.substring(0, 1)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium text-sm line-clamp-1" title={resource.title}>{resource.title}</span>
                                                    <span className="text-xs text-muted-foreground line-clamp-2" title={resource.description}>
                                                        {resource.description || '暂无描述'}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <a
                                                href={resource.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline max-w-45 break-all"
                                            >
                                                <ExternalLink className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{resource.link}</span>
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {resource.tags && resource.tags.length > 0 ? (
                                                    resource.tags.map((tag, index) => (
                                                        <ResourceBadge tag={tag} key={index} />
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">-</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {resource.updatedAt ? new Date(resource.updatedAt).toLocaleString() : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">打开菜单</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>操作</DropdownMenuLabel>
                                                    <ResourceEdit id={resource.id} onRefresh={refresh}>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                            编辑资源
                                                        </DropdownMenuItem>
                                                    </ResourceEdit>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                        onClick={() => setDeleteResourceId(resource.id)}
                                                    >
                                                        删除资源
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination footer */}
                {totalPages > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
                        <div className="text-sm text-muted-foreground">
                            共 <span className="font-medium text-foreground">{total}</span> 条数据
                        </div>
                        <Pagination className="w-auto mx-0">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => page > 1 && setPage(page - 1)}
                                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>

                                {renderPaginationItems()}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => page < totalPages && setPage(page + 1)}
                                        className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

            <AlertDialog open={!!deleteResourceId} onOpenChange={(open) => !open && setDeleteResourceId('')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除该资源？</AlertDialogTitle>
                        <AlertDialogDescription>
                            此操作不可撤销。该资源将被永久删除。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">删除</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}