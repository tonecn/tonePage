'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BlogApi } from "@/lib/api";
import { BlogComment } from "@/lib/types/blogComment";
import { Send, Undo2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface BlogCommentToolProps {
    blogId: string;
    onInsertComment: (b: BlogComment) => void;
    replayTarget: BlogComment | null;
    handleClearReplayTarget: () => void;
}

export function BlogCommentTool({ blogId, onInsertComment, replayTarget, handleClearReplayTarget }: BlogCommentToolProps) {
    const [comment, setComment] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (replayTarget && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'start'
            })
        }
    }, [replayTarget]);

    const submit = async () => {
        if (comment.trim().length === 0) return;

        try {
            const res = await BlogApi.createComment(blogId, comment, replayTarget ? replayTarget.id : undefined);
            if (res) {
                toast.success('发布成功');
                setComment('');
                onInsertComment(res);
                handleClearReplayTarget();
            }
        } catch (error) {
            if ((error as { statusCode: number }).statusCode === 429) {
                return toast.error('操作太频繁了，稍后再试吧')
            }
            toast.error('发布失败')
        }
    }

    const getPlaceHolderText = () => {
        if (!replayTarget) return '评论';

        let replayComment = replayTarget.content.trim();
        if (replayComment.length > 8) {
            replayComment = replayComment.slice(0, 8) + '...';
        }

        const replayUser = replayTarget.user ? replayTarget.user.nickname : '匿名';

        return `回复 ${replayUser} 的 ${replayComment}`;
    }

    return (
        <div className="my-3 flex items-end gap-2">
            <Textarea
                ref={textareaRef}
                placeholder={getPlaceHolderText()}
                onChange={v => setComment(v.target.value)}
                value={comment} />
            <Button variant='outline' size='icon' onClick={() => submit()} disabled={comment.trim().length === 0}>
                <Send />
            </Button>
            {replayTarget && <Button variant='outline' size='icon' onClick={() => handleClearReplayTarget()}>
                <Undo2 />
            </Button>}
        </div>
    )
}
