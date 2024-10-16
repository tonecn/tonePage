<script setup lang='ts'>
import { request, type BaseResponseData } from '@/lib/request';
import { onMounted, reactive, ref } from 'vue';
import { timestampToString } from '../lib/timestampToString'
import { formateTimes } from '@/lib/formateTimes';
const loadStatus = ref(0);
const blogList: any[] = reactive([]);

onMounted(async () => {
    try {
        const blogListRes:BaseResponseData = await request.get('/blogList');
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
    <div class="bg-default-bg fixed inset-0 w-full h-full -z-10 dark:bg-[#222]"></div>
    <div class="flex flex-col max-w-[800px] my-[30px] mx-auto px-[20px]">
        <el-empty description="加载失败，刷新后重试" style="margin: 0 auto;" v-if="loadStatus == -1" />
        <div class="gap-[30px] flex flex-col" v-else>
            <div class="text-center mt-[20px] mb-[300px] dark:text-white" v-if="loadStatus == 0">加载中，请稍后...</div>
            <el-empty description="暂无数据" style="margin: 0 auto;" v-if="loadStatus == 1 && blogList.length == 0" />
            <div class="mx-auto max-w-[400px] w-full flex flex-col" v-for="item of blogList">
                <a class="text-[26px] font-semibold cursor-pointer block hover:underline dark:text-white text-[#333]" :href="`/blogContent/${item.uuid}`" target="_blank">
                    {{ item.title }}
                    <span v-if="item.access_level == 9" class="text-[10px] text-[#666] dark:text-[#ccc] font-normal border border-[#d7d9de] py-[2px] px-[4px] rounded-[10px] bg-[#ebecf0] dark:border-[#999] dark:!bg-[#ffffff22]">受密码保护</span>
                </a>
                <div class="text-[#666] dark:text-[#ccc]">{{ item.description }}</div>
                <div class="text-[#888] mt-[15px] text-[14px]">{{ timestampToString(+item.publish_time) }} ·
                    {{ formateTimes(item.visit_count) }} 次访问</div>
            </div>
        </div>
    </div>
</template>