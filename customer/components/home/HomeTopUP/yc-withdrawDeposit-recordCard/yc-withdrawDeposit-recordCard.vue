<template>
	<view class="card" v-for="item,index in props.dataList" :key="index">
		<view class="card_head">
			<view style="display: flex;align-items: center;flex-direction: row;padding: 10rpx 5rpx;width: 450rpx;">
				<image src="@/static/img/home/zfb.png" style="width: 60rpx;height: 60rpx;" v-if="item.memo == '支付宝'"></image>
				<image v-else src="@/static/img/home/yh.png" style="width: 60rpx;height: 60rpx;"></image>
				<text style="font-size: 38rpx;color: #4d4d4d;font-weight: bold;padding: 0 5rpx;margin-right: 10rpx;">{{item.memo}}提现</text>
				<view :style="item.state == 0 ? 'background-color: #79c5ff;' 
							: item.state == 1 ? 'background-color: #ffc290;' 
							: item.state == 2 ? 'background-color: #ffb44a;'
							: 'background-color: #ff5c5c;'"
					style="height: 50rpx;border-radius: 15rpx;">
					<text style="color: white;font-weight: bold;padding: 0 15rpx;">
						{{item.state == 0 ? '处理中' : item.state == 1 ? '已结算' : item.state == 2 ? '已撤销' : '失败'}}
					</text>
				</view>
			</view>
			<view style="margin-right: 30rpx;">
				<text style="color: #ff5353;font-size: 32rpx;font-weight: bold;">{{item.money}}元</text>
			</view>
		</view>
		
		<view style="display: flex;flex-direction: column;padding:10rpx;color: #b0b0b0;">
			<text v-if="item.state == 2">拒绝理由：{{item.retMemo}}</text>
			<text style="margin: 10rpx 0;">账号：{{item.number}}</text>
			<text>时间：{{common.dateFormat(item.create_time*1000)}}</text>
		</view>
	</view>
</template>

<script setup>
	import common from "@/common/common.js"
	import {
		onBeforeMount,//加载前
		ref,
		reactive,
		defineProps, // 接收
		defineEmits, // 发送
		getCurrentInstance, //获取当前组件的实例
		nextTick//强制刷新实例
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const props = defineProps(['dataList'])
</script>

<style>
	.card{
		width: 700rpx;
		height: 100%;
		padding: 10rpx;
		margin: 15rpx 0;
		border-radius: 25rpx;
		box-shadow: 0 0 15rpx #efefef;
		background-color: white;
		display: flex;
		flex-direction: column;
		}.card_head{
			margin-top: 10rpx;
			display: flex;
			align-items: center;
			flex-direction: row;
			justify-content: space-between;
		}
</style>
