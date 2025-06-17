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
import { OssStore } from '@/lib/oss/OssStore';


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



export default function Page() {
    const ossStore = new OssStore({
        prefix: 'tone-page',
        prefixAddUserId: true,
    });
    const objectList = ossStore.useObjectList;

    const handleRefreshFileList = async () => ossStore.loadObjectList().catch(e => toast.error(e.message));
    const handleCheckboxChange = ossStore.handleObjectCheckedStateChanged.bind(ossStore);

    const checkedFileIds = useMemo(() => {
        return (objectList || []).filter(i => i.isChecked).map(i => i.id);
    }, [objectList])

    const handleDeleteObject = async (id: string) => {
        await ossStore.deleteObject(id)
            .then(() => ossStore.loadObjectList())
            .catch(e => toast.error(`${e.message}`))
    }

    const handleDeleteCheckedFiles = async () => {
        const res = await ossStore.deleteCheckedObjects();

        if (res.failed > 0) {
            toast.warning(`删除完成，共有${res.failed}个文件删除失败`)
        } else {
            toast.success(`${res.all}个文件删除完成`)
        }
        handleRefreshFileList();
    }

    const handleDownloadObject = async (id: string) => {
        ossStore.downloadObject(id).catch(e => toast.error(`${e.message}`));
    }

    return (
        <div>
            <div className='mt-1 flex gap-2'>
                <UploadManager
                    ossStore={ossStore}
                    handleRefreshFileList={handleRefreshFileList}
                >
                    <Button variant='default' className='cursor-pointer'><Upload />上传</Button>
                </UploadManager>
                <Button
                    variant='destructive'
                    className='cursor-pointer'
                    disabled={(checkedFileIds.length) <= 0}
                    onClick={() => handleDeleteCheckedFiles()}
                ><Delete />删除</Button>
                <div className='flex items-center'>
                    <Button variant='secondary' size='icon' className='cursor-pointer' onClick={() => handleRefreshFileList()}><RefreshCcw /></Button>
                    {objectList && <div className='text-sm ml-2'>共有 {objectList.length} 个文件，目前最大支持100个文件</div>}
                </div>
            </div>
            <Table>
                <TableCaption>
                    {/* {(ossStore.isLoading || ( == null && !error)) && <div>加载中...</div>}
                    {error && <div>{`${error}`}</div>}
                    {fileList && fileList.length === 0 && <div>暂无文件</div>} */}
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
                        objectList && objectList.map(d => (
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
                                            <DropdownMenuItem onClick={() => handleDownloadObject(d.id)}><Download />下载</DropdownMenuItem>
                                            {/* <DropdownMenuItem><Edit />编辑</DropdownMenuItem> */}
                                            <DropdownMenuItem onClick={() => handleDeleteObject(d.id)}><Delete />删除</DropdownMenuItem>
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