import fetcher from "../../fetcher";

export async function remove(userId: string) {
    return fetcher(`/api/admin/user/${userId}`, {
        method: 'DELETE',
    })
} 