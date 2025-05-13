import fetcher from "../fetcher";

export async function logout() {
    return fetcher('/api/auth/logout', { method: 'POST' });
}