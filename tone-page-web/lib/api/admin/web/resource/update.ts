import fetcher from "@/lib/api/fetcher";

type UpdateResourceParams = {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    tags: {
        name: string;
        type: string;
    }[];
}

export async function update(id: string, data: UpdateResourceParams) {
    return fetcher(`/api/admin/web/resource/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
}