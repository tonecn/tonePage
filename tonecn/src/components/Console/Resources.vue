<script setup lang='ts'>
import { onMounted, reactive, ref, type Ref } from 'vue';
import { request, type BaseResponseData } from '../../lib/request'
import { ElMessage } from 'element-plus';
type ResourceData = {
    uuid: string,
    type: string,
    recommand: number,
    title: string,
    describe: string,
    icon_src: string,
    addition: string,
    src: string,
}
onMounted(async () => {
    await loadTableData();
})
const tableData: Ref<any[]> = ref([])
const dialogEditFormVisible = ref(false);
const loadTableData = async () => {
    try {
        let resourcesRes: BaseResponseData = await request.get('/console/resources')
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
const editForm: ResourceData = reactive({
    uuid: '',
    type: '',
    recommand: 1,
    title: '',
    describe: '',
    icon_src: '',
    addition: '',
    src: '',
})
const openEditFormSrc = () => { window.open(editForm.src); }
const editHandle = (data: ResourceData) => {
    editForm.uuid = data.uuid;
    editForm.type = data.type;
    editForm.recommand = +data.recommand;
    editForm.title = data.title;
    editForm.describe = data.describe;
    editForm.icon_src = data.icon_src;
    editForm.src = data.src;
    editForm.addition = JSON.stringify(data.addition);
    dialogEditFormVisible.value = true;
}
const addHandle = () => {
    editForm.uuid = '';
    editForm.type = '';
    editForm.recommand = 1;
    editForm.title = '';
    editForm.describe = '';
    editForm.icon_src = '';
    editForm.src = '';
    editForm.addition = '';
    dialogEditFormVisible.value = true;
}
const saveHandle = async () => {
    // 表单验证
    if (!editForm.addition || !editForm.describe || !editForm.icon_src || !editForm.recommand || !editForm.src || !editForm.title || !editForm.type) {
        return ElMessage.warning('请先完成表单')
    }
    try {
        let res: BaseResponseData = await request.post('/console/saveResource', {
            uuid: editForm.uuid,
            type: editForm.type,
            recommand: editForm.recommand,
            title: editForm.title,
            describe: editForm.describe,
            icon_src: editForm.icon_src,
            addition: editForm.addition,
            src: editForm.src,
        })
        if (res.code == 0) {
            dialogEditFormVisible.value = false;
            loadTableData();
            return ElMessage.success('保存成功');
        } else {
            throw new Error(res.message);
        }
    } catch (error) {
        return ElMessage.error(`保存失败 ${error}`);
    }
}
const delHandle = async (data: { id: string, [key: string]: any }) => {
    let { uuid } = data;
    try {
        let res: BaseResponseData = await request.delete('/console/resource?uuid=' + uuid);
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
    return new Date(row.created_at).toLocaleString();
}
</script>
<template>
    <div class="py-[15px] px-[20px]">
        <el-text>总数量：{{ tableData.length }}</el-text>
        <el-button type="primary" style="width: 120px;margin-left: 20px;" @click="addHandle">添加</el-button>
    </div>
    <!-- 数据列表 -->
    <el-table :data="tableData" border class="w-full">
        <el-table-column prop="uuid" label="uuid" width="60" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="80" sortable>
            <template #default="scope">
                {{ scope.row.type == 'resource' ? '资源' : scope.row.type == 'download' ? '下载' : '未知' }}
            </template>
        </el-table-column>
        <el-table-column prop="recommand" label="推荐" width="60" />
        <el-table-column prop="title" label="标题" width="130" />
        <el-table-column prop="describe" label="描述" width="200" />
        <el-table-column prop="icon_src" label="图标" width="110">
            <template #default="scope">
                <div class="el-table-col-image-preview">
                    <el-image :src="scope.row.icon_src" />
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="addition" label="附加样式" width="300">
            <template #default="scope">
                {{ scope.row.addition }}
            </template>
        </el-table-column>
        <el-table-column prop="src" label="资源" width="180" />
        <el-table-column fixed="right" label="操作" min-width="110">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="editHandle(scope.row)">编辑</el-button>
                <el-button link type="primary" size="small" @click="delHandle(scope.row)">删除</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" :formatter="formatTime" />
    </el-table>
    <!-- 编辑、添加资源对话框 -->
    <el-dialog v-model="dialogEditFormVisible" title="编辑" width="800">
        <el-form :model="editForm" label-width="auto" class="mx-[30px]">
            <el-form-item label="uuid">
                <el-input v-model="editForm.uuid" disabled />
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="editForm.type" placeholder="请选择类型">
                    <el-option label="资源" value="resource" />
                    <el-option label="下载" value="download" />
                </el-select>
            </el-form-item>
            <el-form-item label="推荐程度">
                <el-input-number v-model="editForm.recommand" :min="1" />
            </el-form-item>
            <el-form-item label="标题">
                <el-input v-model="editForm.title" />
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="editForm.describe" type="textarea" autosize />
            </el-form-item>
            <el-form-item label="图标链接">
                <el-input v-model="editForm.icon_src" />
                <img :src="editForm.icon_src" class="w-[80px] h-[80px] mt-2 shadow rounded-[4px] bg-gray-100"
                    alt="链接无效">
            </el-form-item>
            <el-form-item label="资源链接">
                <el-input v-model="editForm.src" />
                <el-button class="mt-2" @click="openEditFormSrc">前往链接</el-button>
            </el-form-item>
            <el-form-item label="附加样式">
                <el-input v-model="editForm.addition" type="textarea" autosize />
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