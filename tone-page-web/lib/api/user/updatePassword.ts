import fetcher from "../fetcher";

export async function updatePassword(password: string) {
    return fetcher(`/api/user/password`, {
        method: 'PUT',
        body: JSON.stringify({
            password: password,
        }),
    })
}