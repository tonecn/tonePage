<script setup lang='ts'>
import { request, type BaseResponseData } from '@/lib/request';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { timestampToString } from '@/lib/timestampToString';
const model = defineModel();
const route = useRoute()
const bloguuid = route.params.uuid;
const blogCommentList: any[] = reactive([]);
const loadStatus = ref(0)// 0加载中 1已加载全部评论 -1加载失败
onMounted(async () => {
    await loadComment();
})

const getStatusText = computed(() => {
    switch (loadStatus.value) {
        case 0:
            return '加载中，请稍后...'
        case 1:
            return '已加载全部评论'
        case -1:
            return '加载失败，刷新后重试'
    }
})

const loadComment = async () => {
    try {
        let commentRes:BaseResponseData = await request.get(`/blogComment?bloguuid=${bloguuid}`);
        if (commentRes.code == 0) {
            blogCommentList.splice(0, blogCommentList.length);
            blogCommentList.push(...commentRes.data);
            loadStatus.value = 1;
        } else {
            throw new Error(commentRes.message);
        }
    } catch (error) {
        console.log(error)
        loadStatus.value = -1;
    }
}

watch(model, (newValue, oldValue) => {
    if (newValue) {
        loadComment();
    }
})
</script>
<template>
    <el-divider></el-divider>
    <div class="blogcomment-container">
        <div class="title">评论</div>
        <div class="comment" v-for="blogcomment of blogCommentList">
            <div class="name">{{ blogcomment.name }}</div>
            <div style="font-size: 12px;color: #888;">IP属地：{{ blogcomment.ip_address }}</div>
            <div class="time">{{ timestampToString(blogcomment.time) }}</div>
            <div class="content">「{{ blogcomment.content }}」</div>
        </div>
        <div class="status">—— {{ getStatusText }} ——</div>
    </div>
</template>
<style scoped>
.blogcomment-container .title {
    border-left: 4px solid #ccc;
    font-size: 18px;
    padding-left: 15px;
    margin-bottom: 10px;
    color: #444;
    cursor: default;
}

.blogcomment-container .comment {
    margin: 10px 0px;
}

.blogcomment-container .comment .name {
    color: #555;
}

.blogcomment-container .comment .time {
    font-size: 12px;
    color: #888;
}

.blogcomment-container .comment .content {
    color: #333;
    padding: 10px 0px;
    border-bottom: 1px solid #ddd;
}

.blogcomment-container .status {
    margin: 15px 0px;
    color: #666;
    font-size: 14px;
}
</style>