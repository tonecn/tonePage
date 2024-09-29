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
    let res: BaseResponseData = await request.get('/resourceList?type=download');
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
  <div class="mx-auto flex flex-col items-center">
    <div class="bg-default-bg fixed inset-0 w-full h-full -z-10"></div>
    <div class="mt-[30px] sm:mt-[80px] text-[30px] sm:text-[42px] cursor-default transition-all duration-500">一些可以直接下载的工具
    </div>
    <div class="mt-[20px] text-[#666] cursor-default text-[12px] px-[20px]" v-if="loadStatus != 2">请在浏览此部分内容前阅读并同意
      <a class="text-[#222] cursor-pointer underline]" @click="showAgreement = true">《网站使用协议》</a>，继续使用或浏览表示您接受协议条款。
    </div>
    <div class="mt-[80px] cursor-default mb-[380px] text-center" v-if="loadStatus == 2">加载失败，请刷新界面重试</div>
    <div class="mt-[80px] cursor-default mb-[380px] text-center" v-if="loadStatus == 0">加载中，请稍后...</div>
    <div
      class="mt-[25px] sm:mt-[50px] mx-auto flex justify-center items-start flex-wrap max-w-[1000px] transition-all duration-500"
      v-if="loadStatus == 1">
      <!-- 资源项 -->
      <a class="w-full xs:w-[380px] lg:w-[420px] sm:mb-[40px] mb-[20px] mx-0 xs:mx-[30px] p-[30px] bg-white rounded-0 xs:rounded-[15px] flex justify-between shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
        v-for="item of ResourceDatas" :href="item.src" target="_blank">
        <!-- 左侧图标 -->
        <div class="w-[80px] h-[80px] overflow-hidden shadow-md rounded-[10px] transition-all duration-300">
          <img :src="item.icon_src" alt="" class="w-[80px] h-[80px]">
        </div>
        <!-- 右侧描述 -->
        <div class="ml-[20px] flex-1 cursor-default">
          <div class="text-[23px] font-semibold">{{ item.title }}</div>
          <div class="text-[14px] text-[#666] mt-[5px]">{{ item.describe }}</div>
          <!-- 下方的标签 -->
          <div class="flex gap-[5px] mt-[10px] flex-wrap">
            <div class="text-[10px] font-semibold text-[#666] bg-[#eceef1] py-[1px] px-[6px] rounded-[20px]"
              :class="[{ 'bg-[#d6eeff]': lable.type === 'OS' }]" v-for="lable of item.addition.lables">{{
                lable.text }}</div>
          </div>
        </div>
        <!-- 右上方的标签 -->
        <div class="relative w-0 h-0 bottom-[18px] right-[38px] text-center" v-if="item.addition.lable.text">
          <div class="w-[100px] h-[18px] bg-[#ff1900b3] text-white text-[12px] font-semibold rotate-[45deg]"
            :class="{ 'bg-[#ff8000b2]': (item.addition.lable.class.indexOf('lable-2') != -1) }">{{
              item.addition.lable.text }}</div>
        </div>
      </a>
      <div class="xs:w-[380px] w-0 lg:w-[420px] mx-[30px] transition-all duration-300"></div>
    </div>
  </div>
  <Agreement v-if="showAgreement" @closeAgreement="showAgreement = false" />
</template>
