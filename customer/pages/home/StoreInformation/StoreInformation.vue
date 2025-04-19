<template>
	<!-- 导航 -->
	<view class="navigation">
		<view class="status_bar"></view>
		<view style="height: 100rpx;display: flex;align-items: center;justify-content: center;">
			<uni-icons type="back" @click="back()" size="21" style='position: absolute;left: 30rpx;'></uni-icons>
			<text style="color: #484848;font-size: 34rpx;font-weight: bold;">店铺信息</text>
		</view>
	</view>
	<view style="height: var(--status-bar-height);padding-top: 100rpx;"></view>
	
	<view v-if="dataList !== null"
		style="border-radius: 15rpx;background-color: #fff;width: 710rpx;margin: auto;margin-top: 20rpx;box-shadow: 0 5rpx 15rpx #eaeaea;">
		<view class="listData" >
			<text style="margin-top: -15rpx;">店铺名称：<text style="color: #262626;">{{dataList.shop_NickName}}</text></text>
			<!-- <text style="margin-top: -15rpx;">店铺名称：<text style="color: #262626;">启航竞彩体彩店铺</text></text> -->
			<text>店主姓名：<text style="color: #262626;">{{dataList.shop_RealName}}</text></text>
			<text @click="copy(dataList.shop_Mobile)">店铺号码：<text style="color: #262626;">{{dataList.shop_Mobile}}</text></text>
			<text @click="copy(dataList.shop_WeChat)">微信号码：<text style="color: #262626;">{{dataList.shop_WeChat}}</text></text>
			<text>店铺地址：<text style="color: #262626;">{{dataList.shop_Address}}</text></text>
			<text style="margin-bottom: -10rpx;">店铺公告：<text style="color: #262626;">{{dataList.shop_Notice}}</text></text>
		</view>
	</view>
</template>

<script setup>
	import api from '@/common/vmeitime-http/index.js'
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		getCurrentInstance,
		// nextTick
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	onBeforeMount(()=>{
		api.shopData().then((res)=>{
			console.log('店铺信息',dataList.value);
			dataList.value = res.data.data
			
		})
	})
	const dataList =ref(null)
	
	const copy = (data) =>{
		uni.setClipboardData({
			data: data,
		});
	}
	
	const back =()=>{
		uni.navigateBack()
	}
</script>

<style>
	body{
		background-color: #f7f7f7;
	}
	.status_bar {
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
	}
	/* 导航 */
	.navigation{
		width: 100%;
		background-color: white;
		position: fixed;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 1;
		box-shadow: 0 5rpx 15rpx -8rpx #ebebeb;
	}
	
	.listData{
		width: 660rpx;
		padding: 40rpx 30rpx;
		margin: auto;
		display: flex;
		flex-direction: column;
		}.listData text{
			margin: 20rpx 0;
			line-height: 60rpx;
			font-size: 32rpx;
			color: #a1a1a1;
		}
</style>
