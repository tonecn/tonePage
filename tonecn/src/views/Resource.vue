<script setup lang="ts">
import { request, type BaseResponseData } from '@/lib/request';
import Agreement from '@/components/Common/Agreement.vue';
import { ref, onMounted, reactive } from 'vue';
let showAgreement = ref(false);
let loadStatus = ref(0);// 0加载中 1加载成功 2加载失败
let ResourceDatas: any[] = reactive([])
onMounted(async () => {
  // 用于获取数据的函数
  try {
    let res: BaseResponseData = await request.get('/resourceList?type=resource');
    if (res && res.code == 0) {
      loadStatus.value = 1;
      ResourceDatas.push(...res.data)
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    console.error(error)
    loadStatus.value = 2;
  }
})
</script>
<template>
  <div class="main-container">
    <div class="bcc"></div>
    <div class="title">精心挑选并收藏的资源</div>
    <div class="subtitle" v-if="loadStatus != 2">请在浏览此部分内容前阅读并同意<a
        @click="showAgreement = true">《网站使用协议》</a>，继续使用或浏览表示您接受协议条款。</div>
    <div class="load-fail" v-if="loadStatus == 2">加载失败，请刷新界面重试。</div>
    <div class="load-fail" v-if="loadStatus == 0">加载中，请稍后...</div>
    <div class="content-container" v-if="loadStatus == 1">
      <!-- 资源项 -->
      <a class="content" v-for="item of ResourceDatas" :href="item.src" target="_blank">
        <div class="icon-container">
          <img :src="item.icon_src" alt="" class="icon">
        </div>
        <div class="describe-container">
          <div class="title">{{ item.title }}</div>
          <div class="describe">{{ item.describe }}</div>
          <div class="lable-container">
            <div class="lable" :class="{ 'lable-OS': lable.type === 'OS' }" v-for="lable of item.addition.lables">{{
              lable.text }}</div>
          </div>
        </div>
        <div class="lable-relative" v-if="item.addition.lable.text">
          <div class="lable" :class="{ 'lable-2': (item.addition.lable.class.indexOf('lable-2') != -1) }">{{
            item.addition.lable.text }}</div>
        </div>
      </a>
      <div class="content content-hidden"></div>
    </div>
  </div>
  <Agreement v-if="showAgreement" @closeAgreement="showAgreement = false" />
</template>
<style scoped>
.main-container {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bcc {
  position: fixed;
  z-index: -1;
  background-color: #f6f8f9;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.main-container>.title {
  margin-top: 80px;
  font-size: 42px;
  cursor: default;
  transition: all 0.4s;
}

.main-container>.subtitle {
  margin-top: 20px;
  color: #666;
  cursor: default;
  font-size: 12px;
  padding: 0 20px;
}

.main-container>.subtitle>a {
  color: #222;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 1px solid #f7f8f9;
}

.main-container>.subtitle>a:hover {
  border-bottom: 1px solid #222;
}

.load-fail {
  text-align: center;
  margin-top: 80px;
  cursor: default;
  margin-bottom: 380px;
  transition: all 0.4s;
}

.content-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 50px auto;
}

.content {
  width: 380px;
  /* height: 135px; */
  margin: 20px 30px;
  padding: 30px;
  background-color: #fff;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  box-shadow: 0px 2px 5px 0px #ccc;
  transition: all 0.4s;
  overflow: hidden;
}

.content>.lable-relative {
  position: relative;
  width: 0;
  height: 0;
  bottom: 18px;
  right: 38px;
  text-align: center;
}

.content>.lable-relative>.lable {
  width: 100px;
  height: 18px;
  line-height: 18px;
  background-color: rgba(255, 25, 0, 0.7);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  transform: rotate(45deg);
}

.content>.lable-relative>.lable-2 {
  background-color: rgba(255, 128, 0, 0.7);
}

.content-hidden {
  opacity: 0;
  height: 1px;
  margin: 0 30px;
  padding: 0 30px;
}

.content:hover {
  box-shadow: 0px 5px 12px 0px #ccc;
}

.content .icon-container .icon {
  width: 80px;
  height: 80px;
  margin-left: 10px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0px 1px 4px 1px #ccc;
  border-radius: 10px;
  transition: all 0.4s;
}

.content .describe-container {
  margin-left: 20px;
  /* width: 200px; */
  flex: 1;
  cursor: default;
}

.describe-container .title {
  font-size: 23px;
  font-weight: 600;
}

.describe-container .describe {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.describe-container .lable-container {
  display: flex;
  gap: 5px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.describe-container .lable-container .lable {
  font-size: 10px;
  font-weight: 500;
  color: #666;
  background-color: #eceef1;
  padding: 1px 6px;
  border-radius: 20px;
}

.describe-container .lable-container .lable-OS {
  background-color: #d6eeff;
}

@media screen and (min-width: 1200px) {
  .content {
    width: 410px;
    margin-left: 40px;
    margin-right: 40px;
  }
}

@media screen and (max-width: 550px) {
  .main-container>.title {
    font-size: 28px;
    margin-top: 50px;
  }

  .content-container {
    flex-direction: column;
    margin: 20px 0;
  }

  .load-fail {
    margin-top: 40px;
    margin-bottom: 450px;
  }
}

@media screen and (max-width: 450px) {
  .content {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    border-radius: 0;
    margin-top: 5px;
  }

  .content .icon-container .icon {
    width: 70px;
    height: 70px;
  }

  .describe-container .title {
    font-size: 20px;
  }
}
</style>