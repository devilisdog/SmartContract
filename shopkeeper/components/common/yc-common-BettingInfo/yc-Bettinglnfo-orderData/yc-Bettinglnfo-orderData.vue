<template>
	<view class="dataCard">
		
		<view class="top_title">
			<view style="display: flex;align-items: center;">
				<text style="font-size:32rpx;font-weight:600;">订单信息</text>
				<!-- <yc-card-TGA :value='Props.label' :orderState='Props.orderState'></yc-card-TGA> -->
			</view>
			<view style="display: flex;">
				<yc-card-TGA :value='counter.orderData.default' :orderState='counter.orderData.Issue' :IsAllowRejection='counter.orderData.IsCooperative'/>
			</view>
			<!-- <view style="display: flex;align-items: center;" @click="clickCall">
				<uni-icons type="contact-filled" color="dodgerblue" size="36rpx"></uni-icons>
				<text style="color: dodgerblue;">联系彩民</text>
			</view> -->
		</view>
		<view class="content">
			<text>用户名称：</text>
			<text>{{counter.orderData.user_id.remarks!=undefined?counter.orderData.user_id.remarks:counter.orderData.user_id.nickname}}</text>
		</view>
		<view class="content" v-if="counter.orderData.follow_pid != null && counter.orderData.follow_pid != 0">
			<text>跟单用户：</text>
			<text>{{counter.orderData.follow_user.user_id.nickname}}</text>
		</view>
		<view class="content">
			<text>出票店主：</text>
			<text>{{counter.orderData.shop_id.nickname}}</text>
		</view>
		<!-- <view class="content">
			<text>订单归属</text>
			<text>员工(514)</text>
		</view> -->
		<view class="content">
			<text>订单编号：</text>
			<view @click="copy(counter.orderData.order_id)">
				<text>{{counter.orderData.order_id}}</text>
				<uni-icons type="folder-add"></uni-icons>
			</view>
		</view>
		<view class="content">
			<text>下单时间：</text>
			<text>{{getdatetime.getNowFormatDate(0,counter.orderData.PayTime)}}</text>
		</view>
		<view class="content" v-if="counter.orderData.Receivingtime!=null">
			<text>接单时间：</text>
			<text>{{getdatetime.getNowFormatDate(0,counter.orderData.Receivingtime)}}</text>
		</view>
		<view class="content" v-if="counter.orderData.Ticketingtime!=null">
			<text>出票时间：</text>
			<text>{{getdatetime.getNowFormatDate(0,counter.orderData.Ticketingtime)}}</text>
		</view>
		<!-- <view class="content" v-if="counter.orderData.Ticketingtime!=null">
			<text>撤销时间：</text>
			<text>{{getdatetime.getNowFormatDate(0,counter.orderData.Ticketingtime)}}</text>
		</view> -->
		
		<view class="content">
			<text>截止时间：</text>
			<text>{{getdatetime.getNowFormatDate(0,counter.orderData.Deadline)}}</text>
		</view>
		<view class="content" v-show="stateArr[counter.orderData.State]">
			<text>撤销人：</text>
			<text>{{stateArr[counter.orderData.State]}}</text>
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
		defineEmits, //发送数据
		defineProps,
	} from 'vue';
	import common from "@/common/common.js"
	import getdatetime from "@/common/getdatetime.js"
	import {useCounterStore} from '@/stores/counter'
	import getTime from "@/common/getdatetime.js"
	const counter = useCounterStore(); //状态管理
	const stateArr=reactive({
		'3':'玩家撤销',
		'4':'店主撤销',
		'5':'系统撤销',
	})
	const copy=(id)=>{
		uni.setClipboardData({
			data:String(id),
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
		padding:20rpx;
		line-height:50rpx;
	}
</style>
