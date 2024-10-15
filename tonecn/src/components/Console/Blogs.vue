<script setup lang='ts'>
import { onMounted, reactive, ref, type Ref } from 'vue';
import { request, type BaseResponseData } from '../../lib/request'
import { ElMessage, ElMessageBox } from 'element-plus';
import { timestampToString } from '@/lib/timestampToString';
const tableData: Ref<any[]> = ref([])
const dialogEditFormVisible = ref(false);
type BlogContentData = {
    id: string,
    uuid: string,
    title: string,
    description: string,
    publish_time: Date,
    src: string,
    access_level: number,
    visit_count: number,
    like_count: number,
    encrypt_p: string,
}
onMounted(async () => {
    await loadTableData();
})
const loadTableData = async () => {
    try {
        let resourcesRes: BaseResponseData = await request.get('/console/blogs')
        if (resourcesRes.code == 0) {
            tableData.value = [];
            tableData.value.push(...resourcesRes.data);
        } else {
            throw new Error(resourcesRes.message);
        }
    } catch (error) {
        ElMessage.error(`加载失败 ${error}`)
    }
}
const editForm: BlogContentData = reactive({
    id: '',
    uuid: '',
    title: '',
    description: '',
    publish_time: new Date(),
    src: '',
    encrypt_p: '',
    access_level: 0,
    visit_count: 0,
    like_count: 0
})
const editHandle = (data: any) => {
    editForm.id = data.id;
    editForm.uuid = data.uuid;
    editForm.title = data.title;
    editForm.description = data.description;
    editForm.publish_time = new Date(+data.publish_time);
    editForm.src = data.src;
    editForm.access_level = data.access_level;
    editForm.visit_count = data.visit_count;
    dialogEditFormVisible.value = true;
}
const addHandle = () => {
    editForm.id = '';
    editForm.uuid = '';
    editForm.title = '';
    editForm.description = '';
    editForm.publish_time = new Date();
    editForm.src = '';
    editForm.access_level = 10;
    editForm.visit_count = 0;
    editForm.like_count = 0;
    dialogEditFormVisible.value = true;
}
const saveHandle = async () => {
    // 表单验证
    if (!editForm.title || !editForm.description || !editForm.publish_time || !editForm.src || !editForm.access_level) {
        return ElMessage.warning('请先完成表单')
    }
    try {
        let res: BaseResponseData = await request.post('/console/saveBlog', {
            id: editForm.id,
            uuid: editForm.uuid,
            title: editForm.title,
            description: editForm.description,
            publish_time: editForm.publish_time.getTime(),
            src: editForm.src,
            access_level: editForm.access_level,
        })
        if (res.code == 0) {
            dialogEditFormVisible.value = false;
            loadTableData();
            if ([7, 9].includes(editForm.access_level)) {
                ElMessageBox.prompt('保存成功，当前文章可访问级别为：受保护。是否立即添加密码？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    inputPattern: /\S+/,
                    inputErrorMessage: '输入不能为空或仅包含空白字符'
                })
                    .then(async ({ value }) => {
                        await request.post('/console/setBlogPasswd', {
                            uuid: editForm.uuid,
                            passwd: value,
                        }).then((res: any) => {
                            if (res.code == 0) {
                                ElMessage({
                                    type: 'success',
                                    message: `密码设置成功`,
                                })
                            } else {
                                ElMessage({
                                    type: 'error',
                                    message: `密码设置失败`,
                                })
                            }
                        }).catch((err) => {
                            console.log(err)
                            ElMessage({
                                type: 'error',
                                message: `密码设置发生错误`,
                            })
                        })

                    })
                    .catch(() => {
                        ElMessage({
                            type: 'info',
                            message: '已取消',
                        })
                    })
            } else {
                return ElMessage.success('保存成功');
            }
        } else {
            throw new Error(res.message);
        }
    } catch (error) {
        return ElMessage.error(`保存失败 ${error}`);
    }
}
const delHandle = async (data: { id: string, [key: string]: any }) => {
    let { id } = data;
    try {
        let res: BaseResponseData = await request.delete('/console/blog?id=' + id);
        if (res.code == 0) {
            ElMessage.success('删除成功');
            loadTableData();
        } else {
            throw new Error(res.message)
        }
    } catch (error) {
        return ElMessage.error(`删除失败 ${error}`);
    }
}
const formatTime = (row: any, _column: any, _cellValue: any, _index: any) => {
    return timestampToString(row.publish_time);
}
</script>
<template>
    <div class="px-[20px] py-[15px]">
        <el-text>总数量：{{ tableData.length }}</el-text>
        <el-button type="primary" class="w-[120px] ml-[20px]" @click="addHandle">添加</el-button>
    </div>
    <!-- 数据列表 -->
    <el-table :data="tableData" border class="w-full">
        <el-table-column prop="id" label="id" width="50" />
        <el-table-column prop="uuid" label="uuid" width="120" show-overflow-tooltip />
        <el-table-column prop="title" label="标题" width="240" />
        <el-table-column prop="description" label="描述" width="200" show-overflow-tooltip />
        <el-table-column prop="publish_time" label="发布时间" width="160" :formatter="formatTime" />
        <el-table-column prop="access_level" label="可访问级别" width="100" />
        <el-table-column prop="visit_count" label="访问量" width="80" />
        <el-table-column prop="like_count" label="点赞量" width="80" />
        <!-- <el-table-column label="加密" width="80">
            <template #default="scope">
                <el-text>{{ scope.encrypt_p ? "是" : "否" }}</el-text>
            </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" min-width="110">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="editHandle(scope.row)">编辑</el-button>
                <el-button link type="primary" size="small" @click="delHandle(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 编辑、添加博客对话框 -->
    <el-dialog v-model="dialogEditFormVisible" title="编辑" width="800">
        <el-form :model="editForm" label-width="auto" style="margin: 0 30px;">
            <el-form-item label="id">
                <el-input v-model="editForm.id" disabled />
            </el-form-item>
            <el-form-item label="uuid">
                <el-input v-model="editForm.uuid" disabled />
            </el-form-item>
            <el-form-item label="标题">
                <el-input v-model="editForm.title" />
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="editForm.description" type="textarea" autosize />
            </el-form-item>
            <el-form-item label="发布时间">
                <el-date-picker v-model="editForm.publish_time" type="datetime" placeholder="选择发布时间" />
            </el-form-item>
            <el-form-item label="文章链接">
                <el-input v-model="editForm.src" type="textarea" autosize />
            </el-form-item>
            <el-form-item label="可访问级别">
                <el-input-number v-model="editForm.access_level" :min="0" />
                <el-tooltip placement="right">
                    <template #content>
                        1 ～ 6 - 保留<br />
                        7 - 列表不可见，文章内容无身份验证访问<br />
                        8 - 列表不可见，文章内容公开<br />
                        9 - 列表可见，文章内容可无状态验证访问<br />
                        10 - 列表可见，文章内容公开<br />
                    </template>
                    <el-text style="margin-left: 20px;" size="small">查看规则</el-text>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="访问量">
                <el-input-number v-model="editForm.visit_count" :min="0" disabled />
            </el-form-item>
            <el-form-item label="点赞量">
                <el-input-number v-model="editForm.like_count" :min="0" disabled />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogEditFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveHandle">保存</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<style scoped>
.el-table-col-image-preview {
    display: flex;
    align-items: center;
    height: 80px;
    width: 80px;
    margin: 0 auto;
}
</style>