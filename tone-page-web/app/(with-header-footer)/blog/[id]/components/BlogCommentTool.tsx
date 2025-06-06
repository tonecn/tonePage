'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BlogApi } from "@/lib/api";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function BlogCommentTool({ blogId }: { blogId: string }) {

    const [comment, setComment] = useState('');
    const submit = async () => {
        const res = await BlogApi.createComment(blogId, comment);
        if (res) {
            toast.success('发布成功');
            setComment('');
            // 提交界面刷新
        }
    }

    return (
        <div className="my-3 flex items-end gap-2">
            <Textarea placeholder="评论" onChange={v => setComment(v.target.value)} value={comment} />
            <Button variant='outline' size='icon' onClick={() => submit()}>
                <Send />
            </Button>
        </div>
    )
}