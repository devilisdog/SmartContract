<template>
	<view class="card2">
		<view class="card">
			<checkbox-group @change="check" style="display: flex;align-items: center;">
				<checkbox :checked='Props.allCheckValue==1'></checkbox>
				<view style="margin-right:10rpx;"> 
					<image :src="common.findImg(Props.orderData.Type)" style="width:80rpx;height:80rpx;"></image>
				</view>
				<view>
					<text style="font-weight:600;">{{Props.orderData.Type}}</text>
					<view style="font-size:26rpx;">
						<text style="padding-right:10rpx;">
							{{
								judgeData(Props.orderData.Type)==true?
								JSON.parse(Props.orderData.BetContent).remarks.Note:
								JSON.parse(Props.orderData.BetContent)[0].note
							}}注
						</text>
						<text style="padding-right:10rpx;">
							{{
								judgeData(Props.orderData.Type)==true?
								JSON.parse(Props.orderData.BetContent).remarks.Multiple:
								JSON.parse(Props.orderData.BetContent)[0].beilv
							}}倍</text>
						<text>{{Props.orderData.BetMoney}}元</text>
					</view>
				</view>
			</checkbox-group>
			<view class="textStyle" style="text-align: right;">
				<text>中奖</text>
				<text style="color:red;">{{Props.orderData.AwardMoney}}元</text>
				<view style="margin-top:15rpx;">
					<text>{{getDate.getNowFormatDate(0,Props.orderData.PayTime)}}</text>
				</view>
			</view>
		</view>
		<view class="cardBotton">
			<text class="textStyle">ID:{{Props.orderData.order_id}}</text>
			<view style="display: flex;">
				<view class="buttonStyle" @click="setMoney(Props.orderData)">
					<text>修改金额</text>
				</view>
				<view class="buttonStyle" @click="finalStatement(Props.orderData.order_id)">
					<text>派奖</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import api from "@/common/vmeitime-http/index/index.js"
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		defineEmits,//发送数据
		defineProps,//接收数据
		defineExpose
	} from 'vue';
	import {useCounterStore} from '@/stores/counter'
	import common from "@/common/common.js"
	import getDate from "@/common/getdatetime.js"
	const Props=defineProps(['orderData','allCheckValue','orderIndex'])
	const Emits=defineEmits(['message','finalStatementClick'])
	const counter = useCounterStore(); //状态管理
	const check=(e)=>{
		if(e.detail.value.length==1){
			Emits('message',true,Props.orderIndex)
		}else{
			Emits('message',false,Props.orderIndex)
		}
	}
	const judgeData=(title)=>{
		var viewdata = ['竞彩篮球','竞彩足球','北京单场','胜负过关','胜负彩','任选九']
		var arr=viewdata.includes(title)
		return arr
	}
	const setMoney=(e)=>{
		counter.orderData=e
		uni.navigateTo({
			url:'/pages/indexSupPages/indexSupPages',
			animationType:'slide-in-bottom'
		})
	}
	const finalStatement=(order_id)=>{
		Emits('finalStatementClick',order_id)
	
	}
</script>

<style>
	.cardBotton{
		display: flex;
		align-items: center;
		width:690rpx;
		margin:10rpx auto;
		justify-content: space-between;
	}
	.buttonStyle{
		width:200rpx;
		height:50rpx;
		border:1rpx solid #FDC830;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #FDC830;
		margin-left: 15rpx;
		border-radius:7rpx;
		font-size:26rpx;
		
	}
	.buttonStyle:active{
		transition:.2s;
		transform: scale(0.9);
	}
	.textStyle{
		font-size:26rpx;
		color: #868686;
	}
	.card{
		width:700rpx;
		height:120rpx;
		display: flex;
		align-items: center;
		margin: auto;
		justify-content: space-between;
		border-bottom:1rpx solid #ececec;
	}
	.card2{
		width:720rpx;
		height:200rpx;
		background-color: white;
		border-radius: 20rpx;
		margin:10rpx auto;
	}

</style>