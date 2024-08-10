<script setup>
// import { ref, watch } from 'vue';
// import { ElMessage } from 'element-plus'
// import VerificationProcessVue from '@/components/RotationVerification.vue';
// import router from '@/router';
// import ServerAPI from '@/assets/ServerAPI';
// import ServerSDK from '@/assets/ServerSDK';
// let phone = ref("");
// let code = ref("");
// let sendSIMCodeCoolingTime = ref(-1);
// let ShowVerificationProcessVue = ref(false);
// // 监听phone，使其保持3-4-4分割格式
// watch(phone,(newData)=>{
//     newData = newData.replace(/\D/g,'');
//     let newDatalen = newData.split('').length;
//     if(newDatalen >= 4 && newDatalen <= 7)
//     {
//         let part1 = newData.slice(0, 3);
//         let part2 = newData.slice(3);
//         newData = part1+ " " +part2;
//     }else if(newDatalen >= 8){
//         let part1 = newData.slice(0, 3);
//         let part2 = newData.slice(3, 7);
//         let part3 = newData.slice(7);
//         newData = part1 + " " + part2 + " " + part3; 
//     }
//     phone.value = newData;
// })
// // 监听code，使其只能是数字
// watch(code,(newData)=>{
//     code.value = newData.replace(/\D/g,'');
// })

// // 按钮 - 发送验证码，先获取图像验证码，发短信由其他函数触发
// let sendSIMCode = async () => {
//     // 冷却判定
//     if(sendSIMCodeCoolingTime.value >= 0)
//     {
//         // 还在冷却中，不允许发送
//         ElMessage({
//             message: '冷却中，稍后再来获取吧',
//             type: 'warning',
//         });
//         return;
//     }
//     // 手机号合法性验证
//     const regex = /^1[3-9]\d{9}$/;
//     if(!regex.test(phone.value.replace(/\D/g,'')))
//     {
//         ElMessage({
//             message: '请输入正确的手机号',
//             type: 'warning',
//         });
//         return;
//     }

//     // 准备发送验证码
//     // 滑动验证码验证
//     ShowVerificationProcessVue.value = true;
// }

// // 按钮 - 登录
// let login = async () => {
//     // 是否已经发送验证码
//     if(sendSIMCodeCoolingTime.value == -1)
//     {
//         // 其他情况（冷却倒数，冷却结束）都可以发送
//         ElMessage({
//             message: '请先获取验证码',
//             type: 'warning',
//         });
//         return;
//     }
//     // 手机号合法性验证
//     const regex = /^1[3-9]\d{9}$/;
//     if(!regex.test(phone.value.replace(/\D/g,'')))
//     {
//         ElMessage({
//             message: '请输入正确的手机号',
//             type: 'warning',
//         });
//         return;
//     }
//     // 验证码合法性验证
//     const regex2 = /\d{6}$/;
//     if(!regex2.test(code.value))
//     {
//         ElMessage({
//             message: '请输入正确的验证码',
//             type: 'warning',
//         });
//         return;
//     }
//     // ...可以登录
//     // console.log(localStorage.getItem('login_session'))
//     let loginRes = await ServerSDK.Login(
//         phone.value.replace(/\D/g,''),
//         code.value
//     )
//     if(loginRes == 1)
//     {
//         ElMessage({
//             message: '登录成功',
//             type: 'success',
//         });
//         setTimeout(() => {
//             router.push({name: 'console_console'});
//         }, 1000);
//     }else if(loginRes == 0){
//         ElMessage({
//             message: '验证码已过期',
//             type: 'warning',
//         });
//     }else if(loginRes == -1){
//         ElMessage({
//             message: '验证码已失效',
//             type: 'warning',
//         });
//     }else if(loginRes == -2){
//         ElMessage({
//             message: '验证码错误',
//             type: 'warning',
//         });
//     }else{
//         ElMessage({
//             message: '登录失败，请重试',
//             type: 'error',
//         });
//     }
// }

