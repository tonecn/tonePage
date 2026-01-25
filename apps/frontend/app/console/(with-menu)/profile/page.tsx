'use client';

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { useUserStore } from "@/store/useUserStore";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ReactElement, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { handleAPIError } from "@/lib/api/common";
import { startRegistration } from '@simplewebauthn/browser';
import { toast } from "sonner";
import { getPasskeyRegisterOptions } from "@/lib/api/actions";
import useSWR from "swr";
import { getPasskeys, passkeyRegister, passkeyDelete } from "@/lib/api/actions/auth.action";

export default function Page() {
    const userStore = useUserStore();
    const user = userStore.user;

    return (
        <div className="w-full">
            <form onSubmit={e => {
                e.preventDefault();
            }}>
                <FieldGroup className="gap-5">
                    <FieldSet>
                        <FieldLegend>账户基础信息</FieldLegend>
                        <FieldDescription>这是当前账户的基础信息</FieldDescription>
                        <FieldGroup className="gap-5">
                            {
                                [
                                    {
                                        name: 'username',
                                        localName: '用户名',
                                        required: true,
                                        defaultValue: user?.username,
                                    },
                                    {
                                        name: 'nickname',
                                        localName: '昵称',
                                        required: true,
                                        defaultValue: user?.nickname,
                                    },
                                    {
                                        name: 'email',
                                        localName: '电子邮箱',
                                        required: false,
                                        defaultValue: user?.email,
                                    },
                                    {
                                        name: 'phone',
                                        localName: '手机号',
                                        required: false,
                                        defaultValue: user?.phone,
                                        description: '当前仅支持中国大陆（+86）手机号'
                                    },
                                ].map(({ name, localName, required, defaultValue, description }) => (
                                    <Field key={name} className="gap-2">
                                        <FieldLabel htmlFor={`console-profile-${name}`} className="text-zinc-800">
                                            {localName}
                                        </FieldLabel>
                                        <Input
                                            id={`console-profile-${name}`}
                                            name={name}
                                            defaultValue={defaultValue ?? ''}
                                            placeholder={localName}
                                            required={required}
                                            disabled
                                        />
                                        {
                                            description && (
                                                <FieldDescription>
                                                    {description}
                                                </FieldDescription>
                                            )
                                        }
                                    </Field>
                                ))
                            }
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button type="submit" disabled>保存</Button>
                        <Button variant="outline" type="button" disabled>
                            编辑
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
            <FieldSeparator className="mt-2 mb-2" />
            <FieldGroup className="gap-5">
                <FieldSet>
                    <FieldLegend>通行证列表</FieldLegend>
                    <FieldDescription>
                        通行证（PassKey），一种先进的无密码身份验证技术。
                    </FieldDescription>
                    <PasskeyContent></PasskeyContent>
                </FieldSet>
            </FieldGroup>
        </div>
    )
}

function PasskeyContent() {
    const { data, isLoading, error, mutate } = useSWR(
        'get-passkeys',
        () => getPasskeys(),
    )

    return (
        <>
            <PasskeyList data={data} isLoading={isLoading} error={error} onDeleted={() => mutate()} />
            <div>
                <AddPasskeyDialog onSuccess={() => mutate()}>
                    <Button>添加通行证</Button>
                </AddPasskeyDialog>
            </div>
        </>
    )
}


interface AddPasskeyDialogProps {
    children: ReactElement;
    onSuccess?: () => unknown | Promise<unknown>;
}
function AddPasskeyDialog({ children, onSuccess }: AddPasskeyDialogProps) {
    const [open, setOpen] = useState(false);

    const handleSubmit = async (name: string) => {
        try {
            name = name.trim();
            if (name.length === 0) {
                throw new Error('通行证名称不能为空')
            }

            const options = await getPasskeyRegisterOptions();
            const credential = await startRegistration({ optionsJSON: options }).catch(() => null);
            if (credential === null) {
                throw new Error('认证失败');
            }

            const registerRes = await passkeyRegister(name, credential);
            if (registerRes.id) {
                toast.success('添加成功');
                setOpen(false);
                await onSuccess?.();
            }
        } catch (error) {
            console.log(error)
            handleAPIError(({ message }) => toast.error(message));
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-100">
                <DialogHeader>
                    <DialogTitle>添加通行证</DialogTitle>
                    <DialogDescription>
                        如果能添加成功，则说明您的设备支持；如果添加失败了，说明您的设备不支持😊
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSubmit(formData.get('name')?.toString() || '');
                }}>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="console-add-passkey-name">通行证名称</Label>
                            <Input id="console-add-passkey-name" name="name" required />
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button variant="outline">取消</Button>
                        </DialogClose>
                        <Button type="submit">下一步</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}

interface PasskeyListProps {
    data: { id: string; name: string; createdAt: string }[] | undefined;
    isLoading: boolean;
    error: any;
    onDeleted?: () => unknown | Promise<unknown>;
}

function PasskeyList({ data, isLoading, error, onDeleted }: PasskeyListProps) {
    return (
        <Table>
            {data && data.length === 0 && <TableCaption>暂无Passkey</TableCaption>}
            {isLoading && <TableCaption>加载中...</TableCaption>}
            {error && <TableCaption>{error.message}</TableCaption>}
            <TableHeader>
                <TableRow>
                    <TableHead>名称</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data && data.map(p => (
                        <TableRow key={p.id}>
                            <TableCell className="font-medium">{p.id}</TableCell>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                                <DeletePasskeyDialog id={p.id} name={p.name} onSuccess={onDeleted}>
                                    <Button>删除</Button>
                                </DeletePasskeyDialog>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}

interface DeletePasskeyDialogProps {
    id: string;
    name: string;
    children: ReactElement;
    onSuccess?: () => unknown | Promise<unknown>;
}

function DeletePasskeyDialog({ id, name, children, onSuccess }: DeletePasskeyDialogProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await passkeyDelete(id);
            toast.success('删除成功');
            setOpen(false);
            await onSuccess?.();
        } catch (error) {
            console.log(error);
            handleAPIError(({ message }) => toast.error(message));
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-100">
                <DialogHeader>
                    <DialogTitle>确认删除通行证</DialogTitle>
                    <DialogDescription>
                        确认删除后，将无法使用该通行证登录。<br />
                        通行证名称：{name}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">取消</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete}>删除</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}