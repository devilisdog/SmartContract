<template>
	<div style="width:680rpx;padding:20rpx;margin: auto;background-color: white;border-radius:10rpx;">
		<div style="display: flex;align-items: center;justify-content:space-between;flex-wrap: wrap;">
			<p class="fontStyle">{{orderData.data.type}} {{orderData.data.gametype}}</p>
			<div style="display: flex;margin:10rpx auto;">
				<div class="tou" style="background-color:deepskyblue;">{{orderData.data.remarks.Note}}注</div>
				<div class="tou" style="background-color:red;" v-show="orderData.data.bonusOptimize==undefined">
					{{orderData.data.remarks.Multiple}}倍
				</div>
				<view class="touguog" style="background-color:#898fff;">
					<text class="tou2" v-for="item,index in orderData.data.remarks.reachType">
						{{item}}
					</text>
				</view>
			</div>
		</div>
		<div style=" background-color:#f5f5f5;display: flex;justify-content:space-around;margin-top:10rpx;">
			<text>场次</text>
			<text>客场/主队</text>
			<text>投注内容</text>
			<text>赛果</text>
		</div>
		<div class="neir" :style="index%2!=0?'background-color: #ececec;':''" v-for="item,index in orderData.data.Content">
			<text style="font-size:28rpx;width:90rpx;">{{item.matchNumStr}}</text>
			<div style="display:flex;flex-flow:column;align-items: center;width:280rpx;">
				<div>
					<text>{{item.awayTeamAbbName}}</text>
					
				</div>
				
			 	<text style="font-size:24rpx;">VS</text>
				<div style="text-align: center;">
					<text>{{item.homeTeamAbbName}}</text>
					<text style="color:red;">
						{{item.goal?'('+item.goal+')':''}}
					</text><br>
					<text :style="item.size?'color:blue;':''">{{item.size?item.size:''}}</text>
				</div>
			</div>
			<div style="display: flex;width:270rpx;justify-content: space-between;">
				<view style="display: flex;flex-flow: column;align-items: center;">
					<div style="display: flex;flex-flow:column;align-items:center;margin:20rpx 0rpx;"
						v-for="itemData,indexData in item.data" :style="itemData.isWin?'color:red;':''">
						<text>{{itemData.res}}</text>
						<text>({{itemData.rate}})</text>
					</div>
				</view>
				<div style="display: flex;flex-flow: column;margin:20rpx 0rpx;justify-content: center;">
					<text v-if="item.Result">
						{{item.Result.away_score+':'+item.Result.home_score}}<br>
					</text>
					<text v-else>-/-</text>
				</div>
			</div>
		</div>
		<view class="carBottom" @click="skip">
			<text v-if="orderData.data.bonusOptimize!=undefined">查看奖金优化详情</text>
			<text v-else>拆单详情</text>
		</view>
	</div>
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
	onBeforeMount(()=>{
		orderData.data=JSON.parse(props.data.BetContent)	
		// console.log(JSON.parse(props.data.BetContent));
	})
	const props = defineProps(['data'])
	const orderData=reactive([])
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
	.tou {
		width: fit-content;
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
	.neir {
		padding:20px;
		margin:auto;
		display: flex;
		align-items: center;
		color: black;
		justify-content: space-around;
		
	}
	.fontStyle {
		font-size:32rpx;
		color: black;
		font-weight:bold;
	}
</style>
