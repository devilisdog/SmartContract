<template>
	<view class="card">
		<view class="card_top">
			<view class="top_left">
				<view class="logo_Box">
					<image src="../../../static/img/home/yh.png" class="image_style"></image>
				</view>
				<view class="bankTilei">
					<text style="font-size:32rpx;font-weight: bold;">{{Props.CardData.bank_name}}</text><br>
					<text>绑定手机：{{Props.CardData.tel_no}}</text>
				</view>
			</view>
			<view class="top_right">
				<text>{{Props.CardData.card_id}}</text>
			</view>
		</view>
		<view class="card_bottom">
			<text>添加时间：{{steTime.getNowFormatDate(0,Number(Props.CardData.created_time)*1000)}}</text>
		</view>
	</view>
</template>

<script setup>
	import api from '@/common/vmeitime-http/'
	import {useCounterStore} from '@/stores/counter'
	import {ref,reactive,getCurrentInstance,defineProps,onBeforeMount} from 'vue';
	import steTime from "@/common/getdatetime.js"
	const Props=defineProps(['CardData'])
</script>

<style lang="scss">
	.card{
		width:680rpx;
		padding:20rpx;
		border-radius:20rpx;
		background-image: linear-gradient(-225deg, #202736,#202737);
		margin:15rpx auto;
		color:#fff;
		height:250rpx;
		display: flex;
		flex-flow: column;
		justify-content: space-between;
		.card_bottom{
			width:100%;
			text-align: right;
		}
		.card_top{
			display: flex;
			justify-content: space-between;
			.top_left{
				display: flex;
				.bankTilei{
					margin-left:20rpx;
				}
			}
		}
	}
	.image_style{
		width:70rpx;
		height:70rpx;
	}
	.logo_Box{
		border-radius:50%;
		background-color:#fff;
		width:90rpx;
		height:90rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
