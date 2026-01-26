'use client';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import rehypeRaw from 'rehype-raw'
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useRef } from 'react';
import { Check, Copy } from 'lucide-react';

const CodeBlock = ({ language, children, className, ...props }: any) => {
    const [copied, setCopied] = useState(false);
    const codeRef = useRef<HTMLElement>(null);

    const onCopy = () => {
        if (!codeRef.current) return;
        const text = codeRef.current.innerText;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group flex flex-col">
            <div className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-800/50 px-4 py-2 border-b border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 select-none">
                <span className="font-mono font-medium">{language || 'text'}</span>
                <button 
                    onClick={onCopy}
                    className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
            </div>
            <div className="overflow-x-auto bg-zinc-50 dark:bg-zinc-900">
                <code ref={codeRef} className={cn(className, "text-sm font-mono block bg-transparent dark:bg-transparent p-4! border-none whitespace-pre")} {...props}>
                    {children}
                </code>
            </div>
        </div>
    )
}

interface BlogContentProps {
    content?: string;
    className?: string;
}

export function BlogContent({ content, className }: BlogContentProps) {
    if (!content) return null;

    return (
        <div className={cn("w-full wrap-break-word", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                    h1: ({ ...props }) => <h1 className="text-3xl font-bold mb-4 mt-6 pb-2 border-b border-zinc-200 dark:border-zinc-800" {...props} />,
                    h2: ({ ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                    h3: ({ ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
                    h4: ({ ...props }) => <h4 className="text-lg font-bold mt-3 mb-2" {...props} />,
                    h5: ({ ...props }) => <h5 className="text-base font-bold mt-2 mb-1" {...props} />,
                    h6: ({ ...props }) => <h6 className="text-sm font-bold mt-2 mb-1" {...props} />,
                    p: ({ ...props }) => <p className="leading-7 my-3 text-zinc-700 dark:text-zinc-300" {...props} />,
                    li: ({ ...props }) => <li className="ml-4 list-disc text-zinc-700 dark:text-zinc-300" {...props} />,
                    ul: ({ ...props }) => <ul className="my-3 pl-4" {...props} />,
                    ol: ({ ...props }) => <ol className="my-3 list-decimal" {...props} />,
                    img: ({ src, alt }) => {
                        return (
                            <PhotoProvider>
                                <PhotoView src={src as string}>
                                    <span className="block my-4 cursor-zoom-in">
                                        <Image 
                                            src={src as string} 
                                            width={800} 
                                            height={0} 
                                            className="w-full h-auto border shadow-sm bg-background"
                                            unoptimized // OSS images might not be optimized by Next.js by default if domain not configured
                                            alt={alt || "图片"} 
                                        />
                                        {alt && <span className="block text-center text-xs text-muted-foreground mt-2">{alt}</span>}
                                    </span>
                                </PhotoView>
                            </PhotoProvider>
                        )
                    },
                    th: ({ ...props }) => <th className="text-left font-bold border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-1.5" {...props} />,
                    td: ({ ...props }) => <td className="border border-zinc-200 dark:border-zinc-700 p-1.5" {...props} />,
                    table: ({ ...props }) => <div className="my-4 w-full overflow-x-auto border border-zinc-200 dark:border-zinc-700"><table className="w-full text-sm" {...props} /></div>,
                    /** @ts-ignore */
                    pre: ({ ...props }) => <div className="my-4 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm text-left" {...props} />,
                    code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '')
                        const isInline = !match && !children?.toString().includes('\n');
                        
                        if (isInline) {
                            return (
                                <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-500 break-all border border-zinc-200 dark:border-zinc-700" {...props}>
                                    {children}
                                </code>
                            )
                        }
                        
                        return (
                            <CodeBlock language={match?.[1]} className={className} {...props}>
                                {children}
                            </CodeBlock>
                        )
                    },
                    blockquote: ({ ...props }) => <blockquote className="my-4 pl-4 border-l-4 border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 italic" {...props} />,
                    a: ({ ...props }) => <a className="text-primary hover:underline underline-offset-4" target="_blank" {...props} />,
                    hr: ({ ...props }) => <hr className="my-8 border-zinc-200 dark:border-zinc-800" {...props} />,
                }}
            >{content}</ReactMarkdown>
        </div>
    )
}
