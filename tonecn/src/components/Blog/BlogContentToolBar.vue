<script setup lang='ts'>
import { Star, Edit, StarFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { request, type BaseResponseData } from '@/lib/request';
import RotationVerification from '../Common/RotationVerification.vue';
const route = useRoute()
const bloguuid = route.params.uuid;
const emit = defineEmits(['comment-success'])
const inputComment = ref('')
let inputCommentName = '';
const toolBarVisible = ref(true);
const isLiked = ref(false)
const isCaptchaViewShow = ref(false)
let lastScrollTop = 0;
const handleScrollMove = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        toolBarVisible.value = false;// 下滑
    } else {
        toolBarVisible.value = true;// 上滑
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
}
const likeBlog = async () => {
    if (isLiked.value) {
        return ElMessage.success('已经点过赞啦～')
    }
    try {
        let likeRes: BaseResponseData = await request.post('/blogLike?bloguuid=' + bloguuid)
        if (likeRes.code == 0) {
            isLiked.value = true;
            return ElMessage.success('点赞成功～')
        } else {
            throw new Error(likeRes.message);
        }
    } catch (error) {
        console.error('点赞失败', error);
        return ElMessage.warning('手速太快啦～稍后再来试试吧');
    }
}
onMounted(async () => {
    window.addEventListener('scroll', handleScrollMove)
});
onUnmounted(async () => {
    window.removeEventListener('scroll', handleScrollMove)
})

const commentHandle = () => {
    if (inputComment.value == '' || inputComment.value.trim() == '') {
        return ElMessage.warning('请先填写留言内容哟～')
    }
    ElMessageBox.prompt('请输入留言昵称（可留空）', 'Tip', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
    }).then(({ value }) => {
        inputCommentName = value ? value : '';
        isCaptchaViewShow.value = true;
    }).catch(() => {
        ElMessage.info('已取消')
    })
}
const submitComment = async () => {
    isCaptchaViewShow.value = false;
    ElMessage.info('正在提交，请稍后')
    try {
        let commentRes: BaseResponseData = await request.post('blogComment', {
            session: localStorage.getItem('captcha-session'),
            bloguuid: bloguuid,
            content: inputComment.value.trim(),
            name: inputCommentName.trim() == '' ? '匿名' : inputCommentName.trim()
        })
        if (commentRes.code == 0) {
            emit('comment-success');
            return ElMessage.success('评论成功～');
        } else {
            throw new Error(commentRes.message);
        }
    } catch (error) {
        console.error('评论失败', error)
        ElMessage.error('遇到了一些问题，稍后再来试试吧～')
    }
}

</script>
<template>
    <transition name="el-zoom-in-bottom">
        <div class="fixed bottom-0 left-0 w-full bg-white dark:bg-[#111] shadow flex justify-center items-center" v-show="toolBarVisible">
            <div class="w-full max-w-[600px] flex items-center justify-center py-[12px] px-[20px]">
                <el-input v-model="inputComment" autosize type="textarea" class="mr-[12px]" placeholder="快来留下你的评论吧～"
                    clearable />
                <el-button type="primary" :icon="Edit" circle @click="commentHandle"></el-button>
                <el-button type="danger" :icon="isLiked ? StarFilled : Star" @click="likeBlog"
                    circle></el-button>
            </div>
        </div>
    </transition>
    <RotationVerification v-if="isCaptchaViewShow"
        @fail="() => { isCaptchaViewShow = false; ElMessage.warning('验证失败') }" @success="submitComment" />
</template>
