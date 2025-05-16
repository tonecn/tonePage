"use client"

import { useBlogList } from "@/hooks/admin/web/blog/use-blog-list"
import BlogTable from "./components/BlogTable"
import AddBlog from "./components/AddBlog";
import { Button } from "@/components/ui/button";

export default function Page() {
    const { blogs, error, isLoading, refresh } = useBlogList();

    return (
        <>
            <div>
                <AddBlog onRefresh={refresh}>
                    <Button>添加博客</Button>
                </AddBlog>
            </div>
            <BlogTable blogs={blogs || []} onRefresh={refresh} />
        </>
    )
}