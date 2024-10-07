<script setup lang='ts'>
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import RotationVerification from '@/components/Common/RotationVerification.vue';
import { request, type BaseResponseData } from '@/lib/request';

const containerHeight = ref('800px');
const isCaptchaShow = ref(false);
const loginStatus = ref(false);
const formData = reactive({
    username: '',
    password: ''
})
const loginHandle = () => {
    if (!formData.username || !formData.password) {
        return ElMessage.warning('请填写账户名和密码')
    }
    isCaptchaShow.value = true;
}
const login = async () => {
    loginStatus.value = true;
    try {
        let loginRes: BaseResponseData = await request.post('/console/login', {
            username: formData.username,
            password: formData.password,
            session: localStorage.getItem('captcha-session')
        })
        loginStatus.value = false;
        switch (loginRes.code) {
            case 0:
                // 成功
                localStorage.setItem('jwtToken', loginRes.data.token);
                ElMessage.success('登录成功');
                return setTimeout(() => {
                    window.location.reload();
                }, 1000);
            case -1:
                // 参数缺失
                return ElMessage.error('参数缺失');
            case -3:
                // 服务器错误
                return ElMessage.error('服务器错误');
            case -6000:
                // 用户不存在
                return ElMessage.error('用户不存在');
            case -6001:
                // 账户名或密码错误
                return ElMessage.error('账户名或密码错误');
            default:
                return ElMessage.error(`未知错误 ${loginRes.message}`)
        }
    } catch (error) {
        loginStatus.value = false;
        return ElMessage.error(`未知错误 ${error}`)
    }
}
onMounted(async () => {
    containerHeight.value = window.innerHeight > 500 ? window.innerHeight - 90 + 'px' : '390px';
})
</script>
<template>
    <div class="bg-default-bg fixed inset-0 w-full h-full -z-10 dark:bg-[#222]"></div>
    <div
        class="flex flex-col items-center justify-center mx-auto sm:h-[calc(100vh-90px)] h-[calc(100vh-77px)] px-[20px] max-w-[280px] min-h-[400px]">
        <h1 class="text-center text-[36px] font-medium cursor-default dark:text-white">登录到控制台</h1>
        <el-popover placement="bottom" :width="300" trigger="click">
            <p>控制台是特恩(TONE)网页中的一个控制器界面，如果您是管理员，可通过登录后编辑本网页中的内容（资源、工具、日记等），详情请见<strong style="cursor: pointer;"
                    @click="">《特恩(TONE)控制台使用协议》</strong></p>
            <template #reference>
                <h3 class="text-center cursor-pointer font-semibold mt-[10px] dark:text-[#ccc]">控制台是什么？</h3>
            </template>
        </el-popover>
        <div class="w-full flex flex-col items-center">
            <el-input v-model="formData.username" class="w-full h-[35px] text-[16px] mt-[20px]" placeholder="请输入账户名"
                clearable>
            </el-input>
            <el-input v-model="formData.password" show-password class="w-full h-[35px] text-[16px] mt-[10px]"
                placeholder="密码" @keyup.enter="loginHandle">
            </el-input>
            <el-button class="mt-[12px] mb-[120px] w-full h-[35px] font-bold login-button" @click="loginHandle"
                :loading="loginStatus">登录</el-button>
        </div>
    </div>
    <RotationVerification v-if="isCaptchaShow" @fail="() => { isCaptchaShow = false; ElMessage.warning('验证失败') }"
        @success="() => { isCaptchaShow = false; login() }" />
</template>
<style scoped>
.login-button:hover {
    background-color: #fff;
    border-color: rgb(220, 223, 230);
    color: #333;
}
</style>