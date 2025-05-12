import fetcher from "../../fetcher";

export async function setPassword(userId: string, password: string) {
    return fetcher(`/admin/user/${userId}/password`, {
        method: 'POST',
        body: JSON.stringify({
            password,
        }),
    })
}