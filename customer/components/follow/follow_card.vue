<template>
	<view class="card">
		<view class="card_top">
			<view class="top_left">
				<image :src="Props.CardInfo.user_id.avatar" class="user_logo"></image>
				<view>
					<text style="font-size:30rpx;">{{Props.CardInfo.user_id.nickname}}</text><br>
					<view>
						<text style="font-size:26rpx;color:#acacac;">预计回报</text>
						<text style="font-size:26rpx;" :style="Number(Props.CardInfo.ForecastReward).toFixed(2)>8?'color:red;':'color:#acacac;'">
							{{Number(Props.CardInfo.ForecastReward).toFixed(2)}}倍
						</text>
					</view>
				</view>
			</view>
			<view class="top_right">
				<text style="color:#acacac;">截止时间</text><br>
				<showTime color="#1B4F88" splitorColor="#1B4F88" :timestamp="Props.CardInfo.Deadline"></showTime>
			</view>
		</view>
		<view class="user_text">{{common.isJson(Props.CardInfo.Declarati)}}</view>
		<view class="operating_box">
			<view class="gameInfo_box">
				<view class="info_item">
					<image :src="counter.baseUrl+Props.CardInfo.gameInfo.image"></image>
					<text>{{Props.CardInfo.gameInfo.title}}</text>
				</view>
				<text style="margin:0rpx 10rpx;color:#acacac;">|</text>
				<view class="info_item">
					<text style="color:red;">{{Props.CardInfo.OneselftMoney}}</text>
					<text>自购(元)</text>
				</view>
				<text style="margin:0rpx 10rpx;color:#acacac;">|</text>
				<view class="info_item">
					<text  style="color:red;">{{Props.CardInfo.popularity}}</text>
					<text>人气(次)</text>
				</view>
			</view>
			<view class="button">
				跟单
			</view>
		</view>
	</view>
</template>

<script setup>
	import showTime from "@/components/common/showTiem.vue"
	import {onBeforeMount,ref,reactive,getCurrentInstance,defineProps} from 'vue';
	import { useCounterStore } from '@/stores/counter';
	import common from "@/common/common.js"
	const counter = useCounterStore();//状态管理
	const Props=defineProps(['CardInfo'])
</script>

<style lang="scss">
	.operating_box{
		display: flex;
		align-items: center;
		.button{
			flex: 0.4;
			background: #db3735;
			text-align: center;
			border-radius:20rpx;
			color:#fff;
			height:100rpx;
			line-height:100rpx;
			margin-left:20rpx;
		}
		.gameInfo_box{
			flex:1;
			background-color:#f5f5f5;
			border-radius:20rpx;
			padding:10rpx;
			display:flex;
			align-items: center;
			justify-content:space-around;
			.info_item{
				text-align: center;
				display: flex;
				flex-flow: column;
				// background-color: salmon;
				align-items: center;
				height:100rpx;
				justify-content: space-around;
				image{
					width:70rpx;
					height:70rpx;
				}
			}
		}
	}
	.user_text{
		margin:20rpx 0rpx;
		width:100%;
		word-break: break-all;
		font-size:26rpx;
	}
	.card_top{
		display: flex;
		align-items: center;
		justify-content: space-between;
		.top_right{
			text-align: center;
		}
		.top_left{
			display: flex;
			align-items: center;
		}
	}
	.user_logo{
		width:100rpx;
		height:100rpx;
		border-radius:5rpx;
		margin-right:10rpx;
	}
	.card{
		width:680rpx;
		padding:20rpx;
		border-radius:20rpx;
		background-color:#fff;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		margin:20rpx auto;
	}
</style>
