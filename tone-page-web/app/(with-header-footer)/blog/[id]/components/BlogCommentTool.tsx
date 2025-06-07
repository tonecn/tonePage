'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BlogApi } from "@/lib/api";
import { BlogComment } from "@/lib/types/blogComment";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function BlogCommentTool({ blogId, onInsertComment }: { blogId: string, onInsertComment: (b: BlogComment) => void }) {

    const [comment, setComment] = useState('');
    const submit = async () => {
        if (comment.trim().length === 0) return;
        const res = await BlogApi.createComment(blogId, comment);
        if (res) {
            toast.success('发布成功');
            setComment('');
            onInsertComment(res);
        }
    }

    return (
        <div className="my-3 flex items-end gap-2">
            <Textarea placeholder="评论" onChange={v => setComment(v.target.value)} value={comment} />
            <Button variant='outline' size='icon' onClick={() => submit()} disabled={comment.trim().length === 0}>
                <Send />
            </Button>
        </div>
    )
}