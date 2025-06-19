import { useOssStore } from "@/hooks/admin/web/blog/use-oss-store";
import { Dispatch, SetStateAction, useState } from "react";

export interface OssObjectItem {
    id: string;
    name: string;
    size: number;// Byte
    lastModified: Date;
    isChecked: boolean;
};

export type OssObjectList = OssObjectItem[] | null;

export class OssStore {

    private setObjectList?: Dispatch<SetStateAction<OssObjectList>>;

    public storeMeta: ReturnType<typeof useOssStore>;

    constructor(private options: {
        prefix?: string;
        prefixAddUserId?: boolean;
        objectList?: () => (OssObjectList | null);
        setObjectList?: Dispatch<SetStateAction<OssObjectList>>;
    } = {}) {
        this.setObjectList = options.setObjectList;

        this.storeMeta = useOssStore({
            region: 'oss-cn-chengdu',
            bucket: 'tone-personal',
            onStsTokenDataChanged: (data) => {
                if (!data) return;
                this.loadObjectList();
            }
        });
    }

    public async loadObjectList() {
        if (!this.setObjectList) {
            throw new Error('setObjectList need provided');
        }

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
        if (!this.setObjectList) {
            throw new Error('setObjectList need provided');
        }

        this.setObjectList(current => current ? current.map(objectItem => {
            if (objectItem.id === id) {
                return { ...objectItem, isChecked: value }
            }
            return objectItem;
        }) : null)
    }

    public async deleteObject(objectItem: OssObjectItem) {
        if (!this.storeMeta.store || !this.storeMeta.stsTokenData) {
            throw new Error('初始化失败，请刷新界面重试');
        }

        const objectName = this.getObjectNameByLocalname(objectItem.name);
        const delRes = await this.storeMeta.store.delete(objectName).catch(() => null);
        if (!delRes) throw new Error('删除失败');
    }

    public async deleteCheckedObjects(objectItems: OssObjectItem[]) {
        if (!this.storeMeta.store || !this.storeMeta.stsTokenData) {
            throw new Error('初始化失败，请刷新界面重试');
        }

        if (objectItems.length === 0) throw new Error('请选择需要删除的文件');

        let failedCount = 0;
        for (const objectItem of objectItems) {
            await this.deleteObject(objectItem).catch(e => failedCount++);
        }

        return { all: objectItems.length, failed: failedCount };
    }

    public async downloadObject(objectItem: OssObjectItem) {
        if (!this.storeMeta.store || !this.storeMeta.stsTokenData) {
            throw new Error('初始化失败，请刷新界面重试');
        }

        const url = this.storeMeta.store.signatureUrl(this.getObjectNameByLocalname(objectItem.name));
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

    private getObjectNameByLocalname(localName: string) {
        return `${this.getWorkDir()}/${localName}`;
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
}