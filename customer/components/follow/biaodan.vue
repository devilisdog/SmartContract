
<template>
	<view>
		<view v-for="itme in biaodandata">
			<view style="width: 700rpx; height: 105rpx; background-color: #fff;">
				<image class="imga" src="@/static/img/follow/R-C.jpg"></image>
				<text class="td01">{{itme.text}}</text>
				<text class="td02">￥{{itme.money}}</text>
			</view>
			<!-- ------------------------- -->
			<view style="width: 700rpx; height: 105rpx; background-color: #f7f7f7;">
				<image class="imga" src="@/static/img/follow/ya.jpg"></image>
				<text class="td01">{{itme.text}}</text>
				<text class="td02">￥{{itme.money}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		// onBeforeMount, 
		// onMounted,
		ref,
		reactive,
		// getCurrentInstance,
		// nextTick
	} from 'vue';
	
	
	const biaodandata =reactive([
		{
			img:'./static/img/follow/R-C.jpg',
			text:'测试昵称',
			money:'9999',
		},
		{
			img:'./static/img/follow/ya.jpg',
			text:'测试昵称1',
			money:'9999',
		},
		{
			img:'./static/img/follow/R-C.jpg',
			text:'测试昵称2',
			money:'9999',
		},
		{
			img:'./static/img/follow/ya.jpg',
			text:'测试昵称3',
			money:'9999',
		},
		{
			img:'./static/img/follow/ya.jpg',
			text:'测试昵称4',
			money:'9999',
			
		},
	])
</script>

<style>
	.imga{
		float: left;
		margin: 20rpx 5rpx 0 40rpx;
		border-radius: 100rpx;
		width: 70rpx;
		height: 70rpx;
	}
	.td01{
		float: left;
		margin: 30rpx 0 0 15rpx;
		font-weight: 400;
		font-family: '幼体';
		font-size: 34rpx;
	}
	.td02{
		margin: 30rpx 75rpx 0 0;
		font-size: 30rpx;
		color: red ; 
		float: right;
	}
	
</style>