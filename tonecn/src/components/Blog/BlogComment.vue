<script setup lang='ts'>
import { request, type BaseResponseData } from '@/lib/request';
import { computed, onMounted, reactive, ref, watch, watchEffect } from 'vue';
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
        let commentRes: BaseResponseData = await request.get(`/blogComment?bloguuid=${bloguuid}`);
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

watchEffect(() => {
    if (model.value) {
        model.value = false;
        loadComment();
    }
})
</script>
<template>
    <el-divider></el-divider>
    <div class="w-full">
        <div
            class="border-l-[4px] border-l-[#ccc] text-[18px] pl-[15px] mb-[10px] text-[#444] dark:text-[#fff] cursor-default">
            评论</div>
        <div class="my-[10px]" v-for="blogcomment of blogCommentList">
            <div class=" text-[#555] dark:text-[#fff]">{{ blogcomment.name }}</div>
            <div class="text-[12px] text-[#888] dark:text-[#aaa]">IP属地：{{ blogcomment.ip_address }}</div>
            <div class="text-[12px] text-[#888] dark:text-[#aaa]">{{ new Date(blogcomment.created_at).toLocaleString()
                }}</div>
            <div class="py-[10px] border-b border-b-[#ddd] text-[#333] dark:text-[#fff] whitespace-pre-wrap">{{
                blogcomment.content }}</div>
        </div>
        <div class="text-[14px] text-[#666] dark:text-[#fff] my-[15px]">—— {{ getStatusText }} ——</div>
    </div>
</template>