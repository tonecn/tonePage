import { Role } from "./role";

export interface User {
    userId: string;
    username: string;
    nickname: string;
    email?: string;
    phone?: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    roles: Role[];
}