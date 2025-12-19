"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode, useCallback, useEffect, useState } from "react"

interface HumanVerificationProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess?: () => void;
    onFail?: (reason?: string) => void;
    children: ReactNode;
}

export function HumanVerification({ open, onOpenChange, onSuccess, children }: HumanVerificationProps) {
    const [i_open, i_setOpen] = useState(false);
    const setOpen = useCallback((o: boolean) => {
        i_setOpen(o);
        onOpenChange?.(o);
    }, [onOpenChange]);

    useEffect(() => {
        if (i_open) {
            setOpen(false);
            onSuccess?.();
        }
    }, [i_open, onSuccess, setOpen]);

    return (
        <Dialog open={open ?? i_open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-80">
                <DialogHeader>
                    <DialogTitle>人机验证</DialogTitle>
                    <DialogDescription>
                        请拖动滑块以使得图片水平
                    </DialogDescription>
                </DialogHeader>
                <div>

                </div>
            </DialogContent>
        </Dialog>
    )
}