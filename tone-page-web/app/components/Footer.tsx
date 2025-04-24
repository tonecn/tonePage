"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

async function handleCopy(text: string) {
    try {
        await navigator.clipboard.writeText(text);
        toast.success("复制成功");
    } catch (error) {
        toast.error("复制失败");
    }
}

export default function Footer() {
    return (
        <footer className="border-t border-zinc-300 h-3 relative">
            <div className="bg-zinc-50 h-20 flex sm:justify-between justify-center items-center px-20 flex-col sm:flex-row">
                <div className="flex flex-col items-center sm:block">
                    <a href="https://beian.miit.gov.cn/" className="text-sm text-zinc-500 hover:border-zinc-500 border-b border-transparent">备案号：渝ICP备2023009516号-1</a>
                    <div className="text-sm text-zinc-500 cursor-default">© 2025 TONE Page. All rights reserved.</div>
                </div>
                <div>
                    <Popover>
                        <PopoverTrigger>
                            <div className="cursor-pointer text-zinc-600 hover:border-zinc-600 border-b border-transparent">联系我</div>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 mr-5">
                            <div className="flex items-center">
                                <div className="text-sm">电子邮箱:</div>
                                <Button variant="link" className="cursor-pointer select-text" onClick={() => handleCopy('tone@ctbu.net.cn')}>tone@ctbu.net.cn</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </footer>
    )
}

