export type BlogPermission =
    'public' |
    'password' |
    'listed';

export interface Blog {
    id: string;
    title: string;
    description: string;
    publish_at: string;
    permissions: BlogPermission[];
}