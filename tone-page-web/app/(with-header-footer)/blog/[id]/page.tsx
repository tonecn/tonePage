'use client';

import { BlogApi } from "@/lib/api";
import { base62 } from "@/lib/utils";
import { useParams } from "next/navigation";
import useSWR from "swr";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export default function Blog() {
    const params = useParams();
    const hex = Array.from(base62.decode(params.id as string)).map(b => b.toString(16).padStart(2, '0')).join('');
    const id = [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20, 32)
    ].join('-');

    const { data, error, isLoading } = useSWR(
        `/api/blog/${id}`,
        () => BlogApi.get(id),
    )

    return (
        <div className="w-full overflow-x-hidden">
            {data && (
                <div className="max-w-200 mx-auto px-5 overflow-x-hidden mb-10">
                    <h1 className="text-center text-3xl font-bold mt-10">{data.title}</h1>
                    <p className="text-sm text-zinc-500 text-center my-5">发布于：{new Date(data.createdAt).toLocaleString()}</p>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        children={data.content}
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold py-1" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold py-0.5" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-bold" {...props} />,
                            h4: ({ node, ...props }) => <h4 className="text-lg font-bold" {...props} />,
                            h5: ({ node, ...props }) => <h5 className="text-md font-bold" {...props} />,
                            p: ({ node, ...props }) => <p className="py-2 text-zinc-700" {...props} />,
                            img: ({ node, src, ...props }) => (
                                <PhotoProvider>
                                    <PhotoView src={src as string}>
                                        <img src={src} alt="" {...props} />
                                    </PhotoView>
                                </PhotoProvider>
                            ),
                            th: ({ node, ...props }) => <th className="text-ellipsis text-nowrap border border-zinc-300 p-2" {...props} />,
                            td: ({ node, ...props }) => <td className="border border-zinc-300 p-1" {...props} />,
                            table: ({ node, ...props }) => <div className="overflow-x-auto"><table {...props} /></div>,
                            pre: ({ node, ...props }) => <pre className="rounded-sm overflow-hidden shadow" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="pl-3 border-l-5" {...props} />,
                        }}
                    />
                </div>
            )}
        </div>
    )
}