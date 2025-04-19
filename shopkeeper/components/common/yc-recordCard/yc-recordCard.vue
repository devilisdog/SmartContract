<template>
	<view class="boxCardStyle">
		<view style="display: flex;justify-content: space-between;">
			<view style="display: flex;align-items: center;">
				<image :src="common.findImg(Props.gameData.Type)" style="width:50rpx;height:50rpx;"></image>
				<text style="margin-left:10rpx;font-weight: bold;font-size:32rpx;color:black;">
					{{Props.gameData.Type}}
				</text>
				<yc-card-TGA 
					:value='Props.gameData.default' 
					:orderState='Props.gameData.Issue' 
					:IsAllowRejection='Props.gameData.IsCooperative'
				/>
			</view>
			<text v-if="Props.gameData.State!=10">{{common.orderState(Props.gameData.State)}}</text>
			<text v-else class="tga">{{common.orderState(Props.gameData.State)}}</text>
		</view>
		<view style="display: flex;align-items: center;justify-content: space-between;">
			<view>
				<text>订单号：{{Props.gameData.order_id}}</text><br>
				<text>时间：{{GetDate.getNowFormatDate(0,Props.gameData.PayTime)}}</text>
			</view>
			<text style="color:red;font-weight: bold;" v-show="Props.gameData.AwardMoney>0 && Props.gameData.AwardMoney!=''">
				中奖金额：{{Props.gameData.AwardMoney}}元
			</text>
		</view>
		<view style="display:flex;justify-content: space-between;">
			<text>投注金额：{{Props.gameData.BetMoney}}元</text>
			<view style="display: flex;align-items: center;">
				<uni-icons type="image" size="50rpx"></uni-icons>
				<text>{{Props.gameData.ReturnImages.length}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
		defineProps
	} from 'vue';
	import common from "@/common/common.js"
	import GetDate from "@/common/getdatetime.js"
	const Props=defineProps(['gameData'])
</script>

<style>
	.tga{
		background-image: linear-gradient(#ffd875, #ff7979);
		padding:0rpx 10rpx;
		color: white;
		border-top-left-radius:20rpx;
		border-bottom-right-radius:20rpx;
	}
	.boxCardStyle{
		width:680rpx;
		padding:20rpx;
		border-radius:15rpx;
		background-color:white;
		margin:15rpx auto;
		line-height:50rpx;
		font-size:26rpx;
		color:#686868;
	}
	.boxCardStyle:active{
		transition:.2s;
		transform: scale(0.95);
	}
</style>
