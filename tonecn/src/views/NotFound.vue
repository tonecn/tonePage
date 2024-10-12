<script setup lang='ts'>
import { onMounted, onUnmounted } from 'vue';
onMounted(async () => {
    document.title = '404 不存在的页面';
})

onUnmounted(async () => {
    document.title = '特恩(TONE)'
})

</script>
<template>
    <div class="bg-default-bg fixed inset-0 w-full h-full -z-10 dark:bg-[#222]"></div>
    <div
        class="flex max-w-[800px] flex-col items-center justify-center mx-auto min-h-[320px] sm:h-[calc(100vh-90px)] h-[calc(100vh-77px)]">
        <el-empty id="404-notfound-el-empty" style="margin-bottom: 100px;" description="404 不存在的页面" />
    </div>
</template>