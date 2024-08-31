<script setup>
import { request } from '@/lib/request';
import { onMounted, reactive, ref } from 'vue';
import { timestampToString } from '../lib/timestampToString'
import { formateTimes } from '@/lib/formateTimes';
const loadStatus = ref(0);
const blogList = reactive([]);

onMounted(async () => {
    try {
        const blogListRes = await request.get('/blogList');
        if (blogListRes.code == 0) {
            blogList.push(...blogListRes.data);
            loadStatus.value = 1;
        } else {
            throw new Error(blogListRes.message);
        }
    } catch (error) {
        console.error(error)
        loadStatus.value = -1;
    }
})
</script>
<template>
    <div class="bcc"></div>
    <div class="content-container">
        <el-empty description="加载失败，刷新后重试" style="margin: 0 auto;" v-if="loadStatus == -1" />
        <div style="gap: 30px;display: flex;flex-direction: column;" v-else>
            <div class="coding" v-if="loadStatus == 0">加载中，请稍后...</div>
            <el-empty description="暂无数据" style="margin: 0 auto;" v-if="loadStatus == 1 && blogList.length == 0" />
            <div class="blog-container" v-for="item of blogList">
                <a class="title" :href="`/blogContent/${item.uuid}`" target="_blank">{{ item.title }}</a>
                <div class="description">{{ item.description }}</div>
                <div class="publish-time">{{ timestampToString(+item.publish_time) }} ——
                    {{ formateTimes(item.visit_count) }} 次访问</div>
            </div>
        </div>
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
    max-width: 800px;
    margin: 50px auto;
    padding: 0 20px;
}

.coding {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 300px;
}

.blog-container {
    margin: 0 auto;
    max-width: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.blog-container .title {
    font-size: 26px;
    font-weight: 600;
    cursor: pointer;
    display: block;
}

.blog-container .title:hover {
    text-decoration: underline;
    text-decoration-thickness: 3px;
}

.blog-container .description {
    color: #666;
}

.blog-container .publish-time {
    color: #888;
    margin-top: 15px;
    font-size: 14px;
}
</style>