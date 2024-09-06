<script setup lang='ts'>
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import RotationVerification from '@/components/Common/RotationVerification.vue';
import { request, type BaseResponseData } from '@/lib/request';

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
</script>
<template>
    <div class="bcc"></div>
    <div class="main-container">
        <h1>登录到控制台</h1>
        <el-popover placement="bottom" :width="300" trigger="click">
            <p>控制台是特恩(TONE)网页中的一个控制器界面，如果您是管理员，可通过登录后编辑本网页中的内容（资源、工具、日记等），详情请见<strong style="cursor: pointer;"
                    @click="">《特恩(TONE)控制台使用协议》</strong></p>
            <template #reference>
                <h3>控制台是什么？</h3>
            </template>
        </el-popover>
        <div class="form-container">
            <el-input v-model="formData.username" class="input" placeholder="请输入账户名" clearable>
            </el-input>
            <el-input v-model="formData.password" show-password class="input" placeholder="密码" @keyup.enter="loginHandle">
            </el-input>
            <el-button class="login-botton" @click="loginHandle" :loading="loginStatus">登录</el-button>
        </div>
    </div>
    <RotationVerification v-if="isCaptchaShow" @fail="() => { isCaptchaShow = false; ElMessage.warning('验证失败') }"
        @success="() => { isCaptchaShow = false; login() }" />
</template>
<style scoped>
.bcc {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: #f6f8f9;
}

.main-container {
    padding: 30px;
    margin-bottom: 160px;
}

.main-container>h1 {
    text-align: center;
    font-size: 42px;
    font-weight: 400;
    margin-top: 50px;
    cursor: default;
}

.main-container>h3 {
    text-align: center;
    cursor: pointer;
}

.main-container .form-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.form-container .input {
    width: 260px;
    height: 35px;
    font-size: 16px;
    margin-top: 10px;
}

.login-botton {
    margin-top: 10px;
    width: 260px;
    height: 35px;
    font-weight: 500;
}

.login-botton:hover {
    background-color: #fff;
    border-color: rgb(220, 223, 230);
    color: #222;
}

.login-botton:focus {
    background-color: #fff;
    border-color: rgb(220, 223, 230);
    color: #606266;
}
</style>