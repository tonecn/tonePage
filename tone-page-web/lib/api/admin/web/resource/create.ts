import fetcher from "@/lib/api/fetcher";

type CreateResourceParams = {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    tags: {
        name: string;
        type: string;
    }[];
}

export async function create(data: CreateResourceParams) {
    return fetcher('/api/admin/web/resource', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}