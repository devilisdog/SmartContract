<template>
	<uni-card :style="'width:'+props.widths+'rpx;'"
		style="margin: auto;margin-top: 15rpx;" margin="0" spacing="20" padding="0" :border="false" shadow='0px 0px 3px 1px rgba(255, 255, 255, 0)'>
		<view style="display: flex;align-items: center;justify-content: space-between;margin:20rpx 0rpx;">
			<text class="text">
				{{orderData.data.type}} {{orderData.data.gametype}} {{orderData.data.lssue}}期
			</text>
			<view style="display: flex;align-items: center;">
				<text class="tou" style="background-color:deepskyblue;">{{orderData.data.remarks.Note}}注</text>
				<text class="tou" style="background-color:red;">{{orderData.data.remarks.Multiple}}倍</text>
			</view>
		</view>
		<view style=" background-color:#f5f5f5;display: flex;justify-content: space-around;margin: auto;">
			<text>场次</text>
			<text>主队/客场</text>
			<text>投注内容</text>
			<text>赛果（全/半）</text>
		</view>
		<view class="neir" v-for="item,index in orderData.data.Content" :key="index"
			:style="index%2!=0?'background-color: #ececec;':''">
			<text style="font-size:30rpx;flex:0.6;">{{item.matchId}}</text>
			<view style="display: flex;align-items: center;flex:1.8;justify-content: center;">
				<view>
					<text>{{item.homeTeamAbbName}}</text>
				</view>
				<text style="font-size:24rpx;color:red;">VS</text>
				<view>
					<text>{{item.awayTeamAbbName}}</text>
				</view>
			</view>
			<view style="display: flex;flex-flow: column;flex:1.3;align-items: center;">
				<view v-for="itemNr,indexNr in orderData.data.Content[index].data"
					style="display: flex;flex-flow:column;align-items: center;margin:10rpx 0;"
					:style="trueFunction(item.matchId)==itemNr.res?'color:red;':''">
					<text>{{itemNr.res}}</text>
				</view>
			</view>
			<view style="display: flex;flex-flow: column;align-items: center;flex: 1.7;">
				<text>{{trueFunction(item.matchId)}}</text>
			</view>
		</view>
	</uni-card>
</template>
<script setup>
	import {ref,onBeforeMount,reactive,defineProps,} from 'vue';
	import {useCounterStore} from '@/stores/counter';

	const props = defineProps(['widths'])
	const counter = useCounterStore() //状态管理
	const orderData = reactive([])
	const trueFunction=(gameIndex)=>{
		if(counter.allOrderData.WinConten==null){
			return '-/-'
		}
		var dictionaries={//赛果字典
			'0':'负',
			'1':'平',
			'3':'胜'
		}
		var newGameData=counter.allOrderData.WinConten.Winingnumber[gameIndex-1]//按照比赛场次去对应的index找比赛结果
		return dictionaries[newGameData]//转换为中文并返回
	}
	onBeforeMount(() => {
		orderData.data = counter.BettingContent
		if(typeof(counter.allOrderData.WinConten)=='string'){
			counter.allOrderData.WinConten=JSON.parse(counter.allOrderData.WinConten)
			counter.allOrderData.WinConten.Winingnumber=counter.allOrderData.WinConten.Winingnumber.split(' ')
		}
	})
</script>

<style>
	.touguog{
		border-radius:10rpx;
		margin-left:10rpx;
		color: white;
		text-align: center;
		line-height:45rpx;
		max-width: 200rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: keep-all;
	
	}
	.tou2 {
		padding: 0rpx 5rpx;
		border-radius: 10rpx;
		color: white;
		font-weight: 550;
		line-height:45rpx;
	}
	.neir {
		padding: 20rpx 20rpx;
		margin: auto;
		display: flex;
		align-items: center;
		color: black;
		text-align: center;
	}

	.tou {
		padding: 0rpx 12rpx;
		border-radius: 10rpx;
		color: white;
		margin-left: 10rpx;
		font-weight: 550;
		line-height:45rpx;
	}

	.text {
		font-size: 32rpx;
		color: black;
		font-weight:bold;
	}
</style>
