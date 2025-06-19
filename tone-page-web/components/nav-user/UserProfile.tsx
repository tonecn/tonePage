import { DialogProps } from "@radix-ui/react-dialog";
import React, { FC } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";

interface UserProfileProps {

}

export default function ({ onOpenChange, ...props }: UserProfileProps & React.ComponentProps<FC<DialogProps>>) {
    return (
        <Dialog onOpenChange={onOpenChange} {...props}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>账户信息</DialogTitle>
                    <DialogDescription>
                        新密码长度在6-32位之间，且至少包含一个字母和一个数字，可以包含特殊字符
                    </DialogDescription>
                </DialogHeader>

                <div>
                    开发中...
                </div>

                <DialogFooter>
                    <Button type="button" variant='secondary' onClick={() => onOpenChange?.(false)}>返回</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}