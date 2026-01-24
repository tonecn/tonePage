import { Role } from "./role";

export interface User {
    userId: string;
    username: string;
    nickname: string;
    email: string | null;
    phone: string | null;
    avatar: string | null;
    createdAt: string;
    roles: Role[];
}

export interface AdminUser extends User {
    updatedAt: string;
    deletedAt: string | null;
}