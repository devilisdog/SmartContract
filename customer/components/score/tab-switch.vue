<template>
    <view class="tab-container">
        <scroll-view scroll-x class="tab-scroll" :scroll-with-animation="true" :scroll-left="scrollLeft">
            <view class="tab-list">
                <view 
                    v-for="(item, index) in values" 
                    :key="index"
                    class="tab-item"
                    :class="{ active: current === index }"
                    :style="{ color: current === index ? activeColor : '#333' }"
                    @click="handleClick(index)"
                >
                    <text class="tab-text">{{ item }}</text>
                    <view 
                        class="tab-line" 
                        :style="{ 
                            backgroundColor: activeColor,
                            transform: current === index ? 'scaleX(1)' : 'scaleX(0)'
                        }"
                    ></view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    // 当前选中的索引
    current: {
        type: Number,
        default: 0
    },
    // tab项数组
    values: {
        type: Array,
        default: () => []
    },
    // 激活状态的颜色
    activeColor: {
        type: String,
        default: '#dd3620'
    },
    // 样式类型
    styleType: {
        type: String,
        default: 'text'
    }
})

const emit = defineEmits(['onClickdateItem'])

const scrollLeft = ref(0)

// 处理点击事件
const handleClick = (index) => {
    emit('onClickdateItem', index)
}

// 监听current变化，自动滚动到选中项
watch(() => props.current, (newVal) => {
    // 计算需要滚动的距离
    const query = uni.createSelectorQuery()
    query.selectAll('.tab-item').boundingClientRect()
    query.exec((res) => {
        if (res[0]) {
            let totalWidth = 0
            for (let i = 0; i < newVal; i++) {
                totalWidth += res[0][i].width
            }
            scrollLeft.value = totalWidth
        }
    })
}, { immediate: true })
</script>

<style lang="scss">
.tab-container {
    width: 100%;
    background-color: #fff;
    padding: 20rpx 0;
}

.tab-scroll {
    width: 100%;
    white-space: nowrap;
}

.tab-list {
    display: inline-flex;
    padding: 0 20rpx;
}

.tab-item {
    position: relative;
    padding: 0 30rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
}

.tab-text {
    font-size: 28rpx;
    font-weight: 500;
}

.tab-line {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4rpx;
    transform-origin: center;
    transition: transform 0.3s;
}

.active {
    font-weight: bold;
}
</style> 