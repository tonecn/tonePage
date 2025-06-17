import { useOssStore } from "@/hooks/admin/web/blog/use-oss-store";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface OssObjectItem {
    id: string;
    name: string;
    size: number;// Byte
    lastModified: Date;
    isChecked: boolean;
};

type OssObjectList = null | OssObjectItem[];

export class OssStore {

    private objectList: OssObjectList = null;
    private setObjectList: Dispatch<SetStateAction<OssObjectList>>;

    public storeMeta: ReturnType<typeof useOssStore>;

    constructor(private options: {
        prefix?: string;
        prefixAddUserId?: boolean;
    } = {}) {
        const [objectList, setObjectList] = useState<OssObjectList>(null);
        this.objectList = objectList;
        this.setObjectList = setObjectList;

        this.storeMeta = useOssStore({
            region: 'oss-cn-chengdu',
            bucket: 'tone-personal',
            onStsTokenDataChanged: (data) => {
                if (!data) return;
                this.loadObjectList();
            }
        });
    }

    get useObjectList() {
        return this.objectList;
    }

    public async loadObjectList() {
        const store = await this.getStore();
        this.setObjectList(null);

        const workDir = this.getWorkDir();
        const res = await store.listV2({ ...workDir ? { prefix: workDir } : {} }, {});
        if (!res || !res.objects) throw new Error('文件列表加载失败');

        this.setObjectList(res.objects.map(v => ({
            id: v.name,
            name: v.name.replace(`${workDir}/`, ''),
            size: v.size,
            lastModified: new Date(v.lastModified),
            isChecked: false,
        })))
    }

    public handleObjectCheckedStateChanged(id: string, value: boolean) {
        this.setObjectList(current => current ? current.map(objectItem => {
            if (objectItem.id === id) {
                return { ...objectItem, isChecked: value }
            }
            return objectItem;
        }) : null)
    }

    public async deleteObject(id: string) {
        if (!this.storeMeta.store || !this.storeMeta.stsTokenData) {
            throw new Error('初始化失败，请刷新界面重试');
        }
        const fileItem = (this.objectList || []).find(i => i.id === id);
        if (!fileItem) throw new Error('文件不存在');

        const objectName = this.getObjectName(fileItem.name);
        const delRes = await this.storeMeta.store.delete(objectName).catch(() => null);
        if (!delRes) throw new Error('删除失败');
    }

    public async deleteCheckedObjects() {
        if (!this.storeMeta.store || !this.storeMeta.stsTokenData) {
            throw new Error('初始化失败，请刷新界面重试');
        }

        const objects = (this.objectList || []).filter(i => i.isChecked);
        if (objects.length === 0) throw new Error('请选择需要删除的文件');

        let failedCount = 0;
        for (const objectItem of objects) {
            await this.deleteObject(objectItem.id).catch(e => failedCount++);
        }

        return { all: objects.length, failed: failedCount };
    }

    public async downloadObject(id: string) {
        if (!this.storeMeta.store || !this.storeMeta.stsTokenData) {
            throw new Error('初始化失败，请刷新界面重试');
        }

        const objectItem = this.getObjectItemById(id);
        const url = this.storeMeta.store.signatureUrl(this.getObjectName(objectItem.name));
        const a = document.createElement('a');
        a.href = url;
        a.download = objectItem.name;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    private async getStore() {
        if (!this.storeMeta.store || !this.storeMeta.stsTokenData) {
            throw new Error('初始化失败，请刷新界面重试');
        }
        return this.storeMeta.store;
    }

    private getObjectName(localName: string) {
        return `${this.getWorkDir()}/${localName}`;
    }

    private getObjectNameById(id: string) {
        const objectItem = this.getObjectItemById(id);
        return this.getObjectName(objectItem.name);
    }

    private getObjectItemById(id: string) {
        const objectItem = (this.objectList || []).find(i => i.id === id);
        if (!objectItem) throw new Error('文件不存在');
        return objectItem;
    }

    public getWorkDir() {
        const { stsTokenData } = this.storeMeta;
        if (!stsTokenData) return;

        if (this.options.prefixAddUserId) {
            return `${this.options.prefix ? `${this.options.prefix}/` : ''}${stsTokenData.userId}`;
        } else {
            return this.options.prefix;
        }
    }

    get isLoading() {
        return this.storeMeta.isLoading;
    }

}