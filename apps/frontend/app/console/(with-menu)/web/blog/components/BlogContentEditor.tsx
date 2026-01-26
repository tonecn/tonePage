"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
    Split, 
    Eye, 
    Edit3, 
    Save, 
    Upload, 
    X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlogContent } from "@/components/BlogContent";

interface BlogContentEditorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialContent: string;
    onSave: (content: string) => void;
    title?: string;
}

export function BlogContentEditor({ 
    open, 
    onOpenChange, 
    initialContent, 
    onSave,
    title = "编辑内容"
}: BlogContentEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');

    // Sync content when opening
    useEffect(() => {
        if (open) {
            setContent(initialContent || "");
        }
    }, [open, initialContent]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                setContent(text);
            }
        };
        reader.readAsText(file);
        
        // Reset input value to allow selecting the same file again
        e.target.value = '';
    };

    const handleSave = () => {
        onSave(content);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:max-w-[95vw]">
                {/* Header Toolbar */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30 shrink-0">
                    <div className="flex items-center gap-4">
                        <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
                        <div className="flex items-center bg-muted rounded-lg p-1 border h-9">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('edit')}
                                className={cn(
                                    "h-full px-3 text-muted-foreground hover:text-foreground transition-all",
                                    viewMode === 'edit' && "bg-background text-foreground shadow-sm hover:bg-background"
                                )}
                                title="仅编辑"
                            >
                                <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('split')}
                                className={cn(
                                    "h-full px-3 text-muted-foreground hover:text-foreground hidden md:flex transition-all",
                                    viewMode === 'split' && "bg-background text-foreground shadow-sm hover:bg-background"
                                )}
                                title="分屏"
                            >
                                <Split className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('preview')}
                                className={cn(
                                    "h-full px-3 text-muted-foreground hover:text-foreground transition-all",
                                    viewMode === 'preview' && "bg-background text-foreground shadow-sm hover:bg-background"
                                )}
                                title="仅预览"
                            >
                                <Eye className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="text-sm text-muted-foreground border-l pl-4 ml-2">
                            {content.length} 字符
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                         <div className="relative">
                            <Input 
                                type="file" 
                                accept=".md,.markdown,.txt" 
                                onChange={handleFileUpload}
                                className="hidden"
                                id="editor-file-upload"
                            />
                            <Button variant="outline" size="sm" asChild>
                                <Label htmlFor="editor-file-upload" className="cursor-pointer mb-0">
                                    <Upload className="w-4 h-4 mr-2" />
                                    导入
                                </Label>
                            </Button>
                         </div>

                        <div className="w-px h-4 bg-border mx-1" />

                        <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                            <X className="w-4 h-4 mr-2" />
                            关闭
                        </Button>
                        
                        <Button variant="default" size="sm" onClick={handleSave}>
                            <Save className="w-4 h-4 mr-2" />
                            保存
                        </Button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex overflow-hidden min-h-0 relative">
                    {/* Editor Pane */}
                    <div className={cn(
                        "h-full overflow-hidden flex flex-col transition-all duration-300",
                        viewMode === 'preview' ? "hidden" : "flex-1",
                        viewMode === 'split' ? "w-1/2 border-r" : "w-full"
                    )}>
                        <Textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="flex-1 resize-none border-0 focus-visible:ring-0 rounded-none p-4 font-mono text-sm leading-relaxed"
                            placeholder="# 开始编辑 Markdown..."
                            spellCheck={false}
                        />
                    </div>

                    {/* Preview Pane */}
                    <div className={cn(
                        "h-full overflow-auto bg-white dark:bg-zinc-950 transition-all duration-300",
                        viewMode === 'edit' ? "hidden" : "flex-1",
                        viewMode === 'split' ? "w-1/2" : "w-full"
                    )}>
                        <div className="prose dark:prose-invert max-w-none p-8 min-h-full">
                            <BlogContent content={content || '*暂无内容*'} />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
