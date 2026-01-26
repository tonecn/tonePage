'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import type { BlogListItem } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface BlogListProps {
    initialData: {
        items: BlogListItem[];
        total: number;
    };
}

const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1) + 'M';
    }
    if (num >= 1_000) {
        return (num / 1_000).toFixed(1) + 'K';
    }
    return num.toString();
};

export function BlogList({ initialData }: BlogListProps) {
    const [blogs, setBlogs] = useState<BlogListItem[]>(initialData.items);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialData.items.length < initialData.total);
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loading]);

    // Update hasMore if initialData changes (though typical for client nav)
    useEffect(() => {
         setHasMore(blogs.length < initialData.total);
    }, [initialData.total]);

    const loadMore = async () => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        try {
            const nextPage = page + 1;
            const res = await api.blog.getPublicList(nextPage, 10);
            
            if (res.items.length === 0) {
                setHasMore(false);
            } else {
                setBlogs((prev) => [...prev, ...res.items]);
                setPage(nextPage);
                // Check if we reached the total
                if (blogs.length + res.items.length >= res.total) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Failed to load more blogs', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {blogs.map((blog) => (
                <article className="w-full px-5 cursor-default transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50 py-4 rounded-lg" key={blog.id}>
                    <h2 className="text-2xl font-medium">
                        <Link
                            className="hover:text-primary transition-colors focus:outline-none"
                            href={`/blog/${blog.slug}`}
                        >
                            {blog.title}
                        </Link>
                    </h2>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mt-2 line-clamp-3">{blog.description}</p>
                    <footer className="mt-3 text-sm text-zinc-500 flex items-center gap-2">
                        <time dateTime={blog.createdAt}>
                            {new Date(blog.createdAt).toLocaleString('zh-CN')}
                        </time>
                        <span>·</span>
                        <span>{formatNumber(blog.viewCount)} 次访问</span>
                    </footer>
                </article>
            ))}
            
            {/* Loading Indicator / Sentinel */}
            <div ref={observerTarget} className="w-full h-10 flex justify-center items-center mt-4">
                {loading && <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />}
            </div>
            
            {!hasMore && blogs.length > 0 && (
                <div className="w-full py-8 text-center text-sm text-zinc-400">
                    没有更多内容了
                </div>
            )}
        </div>
    );
}
