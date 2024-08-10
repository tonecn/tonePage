<script setup lang="ts">

</script>
<template>
    <div class="main-container">
        <div class="header-container">
            <div class="header-left">
                <div>
                    <RouterLink :to="{ name: 'home' }" v-if="$route.name == 'home'">
                        <div class="emoji">🍭</div>
                    </RouterLink>
                    <RouterLink :to="{ name: 'home' }" v-else>
                        <div class="title">特恩(TONE)</div>
                    </RouterLink>
                </div>
                <div class="more" tabindex="0" id="header-more">
                    <svg t="1705913460674" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="10513" width="20" height="20">
                        <path
                            d="M150.528 431.104q37.888 0 58.368 24.064t20.48 51.712l0 11.264q0 34.816-17.92 58.88t-59.904 24.064l-7.168 0q-38.912 0-61.952-21.504t-23.04-59.392l0-14.336q0-13.312 5.632-26.624t15.872-24.064 25.6-17.408 33.792-6.656l10.24 0zM519.168 431.104q37.888 0 58.368 24.064t20.48 51.712l0 11.264q0 34.816-17.92 58.88t-59.904 24.064l-7.168 0q-38.912 0-61.952-21.504t-23.04-59.392l0-14.336q0-13.312 5.632-26.624t15.872-24.064 25.6-17.408 33.792-6.656l10.24 0zM887.808 431.104q37.888 0 58.368 24.064t20.48 51.712l0 11.264q0 34.816-17.92 58.88t-59.904 24.064l-7.168 0q-38.912 0-61.952-21.504t-23.04-59.392l0-14.336q0-13.312 5.632-26.624t15.872-24.064 25.6-17.408 33.792-6.656l10.24 0z"
                            p-id="10514"></path>
                    </svg>
                </div>
            </div>
            <div class="header-right header-right-hidden" id="header-right">
                <div class="link-list">
                    <RouterLink :to="{ name: 'resource' }" v-show="true">
                        <div class="link" :class="{ 'link-chosen': $route.name === 'resource' }">资源</div>
                    </RouterLink>
                    <RouterLink :to="{ name: 'download' }" v-show="true">
                        <div class="link" :class="{ 'link-chosen': $route.name === 'download' }">下载</div>
                    </RouterLink>
                    <RouterLink :to="{ name: 'blog' }" v-show="true">
                        <div class="link" :class="{ 'link-chosen': $route.name === 'blog' }">博客</div>
                    </RouterLink>
                    <RouterLink :to="{ name: 'login' }" v-show="true">
                        <div class="link" :class="{ 'link-chosen': $route.name === 'login' || $route.name === 'dashboard'}">控制台</div>
                    </RouterLink>
                </div>
            </div>
        </div>
        <div class="header-divider"></div>
    </div>
    <div class="main-container-block"></div>
</template>
<style scoped>
.main-container {
    /* height: 69px; */
    z-index: 500;
    width: 100%;
    position: fixed;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    background-color: rgba(255, 255, 255, 0.6);
}

.header-container {
    /* height: 100%; */
    width: 100%;
    margin: 0 auto;
    padding: 22px 0;
    max-width: 1170px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: padding 0.2s;
}

.header-left,
.header-right {
    margin: 0 25px;
}

.header-left .emoji {
    font-size: 25px;
    cursor: pointer;
}

.header-left .title {
    /* 因为棒棒糖的高度为35，需要保持统一 */
    height: 35px;
    line-height: 35px;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 5px;
    cursor: pointer;
    color: #333;
}

.header-left .more {
    /* 因为棒棒糖的高度为35，需要保持统一 */
    height: 35px;
    display: none;
}

.link-list {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.link-list .link {
    margin: 0 20px;
    cursor: pointer;
    color: #666;
    transition: color 0.2s;
    border-bottom: 3px solid rgba(0, 0, 0, 0);
}

.link-list .link:hover {
    color: #000;
}

.link-list .link-chosen {
    border-bottom: 3px solid #e03ebf;
}

.header-divider {
    height: 1px;
    width: 100%;
    background-color: #eee;
}

.main-container-block {
    height: 80px;
    width: 100%;
    transition: height 0.2s;
    /* background-color: #fff; */
}

@media screen and (max-width: 800px) {
    .header-container {
        padding: 15px 0;
    }

    .main-container-block {
        height: 65px;
    }

    .header-container {
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .header-left {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .header-left .more {
        display: flex;
        align-content: center;
        flex-wrap: wrap;
        margin-right: 50px;
        cursor: pointer;
    }

    .header-right-hidden {
        display: none;
    }

    .header-right {
        /* width: 100%; */
        margin-top: 15px;
    }

    .link-list {
        display: flex;
        flex-direction: column;
        margin: 20px 10px;
    }

    .link-list .link {
        font-size: 23px;
        margin-top: 10px;
    }
}
</style>