import { BlogPermission } from "./Blog.Permission.enum";

export interface Blog {
    id: string;
    title: string;
    description: string;
    viewCount: number;
    contentUrl: string;
    createdAt: string;
    permissions: BlogPermission[];
}