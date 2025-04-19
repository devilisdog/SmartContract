<template>
	<div style="width:680rpx;padding:20rpx;margin: auto;background-color: white;border-radius:10rpx;">
		<div style="display: flex;align-items: center;justify-content:space-between;">
			<p class="fontStyle">{{orderData.data.type}} {{orderData.data.gametype}}</p>
			<div style="display: flex;">
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
			</div>
			
		</div>
		<div style=" background-color:#f5f5f5;display: flex;justify-content:space-around;margin-top:10rpx;">
			<text>场次</text>
			<text>主队/客场</text>
			<text>投注内容</text>
			<text>赛果（全/半）</text>
		</div>
		<div class="neir" :style="index%2!=0?'background-color: #ececec;':''" v-for="item,index in orderData.data.Content">
			<text style="font-size:16px;width:90px;">{{item.matchNumStr}}</text>
			<div style="display:flex;flex-flow:column;align-items: center;width:200px;">
				<div>
					<text>{{item.awayTeamAbbName}}</text>
				</div>
				
			 	<text style="font-size:24rpx;">VS</text>

				<div>
					<text>{{item.homeTeamAbbName}}</text>
				</div>
			</div>
			<div style="display: flex;flex-flow: column;align-items: center;width:140px;">
				<div style="display: flex;flex-flow:column;align-items: center;"
					v-for="itemData,indexData in item.data">
					<text>{{itemData.res}}</text>
					<text>({{itemData.rate}})</text>
				</div>
			</div>
			<div style="display: flex;justify-content: center;width:180px;">
				<text>-/-</text>
			</div>
		</div>
	</div>
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
		defineEmits, //发送数据
		defineProps,
		// nextTick
	} from 'vue';

	const props = defineProps(['data'])
	const orderData=reactive([])
	const open = () => {
		proxy.$refs.popup.open()
	}
	onBeforeMount(()=>{
		orderData.data=props.data
		
	})
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
		padding:20px;
		margin:auto;
		display: flex;
		align-items: center;
		color: black;
		justify-content: space-around;
		
	}
	.tou {
		width:fit-content;
		padding:0px 5px;
		height:25px;
		font-size:28rpx;
		line-height:25px;
		text-align: center;
		border-radius:5px;
		color: white;
		font-weight: bold;
		margin:0px 5px;
	}
	.fontStyle {
		font-size:32rpx;
		color: black;
		font-weight:bold;
	}
</style>
