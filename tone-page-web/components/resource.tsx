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
            className="text-[10px] text-zinc-500 font-medium py-[1px] px-1.5 rounded-full flex items-center gap-1"
            style={{
                backgroundColor: (() => {
                    switch (tag.type) {
                        case 'os':
                            return '#dbedfd';
                        default:
                            return '#e4e4e7';
                    }
                })()
            }}
            {...props}
        >
            <span className="text-nowrap">{tag.name}</span>
            {
                editMode && (
                    <span onClick={() => onClose?.(tag.name)}><X className="w-3 h-3 text-zinc-800 cursor-pointer" /></span>
                )
            }
        </div>
    )
}