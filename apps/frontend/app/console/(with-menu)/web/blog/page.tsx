"use client"

import { useState } from "react";
import { useBlogList } from "@/hooks/admin/web/blog/use-blog-list"
import AddBlog from "./components/AddBlog";
import BlogEdit from "./components/BlogEdit";
import { SetPasswordDialog } from "./components/SetPasswordDialog";
import { Button } from "@/components/ui/button";
import { Search, Plus, ExternalLink, MoreHorizontal, Eye, Globe, Lock, List, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BlogPermission } from "@/lib/types/Blog.Permission.enum";
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
    const [deleteBlogId, setDeleteBlogId] = useState<string>('');

    const { blogs, total, isLoading, refresh } = useBlogList({
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
        if (!deleteBlogId) return;
        try {
            await api.admin.blog.delete(deleteBlogId);
            toast.success("博客删除成功");
            refresh();
        } catch (error) {
            toast.error((error as ApiError).message || "博客删除失败");
        } finally {
            setDeleteBlogId('');
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
        <div className="space-y-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">博客管理</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        管理博客文章、更新日志及内容发布
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="搜索博客标题、描述..."
                            className="pl-9"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <Button onClick={handleSearch} variant="secondary">搜索</Button>
                    <AddBlog onRefresh={refresh}>
                        <Button><Plus className="mr-2 h-4 w-4" /> 新增</Button>
                    </AddBlog>
                </div>
            </div>

            {/* Content */}
            <div className="border rounded-lg shadow-sm bg-card flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-20">ID</TableHead>
                                <TableHead className="w-64">标题 & 描述</TableHead>
                                <TableHead className="w-32">Slug</TableHead>
                                <TableHead className="w-20">浏览量</TableHead>
                                <TableHead>权限</TableHead>
                                <TableHead className="w-37.5">内容链接</TableHead>
                                <TableHead className="w-37.5">更新时间</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                        <TableCell>
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-48" />
                                                <Skeleton className="h-3 w-64" />
                                            </div>
                                        </TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : blogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                        暂无博客数据
                                        {query && <Button variant="link" onClick={handleClearSearch} className="ml-2">清除搜索</Button>}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                blogs.map((blog) => (
                                    <TableRow key={blog.id}>
                                        <TableCell className="font-medium text-xs text-muted-foreground">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="cursor-help">#{blog.id.substring(0, 4)}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>ID: {blog.id}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-sm line-clamp-1" title={blog.title}>{blog.title}</span>
                                                <span className="text-xs text-muted-foreground line-clamp-2" title={blog.description}>
                                                    {blog.description || '暂无描述'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {blog.slug ? (
                                                <span className="bg-muted px-2 py-0.5 rounded text-xs font-mono">{blog.slug}</span>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Eye className="h-3 w-3" />
                                                {blog.viewCount || 0}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {[...blog.permissions].sort().map(p => {
                                                    let Icon = Globe;
                                                    let label = "";
                                                    let colorClass = "";

                                                    switch (p) {
                                                        case BlogPermission.Public:
                                                            Icon = Globe;
                                                            label = "公开";
                                                            colorClass = "text-green-600";
                                                            break;
                                                        case BlogPermission.ByPassword:
                                                            Icon = Lock;
                                                            label = "密码保护";
                                                            colorClass = "text-amber-600";
                                                            break;
                                                        case BlogPermission.List:
                                                            Icon = List;
                                                            label = "列表可见";
                                                            colorClass = "text-blue-600";
                                                            break;
                                                        case BlogPermission.AllowComments:
                                                            Icon = MessageSquare;
                                                            label = "允许评论";
                                                            colorClass = "text-purple-600";
                                                            break;
                                                    }

                                                    return (
                                                        <TooltipProvider key={p}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Icon className={`h-4 w-4 ${colorClass}`} />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{label}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    );
                                                })}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {blog.contentUrl ? (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <a
                                                                href={blog.contentUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex items-center gap-1 text-xs text-blue-600 hover:underline max-w-32 truncate"
                                                            >
                                                                <ExternalLink className="h-3 w-3 shrink-0" />
                                                                链接
                                                            </a>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="max-w-64 break-all">{blog.contentUrl}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString() : '-'}
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
                                                    <BlogEdit id={blog.id} onRefresh={refresh}>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                            编辑博客
                                                        </DropdownMenuItem>
                                                    </BlogEdit>
                                                    {blog.permissions.includes(BlogPermission.ByPassword) && (
                                                        <SetPasswordDialog id={blog.id} slug={blog.slug}>
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                设置密码
                                                            </DropdownMenuItem>
                                                        </SetPasswordDialog>
                                                    )}
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                        onClick={() => setDeleteBlogId(blog.id)}
                                                    >
                                                        删除博客
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

            <AlertDialog open={!!deleteBlogId} onOpenChange={(open) => !open && setDeleteBlogId('')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除该博客？</AlertDialogTitle>
                        <AlertDialogDescription>
                            此操作不可撤销。该博客将被永久删除或移动到废纸篓。
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