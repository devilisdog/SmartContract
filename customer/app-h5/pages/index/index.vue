<template>
	<view class="content">
		<!-- #ifdef H5 -->
		<web-view :src="url"></web-view>
		<!-- #endif -->
	</view>
</template>

<script>
	import api from "@/config/index.js"
	export default {
		data() {
			return {
				title: '易下',
				url:''
			}
		},
		onLoad() {
			// #ifdef H5
			this.url=api.config.baseUrl
			console.log(api.config.baseUrl)
			// #endif
			// #ifdef APP
			var w = plus.webview.create(api.config.baseUrl, 'id', {
				top: uni.getSystemInfoSync().statusBarHeight,
				height: uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().statusBarHeight
			}, {
				preload: 'preload webview'
			});
			var currentWebview = this.$mp.page.$getAppWebview()
			currentWebview.append(w);
			// #endif
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>