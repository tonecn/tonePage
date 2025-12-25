import { base62 } from "@/lib/utils";
import { BlogContent } from "./BlogContent";
import { BlogAPI } from "@/lib/api/server";
import { handleAPIError } from "@/lib/api/common";
import { BlogComments } from "./components/BlogComments";

interface PageRouteProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    } | undefined>
}

export async function parseBlogParams({ params: paramsPromise, searchParams: searchParamsPromise }: PageRouteProps) {
    const params = await paramsPromise ?? {};
    const searchParams = await searchParamsPromise ?? {};

    if (Array.isArray(searchParams.p)) {
        return {
            errorMsg: '密码错误或文章不存在'
        }
    }

    if (typeof params.id !== 'string' || params.id.trim() === '') {
        return {
            errorMsg: '文章不存在或无权限访问'
        }
    }

    const hex = Array.from(base62.decode(params.id as string)).map(b => b.toString(16).padStart(2, '0')).join('');
    const id = [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20, 32)
    ].join('-');

    return {
        id,
        p: searchParams.p,
    }
}

export async function getBlog(paramsResult: ReturnType<typeof parseBlogParams>) {
    const { errorMsg, id, p } = await paramsResult;
    if (errorMsg) {
        return {
            errorMsg,
        }
    } else {
        try {
            const data = await BlogAPI.getBlog(`${id}`, p);
            return {
                data,
            }
        } catch (error) {
            return {
                errorMsg: handleAPIError(error, ({ message }) => message)
            }
        }
    }
}

export async function generateMetadata({ params, searchParams }: PageRouteProps) {
    const { errorMsg, data } = await getBlog(parseBlogParams({ params, searchParams }));
    if (data) {
        return {
            title: `${data.title} - 特恩的日志`,
            description: `${data.description}`
        }
    } else {
        return {
            title: `${errorMsg || '错误'} - 特恩的日志`,
            description: `出错啦`
        }
    }
}

export default async function Page({ params, searchParams }: PageRouteProps) {
    let { errorMsg, id, p } = await parseBlogParams({ params, searchParams });

    const data = errorMsg ? null
        : await BlogAPI.getBlog(`${id}`, p).catch(e => handleAPIError(e, ({ message }) => { errorMsg = message; return null }));

    return (
        <div className="w-full overflow-x-hidden">
            <div className="max-w-200 mx-auto px-5 overflow-x-hidden mb-10">
                {errorMsg && <div className="my-20 text-center text-zinc-600">{errorMsg}</div>}
                {data && (
                    <article className="w-full">
                        <header className="flex flex-col items-center">
                            <h1 className="text-center text-2xl sm:text-3xl font-bold mt-10 transition-all duration-500">{data.title}</h1>
                            <time className="text-sm text-zinc-500 text-center my-2 sm:my-5 mb-5 transition-all duration-500">发布于：{new Date(data.createdAt).toLocaleString()}</time>
                        </header>
                        <BlogContent content={data.content} />
                    </article>
                )}

                {data && (
                    <>
                        <div className="border my-5"></div>
                        <BlogComments blogId={data.id} />
                    </>
                )}
            </div>
        </div>
    )
}