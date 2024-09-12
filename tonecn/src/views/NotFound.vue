<script setup lang='ts'>
import { onMounted, onUnmounted, ref } from 'vue';
const containerHeight = ref('800px');
onMounted(async () => {
    document.title = '404 不存在的页面';
    containerHeight.value = window.innerHeight > 500 ? window.innerHeight -85 + 'px' : '390px';
})
onUnmounted(() => {
    document.title = '特恩(TONE)';
})
</script>
<template>
    <div class="bcc"></div>
    <div class="content-container">
        <el-empty id="404-notfound-el-empty" style="margin-bottom: 200px;" description="404 不存在的页面" />
    </div>
</template>
<style scoped>
.bcc {
    position: fixed;
    z-index: -1;
    background-color: #f6f8f9;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.content-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 600px;
    margin: 0px auto;
    padding: 0 20px;
    height: v-bind(containerHeight);
}
</style>