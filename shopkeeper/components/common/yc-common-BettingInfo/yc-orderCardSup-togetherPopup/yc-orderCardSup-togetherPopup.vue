<template>
	<uni-nav-bar title="合买列表" leftIcon="closeempty" @clickLeft="Close"></uni-nav-bar>
	<view class="tabStyle">
		<text>合买用户</text>
		<text>认购份数</text>
		<text>认购金额</text>
		<text>中奖金额</text>
	</view>
	<scroll-view scroll-y="true" :style="{height:common.scrollH()-120+'rpx'}">
		<view class="userCard" v-for="itme,index in Props.togetherList">
			<view style="text-align: center;">
				<image :src="itme.user_id.avatar" style="width:80rpx;height:80rpx;"></image><br>
				<text>{{itme.user_id.nickname}}</text>
			</view>
			<text style="width:60rpx;">{{itme.MyselfShare}}</text>
			<text style="color: red;width:90rpx;">{{itme.OneselftMoney}}元</text>
			<text style="width:60rpx;">/</text>
		</view>
	</scroll-view>
</template>

<script setup>
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		defineProps,
		defineEmits,//发送数据
	} from 'vue';
	import common from "@/common/common"
	const Emits=defineEmits(['close'])
	const Props=defineProps(['togetherList'])
	const Close=()=>{
		Emits('close')
	}
</script>

<style>
	.userCard{
		display: flex;
		align-items: center;
		justify-content:space-between;
		width:680rpx;
		padding:20rpx;
		background-color: white;
		border-radius:15rpx;
		margin:10rpx auto;
		border-bottom:1rpx solid #efefef;
	}
	.tabStyle{
		width:100%;
		display: flex;
		align-items: center;
		justify-content:space-around;
		padding:20rpx 0rpx;
		font-size:28rpx;
		background-color:white;
		height:40rpx;
	}

</style>
