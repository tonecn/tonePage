'use client';
import useSWR from "swr";
import { BlogCommentTool } from "./BlogCommentTool";
import { BlogComment } from "@/lib/types/blogComment";
import { useState } from "react";
import { BlogAPI } from "@/lib/api/client";
import { useUserStore } from "@/store/useUserStore";

export function BlogComments({ blogId }: { blogId: string }) {
    const { data, mutate } = useSWR(
        `/api/blog/${blogId}/comments`,
        () => BlogAPI.getComments(blogId),
    )

    const { user } = useUserStore();

    const insertComment = async (newOne: BlogComment) => {
        await mutate(
            (comments) => {
                if (!comments) return [newOne];
                return [newOne, ...comments]
            },
            { revalidate: false }
        )
    }


    const [replayTarget, setReplayTarget] = useState<BlogComment | null>(null);

    return (
        data && <div className="" >
            <h1 className="px-2 border-l-4 border-zinc-300">评论 {data.length}</h1>
            <BlogCommentTool
                blogId={blogId}
                onInsertComment={insertComment}
                replayTarget={replayTarget}
                handleClearReplayTarget={() => setReplayTarget(null)}
            />

            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {
                    user ? (<span>当前账户：{user.nickname}</span>) : (<span>当前未登录，留言名称为匿名，登录可前往控制台</span>)
                }
            </div>

            <div className="flex flex-col">
                {
                    data.filter(d => !d.parentId)
                        .map((d) => (
                            <div key={d.id} className="border-b border-zinc-300 dark:border-zinc-500 py-2 last:border-none">
                                <h1 className="text-zinc-500 dark:text-zinc-200">{d.user ? d.user.nickname : '匿名'}</h1>
                                <div className="whitespace-pre-wrap break-all">{d.content}</div>
                                <div className="text-xs text-zinc-500 flex gap-2">
                                    <p>{new Date(d.createdAt).toLocaleString()}</p>
                                    <p>{d.address}</p>
                                    <p className="text-zinc-900 dark:text-zinc-200 cursor-pointer" onClick={() => setReplayTarget(d)}>回复</p>
                                </div>
                                {
                                    data.filter(c => c.parentId === d.id).length > 0 && (
                                        <div className="flex flex-col ml-5 my-1">
                                            {
                                                data.filter(c => c.parentId === d.id).map(c => (
                                                    <div key={c.id} className="border-b border-zinc-300 dark:border-zinc-500 py-1 last:border-none">
                                                        <h1 className="text-zinc-500 dark:text-zinc-200">{c.user ? c.user.nickname : '匿名'}</h1>
                                                        <div className="whitespace-pre-wrap break-all">{c.content}</div>
                                                        <div className="text-xs text-zinc-500 flex gap-2">
                                                            <p>{new Date().toLocaleString()}</p>
                                                            <p>{c.address}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        ))
                }
            </div >
        </div>
    )
}