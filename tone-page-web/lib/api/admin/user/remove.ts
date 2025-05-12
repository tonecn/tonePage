import fetcher from "../../fetcher";

export async function remove(userId: string) {
    return fetcher(`/admin/user/${userId}`, {
        method: 'DELETE',
    })
} 