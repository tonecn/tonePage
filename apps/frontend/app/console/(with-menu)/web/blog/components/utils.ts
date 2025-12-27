import { BlogPermission } from "@/lib/types/Blog.Permission.enum";
import { toast } from "sonner";

export function handleCopyShareURL(data: {
    slug: string;
    password: string;
    permissions: BlogPermission[];
}) {
    const slug = data.slug.trim();
    const password = data.password.trim();
    const permissions = data.permissions;

    if (slug.length === 0) {
        return toast.warning('请先填写Slug')
    }

    let url = `${window.location.origin}/blog/${slug}`;

    if (permissions.includes(BlogPermission.ByPassword)) {
        if (password.length === 0) {
            return toast.warning('开启了密码保护，但无法获取有效的密码，无法生成有效URL')
        } else {
            url += `?p=${password}`;
        }
    }

    navigator.clipboard.writeText(url).then(() => {
        toast.success('复制成功');
    }, () => {
        toast.error('复制失败，请手动复制');
    });
};