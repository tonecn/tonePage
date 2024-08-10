<script setup>
// import ServerAPI from '@/assets/ServerAPI';
// import router from '@/router';
// import { nextTick, onBeforeMount, onMounted, reactive, ref } from 'vue';
// let load_fail = ref(false);
// let load_ok = ref(false);

// let urlTo = (url) => {
//     window.location.href = url;
// }
// let blog_list = reactive([])
// onBeforeMount(async () => {
//     let res = await ServerAPI.async_getRequest('GetBlogList');
//     try {
//         if(res.status == 'OK')
//         {
//             blog_list.push(...res.data);
//             load_ok.value = true;
//         }else{
//             throw new Error('获取列表失败');
//         }
//     } catch (error) {
//         console.log('获取列表发生错误：' + error)
//         load_fail.value = true;
//     }
// })
// let formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     // 获取日期的各个部分
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
//     const day = String(date.getDate()).padStart(2, '0');
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const seconds = String(date.getSeconds()).padStart(2, '0');
//     // 组装最终的字符串
//     if(hours == '00' && minutes == '00' && seconds == '00')
//         return `${year}/${month}/${day}`;
//     else
//         return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
// }
// let blogto = (uuid) => {
//     // router.push({name:'blogcontent',params: { 'uuid': uuid }})
//     let url = '/blogcontent/' + uuid;
//     window.open(url, '_blank');
// }
</script>
<template>
<div class="bcc"></div>
<div class="content-container">
    <el-empty description="加载失败，刷新后重试" style="margin: 0 auto;" v-if="load_fail"/>
    <div style="gap: 30px;display: flex;flex-direction: column;" v-else>
        <div class="coding" v-if="!load_ok">加载中，请稍后...</div>
        <el-empty description="暂无数据" style="margin: 0 auto;" v-if="load_ok && !blog_list.length"/>
        <div class="blog-container" v-for="item of blog_list">
            <div class="title" @click="blogto(item.uuid)">{{ item.title }}</div>
            <div class="description">{{ item.description }}</div>
            <div class="publish-time">{{ formatTimestamp(+item.publish_time) }}</div>
        </div>
    </div>
</div>
</template>
<style scoped>
.bcc{
    position: fixed;
    z-index: -1;
    background-color: #f6f8f9;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.content-container{
    display: flex;
    flex-direction: column;
    max-width: 800px;
    margin: 50px auto;
    padding: 0 20px;
}
.coding{
    text-align: center;
    margin-top: 20px;
    margin-bottom: 300px;
}
.blog-container{
    margin: 0 auto;
    max-width: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
}
.blog-container .title{
    font-size: 26px;
    font-weight: 600;
    cursor: pointer;
    display: block;
}
.blog-container .title:hover{
    text-decoration: underline;
    text-decoration-thickness: 3px;
}
.blog-container .description{
    color: #666;
}
.blog-container .publish-time{
    color: #888;
    margin-top: 15px;
    font-size: 14px;
}
</style>