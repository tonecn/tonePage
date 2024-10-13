<script setup lang="ts">
import { request } from '@/lib/request';
import { Refresh, Back, House, UploadFilled, Close } from '@element-plus/icons-vue';
import OSS, { type ObjectMeta, type PutObjectOptions } from 'ali-oss'
import { ElMessage, ElMessageBox, ElSubMenu, type UploadFile, type UploadFiles } from 'element-plus';
import { ref, onMounted, reactive } from 'vue';
// ace Editor
import ace from 'ace-builds';
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-plain_text'
import 'ace-builds/src-noconflict/mode-json'; // Load the language definition file used below
import 'ace-builds/src-noconflict/mode-markdown'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/mode-vue'
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-github_dark'
import modeJsonUrl from 'ace-builds/src-noconflict/mode-json?url';
ace.config.setModuleUrl('ace/mode/json', modeJsonUrl);
import themeChromeUrl from 'ace-builds/src-noconflict/theme-chrome?url';
ace.config.setModuleUrl('ace/theme/chrome', themeChromeUrl);
import extSearchboxUrl from 'ace-builds/src-noconflict/ext-searchbox?url';
ace.config.setModuleUrl('ace/ext/searchbox', extSearchboxUrl);// searchBox
import workerJsonUrl from 'ace-builds/src-noconflict/worker-json?url'; // For vite
ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl);

let OSSClient: OSS;
onMounted(async () => {
    // 请求sts token，初始化OSSClient
    let sts_token_res: any = await request.get('console/ossToken');
    if (sts_token_res.code == 0) {
        // 请求成功
        sts_token_res = sts_token_res.data;
        OSSClient = new OSS({
            region: sts_token_res.OSSRegion,
            accessKeyId: sts_token_res.AccessKeyId,
            accessKeySecret: sts_token_res.AccessKeySecret,
            stsToken: sts_token_res.SecurityToken,
            refreshSTSTokenInterval: sts_token_res.ExpirationSec * 1000,
            bucket: sts_token_res.Bucket,

            refreshSTSToken: async () => {
                let sts_token_res: any = await request.get('console/ossToken');
                sts_token_res = sts_token_res.data;
                return {
                    accessKeyId: sts_token_res.AccessKeyId,
                    accessKeySecret: sts_token_res.AccessKeySecret,
                    stsToken: sts_token_res.SecurityToken,
                }
            },
        })
    } else {
        throw new Error('获取OSS Token失败')
    }

    await loadFullFileList();
    loadFileListShow();

    // aceEditor 深色模式监听
    // 监听主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkTheme);
    // 初始检查
    checkTheme();
})

const checkTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        aceEditorTheme.value = 'github_dark'
    } else {
        aceEditorTheme.value = 'github'
    }
};

onMounted(() => {
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', checkTheme);
})

