<script setup lang='ts'>
/**
 * 旋转图像验证码组件
 * @event success 验证成功
 * @event fail 验证失败
 * @requires ServerSDK
 * @since 1.0.2
 */
import { request, type BaseResponseData } from '@/lib/request';
import { onBeforeMount, onMounted, ref } from 'vue';
let imageBase64 = ref('');
const emit = defineEmits(['fail', 'success'])
let onVerifying = ref(false);
let onVerifyFail = ref(false);
onBeforeMount(async () => {
    try {
        let res: BaseResponseData = await request.get('captcha')
        localStorage.setItem('captcha-session', res.data.session)
        imageBase64.value = res.data.imgPreStr + res.data.img;
    } catch (error) {
        console.log("获取图像验证码失败：" + error);
        emit('fail');
    }
})
onMounted(() => {
    let slider = document.getElementById('RV-slider');
    let imageEle = document.getElementById('RV-image');
    let isDragging = false;// 正在移动标志位
    let silderMoveable = true;// 是否可以开始移动标识位
    let startX: number;
    let deltaX: number;// 拖动距离
    if(!slider || !imageEle){
        throw new Error('element is null')
    }
    slider.addEventListener('mousedown', function (e) {
        if (silderMoveable) {
            isDragging = true;
            startX = e.clientX;
            onVerifyFail.value = false;
        }
    })

    slider.addEventListener('touchstart', function (e) {
        if (silderMoveable) {
            e.preventDefault();
            isDragging = true;
            startX = e.touches[0].clientX;
            onVerifyFail.value = false;
        }
    }, { passive: false });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            silderMoveable = false;// 产生了位移，则需等待验证后才可再次移动
            deltaX = e.clientX - startX;
            // 对位移距离限幅
            if (deltaX < 0)
                deltaX = 0;
            if (deltaX > 200)
                deltaX = 200;
            // 调整滑块条位置样式
            slider.style.transform = ` translateX(${deltaX}px)`;
            // 调整图片旋转样式 （200 -> 360）映射 y = 9/5x
            imageEle.style.transform = `rotate(${deltaX * 9 / 5}deg)`
        }
    });

    document.addEventListener('touchmove', function (e) {
        if (isDragging) {
            e.preventDefault();
            silderMoveable = false;
            deltaX = e.touches[0].clientX - startX;
            if (deltaX < 0) deltaX = 0;
            if (deltaX > 200) deltaX = 200;
            slider.style.transform = `translateX(${deltaX}px)`;
            imageEle.style.transform = `rotate(${deltaX * 9 / 5}deg)`;
        }
    }, { passive: false });


    document.addEventListener('mouseup', async () => {
        if (isDragging) {
            isDragging = false;
            if (!deltaX) {
                silderMoveable = true;// 位移距离为0，无需验证可以继续移动
            } else {
                try {
                    onVerifying.value = true;
                    let res: BaseResponseData = await request.post('checkCaptcha', {
                        session: localStorage.getItem('captcha-session'),
                        rotateDeg: deltaX * 9 / 5
                    })
                    switch (res.code) {
                        case 0:
                            // 验证成功
                            emit('success');
                            break;
                        case -5002:
                            // 可以再试一次
                            onVerifyFail.value = true;
                            slider.style.transition = "transform 0.6s";
                            slider.style.transform = "translateX(0px)";
                            imageEle.style.transition = "transform 0.6s";
                            imageEle.style.transform = "rotate(0deg)";
                            setTimeout(() => {
                                isDragging = false;
                                silderMoveable = true;
                                slider.style.transition = "transform 0s";
                                imageEle.style.transition = "transform 0s";
                            }, 600);
                            break;
                        default:
                            console.log('验证session过期、不存在、服务器错误')
                            emit('fail');
                            break;
                    }
                } catch (error) {
                    console.log("图像验证码错误：" + error);
                    emit('fail');
                } finally {
                    onVerifying.value = false;
                }
            }
        }
    });

    document.addEventListener('touchend', async () => {
        if (isDragging) {
            isDragging = false;
            if (!deltaX) {
                silderMoveable = true;// 位移距离为0，无需验证可以继续移动
            } else {
                try {
                    onVerifying.value = true;
                    let res: BaseResponseData = await request.post('checkCaptcha', {
                        session: localStorage.getItem('captcha-session'),
                        rotateDeg: deltaX * 9 / 5
                    })
                    switch (res.code) {
                        case 0:
                            // 验证成功
                            emit('success');
                            break;
                        case -5002:
                            // 可以再试一次
                            onVerifyFail.value = true;
                            slider.style.transition = "transform 0.6s";
                            slider.style.transform = "translateX(0px)";
                            imageEle.style.transition = "transform 0.6s";
                            imageEle.style.transform = "rotate(0deg)";
                            setTimeout(() => {
                                isDragging = false;
                                silderMoveable = true;
                                slider.style.transition = "transform 0s";
                                imageEle.style.transition = "transform 0s";
                            }, 600);
                            break;
                        default:
                            console.log('验证session过期、不存在、服务器错误')
                            emit('fail');
                            break;
                    }
                } catch (error) {
                    console.log("图像验证码错误：" + error);
                    emit('fail');
                } finally {
                    onVerifying.value = false;
                }
            }
        }
    });
})

</script>
<template>
    <transition name="el-fade-in-linear">
        <div class="fixed w-full h-full inset-0 bg-[#00000022] z-[2000] flex justify-center items-center" @click="$emit('fail')">
            <div class="w-[300px] h-[400px] bg-white flex flex-col items-center rounded-[15px]" onclick="event.stopPropagation()">
                <div class="mt-[25px] text-[#888]">安全验证</div>
                <div class="mt-[8px]">{{ onVerifying ? "正在验证，请稍后..." : (onVerifyFail ? "验证失败，请再试一次" : "拖动滑块，使图片角度为水平")
                    }}
                </div>
                <div class="mt-[28px] w-[160px] h-[160px] rounded-full flex justify-center items-center overflow-hidden">
                    <img class="w-[226px] h-[226px] bg-gray-400 object-cover" :src="imageBase64" alt="" id="RV-image">
                </div>
                <div class="w-[240px] h-[40px] rounded-[20px] bg-slate-200 mt-[25px] flex items-center">
                    <div class="w-[45px] h-[45px] leading-[45px] bg-white rounded-full shadow-md text-center cursor-pointer relative translate-x-0" id="RV-slider">
                        <svg t="1706696449802" class="absolute left-[14px] top-[14px]" viewBox="0 0 1024 1024" fill="#666" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="1924" width="18" height="18">
                            <path
                                d="M567.32505 547.18536c20.970614-21.479197 20.970614-56.307424 0-77.790714L185.251168 77.115332c-20.971637-21.47715-54.975079-21.47715-75.948763 0-20.973684 21.484314-20.973684 56.30947 0 77.793784l344.188016 353.383446-344.188016 353.384469c-20.973684 21.484314-20.973684 56.311517 0 77.79276 20.971637 21.482267 54.975079 21.482267 75.948763 0l382.072858-392.280337 0.001024-0.004094zM440.60802 154.908092l344.18597 353.383446-344.18597 353.385493c-20.973684 21.484314-20.973684 56.311517 0 77.79276 20.972661 21.482267 54.975079 21.482267 75.949786 0l382.074905-392.281361c20.966521-21.478174 20.966521-56.307424 0-77.790714L516.555759 77.115332c-20.972661-21.47715-54.975079-21.47715-75.949786 0-20.971637 21.48329-20.971637 56.30947 0.002047 77.79276z"
                                p-id="1925"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>