import { serverFetch } from "../server";

export async function list() {
    return serverFetch('/api/blog')
}