// 当前目录
let prefix = ref('personal-web/');
// 完整的文件列表
const fileList: any[] = reactive([])
// 加载完整的文件列表
const loadFullFileList = async () => {
    try {
        // result.isTruncated ===> { marker: result.nextMarker } 用于后续实现翻页
        const res = (await OSSClient.list({ "prefix": "personal-web", "max-keys": 900 }, {})).objects;
        for (let i of res) {
            // 初始化处理，添加dir字段
            (i as any).dir = (i.name as string).endsWith('/');
        }

        fileList.splice(0, fileList.length);
        fileList.push(...res);
        ElMessage.success('文件列表加载完成')
        console.log(fileList)
    } catch (error) {
        ElMessage.error('文件列表加载失败')
    }
}
// 总文件列表
for (let item of fileList) {
    item.dir = item.name.endsWith('/')
}
// 文件列表可见数据
const fileListShow: any[] = reactive([]);
// 重置文件列表中，在列表中可见的数据
const loadFileListShow = () => {
    fileListShow.splice(0, fileListShow.length);
    const dirLength = prefix.value.indexOf('/') != -1 ? prefix.value.split('/').length - 1 : 0;
    fileList.forEach((item: any) => {
        const itemName: string = item.name;
        // 加入当前目录中的目录
        if (item.dir && itemName.startsWith(prefix.value) && itemName.split('/').length - 2 == dirLength)
            fileListShow.push(item)
    });
    fileList.forEach((item: any) => {
        const itemName: string = item.name;
        // 加入当前目录中的文件
        if (!item.dir && itemName.startsWith(prefix.value) && itemName.split('/').length - 1 == dirLength)
            fileListShow.push(item)
    });
}
// 文件被单击
const fileClick = (row: any, column: any, event: Event) => {
    if (!row.dir || column.label !== '文件名')
        return;
    prefix.value = row.name;
    loadFileListShow();
}
// 返回上级目录
const backtoLastDir = () => {
    const prefixArr = prefix.value.split('/')
    prefixArr.pop()
    prefixArr.pop()
    prefix.value = prefixArr.join('/') + (prefixArr.length > 0 ? '/' : '');
    loadFileListShow();
}
// 文件列表中文件名格式化
const fileListTableNameFormatter = (row: any) => {
    return (row.name as string).substring(prefix.value.length);
}
// 文件列表中上次修改时间格式化
const fileListTableLastModifiedFormatter = (row: any) => {
    return row.dir ? "" : new Date(row.lastModified).toLocaleString()
}
// 文件列表中文件大小格式化
function fileListTableSizeFormatter(row: any) {
    function formatterFileSize(num: number) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
        for (let i = 0; i < units.length; i++) {
            if (num < 1000)
                return num.toFixed(3) + units[i];
            num /= 1024;
        }
    }
    return row.dir ? "" : formatterFileSize(row.size)
}
// 退回到层级为index的某个目录
const Dirto = (index: number) => {
    const prefixArr = prefix.value.split('/');
    prefixArr.splice(index, prefixArr.length);
    prefix.value = prefixArr.join('/') + (prefixArr.length > 0 ? '/' : '');
    loadFileListShow();
}
// 删除选中的一些文件
const deleteChosenFile = () => {

}
// 文件选中状态被切换
const fileListSelectionChange = (newSelection: any[]) => {
    console.log(newSelection)
}
// 长传文件的列表
let uploadFiles: UploadFiles;
const onUploadFileChange = (_uploadFile: UploadFile, _uploadFiles: UploadFiles) => {
    uploadFiles = _uploadFiles;
}
// 上传文件
const uploadFile = async () => {
    if (uploadFiles.length < 1) {
        return ElMessage.error('请选择需要上传的文件')
    }
    // console.log(uploadFiles)
    // console.log(prefix.value)
    isUploading.value = true;
    let uploadSuccessCount = 0;
    for (let i of uploadFiles) {
        if (i.status == 'success' || i.status == 'uploading')
            continue;
        try {
            i.status = 'uploading';
            // 采用分片上传方式，以获取上传进度
            const name = prefix.value + i.raw!.name;
            const options: any = {
                // 获取分片上传进度、断点和返回值。
                progress: (p: any, cpt: any, res: any) => {
                    // console.log(p, cpt, res);
                    i.percentage = +(p * 100).toFixed(2);
                    if (p == 1) {
                        i.status = 'success';
                        uploadSuccessCount++;
                    }
                },
                // 设置并发上传的分片数量。
                parallel: 4,
                // 设置分片大小。默认值为256 KB，最小值为100 KB。
                partSize: 256 * 1024,
            }
            if (i.raw!.size > 10 * 1024 * 1024 * 1024)// 大于10GB的文件，分成50M
                options.partSize = 50 * 1024 * 1024;
            else if (i.raw!.size > 10 * 1024 * 1024)// 大于100MB的文件，分成1MB
                options.partSize = 1 * 1024 * 1024;
            await OSSClient.multipartUpload(name, i.raw, options);
        } catch (error) {
            i.status = 'fail';
            ElMessage.error(`上传失败 ${error}`)
        }
    }
    if (uploadSuccessCount) {
        ElMessage.success(`${uploadSuccessCount} 个文件上传完成`);
        await loadFullFileList();
        loadFileListShow();
    } else
        ElMessage.error(`文件上传失败`)
    isUploading.value = false;
}
// 文件列表操作：删除某个文件
const fileListHandleDelete = async (row: any) => {
    ElMessageBox.confirm(
        '是否要删除该文件？',
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        try {
            await OSSClient.delete(row.name);
            ElMessage.success('删除完成');
            await loadFullFileList();
            loadFileListShow();
        } catch (error) {
            ElMessage.error('删除失败');
        }
    })
}
// 文件列表操作：下载某个文件
const fileListHandleDownload = async (row: any) => {
    window.open(row.url);
}
// 文件列表操作：重命名某个文件
const fileListHandleRename = async (row: any) => {
    ElMessageBox.prompt('请输入新的文件名', '提示', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        inputValue: row.name
    }).then(async ({ value }) => {
        try {
            await OSSClient.copy(value, row.name);
            await OSSClient.delete(row.name);
            ElMessage.success('重命名成功');
            await loadFullFileList()
            loadFileListShow();
        } catch (error) {
            ElMessage.error('重命名失败');
        }
    }).catch(() => {
        // 已取消
    })
}
// 文件列表操作：编辑某个文件
const editableFileTypes = new Map([
    ['.txt', 'text'],
    ['.md', 'markdown'],
    ['.json', 'json'],
    ['.js', 'javascript'],
    ['.ts', 'typescript'],
    ['.vue', 'vue'],
    ['.html', 'html'],
    ['.css', 'css'],
]);
const fileListHandleEdit = async (row: ObjectMeta) => {
    aceEditorConfig.lang = '';
    for (let [key, value] of editableFileTypes) {
        if (row.name.endsWith(key)) {
            aceEditorConfig.lang = value;
            break;
        }
    }
    if (!aceEditorConfig.lang)
        return ElMessage.warning('不支持的文件格式')

    aceEditorFileInfo.url = row.url;
    aceEditorFileInfo.name = row.name;
    try {
        const res = await fetch(row.url);
        if (!res.ok)
            return ElMessage.error('请求失败')
        const blob = await res.blob();
        const text = await blob.text();
        aceEditorContent.text = text;
        aceEditorContent.textBak = text;
        aceEditorContent.type = blob.type;
        aceEditorShow.value = true;
    } catch (error) {
        ElMessage.error('打开失败')
    }
}

