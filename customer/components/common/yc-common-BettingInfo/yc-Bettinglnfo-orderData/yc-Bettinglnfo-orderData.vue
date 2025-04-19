<template>
	<view class="dataCard">
		<view class="top_title">
			<text style="font-size:32rpx;font-weight:600;">订单信息</text>
			<view style="display: flex;align-items: center;">
				
			</view>
		</view>
		<view class="content">
			<text>订单编号</text>
			<view @click="copy(counter.allOrderData.order_id)">
				<text>{{counter.allOrderData.order_id}}</text>
				<uni-icons type="folder-add"></uni-icons>
			</view>
		</view>
		<view class="content">
			<text>付款时间</text>
			<text>{{timeSetat.getNowFormatDate(0,counter.allOrderData.PayTime*1000)}}</text>
		</view>
		<view class="content">
			<text>截止时间</text>
			<text>{{timeSetat.getNowFormatDate(0,counter.allOrderData.Deadline*1000)}}</text>
		</view>
		<view class="content" v-if="counter.allOrderData.State=='2'">
			<text>接单时间</text>
			<text>{{timeSetat.getNowFormatDate(0,counter.allOrderData.Receivingtime*1000)}}</text>
		</view>
		<view class="content" v-else-if="stateTitle(0,counter.allOrderData.State)">
			<text>出票时间</text>
			<text>{{timeSetat.getNowFormatDate(0,counter.allOrderData.Ticketingtime*1000)}}</text>
		</view>
		
		<view class="content" v-else-if='stateTitle(0,counter.allOrderData.State)'>
			<text>撤销时间</text>
			<text>{{timeSetat.getNowFormatDate(0,counter.allOrderData.Receivingtime*1000)}}</text>
		</view>
		<view class="content" v-if='stateTitle(0,counter.allOrderData.State)'>
			<text>撤销人</text>
			<text>{{stateTitle(1,counter.allOrderData.State*1000)}}</text>
		</view>
	</view>
</template>

<script setup>
	import {useCounterStore} from '@/stores/counter'
	import timeSetat from "@/common/getdatetime.js"
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		defineEmits, //发送数据
		defineProps,
	} from 'vue';
	const counter = useCounterStore(); //状态管理
	
	const stateTitle=(type,e)=>{
		if(type==0){
			var arr=['3','4','5']
			var arrBoole=arr.includes(e)
			if(arrBoole){
				return true
			}else{
				return false
			}
		}else{
			var newArr={
				'3':'玩家撤销',
				'4':'店主撤销',
				'5':'系统撤销'
			}
			return newArr[e]
		}
		
	}
	const copy=(e)=>{
		uni.setClipboardData({//复制
			data:String(e),
			showToast:true
		})
	}
</script>

<style>
	.content {
		display: flex;
		justify-content: space-between;
		margin: 10rpx 0rpx;
		color: #616161;;
	}

	.top_title {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.dataCard {
		width: 680rpx;
		background-color: white;
		margin: 20rpx auto;
		border-radius: 10rpx;
		padding: 20rpx;
	}
</style>
