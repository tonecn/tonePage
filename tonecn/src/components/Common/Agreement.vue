<script setup lang="ts">
import { ref } from 'vue';

const isShow = ref(true)
const closeSite = () => {
    window.location.href = 'about:blank';
}
</script>
<template>
    <el-dialog v-model="isShow" title="网站使用协议" width="80%">
        <div>欢迎使用本网站。在使用本网站之前，请仔细阅读以下使用协议。</div>
        <li>关于网站：本网站是个人创建和维护的，主要用于收藏各类资源和工具，编写关于合法计算机技术的日记，并提供与我交流的联系方式。</li>
        <li>
            资源收藏声明：本网站的“个人收藏资源”“个人收藏工具”栏目包含但不限于第三方链接，这些资源仅供个人学习和参考。本站对这些第三方链接及其内容不作任何形式的推广或认可。链接内容、观点或相关信息归原作者或所有者所有，与本网站无关。
        </li>
        <li>风险和责任：访问者在使用这些第三方链接时，应自行判断其内容的适用性，并自行承担相关风险。本网站及其所有者不承担因使用这些链接而产生的任何直接或间接损失的责任。</li>
        <li>内容和交流：本网站的日记部分包含对合法计算机技术的个人见解和经验分享。访问者可以通过提供的联系方式与我就计算机技术话题进行合法交流。</li>
        <li>版权和知识产权：本网站的内容，包括文本、图像和代码，除非另有声明，均为本网站所有者个人创作并拥有版权。未经许可，不得复制、分发或以其他方式使用这些内容。</li>
        <li>同意协议：通过使用或浏览本网站，您表示您已阅读、理解并同意遵守本协议的条款。如果您不同意本协议的任何部分，请<u>停止使用</u>本网站。</li>
        <li>变更和更新：本网站的所有者保留随时更新或修改本使用协议的权利。任何此类更改将在本网站上发布并生效。</li>
        <br /> 
        <div>本使用协议的目的是确保网站的有效运行并保护访问者及网站所有者的合法权益。感谢您的理解和支持。</div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closeSite">我不接受</el-button>
                <el-button type="primary" @click="$emit('closeAgreement')">我接受</el-button>
            </div>
        </template>
    </el-dialog>
</template>