const dialogUploadFileShow = ref(false);
const isUploading = ref(false);

const aceEditorContent = reactive({
    text: '',
    textBak: '',
    type: ''
});
const aceEditorShow = ref(false);
const aceEditorFileInfo = reactive({ url: "", name: "" })
const aceEditorConfig = reactive({
    lang: 'textplain',
})
const closeAceEditor = () => {
    if (aceEditorContent.text == aceEditorContent.textBak)
        return aceEditorShow.value = false;
    ElMessageBox.confirm('文件未保存，是否退出？', '警告', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        aceEditorShow.value = false;
    }).catch(() => {

    })
}
const resetAceEditorContent = () => {
    if (aceEditorContent.text == aceEditorContent.textBak)
        return ElMessage.info('文件未修改')
    aceEditorContent.text = aceEditorContent.textBak;
    ElMessage.success('重置完成')
}
const saveAceEditorContentLoading = ref(false);
const saveAceEditorContent = async () => {
    if (aceEditorContent.text == aceEditorContent.textBak)
        return ElMessage.info('文件未修改')
    saveAceEditorContentLoading.value = true;
    try {
        const blob = new Blob([aceEditorContent.text], { type: aceEditorContent.type });
        const file = new File([blob], aceEditorFileInfo.name, { type: aceEditorContent.type });
        await OSSClient.put(aceEditorFileInfo.name, file);
        ElMessage.success('保存成功');
        aceEditorContent.textBak = aceEditorContent.text;
    } catch (error) {
        ElMessage.success('保存失败');
    } finally {
        saveAceEditorContentLoading.value = false;
    }
}
const aceEditorTheme = ref('github');
</script>
<template>
    <div class="container w-full">
        <div class="flex items-center p-[10px]">
            <el-button class="mr-[-15px]" @click="() => { loadFullFileList(); loadFileListShow(); }" circle link>
                <el-icon>
                    <Refresh />
                </el-icon>
            </el-button>
            <el-button @click="backtoLastDir" circle link>
                <el-icon>
                    <Back />
                </el-icon>
            </el-button>
            <el-text>当前目录：</el-text>
            <el-icon @click="Dirto(0)" class="cursor-pointer hover:text-[#222] mr-[5px]">
                <House />
            </el-icon>
            <span v-for="i, key of prefix.split('/')" class="text-[#666] dark:text-[#bbb]">
                <span v-if="i != ''" class="mx-[3px]">/</span>
                <span @click="Dirto(key + 1)" class="cursor-pointer hover:text-[#222] dark:hover:text-[#fff]">{{ i
                    }}</span>
            </span>
            <span class="mx-[3px] text-[#666]">/</span>
        </div>
    </div>
    <div class="container w-full">
        <el-button-group class="pl-[10px]">
            <el-button @click="dialogUploadFileShow = true">上传</el-button>
            <el-button>下载</el-button>
            <el-button>编辑</el-button>
            <el-button type="danger" :disabled="false" @click="deleteChosenFile">删除</el-button>
        </el-button-group>
    </div>
    <el-table :data="fileListShow" @cell-click="fileClick" @selection-change="fileListSelectionChange" border
        class="mt-[10px]">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="文件名" :formatter="fileListTableNameFormatter" />
        <el-table-column prop="lastModified" :formatter="fileListTableLastModifiedFormatter" label="最后修改时间"
            width="180" />
        <el-table-column prop="size" :formatter="fileListTableSizeFormatter" label="文件大小" width="130" />
        <el-table-column label="操作" width="200">
            <template #default="scope">
                <el-button v-if="!scope.row.dir" size="small" text
                    @click.prevent="fileListHandleEdit(scope.row)">编辑</el-button>
                <el-button v-if="!scope.row.dir" size="small" text style="margin-left: 0;"
                    @click.prevent="fileListHandleDownload(scope.row)">下载</el-button>

                <el-dropdown placement="bottom-end" v-if="!scope.row.dir">
                    <el-button size="small" text>更多</el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>
                                <el-button v-if="!scope.row.dir" size="small" text
                                    @click.prevent="fileListHandleRename(scope.row)">重命名</el-button>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-button v-if="!scope.row.dir" size="small" text type="danger" style="margin-left: 0;"
                                    @click.prevent="fileListHandleDelete(scope.row)">删除</el-button>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </template>
        </el-table-column>
    </el-table>
    <!-- 文件上传对话框 -->
    <el-dialog v-if="dialogUploadFileShow" v-model="dialogUploadFileShow" :multiple="true" title="上传文件"
        class="min-w-[300px]">
        <el-upload drag multiple :auto-upload="false" :on-change="onUploadFileChange" :disabled="isUploading">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                拖动文件到此处或 <em>单击选择</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">任何小于5GB的文件</div>
            </template>
        </el-upload>
        <el-button @click="uploadFile" :loading="isUploading" class="mt-[10px]">开始上传</el-button>
    </el-dialog>
    <!-- 在线文本编辑 -->
    <transition name="el-fade-in-linear">
        <div v-if="aceEditorShow"
            class="fixed w-full h-full inset-0 z-[2000] bg-[#00000066] flex justify-center items-center"
            @click="closeAceEditor">
            <div class="w-3/4 h-3/4 bg-white dark:bg-[#141414] p-[15px] rounded-[5px] flex flex-col" @click.stop>
                <div class="w-full flex items-center justify-between">
                    <span>正在编辑 - /{{ aceEditorFileInfo.name }}</span>
                    <el-button circle text @click="closeAceEditor">
                        <el-icon>
                            <Close />
                        </el-icon>
                    </el-button>
                </div>
                <div class="w-full flex items-center gap-[15px] pb-[15px]">
                    <span>语言
                        <el-select v-model="aceEditorConfig.lang" style="width: 130px;margin-left: 8px;">
                            <el-option v-for="[key, value] of editableFileTypes" :key="value" :label="value"
                                :value="value"></el-option>
                        </el-select>
                    </span>
                </div>
                <v-ace-editor v-model:value="aceEditorContent.text" :lang="aceEditorConfig.lang" :theme="aceEditorTheme"
                    class="w-full flex-1" />
                <div class="flex justify-end mt-[10px]">
                    <el-button @click="resetAceEditorContent">重置</el-button>
                    <el-button @click="saveAceEditorContent" :loading="saveAceEditorContentLoading"
                        type="primary">保存</el-button>
                </div>
            </div>
        </div>
    </transition>
</template>