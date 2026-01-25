import { BlogContent } from "./BlogContent";
import { APIError, safeCall } from "@/lib/api/common";
import { BlogComments } from "./components/BlogComments";
import { getBlogBySlug } from "@/lib/api/server";

interface PageRouteProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    } | undefined>
}

async function parseBlogParams({ params: paramsPromise, searchParams: searchParamsPromise }: PageRouteProps) {
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

    return {
        id: params.id,
        p: searchParams.p,
    }
}

export async function generateMetadata({ params, searchParams }: PageRouteProps) {
    const res = await parseBlogParams({ params, searchParams });
    const { id, p, errorMsg } = res;

    if (errorMsg) {
        return {
            title: `${errorMsg} - 特恩的日志`,
            description: '出错啦'
        }
    }

    const { data, error } = await safeCall(() => getBlogBySlug(`${id}`, p));
    
    if (data) {
        return {
            title: `${data.title} - 特恩的日志`,
            description: data.description,
            openGraph: {
                title: data.title,
                description: data.description,
                type: 'article',
                publishedTime: data.createdAt,
                modifiedTime: data.updatedAt,
                authors: ['tonesc'],
            },
        }
    } else {
        return {
            title: `${error?.message || '错误'} - 特恩的日志`,
            description: '出错啦'
        }
    }
}

export default async function Page({ params, searchParams }: PageRouteProps) {
    const res = await parseBlogParams({ params, searchParams });
    const { id, p } = res;
    let { errorMsg } = res;

    const { data, error } = errorMsg ? {
        data: null,
        error: new APIError(errorMsg)
    } : await safeCall(() => getBlogBySlug(`${id}`, p));

    return (
        <div className="w-full overflow-x-hidden">
            <div className="max-w-200 mx-auto px-5 overflow-x-hidden mb-10">
                {error && <div className="my-20 text-center text-zinc-600 dark:text-zinc-400">{error.message}</div>}
                {data && (
                    <article className="w-full">
                        <header className="flex flex-col items-center">
                            <h1 className="text-center text-2xl sm:text-3xl font-bold mt-10 transition-all duration-500">{data.title}</h1>
                            <time className="text-sm text-zinc-500 dark:text-zinc-300 text-center my-2 sm:my-5 mb-5 transition-all duration-500">发布于：{new Date(data.createdAt).toLocaleString()}</time>
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