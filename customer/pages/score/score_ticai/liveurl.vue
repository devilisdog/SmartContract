<template>
		<view class="" style="background: black;height: 100vh;">
			<uni-nav-bar title="动画直播" left-icon="left" left-text="返回" backgroundColor="#f04b49" color="#ffffff" @clickLeft="back" height="100rpx"></uni-nav-bar>
				<web-view :src="url" style="height: 500rpx;top: 150rpx;"></web-view>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				url:''
			}
		},
		methods: {
			back(){
				uni.navigateBack()
			}
		},
		onLoad(e) {
			console.log(e.url)
			this.url=e.url
		}
	}
</script>

<style>

</style>
