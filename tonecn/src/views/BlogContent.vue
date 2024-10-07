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
const loadStatus = ref(0);// 0加载中 -1加载失败 -2文章不存在或不可见 1加载成功
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
        let blogContentRes: BaseResponseData = await request.get(`/blogContent?bloguuid=${bloguuid}`);
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
            loadStatus.value = -2;
        } else {
            throw new Error(blogContentRes.message);
        }
    } catch (error) {
        console.error('请求博客内容发生错误 ', error);
        loadStatus.value = -1;
    }
})
onUnmounted(() => {
    document.title = '特恩(TONE)';
})
</script>
<template>
    <div class="bg-default-bg fixed inset-0 w-full h-full -z-10 dark:bg-[#222]"></div>
    <div class="flex flex-col max-w-[600px] my-[50px] mx-auto px-[20px]">
        <div class="mx-auto dark:text-white" v-if="loadStatus == 0">加载中，请稍后...</div>
        <el-empty v-if="loadStatus < 0" :description="loadStatus == -1 ? '加载失败，刷新后重试' : '文章不存在或不可见'" />
        <div v-if="loadStatus == 1">
            <div>
                <h1 class="text-center text-[28px] font-semibold dark:text-white">{{ blogInfo.title }}</h1>
                <p class="my-[15px] mx-auto text-[14px] text-[#888] dark:text-[#ccc] text-center">发布于 {{
                    timestampToString(blogInfo.publish_time) }}</p>
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
    width: 100%;
}

#blogContentContainer p {
    color: #555;
}

#blogContentContainer p code {
    background-color: #dedede;
    padding: 2px 3px;
}

#blogContentContainer blockquote {
    margin: 16px 0;
    padding-left: 25px;
    border-left: 4px solid #ddd;
}

#blogContentContainer blockquote p {
    color: #888;
}

#blogContentContainer p {
    margin-top: 10px;
    margin-bottom: 10px;
}

#blogContentContainer pre {
    border-radius: 5px;
    overflow: hidden;
}

#blogContentContainer pre code {
    overflow-x: scroll;
}

#blogContentContainer h1,
#blogContentContainer h2,
#blogContentContainer h3,
#blogContentContainer h4,
#blogContentContainer h5,
#blogContentContainer h6 {
    font-weight: 600;
}

#blogContentContainer h1 {
    font-size: 28px;
    border-bottom: 1px solid #ddd;
}

#blogContentContainer h2 {
    font-size: 24px;
    border-bottom: 1px solid #ddd;
}

#blogContentContainer h3 {
    font-size: 22px;
}

#blogContentContainer h4 {
    font-size: 20px;
}

#blogContentContainer h5 {
    font-size: 18px;
}

#blogContentContainer h6 {
    font-size: 16px;
}

#blogContentContainer pre {
    font-size: 12px;
    border-radius: 8px;
    box-shadow: 0px 4px 10px -2px rgba(0, 0, 0, 0.3);
}
</style>