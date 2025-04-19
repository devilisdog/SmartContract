<template>
	<view style="width:680rpx;margin: auto;background-color: white;padding:20rpx;border-radius:10rpx;" >
		<view style="display: flex;justify-content:space-between;margin-bottom:5rpx;">
			<text class="fontStyle">{{orderData.data.type}} {{orderData.data.gametype}}</text>
			<view style="display: flex;">
				<div class="tou" style="background-color:deepskyblue;">{{orderData.data.remarks.Note}}注</div>
				<div class="tou" style="background-color:red;">{{orderData.data.remarks.Multiple}}倍</div>
				
				<view class="touguog" style="background-color:#898fff;"
					v-show=" orderData.data.remarks.reachType.length <3">
					<text class="tou2" v-for="item,index in orderData.data.remarks.reachType">
						{{item}}
					</text>
				</view>
				
				<view class="touguog" style="background-color:#898fff;" @click="open()"
					v-show="orderData.data.remarks.reachType.length >= 3">
					<text class="tou2" v-for="item,index in orderData.data.remarks.reachType">
						{{item}}
					</text>
				</view>
			</view>
		</view>
		<view style=" background-color:#f5f5f5;display: flex;justify-content: space-around;margin: auto;">
			<text>场次</text>
			<text>主队/客场</text>
			<text>投注内容</text>
			<text>赛果（全/半）</text>
		</view>
		<view class="neir" v-for="item,index in orderData.data.Content" :key="index" :style="index%2!=0?'background-color: #f5f5f5;':''">
			<text style="font-size:28rpx;width:60rpx;">{{item.matchNumStr}}</text>
			<view style="display: flex;flex-flow:column;width:120rpx;">
				<view>
					<text>{{item.awayTeamAbbName}}</text>
				</view>
				<text style="font-size:24rpx;">VS</text>
				<view>
					<text>{{item.homeTeamAbbName}}</text>
				</view>
			</view>
			<view style="display: flex;flex-flow: column;width:110rpx;">
				<view v-for="itemNr,indexNr in orderData.data.Content[index].data" 
					 style="display: flex;flex-flow:column;align-items: center;margin-bottom:20rpx;"
					:style="itemNr.zhongping > 0?'color:red;':''">
					<text>{{itemNr.res}}</text>
					<text>({{itemNr.rate}})</text>
				</view>
			</view>
			<view style="display: flex;flex-flow: column;align-items: center;width:180rpx;">
				<text>-/-</text>
				<!-- <text>00</text> -->
			</view>
		</view>
	
	</view>
	<uni-popup ref="popup" type="center">
		<view class="popupCard">
			<text style="font-size:40rpx;font-weight:600;">过关方式</text>
			<view style="width:550rpx;margin-top:80rpx;display: flex;flex-wrap: wrap;align-items: center;">
				<text>您的过关方式为:</text>
				<view v-for="item,index in orderData.data.remarks.reachType">
					<text class="tou" style="background-color:#898fff;">{{item}}</text>
				</view>
			</view>
		</view>
	</uni-popup>
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
		// nextTick
	} from 'vue'

	const props = defineProps(['data'])
	const orderData=reactive([])
	onBeforeMount(()=>{
		orderData.data=props.data
	})
	const open = () => {
		proxy.$refs.popup.open()
	}
</script>

<style>
	.touguog {
		max-width: 200rpx;
		padding: 8rpx 10rpx;
		height: 25rpx;
		font-size: 28rpx;
		line-height: 25rpx;
		text-align: center;
		border-radius: 5rpx;
		color: white;
		font-weight: bold;
		margin: 5rpx 5rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: keep-all;
	}
	
	.tou2 {
		width: fit-content;
		padding: 8rpx 10rpx;
		height: 25rpx;
		font-size: 28rpx;
		line-height: 25rpx;
		border-radius:5rpx;
		color: white;
		font-weight: bold;
	}
	.neir {
		margin:20rpx auto;
		align-items: center;
		color: black;
		text-align: center;
		display: flex;
		justify-content: space-around;
	}
	.tou {
		width:fit-content;
		padding:8rpx 10rpx;
		height:25rpx;
		font-size:28rpx;
		line-height:25rpx;
		text-align: center;
		border-radius:5rpx;
		color: white;
		font-weight: bold;
		margin:5rpx 5rpx;
	}
	.fontStyle {
		font-size:32rpx;
		color: black;
		font-weight:bold;
	}
	text{
		font-size:28rpx;
	}
</style>
