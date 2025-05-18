"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { BlogApi } from "@/lib/api";
import { useCallback } from "react"
import useSWR from "swr";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { base62 } from "@/lib/utils";

export default function Blog() {
    const formatNumber = useCallback((num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        return num.toString();
    }, []);

    const { data: blogs, error, isLoading } = useSWR(
        '/api/blogs',
        () => BlogApi.list(),
    )

    return (
        <div className="max-w-120 w-auto mx-auto my-10 flex flex-col gap-8">
            {
                isLoading && (
                    <div className="w-full">
                        <Skeleton className="w-full h-5" />
                        <Skeleton className="w-full h-10 mt-1" />
                        <Skeleton className="w-full h-5 mt-5" />
                    </div>
                )
            }
            {
                error && (
                    <Alert variant="destructive" className="w-full">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>出错啦</AlertTitle>
                        <AlertDescription>
                            {error.message}
                        </AlertDescription>
                    </Alert>
                )
            }
            {
                blogs && blogs.map((blog) => (
                    <div className="w-full px-5 cursor-default" key={blog.id}>
                        <a className="text-2xl font-medium cursor-pointer hover:underline" target="_blank" href={`/blog/${base62.encode(Buffer.from(blog.id.replace(/-/g, ''), 'hex'))}`}>{blog.title}</a>
                        <p className="text-sm font-medium text-zinc-400">{blog.description}</p>
                        <p className="text-sm font-medium text-zinc-400 mt-3">{new Date(blog.createdAt).toLocaleString()} · {formatNumber(blog.viewCount)} 次访问</p>
                    </div>
                ))
            }
        </div>
    )
}