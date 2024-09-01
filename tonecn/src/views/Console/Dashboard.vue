<script setup lang="ts">
import { Menu as IconMenu, Document } from '@element-plus/icons-vue'
import Resources from '../../components/Console/Resources.vue'
import Blogs from '../../components/Console/Blogs.vue'
import { shallowRef } from 'vue';
const tabComponent = shallowRef(Resources)
</script>
<template>
    <div class="dashboard-container">
        <el-menu default-active="1" class="menu">
            <el-menu-item index="1" @click="tabComponent = Resources">
                <el-icon><icon-menu /></el-icon>
                <span>资源及下载</span>
            </el-menu-item>
            <el-menu-item index="2" @click="tabComponent = Blogs">
                <el-icon>
                    <document />
                </el-icon>
                <span>博客</span>
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
.dashboard-container{
    display: flex;
}
.dashboard-container .menu{
    min-width: 200px;
}
</style>