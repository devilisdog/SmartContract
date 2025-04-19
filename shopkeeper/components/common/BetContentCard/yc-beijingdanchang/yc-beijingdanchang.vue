<template>
	<view style="width:680rpx;margin: auto;padding:20rpx;background-color: white;border-radius:10rpx;">
		<view style="display: flex;align-items: center;justify-content: space-between;margin-bottom:10rpx;flex-wrap: wrap;">
			<text class="fontStyle">{{orderData.data.type}} {{orderData.data.gametype}} {{orderData.data.lssue}}期</text>
			<view style="display: flex;flex-wrap: wrap;margin:10rpx auto;">
				<view class="tou" style="background-color:deepskyblue;">{{orderData.data.remarks.Note}}注</view>
				<view class="tou" style="background-color:red;">{{orderData.data.remarks.Multiple}}倍</view>
				<view class="touguog" style="background-color:#898fff;">
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
		<view class="neir" :style="index%2!=0?'background-color: #ececec;':''" v-for="item,index in orderData.data.Content">

			<text style="width:90rpx;">{{item.matchId}}</text>

			<view style="display: flex;flex-flow:column;align-items: center;width:220rpx;">
				<view>
					<text>{{item.homeTeamAbbName}}</text>
					<text :style="item.goal?Number(item.goal)>0?'color:red;':'color:green;':''">
						{{item.goal?'('+item.goal+')':''}}
					</text>
				</view>
				<text style="font-size:28rpx;">VS</text>
				<view>
					<text>{{item.awayTeamAbbName}}</text>
				</view>
			</view>
			<view style="display: flex;flex-flow: column;width:125rpx;align-items: center;margin-right:30rpx;">
				<view style="display: flex;flex-flow:column;margin:10rpx 0;"
					v-for="itemData,indexData in item.data" :style="itemData.isWin?'color:red;':''">
					<text>{{itemData.res}}</text>
					<text>
						({{item.spvalue?itemData.isWin?Number(item.spvalue).toFixed(2):itemData.rate:itemData.rate}})
					</text>
				</view>
			</view>
			<view style="display: flex;justify-content: center;width:90rpx;flex-flow: column;">
				<text v-if="item.result">
					{{gameFunicton(item.result,orderData.data.gametype)}}<br>
				</text>
				<text v-else>-/-</text>
			</view>
		</view>
		<view style="text-align: center;margin:20rpx 0rpx;">
			<view>
				<text style="color: red;">注意:</text>
				<text>北单为浮动赔率,购买时的赔率仅供参考</text>
			</view>
			<view>
				<text>北单奖金计算公式=2x所选场次的开奖SP值X</text>
				<text style="color: red;">65%</text>倍数
			</view>
		</view>
	</view>
</template>

<script setup>
	import {ref,onBeforeMount,reactive,getCurrentInstance,defineProps} from 'vue';
	const {proxy,ctx} = getCurrentInstance()

	const props = defineProps(['data'])
	const orderData = reactive([])
	const spfArr=reactive({
		'0':'负',
		'3':'胜',
		'1':'平'
	})
	const gameFunicton=(number,gametype)=>{
		if(gametype=='胜平负'){
			return spfArr[number]
		}else{
			return number
		}
	}
	onBeforeMount(() => {
		orderData.data = JSON.parse(props.data.BetContent)
		//console.log(orderData.data);
	})
</script>

<style>
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

	.popupCard {
		width: 600rpx;
		background-color: white;
		border-radius: 20rpx;
		display: flex;
		flex-flow: column;
		align-items: center;
		padding:20rpx;
	}

	.neir {
		display: flex;
		justify-content: space-around;
		margin: 20rpx 0rpx;
		align-items: center;
		text-align: center;

	}
	.fontStyle {
		font-size: 32rpx;
		color: black;
		font-weight: bold;
	}

	text {
		font-size: 28rpx;
	}
</style>
