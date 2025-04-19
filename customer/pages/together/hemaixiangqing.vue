<template>
	<view class="status_bar"></view>
	<!-- <顶部> -->
	<uni-nav-bar title="合买详情" leftIcon="back" @clickLeft="back"></uni-nav-bar>

	<!-- 头像名字 -->
	<view class="logo">
		<view style="width:120rpx;height:120rpx;background-color:black;border-radius:100rpx;grid-row-start:1;grid-row-end:3;border:10rpx solid white;"></view>
		<text style="font-weight:600;line-height:50rpx;font-size:32rpx;">sadasdasd</text>
		<view style="display: flex;align-items:flex-start;justify-content: space-between;">
			<text style="font-size:26rpx;color:red;">粉丝:4165 | 发单:41564</text>
			<view style="display: flex;">
				<view style="width:20rpx;height:20rpx;background-color:red;border-radius:50rpx;margin:0rpx 5rpx;"></view>
			</view>
		</view>
		<text style="margin-top:20rpx;">暂无简介</text>
	</view>
	<view class="cardSize" style="height:140rpx;margin-top:90rpx;"></view>
	<view class="cardSize" >
		<view style="width:100%;background-color: #e6e6e6;display: flex;justify-content:space-between;align-items: center;margin-bottom:20rpx;">
			<view class="tbr" style="background-color:white;padding:10rpx 10rpx;">
				<text>截止时间</text>
				<text style="color:red;">05:00:52</text>
			</view>
			<view class="tbr">
				<text>方案总额</text>
				<text style="color:red;">￥200.00</text>
			</view>
			<text>|</text>
			<view class="tbr">
				<text>单份金额</text>
				<text style="color:red;">￥2.50</text>
			</view>
			<text>|</text>
			<view class="tbr" style="padding:0rpx 10rpx;">
				<text>剩余份数</text>
				<text>79</text>
			</view>
		</view>
		<text>当前购买份数1份</text>
		<view style="margin-top:10rpx;display: flex;flex-wrap: wrap;">
			<view style="display: flex;flex-flow: column;align-items: center;width:140rpx;flex-wrap:wrap;margin:10rpx 15rpx;">
				<view style="width:80rpx;height:80rpx;border-radius:100rpx;background-color: black;"></view>
				<text>asdsadasd</text>
				<text>1份</text>
				<text style="color: red;">2.5元</text>
			</view>
		</view>
	</view>
	<view class="cardSize">
		<view style="display: flex;justify-content: space-between;">
			<text>合买宣言</text>
			<text style="color: red;">认购中 | 佣金5%</text>
		</view>
		<view style="background-color: #e6e6e6;border-radius:10rpx;height:70rpx;margin-top:20rpx;">
			<text style="line-height:70rpx;padding:20rpx;">众人拾柴火焰高~</text>
		</view>
	</view>
	<!-- <jczqCard></jczqCard> -->
	<view style="width:720rpx;margin:20rpx auto;">
		<uni-collapse>
			<!-- 因为list默认带一条分隔线，所以使用 titleBorder="none" 取消面板的分隔线 -->
			<uni-collapse-item title-border="none" :border="false">
				<template v-slot:title>
					<view style="padding:20rpx;">
						<text>订单详情</text>
					</view>
				</template>
				<view style="padding:10rpx;display: flex;flex-flow: column;border-top:1rpx solid #d0d0d0;">
					<text style="margin:10rpx 0rpx;">订单编号</text>
					<text style="margin:10rpx 0rpx;">发单时间</text>
					<text style="margin:10rpx 0rpx;">截止时间</text>
				</view>
			</uni-collapse-item>
		</uni-collapse>
		
	</view>
	<view class="bottomTab">
		<view style="flex: 1;text-align: center;">
			<text>分享</text>
		</view>
		<view class="bouttomStyle">参与合买</view>
	</view>
</template>

<script setup>
	import api from '@/common/vmeitime-http/'
	import { useCounterStore } from '@/stores/counter';
	import jczqCard from "@/components/common/yc-dingdanxiangqing-card/yc-jingcaizuqiu/yc-jingcaizuqiu.vue"
	import { 
		onBeforeMount,
		onMounted,
		ref,
		reactive,
	 } from 'vue';
	 const back=()=>{
		 uni.navigateBack()
	 }
</script>

<style>
	.status_bar {
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
	}
	.bottomTab{
		width:100%;
		height:90rpx;
		background-color:white;
		position: fixed;
		bottom:0rpx;
		display: flex;
		align-items: center;
		justify-content:space-between;
	}
	.bouttomStyle{
		width:500rpx;
		height:75rpx;
		background: #202736;
		border-radius:20rpx;
		margin-right:20rpx;
		text-align: center;
		line-height:75rpx;
		color: white;
		font-weight:600;
	}
	.tbr{
		font-size:26rpx;
		display: flex;
		flex-flow: column;
		align-items: center;
	}
	.cardSize{
		width:700rpx;
		border-radius:10rpx;
		background-color: white;
		margin:20rpx auto;
		padding:10rpx;
	}
	.logo{
		width:660rpx;
		margin-bottom:-220rpx;
		margin-left:60rpx;
		margin-top:10rpx;
		display: grid;
		grid-template-columns:150rpx auto;
		grid-template-rows:repeat(2,auto);
	}
	body{
		background-color: #ececec;
	}
</style>
