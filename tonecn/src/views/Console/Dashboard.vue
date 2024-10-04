<script setup lang="ts">
import { Menu as IconMenu, Document, Back, Tools, Files } from '@element-plus/icons-vue'
import Resources from '../../components/Console/Resources.vue'
import Blogs from '../../components/Console/Blogs.vue'
import Utils from '../../components/Console/Utils.vue'
import FileOnline from '../../components/Console/FileOnline.vue'
import { shallowRef, ref, onMounted, onUnmounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const tabComponent = shallowRef(Resources);
const menuCollapse = ref(false)
const handleResize = () => {
    if (window.matchMedia('(max-width: 768px)').matches) {
        menuCollapse.value = true;
    } else {
        menuCollapse.value = false;
    }
};
const logout = () => {
    ElMessageBox.confirm(
        '是否要退出登录？',
        '警告',
        {
            confirmButtonText: '退出',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        localStorage.clear()
        ElMessage.success('退出成功')
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    })
}
onMounted(async () => {
    window.addEventListener('resize', handleResize);
})
onUnmounted(async () => {
    window.removeEventListener('resize', handleResize);
})
</script>
<template>
    <div class="dashboard-container">
        <el-menu default-active="1" :collapse="menuCollapse" class="menu">
            <el-menu-item index="1" @click="tabComponent = Resources">
                <el-icon><icon-menu /></el-icon>
                <span style="width: 140px;">资源及下载</span>
            </el-menu-item>
            <el-menu-item index="2" @click="tabComponent = Blogs">
                <el-icon>
                    <document />
                </el-icon>
                <span>博客管理</span>
            </el-menu-item>
            <el-menu-item index="3" @click="tabComponent = FileOnline">
                <el-icon>
                    <Files />
                </el-icon>
                <span>文件管理</span>
            </el-menu-item>
            <el-menu-item index="4" @click="tabComponent = Utils">
                <el-icon>
                    <Tools />
                </el-icon>
                <span>实用工具</span>
            </el-menu-item>
            <el-menu-item @click="logout">
                <el-icon>
                    <Back />
                </el-icon>
                <span>退出登录</span>
            </el-menu-item>
        </el-menu>
        <div style="flex: 1;min-height: calc(100vh - 90px);">
            <KeepAlive>
                <component :is="tabComponent" />
            </KeepAlive>
        </div>
    </div>
</template>
<style scoped>
.dashboard-container {
    display: flex;
}

.dashboard-container .menu {
    /* min-width: 200px; */
}
</style>