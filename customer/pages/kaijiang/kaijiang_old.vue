<template>
	<view class="box">
		<nav-bar :title="'开奖'" :bgColor="bgColor" :back="true"></nav-bar>
		<zero-loading v-if="loading" mask :color="bgColor"></zero-loading>
		<!-- <web-view src="https://m.310win.com/Trade/DrawInfo/DrawInfoMain.aspx"></web-view> -->
		<web-view src="https://h5.jiangduoduo.com/home/nation?frm=C_ATjdd%2FHallOfPrize"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading:false,
			}
		},
		methods: {

		},
		onLoad() {
			this.bgColor = uni.getStorageSync("bgColor");
			this.fontColor = uni.getStorageSync("fontColor");
			this.loading=true;
			setTimeout(() => {
				this.loading=false;
			}, 500)
		}
	}
</script>

<style lang="scss">
	uni-web-view.uni-webview--fullscreen {
		margin-top: 10rpx;
		// 如果用了彩客网的开奖就需要放开下面的注释，然后把上面的注释掉
		/* margin-top: -8rpx;
		margin-bottom: 146rpx; */
	}
</style>