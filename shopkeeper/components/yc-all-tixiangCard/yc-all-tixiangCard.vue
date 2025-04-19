<template>
	<view class="card">
		<view class="dis" style="border-bottom:1rpx solid #e3e3e3;">
			<text>{{date.getNowFormatDate(0,Props.data.create_time)}}</text>
			<text>{{Props.data.memo}}提现</text>
		</view>
		
		<view class="dis">
			<text>真实姓名</text>
			<view @click="copy(Props.data.user_RealName)">
				<text style="font-weight:500;">{{Props.data.user_RealName}}</text>
				<uni-icons type="folder-add-filled"></uni-icons>
			</view>
		</view>
		
		<view class="dis">
			<text>用户id</text>
			<view @click="copy(Props.data.user_id)">
				<text style="font-weight:500;">{{Props.data.user_id}}</text>
				<uni-icons type="folder-add-filled"></uni-icons>
			</view>
		</view>
		
		<view class="dis">
			<text>{{Props.data.memo}}账户</text>
			<view @click="copy(Props.data.number)">
				<text style="font-weight:500;">{{Props.data.number}}</text>
				<uni-icons type="folder-add-filled"></uni-icons>
			</view>
		</view>
		<view class="dis">
			<text>手机号</text>
			<view @click="copy(Props.data.contact)">
				<text style="font-weight:500;">{{Props.data.contact}}</text>
				<uni-icons type="folder-add-filled"></uni-icons>
			</view>
		</view>
		<view class="dis">
			<text>提现金额（元）</text>
			<text style="font-weight:500;color: red;">￥{{Props.data.money}}</text>
		</view>
		<view class="dis">
			<text>状态</text>
			<text style="font-weight:500;">
				{{Props.data.state==1?'已结算':'已撤销'}}
			</text>
		</view>
		<view class="dis" v-if="Props.data.state==2">
			<text>拒绝理由</text>
			<text style="font-weight:500;">
				{{Props.data.retMemo}}
			</text>
		</view>
		<view class="dis">
			<text>备注</text>
			<text style="font-weight:500;">{{Props.data.memo!=''?Props.data.memo:'无'}}</text>
		</view>
	</view>
</template>

<script setup>
	import date from "@/common/getdatetime.js"
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
		defineProps
	} from 'vue'
	const Props=defineProps(['data'])
	const copy=(e)=>{
		uni.setClipboardData({
			data:String(e),
			showToast:true
		})
	}
</script>

<style>
	.dis{
		display: flex;
		justify-content: space-between;
		font-size:26rpx;
		padding:0rpx 15rpx 0rpx 15rpx;
		height:60rpx;
		font-weight:600;
		align-items: center;
	}
	.card{
		width:700rpx;
		background-color: white;
		margin:30rpx auto;
		border-radius:10rpx;
	}
</style>