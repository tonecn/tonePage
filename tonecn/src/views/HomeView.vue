<script setup lang="ts">
import { ref, onMounted } from 'vue';
let containerHeight = ref('800px');
onMounted(() => {
  // 主盒子高度根据初始视窗高度自适应
  containerHeight.value = window.innerHeight > 500 ? window.innerHeight - 90 + 'px' : '390px';

  // 界面特效字体
  let nameElement = document.getElementById("my-name");
  if (nameElement == null) {
    console.error('未找到元素my-name')
    return;
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
  <div class="bcc"></div>
  <div class="main-container" id="home-main">
    <img src="../assets/logo.jpg" alt="" class="logo">
    <div class="name" id="my-name">特恩(TONE)</div>
    <div class="self-introduction">一名计算机类专业在校本科大三学生</div>
    <div class="button-container">
      <a href="https://space.bilibili.com/474156211" target="_blank">
        <button class="button" id="button-resource">哔哩哔哩</button>
      </a>
      <a href="https://github.com/tonecn" target="_blank">
        <button class="button button-style2" id="button-code">GitHub</button>
      </a>
    </div>
  </div>
</template>
<style scoped>
.bcc {
  background-color: #fafafa;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.main-container {
  margin: 0 auto;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: height 0.2s;
  height: v-bind(containerHeight);
}

.logo {
  border-radius: 50%;
  width: 150px;
}

.name {
  font-size: 42px;
  font-weight: 800;
  margin-top: 25px;
  cursor: default;
  background: linear-gradient(45deg, rgb(66, 66, 255), rgb(255, 66, 66));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: font-size 0.2s;
}

.self-introduction {
  margin-top: 10px;
  font-size: 23px;
  cursor: default;
  color: #888;
  transition: font-size 0.2s;
}

.button-container {
  margin-top: 28px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.button {
  cursor: pointer;
  width: 130px;
  height: 46px;
  background-color: #2591f0;
  color: #fff;
  border: none;
  font-size: 16px;
  border-radius: 23px;
  margin: 0 10px;
  transition: background-color 0.2s;
  box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.2);
}

.button-style2 {
  background-color: #e87f29;
}

#button-resource:hover {
  background-color: #1d74c0;
}

#button-code:hover {
  background-color: #d5782c;
}

@media screen and (max-width: 470px) {
  .name {
    font-size: 34px;
  }

  .self-introduction {
    font-size: 16px;
  }

  .button-container {
    flex-direction: column;
    gap: 10px;
    margin-bottom: 60px;
  }

  .button {
    width: 180px;
    height: 40px;
  }
}

@media screen and (max-width: 800px) {
  .main-container {
    height: calc(v-bind(containerHeight) + 15px);
  }
}
</style>