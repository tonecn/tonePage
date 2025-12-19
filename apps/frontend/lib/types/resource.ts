export type TagType = {
    name: string;
    type: string;
}

export interface PublicResource {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    tags: TagType[];
}

export interface Resource {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    tags: TagType[];
    createdAt: Date;
    updatedAt: Date;
}