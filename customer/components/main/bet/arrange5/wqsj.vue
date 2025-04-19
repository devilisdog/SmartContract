<template>
	<view class="" v-for="item,index in Props.list">
		<view :style="(index+1)%2!=0?'background:rgba(255, 198, 83, 0.1)':''"
		style="display: flex;height: 60rpx;align-items: center;color: #7a7a7a;padding-left: 20rpx;">
			<text>{{list[index].code}}</text>
			<text style="margin-right: 50rpx;">期</text>
			<!-- 球 -->
			<view v-for="itme in list[index].lotteryDrawResult"
				style="width: 50rpx; height: 50rpx;background-color: #ff6f6f;border-radius: 50rpx;line-height: 50rpx;display: flex;margin-left: 10rpx;">
				<text style="display: block; margin: auto;color: #fff;">{{itme}}</text>
			</view>
			<view style="position:relative;left: 90rpx;line-height: 70rpx;">
				<text>奖池:</text>
				<text style="color: red;">{{common.unitConvert(Props.list[index].poolmoney.replace(/,/g,'')-0).num}}{{common.unitConvert(Props.list[index].poolmoney.replace(/,/g,'')-0).unit}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import common from "@/common/common.js"
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		getCurrentInstance,
		defineProps, // 接收
		defineEmits, // 发送
	} from 'vue';
	
	const Props = defineProps(['list'])
	
</script>

<style>

</style>