<template>
	<div style="width:680rpx;margin: auto;background-color: white;padding:20rpx;border-radius:10rpx;">
		<div style="display: flex;align-items: center;justify-content: space-between;margin-bottom:5px;flex-wrap: wrap;">
			<p class="fontStyle">{{orderData.data.type}} {{props.data.issue_code}}期</p>
			<div style="display: flex;margin:10rpx auto;">
				<div class="tou" style="background-color:deepskyblue;">{{orderData.data.remarks.Note}}注</div>
				<div class="tou" style="background-color:red;">{{orderData.data.remarks.Multiple}}倍</div>
				<view class="touguog" style="background-color:#898fff;">
					<text class="tou2" v-for="item,index in orderData.data.remarks.reachType">
						{{item}}
					</text>
				</view>
			</div>
		</div>

		<div style=" background-color:#f5f5f5;display: flex;justify-content: space-around;margin: auto;">
			<text>场次</text>
			<text>主队/客场</text>
			<text>投注内容</text>
			<text>赛果</text>
		</div>
		<div class="neir" :style="index%2!=0?'background-color: #ececec;':''" v-for="item,index in orderData.data.Content">

			<text style="width:60rpx;">{{item.matchNumStr}}</text>
			<div style="display: flex;flex-flow:column;align-items: center;width:220rpx;">
				<div>
					<text>{{item.homeTeamAbbName}}</text>
					<text :style="Number(item.goal)>0?'color:red;':'color:green;'">
						{{item.goal!='0'?'('+item.goal+')':''}}
					</text>
				</div>
				<text style="font-size:28rpx;">VS</text>
				<div>
					<text>{{item.awayTeamAbbName}}</text>
				</div>
				
			</div>
			<div style="display: flex;flex-flow: column;align-items: center;width:100rpx;">
				<div style="display: flex;flex-flow:column;align-items: center;margin:10rpx 0;"
					v-for="itemData,indexData in item.data" :style="itemData.isWin?'color:red;':''">
					<text>{{itemData.res}}</text>
					<text>({{item.spvalue?Number(item.spvalue).toFixed(2):itemData.rate}})</text>
				</div>
			</div>
			<div style="display: flex;justify-content: center;width:70rpx;">
				<text>{{item.result?trueFunction(item.result):'-/-'}}<br></text>
			</div>
		</div>
	</div>
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
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const props = defineProps(['data'])
	const orderData=reactive([])
	const trueFunction=(gameIndex)=>{
		var dictionaries={//赛果字典
			'0':'负',
			'1':'平',
			'3':'胜'
		}
		return dictionaries[gameIndex]//转换为中文并返回
	}
	onBeforeMount(()=>{
		orderData.data=JSON.parse(props.data.BetContent)
		// console.log(orderData.data); 
	})
</script>

<style>
	.popupCard {
		width: 600rpx;
		height: 300rpx;
		background-color: white;
		border-radius: 20rpx;
		display: flex;
		flex-flow: column;
		align-items: center;
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
		display: flex;
		justify-content:space-around;
		align-items: center;
		text-align: center;
		margin:20rpx 0rpx;
		
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
