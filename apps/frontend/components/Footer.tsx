import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Mail } from "lucide-react";
import { Button } from "./ui/button";

const EMAIL = "tonesc.cn@gmail.com";

export default function Footer() {
    return (
        <footer className="border-t border-zinc-300">
            <div className="bg-zinc-50 px-4 py-3 md:py-5 sm:px-10 md:px-20 flex flex-col sm:flex-row justify-between items-center gap-4 transition-all">
                {/* 版权与备案信息 */}
                <div className="text-center sm:text-left">
                    <a
                        href="https://beian.miit.gov.cn/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-zinc-500 hover:text-zinc-700 hover:underline focus:outline-none focus:underline"
                    >
                        备案号：渝ICP备2023009516号-1
                    </a>
                    <p className="mt-1 text-sm text-zinc-500">
                        © {new Date().getFullYear()} TONE Page. All rights reserved.
                    </p>
                </div>

                {/* 联系方式弹出框 */}
                <address className="not-italic">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant='outline' size='sm' >
                                <Mail className="text-zinc-600" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit">
                            <a
                                href={`mailto:${EMAIL}`}
                                className="text-sm text-zinc-800 hover:underline focus:outline-none focus:underline"
                            >
                                {EMAIL}
                            </a>
                        </PopoverContent>
                    </Popover>
                </address>
            </div>
        </footer>
    );
}