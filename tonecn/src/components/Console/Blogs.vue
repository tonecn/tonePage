<script setup>
import { onMounted, reactive, ref } from 'vue';
import { request } from '../../lib/request'
import { ElMessage } from 'element-plus';
import { timestampToString } from '@/lib/timestampToString';
onMounted(async () => {
    await loadTableData();
})
const loadTableData = async () => {
    try {
        let resourcesRes = await request.get('/console/blogs')
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
const tableData = ref([])
const dialogEditFormVisible = ref(false);
const editForm = reactive({
    id: '',
    uuid: '',
    title: '',
    description: '',
    publish_time: '',
    src: '',
    access_level: '',
    visit_count: '',
    like_count: ''
})
const editHandle = (data) => {
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
    editForm.publish_time = '';
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
        let res = await request.post('/console/saveBlog', {
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
            return ElMessage.success('保存成功');
        } else {
            throw new Error(res.message);
        }
    } catch (error) {
        return ElMessage.error(`保存失败 ${error}`);
    }
}
const delHandle = async (data) => {
    let { id } = data;
    try {
        let res = await request.delete('/console/blog?id=' + id);
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
const formatTime = (row, column, cellValue, index) => {
    return timestampToString(row.publish_time);
}
</script>
<template>
    <div style="padding: 15px 20px;">
        <el-text>总数量：{{ tableData.length }}</el-text>
        <el-button type="primary" style="width: 120px;margin-left: 20px;" @click="addHandle">添加</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="id" width="50" />
        <el-table-column prop="uuid" label="uuid" width="120" show-overflow-tooltip />
        <el-table-column prop="title" label="标题" width="240" />
        <el-table-column prop="description" label="描述" width="200" show-overflow-tooltip />
        <el-table-column prop="publish_time" label="发布时间" width="160" :formatter="formatTime" />
        <el-table-column prop="access_level" label="可访问级别" width="100" />
        <el-table-column prop="visit_count" label="访问量" width="80" />
        <el-table-column prop="like_count" label="点赞量" width="80" />
        <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="editHandle(scope.row)">编辑</el-button>
                <el-button link type="primary" size="small" @click="delHandle(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

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
                <el-text style="margin-left: 20px;" size="small">默认可访问大于6的项</el-text>
            </el-form-item>
            <el-form-item label="访问量">
                <el-input-number v-model="editForm.visit_count" :min="0" disabled/>
            </el-form-item>
            <el-form-item label="点赞量">
                <el-input-number v-model="editForm.like_count" :min="0" disabled/>
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