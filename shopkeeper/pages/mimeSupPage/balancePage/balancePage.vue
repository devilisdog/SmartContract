<template>
	<view class="status_bar"></view>
	<uni-nav-bar title="店铺余额" leftIcon="back" rightText="账号明细" @clickLeft="back" @clickRight="particulars" leftText="返回" />
	<view style="width:100%;height:200rpx;background-color: #FDC830;float: left;">
		<view class="backColor">
			<text>店铺余额</text>
		</view>
		<view class="Card">
			<view style="margin-left:20rpx;font-size:26rpx;color: #a4a4a5;">
				<text>当前余额</text>
			</view>
			<view>
				<text style="font-weight:600;font-size:40rpx;margin-left:20rpx;">￥{{counter.shopBasicsData.money}}</text>
			</view>
			<view style="display: flex;justify-content: space-around;">
				<view class="balanceBottom" style="border:1rpx solid #FDC830;" @click="drawMonaye">
					<text style="color: #FDC830;">清账</text>
				</view>
				<view class="balanceBottom" style="background-color: #FDC830;" @click="skip">
					<text style="color: #fbfbfd;">加帐</text>
				</view>
			</view>
		</view>
	</view>

</template>

<script setup>
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		defineProps,
	} from 'vue';
	import {useCounterStore} from '@/stores/counter'
	const counter = useCounterStore(); //状态管理

	const back = () => {
		uni.navigateBack()
	}
	const particulars=()=>{
		uni.navigateTo({
			url:'/pages/mimeSupPage/balancePage/shopParticulars/shopParticulars'
		})
	}
	const drawMonaye=()=>{
		uni.navigateTo({
			url:'/pages/mimeSupPage/balancePage/drawMoney/drawMoney'
		})
	}
	const skip = () => {
		uni.navigateTo({
			url:'/pages/mimeSupPage/balancePage/rechargePage'
		})
	}
</script>

<style>
	.Card {
		width: 700rpx;
		height: 260rpx;
		background-color: white;
		margin: auto;
		border-radius: 20rpx;
		display: flex;
		flex-flow: column;
		justify-content: space-evenly
	}

	.balanceBottom {
		width: 300rpx;
		height: 70rpx;
		border-radius:20rpx;
		text-align:center;
		line-height:70rpx;
		transition:.2s;
	}
	
	.balanceBottom:active{
		transition:.2s;
		transform: scale(0.9);
	}

	.backColor {
		height: 100rpx;
		width: 700rpx;
		margin: auto;
		display: flex;
		align-items: center;
		color: white;
		font-weight: 600;
		font-size: 40rpx;
	}

	body {
		background-color: #f3f3f3;
	}
	.status_bar{
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
