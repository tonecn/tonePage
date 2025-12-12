export type TagType = {
    name: string;
    type: string;
}

export interface Resource {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    tags: TagType[];
}