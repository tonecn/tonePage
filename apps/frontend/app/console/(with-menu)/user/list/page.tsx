'use client';

import { useState } from 'react';
import { useUserList } from "@/hooks/admin/user/use-user-list";
import { CreateUserEditor } from "./components/create-user-editor";
import { UserInfoEditor } from "./components/user-info-editor";
import { Button } from "@/components/ui/button";
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
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
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
import { AdminUser } from "@/lib/types/user";
import { api } from "@/lib/api";
import { Search, Plus, Pencil, Trash2, MoreHorizontal, ShieldAlert, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApiError } from 'next/dist/server/api-utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function UserListPage() {
    // State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchInput, setSearchInput] = useState('');
    const [query, setQuery] = useState('');

    const { users, total, isLoading, mutate, refresh } = useUserList({
        page,
        pageSize,
        query
    });

    const totalPages = Math.ceil(total / pageSize);

    // Editors State
    const [editorUserId, setEditorUserId] = useState<string>('');
    const [passwordUserId, setPasswordUserId] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [deleteUserId, setDeleteUserId] = useState<string>('');
    const [isSoftDelete, setIsSoftDelete] = useState(true);

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

    const handleUserUpdateLocal = async (newUser: AdminUser) => {
        await mutate(
            (data) => {
                if (!data) return data;
                return {
                    ...data,
                    items: data.items.map((user) =>
                        user.userId === newUser.userId ? newUser : user
                    ),
                };
            },
            { revalidate: false }
        )
    }

    const handleUserDeleteLocal = async (userId: string, soft: boolean) => {
        await mutate(
            (data) => {
                if (!data) return data;
                return soft ? {
                    ...data,
                    items: data.items.map(u => u.userId === userId ? { ...u, deletedAt: new Date().toISOString() } : u)
                } : {
                    ...data,
                    items: data.items.filter((user) => user.userId !== userId),
                };
            },
            { revalidate: false }
        )
    }

    const handleUserDelete = async (userId: string) => {
        try {
            await api.admin.user.delete(userId, isSoftDelete);
            toast.success(isSoftDelete ? '注销成功' : '删除成功');
            handleUserDeleteLocal(userId, isSoftDelete);
            setDeleteUserId('');
        } catch (error) {
            toast.error((error as ApiError).message || '操作失败');
        }
    }

    const handleSetPassword = async () => {
        try {
            await api.admin.user.setPassword(passwordUserId, newPassword);
            toast.success("密码修改成功");
            setPasswordUserId('');
            setNewPassword('');
        } catch (error) {
            toast.error((error as ApiError).message || "密码修改失败");
        }
    }

    const handlePermissionEdit = (userId: string) => {
        toast.info("权限编辑功能开发中...");
        // TODO: Open Permission Editor Dialog
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxVisible = 5;
        let startPage = Math.max(1, page - 2);
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        isActive={page === i}
                        onClick={() => setPage(i)}
                        className="cursor-pointer"
                    >
                        {i}
                    </PaginationLink>
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
                    <h1 className="text-2xl font-bold tracking-tight">用户管理</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        管理系统用户账户、角色及权限配置
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="搜索账户、昵称、邮箱..."
                            className="pl-9"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <Button onClick={handleSearch} variant="secondary">搜索</Button>
                    <CreateUserEditor onRefresh={refresh}>
                        <Button><Plus className="mr-2 h-4 w-4" /> 新增</Button>
                    </CreateUserEditor>
                </div>
            </div>

            {/* Content */}
            <div className="border rounded-lg shadow-sm bg-card flex-1">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-75">用户</TableHead>
                            <TableHead>联系方式</TableHead>
                            <TableHead>注册时间</TableHead>
                            <TableHead>状态</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="flex gap-3"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div></div></TableCell>
                                    <TableCell><div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-12 rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    暂无用户数据
                                    {query && <Button variant="link" onClick={handleClearSearch} className="ml-2">清除搜索</Button>}
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.userId}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatar ?? ''} />
                                                <AvatarFallback>{user.nickname?.[0]?.toUpperCase() || user.username[0]?.toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium truncate max-w-37.5" title={user.nickname}>{user.nickname || user.username}</span>
                                                <span className="text-xs text-muted-foreground truncate max-w-37.5" title={user.username}>@{user.username}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="truncate max-w-45" title={user.email || ''}>{user.email || '-'}</span>
                                            <span className="text-muted-foreground text-xs">{user.phone || '-'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {user.deletedAt ? (
                                            <Badge variant="destructive">已注销</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700 border-green-200">
                                                正常
                                            </Badge>
                                        )}
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
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.username)}>
                                                    复制用户名
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setEditorUserId(user.userId)} disabled={!!user.deletedAt}>
                                                    <Pencil className="mr-2 h-4 w-4" /> 编辑资料
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => { setPasswordUserId(user.userId); setNewPassword(''); }} disabled={!!user.deletedAt}>
                                                    <KeyRound className="mr-2 h-4 w-4" /> 修改密码
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handlePermissionEdit(user.userId)} disabled={!!user.deletedAt}>
                                                    <ShieldAlert className="mr-2 h-4 w-4" /> 权限管理
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {user.deletedAt ? (
                                                    <DropdownMenuItem onClick={() => { setDeleteUserId(user.userId); setIsSoftDelete(false); }} className="text-red-600 focus:text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" /> 彻底删除
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => { setDeleteUserId(user.userId); setIsSoftDelete(true); }} className="text-red-600 focus:text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" /> 注销账号
                                                    </DropdownMenuItem>
                                                )}

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <PaginationPrevious className="pl-0" />
                            </Button>
                        </PaginationItem>

                        {renderPaginationItems()}

                        <PaginationItem>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                <PaginationNext className="pr-0" />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            {/* Editors */}
            <UserInfoEditor
                onClose={() => setEditorUserId('')}
                userId={editorUserId}
                onUserUpdate={handleUserUpdateLocal}
            />

            <Dialog open={!!passwordUserId} onOpenChange={(o) => !o && setPasswordUserId('')}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>修改密码</DialogTitle>
                        <DialogDescription>
                            密码支持字母、数字及常见特殊字符，且长度在6~32之间。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="password">新密码</Label>
                            <Input
                                id="password"
                                type="text"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="请输入新的密码"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setPasswordUserId('')}>取消</Button>
                        <Button type="button" onClick={handleSetPassword}>保存密码</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteUserId} onOpenChange={(o) => !o && setDeleteUserId('')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{isSoftDelete ? '确认要注销该账号吗?' : '确认彻底删除?'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {isSoftDelete
                                ? '注销后该用户将无法通过此账号登录系统，但数据仍会保留。'
                                : '此操作不可逆，将永久删除该用户的账号及所有相关数据。'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleUserDelete(deleteUserId)}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isSoftDelete ? '确认注销' : '彻底删除'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
