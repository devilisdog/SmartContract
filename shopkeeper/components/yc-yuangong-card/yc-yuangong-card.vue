<template>
	<view class="card">
		<view style="display: flex;border-bottom:1rpx solid #ececec;align-items: center;" @click="clickCard">
			<view class="yiimg">
				<image :src="Props.logo" style="width:80rpx;height:80rpx;border-radius:50rpx;"></image>
			</view>
			<view style="flex:1;">
				<view style="height:60rpx;display: flex;align-items:flex-end;">
					<text style="font-weight:600;">{{Props.name}}</text>
				</view>
				<view class="er">
					<view>
						<text>ID：{{Props.id}}</text>
					</view>
				</view>
			</view>
			<view style="margin-right:20rpx;">
				<text>余额:</text>
				<text style="font-weight: 600;">{{Props.money}}</text>
			</view>
		</view>
		<view class="yi">
			<view style="display: flex;">
				<view class="bottm" style="border: 1rpx solid #FDC830;color: #FDC830;" @click="caizhong">
					<text>配置彩种</text>
				</view>
				<view class="bottm" style="border: 1rpx red solid;color: red;" v-if="Props.stateValue==1" @click="alterSetff('stop')">
					<text>停用</text>
				</view>
				<view class="bottm" style="border: 1rpx deepskyblue solid;color: deepskyblue;" v-else @click="alterSetff('start')">
					<text>启用</text>
				</view>
				
			</view>
			<!-- <view style="display: flex;">
				<view class="bottm" style="border: 1rpx solid #9a9a9a;color: #9a9a9a;" @click="forbidden">
					<text>扣款</text>
				</view>
				<view class="bottm" style="background-color: #FDC830;color: #ffffff;" @click="forbidden">
					<text>加款</text>
				</view>
			</view> -->
		
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
		defineProps, // 接收
		defineEmits, // 发送
	} from 'vue';
	import {useCounterStore} from '@/stores/counter'
	const counter = useCounterStore(); //状态管理
	const Props=defineProps(['stateValue','name','id','money','logo'])
	const Emits=defineEmits(['click','alterSetff','clickCard'])
	const forbidden=()=>{
		uni.showToast({
			title:'此功能暂未开放~',
			icon:'error'
		})
	}
	const alterSetff=(e)=>{
		Emits('alterSetff',e,Props.name,Props.id)
	}
	const caizhong=()=>{
		Emits('click')
	}
	const clickCard=()=>{
		Emits('clickCard',Props.id)
	}
</script>

<style>
	.yi {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content:flex-end;
		margin: auto;

	}

	.bottm {
		width: 140rpx;
		height: 40rpx;
		border-radius: 7rpx;
		margin:0rpx 10rpx;
		font-size:26rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.bottm:active{
		transition:.2s;
		transform: scale(0.95);
	}

	.yiimg {
		width: 100rpx;
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.er {
		height: 60rpx;
		display: flex;
		font-size: 22rpx;
		justify-content: space-between;
		align-items: center;
	}

	.card {
		width:720rpx;
		background-color: white;
		margin:20rpx auto;
		border-radius: 10rpx;
	}
</style>
