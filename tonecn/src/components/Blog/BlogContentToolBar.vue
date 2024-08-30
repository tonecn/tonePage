<script setup>
import { Star, Edit, StarFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { request } from '@/lib/request';
const route = useRoute()
const bloguuid = route.params.uuid;
const inputComment = ref('')
const inputCommentName = ref('')
const commentDialogVisible = ref(false)
const toolBarVisible = ref(true);
const isLiked = ref(false)
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
        let likeRes = await request.post('/blogLike?bloguuid=' + bloguuid)
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

</script>
<template>
    <transition name="el-zoom-in-bottom">
        <div class="tool-bar-container" v-show="toolBarVisible">
            <div class="tool-bar">
                <el-input v-model="inputComment" autosize type="textarea" class="input-comment" placeholder="快来留下你的评论吧～"
                    clearable />
                <el-button type="primary" :icon="Edit" class="button" circle @click=""></el-button>
                <el-button type="danger" :icon="isLiked ? StarFilled : Star" class="button" @click="likeBlog"
                    circle></el-button>
            </div>
            <el-dialog v-model="commentDialogVisible" title="提示">
                <div style="display: flex;flex-direction: column;gap: 5px;">
                    <div>每篇文章最多可发布3条评论，确认要现在发布吗？</div>
                    <div>另外，您可选择留下昵称：</div>
                    <el-input v-model="inputCommentName" placeholder="昵称（可选）" />
                </div>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="CommentDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="sendComment">确认</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
    </transition>
</template>
<style scoped>
.tool-bar-container {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    /* height: 60px; */
    background-color: #ffffff;
    box-shadow: 0px 0px 9px 1px #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
}

.tool-bar {
    width: 100%;
    max-width: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
}

.input-comment {
    margin-right: 12px;
}

@media screen and (max-width: 570px) {
    .button {
        background-color: none;
    }
}
</style>