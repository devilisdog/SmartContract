<template>
	<view style="width: 700rpx; height: 170rpx" >
		<!-- 上半部分 -->
		<view style="width: 700rpx; height: 90rpx;">
			<image src="" style="width: 65rpx; height: 65rpx;margin: 10rpx 0 0 40rpx; float: left;"></image>
			<text style="margin: 22rpx 0 0 10rpx; float: left; font-size: 28rpx;">竞彩足球</text>
			<text style="float: right; font-size: 26rpx; color: #999999; margin: 15rpx 20rpx 0 0;">2022-06-06 09:50:03</text>
		</view>
		<!-- 下半部分 -->
		<view style="width: 700rpx; height: 70rpx;">
			<!-- 按钮 -->
			<view class="Concern-liji" style="">立即跟单</view>
			<view style="float: right;">
				<text class="textzhanji" style="margin: 0 20rpx 0 20rpx;">跟单:<text class="textzhanji-red">78<text class="textzhanji">人</text></text></text>
				<text class="textzhanji">自购:<text class="textzhanji-red">100.0 <text class="textzhanji">元</text></text></text>
			</view>
		</view>
		<!-- 分割线 -->
		<view style="width: 650rpx; height: 2rpx; background-color: #e8e8e8; float: right; margin: 0 25rpx 0 25rpx;"></view>
	</view>
</template>

<script setup>
	
</script>

<style>
	.textzhanji{
		color: #000 ;
		font-size: 26rpx;
	}
	.textzhanji-red{
		line-height: 45rpx;
		color: red;
		font-size: 26rpx;
	}
	.Concern-liji{
		float: left;
		background-color:#f04b49;
		width: 150rpx; 
		height: 38rpx;
		border-radius: 10rpx;
		color: #fff ;
		text-align: center;
		font-size: 26rpx;
		margin-left: 42rpx;
	}
	.Concern-liji:hover{
		background-color: #ff9602;
	}
	.Concern-liji:active{
		background-color: #ff9602;
	}
</style>
