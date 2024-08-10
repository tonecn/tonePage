<script setup>
import { Star, Edit, StarFilled, Watch } from '@element-plus/icons-vue'
import { ref, onMounted, onUnmounted, watch } from 'vue';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useRoute } from 'vue-router';
import { request } from '@/lib/request';
import { ElMessage, ElMessageBox } from 'element-plus';
let showToolBar = defineModel();
const emit = defineEmits(['loadComment'])
watch(showToolBar, (newData, oldData) => {
    if (newData)
        isScrollingUp.value = true;
})
const route = useRoute();
const uuid = route.params.uuid;
let input_comment = ref('')
let input_comment_name = ref('')
let isStarted = ref(false)
let fgId;
let CommentDialogVisible = ref(false)
let isScrollingUp = ref(true);
onMounted(async () => {
    window.addEventListener('wheel', handleWheel);

    const fp = await FingerprintJS.load();
    const result = await fp.get();
    fgId = result.visitorId;
});
onUnmounted(() => {
    window.removeEventListener('wheel', handleWheel);
});
function handleWheel(event) {
    // deltaY > 0 表示向下滚动，deltaY < 0 表示向上滚动
    isScrollingUp.value = event.deltaY < 0;
    showToolBar.value = isScrollingUp.value;
}

let blogLike = async () => {
    if (isStarted.value) {
        ElMessage({
            message: '你已经点过赞啦！',
            type: 'success',
        })
        return;
    }
    let res = await ServerAPI.async_getRequest(`BlogLike?uuid=${uuid}&fgId=${fgId}`);
    try {
        if (res && res.status == 'OK') {
            if (res.code == 1) {
                // 点赞成功
                isStarted.value = true;
                ElMessage({
                    message: '点赞成功！',
                    type: 'success',
                })
            } else if (res.code == 0) {
                // 重复点赞
                isStarted.value = true;
                ElMessage({
                    message: '你已经点过赞啦！',
                    type: 'success',
                })
            }
        } else {
            throw new Error('点赞失败')
        }
    } catch (error) {
        // 网络错误等原因
        console.log(error)
        ElMessage({
            message: '点赞失败',
            type: 'error',
        })
    }
}
// 评论按钮触发事件
let blogComment = async () => {
    if (!input_comment.value) {
        ElMessage({
            message: '请先填写评论内容呀～',
            type: 'warning'
        })
        return;
    }
    if (input_comment.value.length >= 65535) {
        ElMessage({
            message: '评论内容太长啦～',
            type: 'warning'
        })
        return;
    }
    CommentDialogVisible.value = true;
}
// 提交评论
let sendComment = async () => {
    if (input_comment_name.value.length >= 255) {
        ElMessage({
            message: '昵称太长啦～',
            type: 'warning'
        })
        return;
    }
    let res = await ServerAPI.async_postRequest(`PostBlogComment`, {
        'uuid': uuid,
        'fgId': fgId,
        'comment': input_comment.value,
        'comment_name': input_comment_name.value ? input_comment_name.value : '匿名',
    });
    try {
        if (res && res.status == 'OK') {
            if (res.code == 1) {
                // 评论成功
                ElMessage({
                    message: '评论成功！',
                    type: 'success',
                })
                CommentDialogVisible.value = false;
                // 重新加载评论区内容
                emit('loadComment');
                return;
            } else if (res.code == 0) {
                // 评论3次机会用完
                ElMessage({
                    message: '您的评论次数已达上限',
                    type: 'warning',
                })
                CommentDialogVisible.value = false;
                return;
            }
        }
        throw new Error('评论失败')
    } catch (error) {
        // 网络错误等原因
        console.log(error)
        ElMessage({
            message: '评论失败',
            type: 'error',
        })
        CommentDialogVisible.value = false;
    }
}
</script>
<template>
    <transition name="el-zoom-in-bottom">
        <div class="tool-bar-container" v-show="isScrollingUp">
            <div class="tool-bar">
                <el-input v-model="input_comment" autosize type="textarea" class="input-comment"
                    placeholder="快来留下你的评论吧～" clearable />
                <el-button type="primary" :icon="Edit" class="button" circle @click="blogComment"></el-button>
                <el-button type="danger" :icon="isStarted ? StarFilled : Star" class="button" @click="blogLike"
                    circle></el-button>
            </div>
            <el-dialog v-model="CommentDialogVisible" title="提示">
                <div style="display: flex;flex-direction: column;gap: 5px;">
                    <div>每篇文章最多可发布3条评论，确认要现在发布吗？</div>
                    <div>另外，您可选择留下昵称：</div>
                    <el-input v-model="input_comment_name" placeholder="昵称（可选）" />
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