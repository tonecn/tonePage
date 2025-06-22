'use client';

import { BlogApi } from "@/lib/api";
import { base62 } from "@/lib/utils";
import { useParams, useSearchParams } from "next/navigation";
import useSWR from "swr";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import rehypeRaw from 'rehype-raw'
import { Skeleton } from "@/components/ui/skeleton";
import { BlogComments } from "./components/BlogComments";
import Image from "next/image";

export default function Blog() {
    const params = useParams();
    const searchParams = useSearchParams();

    const hex = Array.from(base62.decode(params.id as string)).map(b => b.toString(16).padStart(2, '0')).join('');
    const id = [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20, 32)
    ].join('-');

    const password = searchParams.get('p');
    const { data, error, isLoading } = useSWR(
        `/api/blog/${id}`,
        () => BlogApi.get(id, {
            password: password || undefined,
        }),
    )

    return (
        <div className="w-full overflow-x-hidden">
            <div className="max-w-200 mx-auto px-5 overflow-x-hidden mb-10">
                {error && <div className="my-20 text-center text-zinc-600">{error.message}</div>}
                {isLoading && (
                    <div className="flex flex-col gap-2 mt-10">
                        <Skeleton className="w-full h-10" />
                        <Skeleton className="w-full h-20" />
                        <Skeleton className="w-full h-10" />
                        <Skeleton className="w-full h-20" />
                        <Skeleton className="w-full h-30" />
                    </div>
                )}
                {data && (
                    <>
                        <h1 className="text-center text-3xl font-bold mt-10">{data.title}</h1>
                        <p className="text-sm text-zinc-500 text-center my-5">发布于：{new Date(data.createdAt).toLocaleString()}</p>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeHighlight]}
                            components={{
                                h1: ({ ...props }) => <h1 className="text-3xl font-bold py-2" {...props} />,
                                h2: ({ ...props }) => <h2 className="text-2xl font-bold py-1" {...props} />,
                                h3: ({ ...props }) => <h3 className="text-xl font-bold py-0.5" {...props} />,
                                h4: ({ ...props }) => <h4 className="text-lg font-bold" {...props} />,
                                h5: ({ ...props }) => <h5 className="text-md font-bold" {...props} />,
                                p: ({ ...props }) => <p className="py-1 text-zinc-700" {...props} />,
                                img: ({ src }) => (
                                    <PhotoProvider className="w-full">
                                        <PhotoView src={src as string}>
                                            <Image src={src as string} fill alt="加载失败" />
                                        </PhotoView>
                                    </PhotoProvider>
                                ),
                                th: ({ ...props }) => <th className="text-ellipsis text-nowrap border border-zinc-300 p-2" {...props} />,
                                td: ({ ...props }) => <td className="border border-zinc-300 p-1" {...props} />,
                                table: ({ ...props }) => <div className="overflow-x-auto"><table {...props} /></div>,
                                pre: ({ ...props }) => <pre className="rounded-sm overflow-hidden shadow" {...props} />,
                                blockquote: ({ ...props }) => <blockquote className="pl-3 border-l-5" {...props} />,
                                a: ({ ...props }) => <a className="hover:underline" {...props} />,
                            }}
                        >{data.content}</ReactMarkdown>
                    </>
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