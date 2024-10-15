<script setup lang='ts'>
import { request, type BaseResponseData } from '@/lib/request';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import { timestampToString } from '../lib/timestampToString'
import { useRoute } from 'vue-router'
import { Marked } from 'marked';
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import "highlight.js/styles/xcode.css";
import BlogContentToolBar from '@/components/Blog/BlogContentToolBar.vue';
import BlogComment from '@/components/Blog/BlogComment.vue';
type BlogInfo = {
    visit_count: number,
    title: string,
    publish_time: string,
    like_count: number,
    description: string
}
const loadStatus = ref(0);// 0加载中 -1加载失败 1加载成功
const loadStatusDescription = ref('出错啦，返回到上一个界面重试吧');
const route = useRoute();
const blogContent = ref('');
const blogInfo: Ref<BlogInfo> = ref({
    visit_count: 0,
    title: '',
    publish_time: '',
    like_count: 0,
    description: ''
});
const blogCommentReload = ref(false);

const marked = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang, info) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    })
);

onMounted(async () => {
    const bloguuid = route.params.uuid;
    if (bloguuid.length != 32) {
        return loadStatus.value = -1;
    }
    try {
        let blogContentRes: BaseResponseData = await request.get(`/blogContent?bloguuid=${bloguuid}` + (window.location.href.indexOf('?') != -1 ? "&" + window.location.href.split('?')[1] : ""));
        console.log(blogContent.value)
        if (blogContentRes.code == 0) {
            try {
                blogContent.value = await marked.parse(decodeURIComponent(escape(atob(blogContentRes.data.data))))
                blogInfo.value = blogContentRes.data.info;
                loadStatus.value = 1;

                // 标题
                document.title = blogContentRes.data.info.title + ' —— 特恩(TONE)';
            } catch (error) {
                throw error
            }
        } else if (blogContentRes.code == -4001) {
            // 不可见或不存在
            loadStatus.value = -1;
            loadStatusDescription.value = '文章不可见或不存在'
        } else if (blogContentRes.code == -4002) {
            // 文章加密
            loadStatus.value = -1;
            loadStatusDescription.value = '文章被加密啦，请联系发布者'
        } else if (blogContentRes.code == -4003) {
            loadStatus.value = -2;
            loadStatusDescription.value = '密钥好像有点问题，请联系发布者'
        } else {
            throw new Error(blogContentRes.message);
        }
    } catch (error) {
        console.error('请求博客内容发生错误 ', error);
        loadStatusDescription.value = '加载失败，刷新后重试';
        loadStatus.value = -1;
    }
})
onUnmounted(() => {
    document.title = '特恩(TONE)';
})
</script>
<template>
    <div class="bg-default-bg dark:bg-[#222] fixed inset-0 w-full h-full -z-10"></div>
    <div class="flex flex-col max-w-[600px] my-[50px] mx-auto px-[20px]">
        <div class="mx-auto dark:text-white" v-if="loadStatus == 0">加载中，请稍后...</div>
        <el-empty v-if="loadStatus < 0" :description="loadStatusDescription" />
        <div v-if="loadStatus == 1">
            <div>
                <h1 class="text-center text-[28px] font-semibold dark:text-white text-[#222]">{{ blogInfo.title }}</h1>
                <p class="my-[15px] mx-auto text-[14px] text-[#888] dark:text-[#ccc] text-center">发布于 {{
                    timestampToString(blogInfo.publish_time) }} ｜ {{ blogInfo.like_count }} 点赞</p>
                <!-- TODO <p class="mt-[-10px] mx-auto text-[14px] text-[#888] dark:text-[#ccc] text-center whitespace-pre">
                    {{ blogInfo.visit_count }} 访问
                    {{ blogInfo.like_count }} 点赞
                </p> -->
            </div>
            <div v-html="blogContent" id="blogContentContainer"></div>
        </div>

        <BlogComment v-if="loadStatus == 1" v-model="blogCommentReload" />
    </div>
    <BlogContentToolBar v-if="loadStatus == 1" @comment-success="blogCommentReload = true;" />
</template>
<style>
/* markdown CSS */
#blogContentContainer img {
    @apply w-full my-[5px];
}

#blogContentContainer p {
    @apply text-[#555] dark:text-[#ddd] my-[10px];
}

#blogContentContainer p code {
    @apply bg-[#dedede] dark:bg-[#ffffff44] py-[1px] px-[3px] rounded-[3px];
}

#blogContentContainer blockquote {
    @apply my-[16px] pl-[25px] border-[4px_solid_#ddd];
}

#blogContentContainer blockquote p {
    @apply text-[#888];
}

#blogContentContainer pre {
    @apply rounded-[5px] overflow-hidden;
}

#blogContentContainer pre code {
    @apply overflow-x-scroll;
}

#blogContentContainer h1,
#blogContentContainer h2,
#blogContentContainer h3,
#blogContentContainer h4,
#blogContentContainer h5,
#blogContentContainer h6 {
    @apply font-[800] text-[#333] dark:text-[#fff] mt-[20px];
}

#blogContentContainer h1 {
    @apply text-[28px] border-b-[#ddd] dark:border-b-[#999] border-b;
}

#blogContentContainer h2 {
    @apply text-[24px] border-b-[#ddd] dark:border-b-[#999] border-b;

}

#blogContentContainer h3 {
    @apply text-[22px];
}

#blogContentContainer h4 {
    @apply text-[20px];
}

#blogContentContainer h5 {
    @apply text-[18px];
}

#blogContentContainer h6 {
    @apply text-[16px];
}

#blogContentContainer pre {
    @apply text-[12px] rounded-[8px] shadow;
}
</style>