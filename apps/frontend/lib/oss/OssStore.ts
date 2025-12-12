import { Dispatch, SetStateAction } from "react";
import OSS from "ali-oss";

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
    public store?: OSS;
    private workDir: string;

    constructor(options: {
        workDir?: string;
        setObjectList?: Dispatch<SetStateAction<OssObjectList>>;
    } = {}) {
        this.workDir = options.workDir ?? '';
        this.setObjectList = options.setObjectList;
    }

    public setStore(store: OSS | undefined) {
        this.store = store;
    }

    public setSetObjectList(setObjectList: Dispatch<SetStateAction<OssObjectList>>) {
        this.setObjectList = setObjectList;
    }

    public async loadObjectList() {
        if (!this.setObjectList) {
            throw new Error('setObjectList need provided');
        }

        const store = this.getStore();
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
        const store = this.getStore();

        const objectName = this.getObjectNameByLocalname(objectItem.name);
        const delRes = await store.delete(objectName).catch(() => null);
        if (!delRes) throw new Error('删除失败');
    }

    public async deleteCheckedObjects(objectItems: OssObjectItem[]) {
        if (!this.getStore()) {
            throw new Error('初始化失败，请刷新界面重试');
        }

        if (objectItems.length === 0) throw new Error('请选择需要删除的文件');

        let failedCount = 0;
        for (const objectItem of objectItems) {
            await this.deleteObject(objectItem).catch(() => failedCount++);
        }

        return { all: objectItems.length, failed: failedCount };
    }

    public async downloadObject(objectItem: OssObjectItem) {
        const store = this.getStore();
        if (!store) {
            throw new Error('初始化失败，请刷新界面重试');
        }

        const url = store.signatureUrl(this.getObjectNameByLocalname(objectItem.name));
        const a = document.createElement('a');
        a.href = url;
        a.download = objectItem.name;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    /**
     * @throws Error
     */
    public getStore() {
        if (!this.store) {
            throw new Error('初始化失败，请刷新界面重试');
        }
        return this.store;
    }

    private getObjectNameByLocalname(localName: string) {
        return `${this.getWorkDir()}/${localName}`;
    }

    public getWorkDir() {
        return this.workDir;
    }

    public setWorkDir(dir: string) {
        this.workDir = dir;
    }
}