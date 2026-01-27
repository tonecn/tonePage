'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import type { BlogListItem } from '@/lib/api';
import { Loader2, Calendar, Eye } from 'lucide-react';
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
        <div className="flex flex-col gap-4">
            {blogs.map((blog) => (
                <article 
                    key={blog.id} 
                    className="group relative flex flex-col gap-3 p-5 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all duration-300"
                >
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">
                            <Link
                                className="text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors focus:outline-none"
                                href={`/blog/${blog.slug}`}
                            >
                                <span className="absolute inset-0 z-0"></span>
                                {blog.title}
                            </Link>
                        </h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                            {blog.description}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium pt-1">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <time dateTime={blog.createdAt}>
                                {new Date(blog.createdAt).toLocaleDateString('zh-CN')}
                            </time>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{formatNumber(blog.viewCount)}</span>
                        </div>
                    </div>
                </article>
            ))}
            
            {/* Loading Indicator / Sentinel */}
            <div ref={observerTarget} className="w-full h-10 flex justify-center items-center mt-4">
                {loading && <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />}
            </div>
            
            {!hasMore && blogs.length > 0 && (
                <div className="w-full py-2 text-center text-sm text-zinc-400">
                    没有更多内容了
                </div>
            )}
        </div>
    );
}
