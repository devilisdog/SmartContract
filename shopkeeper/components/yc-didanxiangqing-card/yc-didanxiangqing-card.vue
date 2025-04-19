<template>
<view style="float:left;">
		<!-- 顶部文字部分 -->
	<uni-card  margin="0" spacing="0" padding="0" style="margin-top: 30rpx; margin-left: 10rpx;">
	<view class="erkap">
		<view style="margin-left:10rpx;">
			<text class="text">订单信息</text>
		</view>
		<view v-for="itme in dingdan" style="display: flex;flex-direction: row;margin: 25rpx;margin-bottom:30rpx;" :key="itme">
			<view class="left">
				<text style="font-size:26rpx;color:#c1c1c1;">{{itme.tite}}</text>
			</view>
			<view class="right" style="display: flex;margin-left: auto;">
				<text style="font-size:28rpx;color:#747474;">{{itme.shijian}}</text>
			</view>	
		</view>
	</view>
	<view class="bottomCard">
		<view style="margin-left:10rpx;padding-top:25rpx;">
			<text class="text">彩票照片</text>
		</view>
		<view class="images">			
				<!-- <image src="../../static/img/main/authentication.png" mode="widthFix" style="border-radius:10rpx;"></image> -->
		</view>
	</view>
	</uni-card>
	</view>
	
</template>

<script setup>
	import { useCounterStore } from '@/stores/counter';
	import {
		onBeforeMount,
		// onMounted,
		ref,
		reactive,
		defineProps,
		// getCurrentInstance,
		// nextTick
	} from 'vue';
	const props = defineProps(['data']) //接收传值
	const counter = useCounterStore(); //状态管理
	const data = reactive([])
	onBeforeMount(()=>{
		data.value = props.data
	})
	
	const dingdan = reactive([{
			tite:"订单编号",
			shijian:"7474084"
		},
		{
			tite:"付款时间",
			shijian:"2022-06-07 14:22:35"
		},
		{
			tite:"出票时间",
			shijian:"2022-06-07 14:45:02"
		},
		{
			tite:"截至时间",
			shijian:"2022-06-07 21:00:00"
		}
	])
</script>

<style>
	
	.bottomCard{
		width: 700rpx;
		height:100%;
		background-color:white;
		margin:20rpx 0rpx 0rpx 25rpx;
		border-radius:10rpx;
	}
	.erkap{
		width: 700rpx;
		height:380rpx;
		background-color: white;
		margin:10rpx 0rpx 0rpx 25rpx;
		border-radius: 10rpx;
	}
	

	

	.kap {
		width: 700rpx;
		height: 570rpx;
		background-color: white;
		border-radius: 10rpx;
		margin-left: 3.5%;
		margin-top: 25rpx;
	}
</style>
