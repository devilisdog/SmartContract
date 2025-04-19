<template>
	
	<view class="wanfa" style='background-color:slateblue;' v-if="Prop.value==1 && Prop.orderState!=0">
		<text style="color: white;font-weight:600;" v-if="Prop.orderState==2">跟单</text>
		<text style="color: white;font-weight:600;" v-else-if="Prop.orderState==1">发单</text>
	</view>
	<view class="wanfa" style='background-color:seagreen;' v-if="Prop.value==2">
		<text style="color: white;font-weight:600;">合买</text>
	</view>
	
	
	
	<view class="wanfa" style='background-color: deepskyblue;' v-if="Prop.IsAllowRejection==1">
		<text style="color: white;font-weight:600;">合作</text>
	</view>

	<!-- <view class="wanfa" style='background-color:salmon;' v-if="Prop.orderState==2">
		<text style="color: white;font-weight:600;">发单</text>
	</view> -->
</template>
<script setup>
	/**
	 * @value 0显示合作
	 * @value 1显示跟单
	 * property {String} value 标识
	 * 
	 */
	
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		defineEmits,//发送数据
		defineProps,//接收数据
	} from 'vue';
	const Prop=defineProps(['value','orderState','IsAllowRejection'])
</script>

<style>
	.wanfa{
		width:80rpx;
		height:35rpx;
		font-size: 22rpx;
		border-radius:20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left:10rpx;
	}
</style>