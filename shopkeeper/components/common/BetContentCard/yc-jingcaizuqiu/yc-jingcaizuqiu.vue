<template>
	<view style="width:680rpx;margin: auto;background-color: white;padding:20rpx;border-radius:10rpx;" >
		<view style="display: flex;justify-content:space-between;margin-bottom:10rpx;flex-wrap: wrap;align-items: center;">
			<text class="fontStyle">{{orderData.data.type}} {{orderData.data.gametype}}</text>
			<view style="display: flex;margin:10rpx auto;">
				<div class="tou" style="background-color:deepskyblue;">{{orderData.data.remarks.Note}}注</div>
				<div class="tou" style="background-color:red;" v-show="orderData.data.bonusOptimize==undefined">
					{{orderData.data.remarks.Multiple}}倍
				</div>
				<view class="touguog" style="background-color:#898fff;" >
					<text class="tou2" v-for="item,index in orderData.data.remarks.reachType">
						{{item=='1单关1'?'单关':item}}
					</text>
				</view>
			</view>
		</view>
		<view style=" background-color:#f5f5f5;display: flex;justify-content: space-around;margin: auto;">
			<text>场次</text>
			<text>主队/客场</text>
			<text>投注内容</text>
			<text>赛果</text>
		</view>
		<view class="neir" v-for="item,index in orderData.data.Content" :key="index" :style="index%2!=0?'background-color: #f5f5f5;':''">
			<text style="font-size:28rpx;width:60rpx;">{{item.matchNumStr}}</text>
			<view style="display: flex;flex-flow:column;width:170rpx;">
				<view>
					<text>{{item.homeTeamAbbName}}</text>
					<text :style="item.goal?Number(item.goal)>0?'color:red;':'color:green;':''">
						{{item.goal?'('+item.goal+')':''}}
					</text>
				</view>
				<text style="font-size:24rpx;">VS</text>
				<view>
					<text>{{item.awayTeamAbbName}}</text>
				</view>
			</view>
			<view style="display: flex;width:220rpx;justify-content: space-between;">
				<view  style="display: flex;flex-flow: column;">
					<view v-for="itemNr,indexNr in orderData.data.Content[index].data"
						 style="display: flex;flex-flow:column;align-items: center;margin:20rpx 0;"
						:style="itemNr.isWin?'color:red;':''">
						<text>{{itemNr.res}}</text>
						<text>({{itemNr.rate}})</text>
					</view>
				</view>
				<view style="display: flex;flex-flow: column;margin:20rpx 0;text-align: center;justify-content: center;">
					<text v-if="item.Result">
						{{item.Result.home_score+':'+item.Result.away_score}}<br>
						({{item.Result.half_home_score+':'+item.Result.half_away_score}})
					</text>
					<text v-else>-/-</text>
				</view>
			</view>
			
		</view>
		<view class="carBottom" @click="skip">
			<text v-if="orderData.data.bonusOptimize!=undefined">查看奖金优化详情</text>
			<text v-else>拆单详情</text>
		</view>
	</view>
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
		orderData.data=JSON.parse(props.data.BetContent)
	})
	const skip=()=>{
		uni.navigateTo({
			url:'/pages/indexSupPages/orderSplitting?money='+orderData.data.remarks.Amount,
			animationType:'slide-in-bottom'
		})
	}
</script>

<style>
	.carBottom{
		padding:10rpx 0 0 0;
		text-align: center;
		border-top:1rpx #c8c8c8 dashed;
		text-decoration: underline;
		color:#ffaa00;
	}
	.touguog {
		padding: 8rpx 10rpx;
		height: 25rpx;
		font-size: 28rpx;
		line-height: 25rpx;
		text-align: center;
		border-radius: 5rpx;
		color: white;
		font-weight: bold;
		margin: 5rpx 5rpx;
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
