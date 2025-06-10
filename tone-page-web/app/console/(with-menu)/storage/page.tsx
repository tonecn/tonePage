'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOssStore } from '@/hooks/admin/web/blog/use-oss-store';
import { ObjectMeta } from 'ali-oss';
import { Delete, Download, Edit, RefreshCcw, Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UploadManager } from './components/UploadManager';


const formatSizeNumber = (n: number) => {
    const unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
    for (const [i, u] of unit.entries()) {
        if (n < 1024 ** (i + 1)) {
            if (i <= 0) {
                return `${(n)}${unit[i]}`;
            } else {
                return `${(n / 1024 ** i).toFixed(2)}${unit[i]}`;
            }
        }
    }
}

interface FileItem {
    id: string;
    name: string;
    size: number;// Byte
    lastModified: Date;
    isChecked: boolean;
};

export default function Page() {
    const { stsTokenData, isLoading, error, store } = useOssStore();

    const [fileList, setFileList] = useState<null | FileItem[]>(null);

    const handleRefreshFileList = async () => {
        if (!store || !stsTokenData) return toast.error('初始化失败，请刷新界面重试');
        setFileList(null);
        const res = await store.listV2({ prefix: `tone-page/${stsTokenData.userId}` }, {}).catch(e => {
            toast.error('文件列表加载失败');
        });

        if (res && res.objects) {
            setFileList(res.objects.map(v => ({
                id: v.name,
                name: v.name.replace(`tone-page/${stsTokenData.userId}/`, ''),
                size: v.size,
                lastModified: new Date(v.lastModified),
                isChecked: false,
            })));
        }
    }

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setFileList((prevFileList) => {
            if (!prevFileList) return null;

            return prevFileList.map(item => {
                if (item.id === id) {
                    return { ...item, isChecked: checked };
                }
                return item;
            })
        })
    }

    useEffect(() => {
        store && stsTokenData && handleRefreshFileList();
    }, [stsTokenData]);

    const checkedFileIds = useMemo(() => {
        if (!fileList) return null;
        return fileList.filter(i => i.isChecked).map(i => i.id);
    }, [fileList])


    const handleDeleteCheckedFiles = async () => {
        if (!store || !stsTokenData) return toast.error('初始化未完成或失败，请等待或重新加载');
        const deleteFiles = (fileList || []).filter(i => i.isChecked);
        if (!deleteFiles) return toast.error('请选择需要删除的文件');

        let failedCount = 0;
        for (let item of deleteFiles) {
            await deleteFile(item.name).catch(e => { failedCount++; return e; });
        }

        if (failedCount > 0) {
            toast.warning(`删除完成，共有${failedCount}个文件删除失败`)
        } else {
            toast.success(`${deleteFiles.length}个文件删除完成`)
        }
        handleRefreshFileList();
    }

    const handleDeleteFile = async (fileItem: FileItem) => {
        await deleteFile(fileItem.name)
            .then(() => toast.success('删除完成'))
            .catch(() => toast.error('删除失败'));
        handleRefreshFileList();
    }

    const deleteFile = async (localFilename: string) => {
        if (!store) throw new Error('store未初始化');
        if (!stsTokenData) throw new Error('sts服务未初始化');
        return store.delete(`/tone-page/${stsTokenData.userId}/${localFilename}`);
    }

    const downloadFile = (localFilename: string) => {
        if (!store) throw new Error('store未初始化');
        if (!stsTokenData) throw new Error('sts服务未初始化');
        const url = store.signatureUrl(`/tone-page/${stsTokenData.userId}/${localFilename}`);
        const a = document.createElement('a');
        a.href = url;
        a.download = localFilename;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const handleDownloadFile = async (fileItem: FileItem) => {
        downloadFile(fileItem.name);
    }

    return (
        <div>
            <div className='mt-1 flex gap-2'>
                <UploadManager
                    store={store}
                    basePath={stsTokenData && `/tone-page/${stsTokenData.userId}`}
                    handleRefreshFileList={handleRefreshFileList}
                >
                    <Button variant='default' className='cursor-pointer'><Upload />上传</Button>
                </UploadManager>
                <Button
                    variant='destructive'
                    className='cursor-pointer'
                    disabled={(checkedFileIds?.length || 0) <= 0}
                    onClick={() => handleDeleteCheckedFiles()}
                ><Delete />删除</Button>
                <div className='flex items-center'>
                    <Button variant='secondary' size='icon' className='cursor-pointer' onClick={() => handleRefreshFileList()}><RefreshCcw /></Button>
                    {fileList && <div className='text-sm ml-2'>共有 {fileList.length} 个文件，目前最大支持100个文件</div>}
                </div>
            </div>
            <Table>
                <TableCaption>
                    {(isLoading || (fileList == null && !error)) && <div>加载中...</div>}
                    {error && <div>{`${error}`}</div>}
                    {fileList && fileList.length === 0 && <div>暂无文件</div>}
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-10'></TableHead>
                        <TableHead>文件名</TableHead>
                        <TableHead>文件大小</TableHead>
                        <TableHead>上次修改时间</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        fileList && fileList.map(d => (
                            <TableRow key={d.name} >
                                <TableCell>
                                    <Checkbox checked={d.isChecked} onCheckedChange={v => handleCheckboxChange(d.id, Boolean(v))} />
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className='whitespace-normal break-all cursor-pointer text-left'>
                                            {d.name}
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleDownloadFile(d)}><Download />下载</DropdownMenuItem>
                                            {/* <DropdownMenuItem><Edit />编辑</DropdownMenuItem> */}
                                            <DropdownMenuItem onClick={() => handleDeleteFile(d)}><Delete />删除</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell>{formatSizeNumber(d.size)}</TableCell>
                                <TableCell className='whitespace-normal break-words'>{d.lastModified.toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div >
    )
}