<script setup lang="ts">
import { ref, onMounted } from 'vue';
onMounted(() => {
  window.document.title = `特恩的日志`;
  // 界面特效字体
  let nameElement = document.getElementById("my-name");
  if (nameElement == null) {
    return console.error('未找到元素my-name')
  }
  let colorNum = 66;
  let colorNumReverse = false;
  setInterval(() => {
    if (colorNumReverse) {
      colorNum--;
      if (colorNum <= 66)
        colorNumReverse = !colorNumReverse;
    } else {
      colorNum++;
      if (colorNum >= 255)
        colorNumReverse = !colorNumReverse;
    }
    nameElement.style.backgroundImage = `linear-gradient(45deg, rgb(${colorNum}, 66, ${255 - (66 - colorNum)}), rgb(${255 - (66 - colorNum)}, 66, ${colorNum}))`;
  }, 20);
})
</script>
<template>
  <div class="bg-default-bg fixed inset-0 w-full h-full -z-10 dark:bg-[#222]"></div>
  <div
    class="flex max-w-[800px] flex-col items-center justify-center mx-auto min-h-[420px] sm:h-[calc(100vh-90px)] h-[calc(100vh-77px)]"
    id="home-main">
    <img src="../assets/logo.jpg" alt="" class="w-[150px] rounded-full">
    <div class="name text-[34px] sm:text-[42px]" id="my-name">特恩(TONE)</div>
    <div
      class="mt-[10px] sm:text-[23px] text-[16px] cursor-default text-[#888] transition-all duration-200 dark:text-[#ccc]">
      一名计算机类专业在校本科大三学生</div>
    <div class="mt-[28px] mb-[30px] flex items-center justify-center flex-wrap sm:flex-row flex-col gap-[10px]">
      <a href="https://space.bilibili.com/474156211" target="_blank">
        <button
          class="cursor-pointer sm:w-[130px] w-[180px] sm:h-[46px] h-[40px] bg-[#2591f0] hover:bg-[#1d74c0] text-white border-none text-[16px] rounded-[23px] mx-[10px] transition-all duration-200 shadow-lg"
          id="button-resource">哔哩哔哩</button>
      </a>
      <a href="https://github.com/tonecn" target="_blank">
        <button
          class="cursor-pointer sm:w-[130px] w-[180px] sm:h-[46px] h-[40px] bg-[#e87f29] hover:bg-[#d5782c] text-white border-none text-[16px] rounded-[23px] mx-[10px] transition-all duration-200 shadow-lg"
          id="button-code">GitHub</button>
      </a>
    </div>
  </div>
</template>
<style scoped>
.name {
  font-weight: 800;
  margin-top: 25px;
  cursor: default;
  background: linear-gradient(45deg, rgb(66, 66, 255), rgb(255, 66, 66));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: font-size 0.2s;
}
</style>