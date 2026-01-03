import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ResourceBadgeProps extends React.HTMLProps<HTMLDivElement> {
    tag: { name: string; type: string | 'os' };
    editMode?: boolean;
    onClose?: (name: string) => void;
}

export function ResourceBadge({ tag, editMode, onClose, ...props }: ResourceBadgeProps) {
    return (
        <div
            id={tag.name}
            className={cn(
                "text-[10px] text-zinc-500 dark:text-zinc-300 dark:border font-medium py-px px-1.5 rounded-full flex items-center gap-1",
                'bg-[#e4e4e7] dark:bg-[#2d2d30]',
                tag.type === 'os' || 'bg-[#dbedfd] dark:bg-[#1e3a5f]',
            )}
            {...props}
        >
            <span className="text-nowrap">{tag.name}</span>
            {
                editMode && (
                    <span onClick={() => onClose?.(tag.name)}><X className="w-3 h-3 text-zinc-800 dark:text-zinc-200 cursor-pointer" /></span>
                )
            }
        </div>
    )
}