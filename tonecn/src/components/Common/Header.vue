<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const showMoreOptions = ref(false);
const moreOptionsButton = ref<HTMLElement | null>(null);
const handleMoreOptionsButtonClick = () => {
    showMoreOptions.value = !showMoreOptions.value;
}
const handleScreenResize = (e: MediaQueryListEvent) => {
    if (e.matches)
        showMoreOptions.value = false;
}
onMounted(async () => {
    if (moreOptionsButton.value) {
        moreOptionsButton.value.addEventListener('click', handleMoreOptionsButtonClick)
    }

    const mediaQueryList = window.matchMedia('(min-width: 640px)');
    mediaQueryList.addEventListener('change', handleScreenResize);
    if (mediaQueryList.matches)
        showMoreOptions.value = false;
});
onUnmounted(async () => {
    if (moreOptionsButton.value) {
        moreOptionsButton.value.removeEventListener('click', handleMoreOptionsButtonClick);
    }

    const mediaQueryList = window.matchMedia('(min-width: 640px)');
    mediaQueryList.removeEventListener('change', handleScreenResize);
})

router.afterEach(() => {
    showMoreOptions.value = false;
});


</script>
<template>
    <div class="z-[500] w-full fixed backdrop-blur-sm bg-white/60">
        <div class="w-full box-content mx-auto py-[15px] sm:py-[22px] max-w-[1170px] flex justify-between items-center transition-all duration-200 border-b-[1px] border-b-[#eee]"
            :class="[{ 'flex-col': showMoreOptions }]">
            <!-- left header -->
            <div class="px-[25px] flex items-center w-full justify-between sm:block">
                <div>
                    <RouterLink :to="{ name: 'home' }" v-if="$route.name == 'home'">
                        <div class="h-[35px] text-[25px] cursor-pointer]">🍭</div>
                    </RouterLink>
                    <RouterLink :to="{ name: 'home' }" v-else>
                        <div class="h-[35px] leading-[35px] font-semibold tracking-[5px] text-[#333] text-nowrap">
                            特恩(TONE)</div>
                    </RouterLink>
                </div>
                <!-- 更多选项按钮，宽度小于800时出现 -->
                <div class="sm:hidden block" tabindex="0" id="header-more" ref="moreOptionsButton">
                    <svg t="1705913460674" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="10513" width="20" height="20">
                        <path
                            d="M150.528 431.104q37.888 0 58.368 24.064t20.48 51.712l0 11.264q0 34.816-17.92 58.88t-59.904 24.064l-7.168 0q-38.912 0-61.952-21.504t-23.04-59.392l0-14.336q0-13.312 5.632-26.624t15.872-24.064 25.6-17.408 33.792-6.656l10.24 0zM519.168 431.104q37.888 0 58.368 24.064t20.48 51.712l0 11.264q0 34.816-17.92 58.88t-59.904 24.064l-7.168 0q-38.912 0-61.952-21.504t-23.04-59.392l0-14.336q0-13.312 5.632-26.624t15.872-24.064 25.6-17.408 33.792-6.656l10.24 0zM887.808 431.104q37.888 0 58.368 24.064t20.48 51.712l0 11.264q0 34.816-17.92 58.88t-59.904 24.064l-7.168 0q-38.912 0-61.952-21.504t-23.04-59.392l0-14.336q0-13.312 5.632-26.624t15.872-24.064 25.6-17.408 33.792-6.656l10.24 0z"
                            p-id="10514"></path>
                    </svg>
                </div>
            </div>
            <!-- right header -->
            <div class="sm:block" :class="[{ 'hidden': !showMoreOptions }, { 'mt-[25px]': showMoreOptions }]"
                id="header-right">
                <div class="flex justify-end items-center">
                    <RouterLink :to="{ name: 'resource' }">
                        <div class="text-nowrap mx-[20px] cursor-pointer text-[#666] transition-all duration-200 border-b-[3px] border-transparent hover:text-black"
                            :class="{ 'border-b-[#e03ebf] text-black': $route.name === 'resource' }">资源</div>
                    </RouterLink>
                    <RouterLink :to="{ name: 'download' }">
                        <div class="text-nowrap mx-[20px] cursor-pointer text-[#666] transition-all duration-200 border-b-[3px] border-transparent hover:text-black"
                            :class="{ 'border-b-[#e03ebf] text-black': $route.name === 'download' }">下载</div>
                    </RouterLink>
                    <RouterLink :to="{ name: 'blog' }">
                        <div class="text-nowrap mx-[20px] cursor-pointer text-[#666] transition-all duration-200 border-b-[3px] border-transparent hover:text-black"
                            :class="{ 'border-b-[#e03ebf] text-black': $route.name === 'blog' || $route.name === 'blogContent' }">
                            博客</div>
                    </RouterLink>
                    <RouterLink :to="{ name: 'dashboard' }">
                        <div class="text-nowrap mx-[20px] cursor-pointer text-[#666] transition-all duration-200 border-b-[3px] border-transparent hover:text-black"
                            :class="{ 'border-b-[#e03ebf] text-black': $route.name === 'login' || $route.name === 'dashboard' }">
                            控制台</div>
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
    <!-- 占位盒，用于解决fixed布局导致的文档流异常 -->
    <div class="h-[66px] sm:h-[80px] w-full transition-all duration-200"></div>
</template>
<style scoped></style>