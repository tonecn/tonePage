import { User } from "./user";

export interface BlogComment {
    id: string;
    blogId: string;
    content: string;
    createdAt: string;
    deletedAt: string | null;
    parentId: string | null;
    user: User | null;
}