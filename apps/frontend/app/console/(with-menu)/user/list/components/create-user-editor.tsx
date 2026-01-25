import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { toast } from "sonner";
import { ApiError } from "next/dist/server/api-utils";
import { api } from "@/lib/api";
import { UserForm } from "./user-form";
import { CreateUserValues } from "./user-schema";

interface CreateUserEditorProps {
    children: React.ReactNode;
    onRefresh: () => void;
}

export function CreateUserEditor({ children, onRefresh }: CreateUserEditorProps) {
    const [open, setOpen] = useState(false);
    const handleSubmit = async (values: CreateUserValues) => {
        try {
            await api.admin.user.create({
                username: values.username,
                nickname: values.nickname,
                email: values.email,
                phone: values.phone,
                password: values.password,
            });
            setOpen(false);
            toast.success('创建成功')
            onRefresh();
        } catch (error) {
            toast.error((error as ApiError).message || '创建失败')
        }
    }

    return (
        <>
            <div onClick={() => setOpen(true)} className="cursor-pointer">
                {children}
            </div>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="sm:max-w-md flex flex-col h-full">
                    <SheetHeader>
                        <SheetTitle>新增用户</SheetTitle>
                        <SheetDescription>
                            创建一个新的用户账户。
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-5">
                        <UserForm onSubmit={handleSubmit} />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}