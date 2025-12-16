import { serverFetch } from "../server";

export type ResourceTagType = {
    name: string;
    type: string;
}

export interface Resource {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    tags: ResourceTagType[];
}

export async function list() {
    return serverFetch<Resource[]>('/api/resource')
}