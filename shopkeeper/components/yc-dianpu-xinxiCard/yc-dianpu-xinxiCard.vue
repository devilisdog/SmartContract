<template>
	<view class="CardBox">
		<view class="leftData" @click="Card">
			<view style="display:flex;">
				<image :src="prop.shopLogo" style="width:110rpx;height:110rpx;border-radius:10rpx;"></image>
				<view style="margin-left:10rpx;">
					<text>{{prop.shopName}}({{'ID:'+prop.shopID}})</text>
					<view class="conetent">
						<text style="margin:0rpx 10rpx;" v-for="itme,index in prop.gameList">{{itme.gameInfo.title}}</text>
					</view>
				</view>
			</view>
		</view>
		<view @click="Card">
			<text style="color: red;font-weight:600;margin-right:10rpx;">￥{{prop.shopMoney}}</text>
			<uni-icons type="forward"></uni-icons>
		</view>
		<view style="margin-top:-140rpx;background-color:#e7e7e7;border-radius:50rpx;margin-right:0rpx;" @click="deleteShop">
			<uni-icons type="closeempty"></uni-icons>
		</view>
	</view>
	
	
</template>

<script setup>
	/*
	接收：
	value（控制是否显示副标题默认0不显示，1为显示副标题（玩法））
	-----------------------------------------------------------
	发送：
	money（店铺金额）
	*/
    // import { toRaw } from '@vue/reactivity'
	import api from "@/common/vmeitime-http/mine/mine.js"
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		defineEmits,//发送数据
		defineProps,//接收数据
		toRaw
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const Emits=defineEmits(['clickCard','clickClose'])
	const deleteShop=()=>{
		Emits('clickClose',prop.shopID,prop.shopName)
	}
	const Card=()=>{
		Emits('clickCard')
	}
	const prop=defineProps(['value','shopMoney','shopName','gameList','shopID','shopLogo'])	
</script>

<style>
	.conetent{
		font-size:26rpx;
		color: #818181;
		max-width:430rpx;
		-webkit-line-clamp:1;
		display:-webkit-box;
		-webkit-box-orient:vertical;
		overflow: hidden;
		text-overflow:ellipsis;
		margin-top:20rpx;
	}
	.leftData{
		display:flex;
		align-items:flex-start;
		width:670rpx;
		justify-content:space-between;
		margin-left:10rpx;
	}
	.CardBox{
		width:720rpx;
		border-radius:20rpx;
		margin:15rpx auto;
		height:160rpx;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content:space-between;
	}

</style>
