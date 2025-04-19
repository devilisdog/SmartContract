<template>
  <view class="tabbar">
    <view class="tabbar-item" @click="switchTab('pages/main/main')" :class="{ active: current === 'pages/main/main' }">
      <text>首页</text>
    </view>

    <view class="tabbar-item" @click="switchTab('pages/follow/follow')" :class="{ active: current === 'pages/follow/follow' }">
      <text>跟单</text>
    </view>

    <view class="tabbar-item special-button" @click="switchTab('pages/together/together')">
      <!-- <image src="@/static/tabbar/follow.png" class="circle-icon"></image> -->
	  <view class="">合买</view>
    </view>

    <view class="tabbar-item" @click="switchTab('pages/score/score')" :class="{ active: current === 'pages/score/score' }">
      <text>比分</text>
    </view>

    <view class="tabbar-item" @click="switchTab('pages/home/home')" :class="{ active: current === 'pages/home/home' }">
      <text>我的</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const current = ref('')

const switchTab = (url) => {
  current.value = url
   router.push({ path: url })
}

onMounted(() => {
  current.value = router.currentRoute.value.url
})
</script>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  height: 60px;
  border-top: 1px solid #eaeaea;
}

.tabbar-item {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999999;
  line-height: 60px;
}

.tabbar-item.active {
  color: #FF0000;
}

.special-button {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.circle-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>
