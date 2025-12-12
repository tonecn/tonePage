import fetcher from "../../fetcher";

export async function remove(userId: string, soft: boolean) {
    return fetcher(`/api/admin/user/${userId}?soft=${soft}`, {
        method: 'DELETE',
    })
} 