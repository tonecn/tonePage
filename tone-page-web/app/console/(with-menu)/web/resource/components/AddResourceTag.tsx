"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";

interface AddResourceTagProps {
    children: React.ReactNode;
    onTagAdd: (tag: { name: string; type: string }) => void;
}

export default function AddResourceTag({ onTagAdd, children }: AddResourceTagProps) {
    const [open, setOpen] = useState(false);
    const [tag, setTag] = useState({ name: '', type: 'default' });

    function handleSetOpen(open: boolean) {
        setOpen(open);
        if (open) {
            setTag({ name: '', type: 'default' });
        }
    }

    return (
        <Popover open={open} onOpenChange={handleSetOpen}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">添加标签</h4>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="add-tag-name">内容</Label>
                            <Input
                                id="add-tag-name"
                                className="col-span-2 h-8"
                                value={tag.name}
                                onChange={(e) => setTag({ ...tag, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="add-tag-type">类型</Label>
                            <Select onValueChange={v => setTag({ ...tag, type: v })} defaultValue="default">
                                <SelectTrigger className="w-[185px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">默认</SelectItem>
                                    <SelectItem value="os">OS</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={() => {
                            onTagAdd({
                                ...tag,
                            });
                            setOpen(false);
                        }}>添加</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}