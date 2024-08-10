<script setup lang="ts">
import copyText from '@/lib/copyText';

let copyTextwithMsg = (text : string) => {
    if(copyText(text)){
        ElMessage({
            message: '复制成功',
            type: 'success',
        })
    }else{
        ElMessage({
            message: '复制失败',
            type: 'error',
        })
    }
}
</script>
<template>
    <div class="footer-divider"></div>
    <div class="footer-container">
        <div class="left-container">
            <a href="https://beian.miit.gov.cn/">
                <div class="fillings">备案号：渝ICP备2023009516号-1</div>
            </a>
            <div class="copyright">Copyright ©2020-2024 TONE All Rights Reserved.</div>
        </div>
        <div class="right-container">
            <el-popover trigger="click" placement="top" :width="160">
                <p>QQ号：3341154833</p>
                <div style="text-align: center; margin: 0">
                    <el-button size="small" type="primary" @click="copyTextwithMsg('3341154833')">复制</el-button>
                </div>
                <template #reference>
                    <div class="icon">
                        <svg t="1705909811918" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="5851" width="24" height="24">
                            <path
                                d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z"
                                p-id="5852" fill="#8a8a8a"></path>
                        </svg>
                    </div>
                </template>
            </el-popover>
            <el-popover trigger="click" placement="top" :width="130">
                <p>微信号：tone0121</p>
                <div style="text-align: center; margin: 0">
                    <el-button size="small" type="primary" @click="copyTextwithMsg('tone0121')">复制</el-button>
                </div>
                <template #reference>
                    <div class="icon">
                        <svg t="1705909888071" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="7135" width="24" height="24">
                            <path
                                d="M664.250054 368.541681c10.015098 0 19.892049 0.732687 29.67281 1.795902-26.647917-122.810047-159.358451-214.077703-310.826188-214.077703-169.353083 0-308.085774 114.232694-308.085774 259.274068 0 83.708494 46.165436 152.460344 123.281791 205.78483l-30.80868 91.730191 107.688651-53.455469c38.558178 7.53665 69.459978 15.308661 107.924012 15.308661 9.66308 0 19.230993-0.470721 28.752858-1.225921-6.025227-20.36584-9.521864-41.723264-9.521864-63.862493C402.328693 476.632491 517.908058 368.541681 664.250054 368.541681zM498.62897 285.87389c23.200398 0 38.557154 15.120372 38.557154 38.061874 0 22.846334-15.356756 38.156018-38.557154 38.156018-23.107277 0-46.260603-15.309684-46.260603-38.156018C452.368366 300.994262 475.522716 285.87389 498.62897 285.87389zM283.016307 362.090758c-23.107277 0-46.402843-15.309684-46.402843-38.156018 0-22.941502 23.295566-38.061874 46.402843-38.061874 23.081695 0 38.46301 15.120372 38.46301 38.061874C321.479317 346.782098 306.098002 362.090758 283.016307 362.090758zM945.448458 606.151333c0-121.888048-123.258255-221.236753-261.683954-221.236753-146.57838 0-262.015505 99.348706-262.015505 221.236753 0 122.06508 115.437126 221.200938 262.015505 221.200938 30.66644 0 61.617359-7.609305 92.423993-15.262612l84.513836 45.786813-23.178909-76.17082C899.379213 735.776599 945.448458 674.90216 945.448458 606.151333zM598.803483 567.994292c-15.332197 0-30.807656-15.096836-30.807656-30.501688 0-15.190981 15.47546-30.477129 30.807656-30.477129 23.295566 0 38.558178 15.286148 38.558178 30.477129C637.361661 552.897456 622.099049 567.994292 598.803483 567.994292zM768.25071 567.994292c-15.213493 0-30.594809-15.096836-30.594809-30.501688 0-15.190981 15.381315-30.477129 30.594809-30.477129 23.107277 0 38.558178 15.286148 38.558178 30.477129C806.808888 552.897456 791.357987 567.994292 768.25071 567.994292z"
                                fill="#8a8a8a" p-id="7136"></path>
                        </svg>
                    </div>
                </template>
            </el-popover>
            <el-popover trigger="click" placement="top" :width="180">
                <p>邮箱号：3341154833@qq.com</p>
                <div style="text-align: center; margin: 0">
                    <el-button size="small" type="primary" @click="copyTextwithMsg('3341154833@qq.com')">复制</el-button>
                </div>
                <template #reference>
                    <div class="icon">
                        <svg t="1705909952800" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="8336" width="24" height="24">
                            <path
                                d="M677.288 536.903l-167.315 156.052-170.532-156.052-246.146 230.058h831.748l-247.756-230.058zM954.002 287.541v423.114l-238.1-209.145 238.1-213.969zM64.336 290.756l231.666 212.361-231.666 207.534v-419.895zM93.294 234.45l418.287 389.33 413.461-389.33h-831.748z"
                                fill="#8a8a8a" p-id="8337"></path>
                        </svg>
                    </div>
                </template>
            </el-popover>
            <a class="icon" href="https://github.com/tonecn">
                <svg t="1705909977594" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="9342" width="24" height="24">
                    <path
                        d="M511.957333 21.333333C241.024 21.333333 21.333333 240.981333 21.333333 512c0 216.832 140.544 400.725333 335.573334 465.664 24.490667 4.394667 32.256-10.069333 32.256-23.082667 0-11.690667 0.256-44.245333 0-85.205333-136.448 29.610667-164.736-64.64-164.736-64.64-22.314667-56.704-54.4-71.765333-54.4-71.765333-44.586667-30.464 3.285333-29.824 3.285333-29.824 49.194667 3.413333 75.178667 50.517333 75.178667 50.517333 43.776 75.008 114.816 53.333333 142.762666 40.789333 4.522667-31.658667 17.152-53.376 31.189334-65.536-108.970667-12.458667-223.488-54.485333-223.488-242.602666 0-53.546667 19.114667-97.322667 50.517333-131.669334-5.034667-12.330667-21.930667-62.293333 4.778667-129.834666 0 0 41.258667-13.184 134.912 50.346666a469.802667 469.802667 0 0 1 122.88-16.554666c41.642667 0.213333 83.626667 5.632 122.88 16.554666 93.653333-63.488 134.784-50.346667 134.784-50.346666 26.752 67.541333 9.898667 117.504 4.864 129.834666 31.402667 34.346667 50.474667 78.122667 50.474666 131.669334 0 188.586667-114.730667 230.016-224.042666 242.090666 17.578667 15.232 33.578667 44.672 33.578666 90.453334v135.850666c0 13.141333 7.936 27.605333 32.853334 22.869334C862.250667 912.597333 1002.666667 728.746667 1002.666667 512 1002.666667 240.981333 783.018667 21.333333 511.957333 21.333333z"
                        p-id="9343" fill="#8a8a8a"></path>
                </svg>
            </a>
        </div>
    </div>
</template>
<style scoped>
.footer-divider {
    height: 1px;
    width: 100%;
    background-color: #eee;
}

.footer-container {
    /* height: 100%; */
    height: 100px;
    width: 100%;
    margin: 0 auto;
    max-width: 1170px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.left-container {
    font-size: 12px;
    margin-left: 25px;
    cursor: default;
}

.fillings {
    margin-bottom: 5px;
    cursor: pointer;
}

.right-container {
    margin-right: 25px;
    display: flex;
}

.right-container>.icon {
    cursor: pointer;
    margin: 0 8px;
    width: 30px;
    height: 30px;
    /* background-color: #aaa; */
    border: 1.5px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    transition: background-color 0.3s;
}

.right-container>.icon:hover {
    background-color: #eee;
}

.right-container>.icon>.icon {
    width: 20px;
    height: 20px;
}

@media screen and (max-width: 550px) {
    .footer-container {
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 20px;
    }

    .left-container {
        margin: 20px 0px;
        margin-bottom: 10px;
        text-align: center;
    }

    .right-container {
        margin: 0 0;
    }
}
</style>