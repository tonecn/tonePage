'use client';

import { BlogApi } from "@/lib/api";
import { base62 } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

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

    const [markdownHTML, setMarkdownHTML] = useState<string | null>(null);

    const { data, error, isLoading } = useSWR(
        `/api/blog/${id}`,
        () => BlogApi.get(id),
    )

    useEffect(() => {
        if (data?.content) {
            (async () => {
                try {
                    const processed = unified()
                        .use(remarkParse)         // 解析 Markdown
                        .use(remarkRehype)        // 转换为 HTML AST
                        .use(rehypeHighlight)     // 高亮代码块
                        .use(rehypeStringify);    // 输出 HTML 字符串

                    const result = await processed.process(data.content);
                    setMarkdownHTML(result.toString());
                } catch (err) {
                    console.error("Failed to parse markdown", err);
                    setMarkdownHTML("<p>无法加载内容</p>");
                }
            })();
        }
    }, [data]);

    return (
        <div className="w-full">
            {data && (
                <div className="w-full flex flex-col items-center">
                    <h1 className="text-center text-2xl font-semibold mt-5">{data.title}</h1>
                    {/* 渲染 Markdown HTML */}
                    {markdownHTML && (
                        <div
                            className="prose dark:prose-invert max-w-200 mt-8"
                            dangerouslySetInnerHTML={{ __html: markdownHTML }}
                        />
                    )}
                    <h2 className="text-sm text-zinc-500 text-center mt-1">发布于：{new Date(data.createdAt).toLocaleString()}</h2>
                </div>
            )}
        </div>
    )
}