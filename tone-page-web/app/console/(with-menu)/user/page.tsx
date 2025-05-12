'use client';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from "@/components/ui/tooltip";
import { useUserList } from "@/hooks/admin/user/use-user-list";
import { useState } from "react";
import { UserInfoEditor } from "./components/user-info-editor";
import { User } from "@/lib/types/user";


export default function Page() {
    const { users, isLoading, error, total, page, pageSize, mutate } = useUserList();
    const [editorUserId, setEditorUserId] = useState("");

    const handleUserUpdate = async (newUser: User) => {
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

    const handleUserDelete = async (userId: string) => {
        await mutate(
            (data) => {
                if (!data) return data;
                return {
                    ...data,
                    items: data.items.filter((user) => user.userId !== userId),
                };
            },
            {
                revalidate: false,
            }
        )
    }

    return (
        <>
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
                                    <Button className="cursor-pointer" variant='outline' size='sm' onClick={() => setEditorUserId(user.userId)}>编辑</Button>
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
            </Table>

            <UserInfoEditor
                onClose={() => setEditorUserId('')}
                userId={editorUserId}
                onUserUpdate={handleUserUpdate}
                onUserDelete={handleUserDelete}
            />
        </>
    )
}