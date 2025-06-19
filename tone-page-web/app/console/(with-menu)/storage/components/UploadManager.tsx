'use client';

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Check, CloudUpload, File, Files, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Progress } from '@/components/ui/progress';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { OssStore } from "@/lib/oss/OssStore";
import OSS, { Checkpoint } from "ali-oss";

interface UploadManagerProps {
    children: React.ReactNode;
    ossStore?: OssStore;
    handleRefreshFileList?: () => void;
}

interface UploadFileItem {
    id: string;
    file: File;
    status: 'ready' | 'uploading' | 'finish' | 'failed';
    progress: number;// 0 ~ 100
}

export function UploadManager({ children, ossStore, handleRefreshFileList }: UploadManagerProps) {
    const [filesList, setFileList] = useState<UploadFileItem[]>([]);

    const handleFileSelect = (fileList: FileList) => {
        setFileList(currentFileList => {
            const newFiles: UploadFileItem[] = [];
            for (const file of fileList) {
                const repeatFile = currentFileList.find(f =>
                    f.file.name === file.name &&
                    f.file.size === file.size &&
                    f.file.lastModified === file.lastModified
                );
                if (!repeatFile) {
                    newFiles.push({
                        id: `${Math.random()}${Date.now()}`,
                        file: file,
                        progress: 0,
                        status: 'ready',
                    })
                }
            }
            return [...currentFileList, ...newFiles];
        })
    }

    const handleFileDelete = (fileItemId: string) => {
        if (isUploading) return toast.warning('上传过程暂时无法删除');
        setFileList(currentFileList => currentFileList.filter(i => i.id !== fileItemId))
    }

    const inputFileRef = useRef<HTMLInputElement>(null);
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        handleFileSelect(e.target.files);
    }

    const [fileDroping, setFileDroping] = useState(false);
    const handleFileOnDropOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setFileDroping(true);
    }

    const handleFileOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setFileDroping(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files);
        }
    }

    const [isUploading, setIsUploading] = useState(false);
    /** 开始上传文件 */
    const handleUpload = async () => {
        if (!ossStore) return;
        let store: OSS;
        try { store = ossStore.getStore(); } catch { return toast.error(`初始化失败`) };

        const needUploadFiles = filesList.filter(f => f.status !== 'finish');
        if (needUploadFiles.length === 0) return toast.info('请选择需要上传的文件');

        let failCount = 0;
        setIsUploading(true);
        for (const fileItem of needUploadFiles) {
            fileItem.status = 'uploading';
            await startUploadFile(store, fileItem, ossStore.getWorkDir()).catch(() => { fileItem.status = 'failed'; failCount++; });
            fileItem.status = 'finish';
        }
        setIsUploading(false);

        if (failCount > 0) {
            toast.warning(`上传完成，本次共有${failCount}个文件上传失败`);
        } else {
            toast.success(`上传完成，共上传了${needUploadFiles.length}个文件`)
        }
        // 清空上传成功的文件
        setFileList(current => current.filter(f => f.status !== 'finish'));
        handleRefreshFileList?.();
    }

    // 上传单个文件
    const startUploadFile = async (store: OSS, fileItem: UploadFileItem, workDir?: string) => {
        let checkpoint: Checkpoint | undefined;

        await store.multipartUpload(`${workDir ? `${workDir}/` : ''}${fileItem.file.name}`, fileItem.file, {
            checkpoint: checkpoint,
            progress: (p, cpt) => {
                setFileList(currentFileList => {
                    return currentFileList.map(f => {
                        if (f.id == fileItem.id) {
                            f.progress = p * 100;
                        }
                        return f;
                    })
                });
                checkpoint = cpt;
            }
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>上传文件</DialogTitle>
                    <DialogDescription>
                        请点击选择文件按钮或拖动文件到指定位置
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div
                        onDrop={handleFileOnDrop}
                        onDragOver={handleFileOnDropOver}
                        onClick={() => inputFileRef.current?.click()}
                        className="flex items-center justify-center border shadow rounded select-none cursor-pointer relative">
                        <div className={cn('flex flex-col items-center py-6 text-zinc-500 text-sm text-center', fileDroping && 'invisible')}>
                            <div className="flex items-center gap-3">
                                <CloudUpload className="size-10 text-zinc-400" />
                                <span>请拖动文件到此处 或 点击此处</span>
                            </div>
                            <div className="w-full px-5 mt-3 text-xs">
                                <p>支持同时选择多个文件，文件区分大小写，若存在同名文件，新文件将被覆；支持超过5GB的文件，上传过程请不要关闭对话框</p>
                            </div>
                        </div>
                        <div className={cn('absolute flex items-center text-zinc-600 gap-1 invisible', fileDroping && 'visible')}>
                            <Files className="size-6 text-zinc-500" />
                            <span className="text-sm">请拖放至此处，并松开鼠标</span>
                        </div>
                    </div>
                    <input
                        type="file"
                        multiple
                        ref={inputFileRef}
                        className="hidden"
                        onChange={handleFileInputChange} />
                </div>
                <div>
                    {
                        filesList.map(f => (
                            <div
                                key={f.id}
                                className="group hover:bg-zinc-100 duration-300 rounded px-1 py-1">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1">
                                        <File className="size-4 text-zinc-500" />
                                        {/* 存在一个bug，文本省略无法自动适配容器宽度 */}
                                        <div className="text-sm text-zinc-800 overflow-hidden text-nowrap text-ellipsis max-w-60">
                                            {f.file.name}
                                        </div>
                                    </div>
                                    <div>
                                        {f.status === 'finish' && <Check className="size-4 text-green-600 group-hover:hidden" />}
                                        <X
                                            onClick={() => handleFileDelete(f.id)}
                                            className="size-4 text-zinc-500 cursor-pointer hover:text-zinc-600 hidden group-hover:block" />
                                    </div>
                                </div>
                                <div className="h-0 w-full relative">
                                    {f.status === 'uploading' && <Progress value={f.progress} className="h-1" />}
                                </div>
                            </div>
                        ))
                    }
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        className="cursor-pointer"
                        onClick={handleUpload}
                        disabled={isUploading}>开始上传</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}