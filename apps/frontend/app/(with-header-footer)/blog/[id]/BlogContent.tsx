'use client';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import rehypeRaw from 'rehype-raw'
import Image from "next/image";

export function BlogContent({ content }: { content?: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
                h1: ({ ...props }) => <h2 className="text-3xl font-bold py-2" {...props} />,
                h2: ({ ...props }) => <h3 className="text-2xl font-bold py-1" {...props} />,
                h3: ({ ...props }) => <h4 className="text-xl font-bold py-0.5" {...props} />,
                h4: ({ ...props }) => <h5 className="text-lg font-bold" {...props} />,
                h5: ({ ...props }) => <h6 className="text-md font-bold" {...props} />,
                p: ({ ...props }) => <p className="py-1 text-zinc-700 dark:text-zinc-300" {...props} />,
                img: ({ src }) => (
                    <PhotoProvider className="w-full">
                        <PhotoView src={src as string}>
                            <div style={{ width: '100%' }}>
                                <Image src={src as string} width={0} height={0} style={{ width: '100%', height: 'auto' }} unoptimized alt="加载失败" />
                            </div>
                        </PhotoView>
                    </PhotoProvider>
                ),
                th: ({ ...props }) => <th className="text-ellipsis text-nowrap border border-zinc-300 dark:border-zinc-500 p-2" {...props} />,
                td: ({ ...props }) => <td className="border border-zinc-300 dark:border-zinc-500 p-1" {...props} />,
                table: ({ ...props }) => <div className="overflow-x-auto"><table {...props} /></div>,
                pre: ({ ...props }) => <pre className="rounded-sm overflow-hidden shadow" {...props} />,
                blockquote: ({ ...props }) => <blockquote className="pl-3 border-l-5" {...props} />,
                a: ({ ...props }) => <a className="hover:underline" {...props} />,
            }}
        >{content}</ReactMarkdown>
    )
}