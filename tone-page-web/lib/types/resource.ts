export type TagType = {
    id: string;
    name: string;
    color: string;
}

export interface Resource {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    tags: TagType[];
}