'use client';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from "@/components/ui/tooltip";
import { useUserList } from "@/hooks/admin/user/use-user-list";
import { useState } from "react";
import { UserInfoEditor } from "./components/user-info-editor";
import { User } from "@/lib/types/user";
import { CreateUserEditor } from "./components/create-user-editor";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ApiError } from "next/dist/server/api-utils";
import { AdminAPI } from "@/lib/api/client";


export default function Page() {
    const { users, isLoading, error, mutate, refresh } = useUserList();
    const [editorUserId, setEditorUserId] = useState("");

    const handleUserUpdateLocal = async (newUser: User) => {
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
            {
                revalidate: false,
            }
        )
    }

    const handleUserDeleteLocal = async (userId: string, soft: boolean) => {
        await mutate(
            (data) => {
                if (!data) return data;
                return soft ? {
                    ...data,
                    items: data.items.map(u => u.userId === userId ? { ...u, deletedAt: new Date().toLocaleString() } : u)
                } : {
                    ...data,
                    items: data.items.filter((user) => user.userId !== userId),
                };
            },
            {
                revalidate: false,
            }
        )
    }

    const [deletedUserId, setDeletedUserId] = useState('');
    const handleUserDelete = async (userId: string) => {
        try {
            await AdminAPI.removeUser(userId, false);
            toast.success('删除成功');
            handleUserDeleteLocal(userId, false);
            setDeletedUserId('');
        } catch (error) {
            toast.error((error as ApiError).message || '删除失败');
        }
    }

    return (
        <>
            <div>
                <CreateUserEditor onRefresh={() => refresh()}>
                    <Button >新增用户</Button>
                </CreateUserEditor>
            </div>
            <Table>
                {error && <TableCaption>{error.message}</TableCaption>}
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">userId</TableHead>
                        <TableHead>账户</TableHead>
                        <TableHead>昵称</TableHead>
                        <TableHead>邮箱</TableHead>
                        <TableHead>手机号</TableHead>
                        <TableHead>操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        users.map((user) => (
                            <TableRow key={user.userId}>
                                <TableCell className="font-medium">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="max-w-[100px] overflow-hidden text-ellipsis">{user.userId}</div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{user.userId}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.nickname}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>
                                    {user.deletedAt
                                        ? <Button className="cursor-pointer" variant='destructive' size='sm'
                                            onClick={() => setDeletedUserId(user.userId)}>删除</Button>
                                        : <Button className="cursor-pointer" variant='outline' size='sm'
                                            onClick={() => setEditorUserId(user.userId)}>编辑</Button>
                                    }
                                </TableCell>
                            </TableRow>
                        ))
                    }

                    {isLoading && (
                        <TableRow>
                            {
                                Array.from({ length: 6 }).map((_, index) => (
                                    <TableCell key={index}>
                                        <Skeleton className="h-10 w-full" />
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    )}
                </TableBody>
            </Table >

            <UserInfoEditor
                onClose={() => setEditorUserId('')}
                userId={editorUserId}
                onUserUpdate={handleUserUpdateLocal}
                onUserSoftDelete={userId => handleUserDeleteLocal(userId, true)}
            />

            <AlertDialog open={!!deletedUserId} onOpenChange={o => !o && setDeletedUserId('')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>是否要彻底删除账号?</AlertDialogTitle>
                        <AlertDialogDescription>
                            该操作无法撤销，会彻底删除该账号相关连的所有数据
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleUserDelete(deletedUserId)}>删除</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}