import useSWR from "swr";
import { BlogCommentTool } from "./BlogCommentTool";
import { BlogApi } from "@/lib/api";

export function BlogComments({ blogId }: { blogId: string }) {
    const { data, isLoading, error } = useSWR(
        `/api/blog/${blogId}/comments`,
        () => BlogApi.getComments(blogId),
    )

    return (
        data && <div className="" >
            <h1 className="px-2 border-l-4 border-zinc-300">评论 {data.length}</h1>
            <BlogCommentTool blogId={blogId} />
            <div className="flex flex-col gap-3">
                {
                    data.filter(d => !d.parentId)
                        .map(d => (
                            <div key={d.id}>
                                <h1 className="text-zinc-500">{d.user ? d.user : '匿名'}</h1>
                                <div>{d.content}</div>
                                <div className="text-xs text-zinc-500 flex gap-2">
                                    <p>{new Date(d.createdAt).toLocaleString()}</p>
                                    <p>未知</p>
                                    <p className="text-zinc-900 cursor-pointer">回复</p>
                                </div>
                                {
                                    data.filter(c => c.parentId === d.id).length > 0 && (
                                        <div className="flex flex-col gap-3 ml-5 my-1">
                                            {
                                                data.filter(c => c.parentId === d.id).map(c => (
                                                    <div key={c.id}>
                                                        <h1 className="text-zinc-500">{c.user ? c.user : '匿名'}</h1>
                                                        <div>{c.content}</div>
                                                        <p className="text-xs text-zinc-500 flex gap-2">
                                                            <p>{new Date().toLocaleString()}</p>
                                                            <p>未知</p>
                                                        </p>
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