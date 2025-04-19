<template>
	<view class="all">
		<view class="all-herd">
			<text style="font-weight: bold;color: #474747 ; font-size: 34rpx;">合买列表</text>
			<view style="position: absolute;right: 40rpx;" @click="back"><uni-icons type="closeempty"></uni-icons></view>
		</view>
		<view class="all-ListName">
			<text style="flex: 0.35;padding-left: 50rpx;">用户</text>
			<text style="flex: 0.3;">购买份数</text>
			<text style="flex: 0.2;">购买金额</text>
		</view>
		
		<scroll-view scroll-y="true" style="height: 600rpx;" >
		<view class="all-content" v-for="item,index in props.playerData.content" :key="index">
			<view style="width: 270rpx;padding: 0 35rpx; display: flex; align-items: center;">
				<image :src="item.user_id.avatar" style="width: 80rpx;height: 80rpx;"></image>
				<text style="padding: 0 20rpx;">{{item.user_id.nickname}}</text>
			</view>
			<view style="width: 180rpx;">
				<text>{{item.MyselfShare}}份</text>
			</view>
			<view>
				<text style="color: red;">{{item.OneselftMoney}}元</text>
			</view>
		</view>
		
		<view style="width:680rpx;display: flex;justify-content: center;padding: 20rpx 0;color: #b9b9b9 ;font-size: 26rpx;">没有更多了~</view>
		</scroll-view>
		
	</view>
</template>

<script setup>
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		getCurrentInstance,
		defineEmits, //发送数据
		defineProps,
	 } from 'vue';
	const props = defineProps(['playerData'])
	const emits = defineEmits(['close'])
	onBeforeMount(()=>{
		// console.log('合买列表',props.playerData);
	})
	
	const back = () =>{
		emits('close')
	}
	
</script>

<style>
	.all{
		width: 680rpx;
		height: 100%;
		border-radius: 35rpx;
		background-color: white;
		}.all-herd{
			width: 680rpx;
			display: flex;
			padding: 20rpx 0;
			align-items: center;
			justify-content: center;
		}.all-ListName{
			width: 650rpx;
			display: flex;
			padding: 20rpx 0;
			align-items: center;
			justify-content: center;
		}.all-ListName text{
			color: #5a5a5a;
			font-size: 30rpx;
		}.all-content{
			width: 650rpx;
			display: flex;
			padding: 20rpx 0rpx;
			flex-direction: row;
			align-items: center;
		}
</style>