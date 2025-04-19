<template>
	<uni-transition  :show="Props.contentShow" mode-class="slide-top" class="popup_mask">
		<view class="popup_card">
			<view class="card_title">{{Props.content.shop_id=='0'?'平台':'店铺'}}重要通知</view>
			<scroll-view :scroll-y="true" class="content_scroll">
				<view style="width:100%;height:20rpx;"></view>
				<rich-text class="content_box" :nodes="Props.content.content"></rich-text>
				<view class="time_box">发布时间：{{getdatetime.getNowFormatDate(0,Props.content.create_time*1000)}}</view>
				<view style="width:100%;height:20rpx;"></view>
			</scroll-view>
			<view class="operation">
				<view class="closeButton" @click="clickButtom('close')">关闭</view>
				<view class="clickButton" @click="clickButtom('confirm')">知道了，不再提示</view>
			</view>
		</view>
	</uni-transition>
</template>

<script setup>
	import {onBeforeMount,ref,reactive,defineProps,defineEmits} from 'vue';
	import getdatetime from '../../common/getdatetime';
	const Props=defineProps(['content','contentShow'])
	const Emits=defineEmits(['close','confirm'])
	const clickButtom=(emits)=>{
		Emits(emits)
	}
</script>

<style lang="scss">
	.popup_card{
		width:90vw;
		background-color:#fff;
		border-radius:20rpx;
		position: absolute;
		top:25%;
		left:calc(50% - 45vw - 20rpx);
		padding:20rpx;
		.operation{
			display: flex;
			align-items: center;
			margin-top:20rpx;
			.closeButton{
				background-color: #c7c7c7;
				flex:1;
			}
			.clickButton{
				background-image: linear-gradient(-225deg, #202736,#202737);
				flex:1.3;
				margin-left:20rpx;
				color: #fff;
			}
			view{
				height:80rpx;
				border-radius:20rpx;
				text-align: center;
				line-height:80rpx;
			}
		}
		.content_scroll{
			width:100%;
			height:500rpx;
			background-color: #f4f4f4;
			border-radius:20rpx;
			overflow: hidden;
			padding:0rpx 20rpx;
			box-sizing: border-box;
			.content_box{
				word-wrap:break-word;
			}
			.time_box{
				text-align: right;
				font-size:26rpx;
				margin-top:20rpx;
			}
		}
		.card_title{
			text-align: center;
			font-size:38rpx;
			font-weight: bold;
			margin-bottom:20rpx;
		}
	}
	.popup_mask{
		width:100vw;
		height:100vh;
		position: fixed;
		top:var(--status-bar-height);
		left:0rpx;
		background-color: rgba(0, 0, 0, 0.1);
		z-index:999;
	}
</style>