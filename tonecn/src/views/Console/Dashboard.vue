<script setup lang="ts">
import { Menu as IconMenu, Document, Back, Tools, Files } from '@element-plus/icons-vue'
import Resources from '../../components/Console/Resources.vue'
import Blogs from '../../components/Console/Blogs.vue'
import Utils from '../../components/Console/Utils.vue'
import FileOnline from '../../components/Console/FileOnline.vue'
import { shallowRef, ref, onMounted, onUnmounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { request } from '@/lib/request'
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
    handleResize()
    window.addEventListener('resize', handleResize);

    const refreshToken = async () => {
        // 判断jwt过期时间并定期刷新    
        if (localStorage.getItem('jwtToken')) {
            const binaryString = atob(localStorage.getItem('jwtToken')!.split('.')[1]);
            const jwtPayload = JSON.parse(binaryString);
            if ((jwtPayload.exp - Math.floor(Date.now() / 1000)) < 0) {
                // token已过期
                localStorage.clear()
                window.location.reload()
            }
            if ((jwtPayload.exp - Math.floor(Date.now() / 1000)) / (jwtPayload.exp - jwtPayload.iat) < 0.3) {
                // 重新获取token
                console.log("token有效期 ", (jwtPayload.exp - Math.floor(Date.now() / 1000)) / (jwtPayload.exp - jwtPayload.iat), "不足%30，正在重新获取Token")
                let res: any = await request.get('/console/loginStatus');
                if (res.code == 0) {
                    localStorage.setItem('jwtToken', res.data.token)
                }
            }
        }
    }
    setInterval(refreshToken, 1000 * 60 * 30);// 30 分钟判定一次token有效期
    refreshToken()
})
onUnmounted(async () => {
    window.removeEventListener('resize', handleResize);
})
</script>
<template>
    <div class="flex w-[100vw]">
        <el-menu default-active="1" :collapse="menuCollapse">
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
        <div class="flex-1 overflow-x-scroll sm:min-h-[calc(100vh-90px)] min-h-[calc(100vh-77px)]">
            <KeepAlive>
                <component :is="tabComponent" />
            </KeepAlive>
        </div>
    </div>
</template>