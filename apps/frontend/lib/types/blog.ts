import { BlogPermission } from "./Blog.Permission.enum";

export interface Blog {
    id: string;
    title: string;
    slug: string;
    description: string;
    viewCount: number;
    content?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    permissions: BlogPermission[];
}