<script setup lang="ts">
import { ref } from 'vue'
import md5 from 'md5'
import copyText from '@/lib/copyText'
import { ElMessage } from 'element-plus'
const randomNum = ref(0)
const uuid = ref('')
const generateRandom = () => {
    randomNum.value = Math.random()
}
const generateUUID = () => {
    uuid.value = md5(`${Math.random()}${Date.now()}`);
}
</script>
<template>
    <el-col class="p-[20px]">
        <el-row>
            <el-text>随机数生成</el-text>
        </el-row>
        <el-row>
            <el-input style="width: 230px;" v-model="randomNum" />
        </el-row>
        <el-row>
            <el-button-group>
                <el-button style="width: 115px;" @click="generateRandom" type="primary">生成</el-button>
                <el-button style="width: 115px;"
                    @click="() => { copyText(randomNum + ''); ElMessage.success('复制成功') }">复制</el-button>
            </el-button-group>
        </el-row>
        <el-row class="mt-[15px]">
            <el-text>32位UUID生成</el-text>
        </el-row>
        <el-row>
            <el-input style="width: 230px;" v-model="uuid" />
        </el-row>
        <el-row>
            <el-button-group>
                <el-button style="width: 115px;" @click="generateUUID" type="primary">生成</el-button>
                <el-button style="width: 115px;"
                    @click="() => { copyText(uuid + ''); ElMessage.success('复制成功') }">复制</el-button>
            </el-button-group>
        </el-row>
    </el-col>
</template>