// // 短信验证码发送成功，修改界面交互
// let verify_success = async () => {
//     // 验证成功，等待接收验证码后登录
//     let sendSIMCodeRes = await ServerAPI.async_postRequest('SendSMSCode',{
//         'phone': phone.value.replace(/\D/g,''),
//         'session': localStorage.getItem('RVSession')
//     })
//     console.log(sendSIMCodeRes)
//     if(sendSIMCodeRes && sendSIMCodeRes.status == 'OK')
//     {
//         // 发送成功，等待接收验证码后登录
//         ElMessage({
//             message: '发送成功',
//             type: 'success',
//         });
//     }else{
//         // 发送失败
//         ElMessage({
//             message: '发送失败，请重试',
//             type: 'error',
//         });
//     }
//     ShowVerificationProcessVue.value = false;// 关闭验证码界面
//     sendSIMCodeCoolingTime.value = 59;// 冷却倒计时
//     let SIMCodeCoolingTimer = setInterval(() => {
//         sendSIMCodeCoolingTime.value--;
//         if(sendSIMCodeCoolingTime.value <= 0)
//         {
//             clearInterval(SIMCodeCoolingTimer);
//             sendSIMCodeCoolingTime.value = -2;
//         }
//     }, 1000);
// }
// // 图像验证码验证失败，短信验证码未发送
// let verify_fail = () => {
//     ShowVerificationProcessVue.value = false;
//     ElMessage({
//         message: '发送失败，请重试',
//         type: 'error',
//     });
// }

// let onDev = () => {
//     ElMessage({
//         message: '抱歉，当前内容暂未开放',
//         type: 'warning',
//     });
// }
</script>
<template>
<div class="bcc"></div>
<div class="main-container">
    <h1>登录到控制台</h1>
    <el-popover
        placement="bottom"
        :width="300"
        trigger="click"
    >
        <!-- <p>控制台是特恩(TONE)网页中的一个控制器界面，您可以使用其中开放的一些控制器功能。普通访客可通过登录后的界面暂存合法文件（图片、视频、文档、音频、压缩包等），管理员可通过登录后编辑本网页中的内容（资源、工具、日记等），详情请见<strong style="cursor: pointer;">《特恩(TONE)控制台使用协议》</strong></p> -->
        <p>控制台是特恩(TONE)网页中的一个控制器界面，如果您是管理员，可通过登录后编辑本网页中的内容（资源、工具、日记等），详情请见<strong style="cursor: pointer;" @click="onDev">《特恩(TONE)控制台使用协议》</strong></p>
        <template #reference>
            <h3>控制台是什么？</h3>
        </template>
    </el-popover>
    <div class="form-container">
        <el-input 
            v-model="phone" 
            class="input" 
            placeholder="请输入手机号" 
            maxlength="13"
            inputmode="tel"
            clearable>
            <template #prepend> <div class="phone-prepend">+86</div></template>
        </el-input>
        <el-input 
            v-model="code" 
            class="input"  
            maxlength="6"
            inputmode="numeric"
            placeholder="验证码">
            <template #append>
                <el-button class="sendSIMCode-button" :class="{ 'sendSIMCode-button-cooling' : (sendSIMCodeCoolingTime > 0) }" @click="sendSIMCode">{{ sendSIMCodeCoolingTime > 0 ? `${sendSIMCodeCoolingTime}秒后再获取` : "获取验证码"}}</el-button>
            </template>
        </el-input>
        <el-button class="login-botton" @click="login">登录</el-button>
    </div>
</div>
<VerificationProcessVue v-if="ShowVerificationProcessVue" @fail="verify_fail" @success="verify_success" :phone="phone" />
</template>
<style scoped>
.bcc{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: #f6f8f9;
}
.main-container{
    padding: 30px;
    margin-bottom: 160px;
}
.main-container>h1{
    text-align: center;
    font-size: 42px;
    font-weight: 400;
    margin-top: 50px;
    cursor: default;
}
.main-container>h3{
    text-align: center;
    cursor: pointer;
}
.main-container .form-container{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.phone-prepend{
    width: 20px;
    margin-left: -10px;
    cursor: default;
    text-align: center;
    font-size: 15px;
}
.form-container .input{
    width: 260px;
    height: 35px;
    font-size: 16px;
    margin-top: 10px;
}
.input .sendSIMCode-button{
    font-size: 14px;
    font-weight: 400;
    color: #333;
    width: 120px;
}
.input .sendSIMCode-button:hover{
    color: #333;
}
.input .sendSIMCode-button-cooling{
    color: #888;
}
.input .sendSIMCode-button-cooling:hover{
    color: #888;
}
.login-botton{
    margin-top: 10px;
    width: 260px;
    height: 35px;
    font-weight: 500;
}
.login-botton:hover{
    background-color: #fff;
    border-color: rgb(220, 223, 230);
    color: #222;
}
.login-botton:focus{
    background-color: #fff;
    border-color: rgb(220, 223, 230);
    color: #606266;
}
</style>