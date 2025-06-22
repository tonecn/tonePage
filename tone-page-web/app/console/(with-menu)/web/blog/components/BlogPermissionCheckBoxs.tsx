import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BlogPermission } from "@/lib/types/Blog.Permission.enum";

const blogPermissions = [
    {
        permission: BlogPermission.Public,
        localText: '公开可读',
    },
    {
        permission: BlogPermission.ByPassword,
        localText: '受密码保护',
    },
    {
        permission: BlogPermission.List,
        localText: '显示在列表中',
    },
] as const;

interface BlogPermissionCheckBoxsProps {
    permissions: BlogPermission[];
    onCheckedChange: (permission: BlogPermission, newState: boolean) => void;
}

export function BlogPermissionCheckBoxs({ permissions, onCheckedChange }: BlogPermissionCheckBoxsProps) {
    return (
        <div className="flex gap-3 gap-x-8 flex-wrap">
            {
                blogPermissions.map((v, i) => (
                    <div key={`blog-permission-option-${i}`} className="flex gap-2">
                        <Checkbox
                            id={`blog-permission-option-checkbox-${i}`}
                            checked={permissions.includes(v.permission)}
                            onCheckedChange={newChecked => onCheckedChange(v.permission, !!newChecked)} />
                        <Label htmlFor={`blog-permission-option-checkbox-${i}`} className="whitespace-nowrap">{v.localText}</Label>
                    </div>
                ))
            }
        </div>
    )
}