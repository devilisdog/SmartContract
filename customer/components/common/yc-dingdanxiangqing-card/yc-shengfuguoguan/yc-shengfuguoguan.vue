<template>
	<uni-card :style="'width:'+props.widths+'rpx;'"
			style="margin: auto;margin-top: 15rpx;" margin="0" spacing="20" padding="0" :border="false" shadow='0px 0px 3px 1px rgba(255, 255, 255, 0)'>
		<view style="display: flex;align-items: center;margin:20rpx 0rpx;flex-wrap: wrap;">
			<view>
				<text class="text">{{orderData.data.type}} {{counter.allOrderData.issue_code}}期</text>
			</view>
			<view style="display: flex;margin:10rpx auto;">
				<text class="tou" style="background-color:deepskyblue;">{{orderData.data.remarks.Note}}注</text>
				<text class="tou" style="background-color:red;">{{orderData.data.remarks.Multiple}}倍</text>
				
				<view class="touguog" style="background-color:#898fff;">
					<text class="tou2" v-for="item,index in orderData.data.remarks.reachType">
						{{item}}
					</text>
				</view
				>
			</view>
		</view>
		<view style=" background-color:#f5f5f5;display: flex;justify-content: space-around;margin: auto;">
			<text>场次</text>
			<text>主队/客场</text>
			<text>投注内容</text>
			<text>赛果</text>
		</view>
		<view class="neir" :style="index%2!=0?'background-color: #ececec;':''" v-for="item,index in orderData.data.Content">
			<text style="flex:0.6;margin-left:15rpx;">{{item.matchNumStr}}</text>
			<view style="display: flex;flex-flow:column;align-items: center;flex:1.5;margin:10rpx 0;">
				<view>
					<text>{{item.homeTeamAbbName}}</text>
					<text :style="Number(item.goal)>0?'color:red;':'color:green;'">
						{{item.goal!='0'?'('+item.goal+')':''}}
					</text>
				</view>
				<text style="font-size:24rpx;">VS</text>
				<view>
					<text>{{item.awayTeamAbbName}}</text>
				</view>
			</view>
			<view style="display: flex;flex-flow: column;flex:1.3;align-items: center;">
				<view style="display: flex;flex-flow:column;align-items: center;"
					v-for="itemData,indexData in item.data" :style="itemData.isWin?'color:red;':''">
					<text>{{itemData.res}}</text>
					<text>({{item.spvalue?Number(item.spvalue).toFixed(2):itemData.rate}})</text>
				</view>
			</view>
			<view style="flex:0.8;text-align: center;">
				{{item.result?trueFunction(item.result):'-/-'}}<br>
			</view>
		</view>
	</uni-card>
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
	const props = defineProps(['widths'])
	import {useCounterStore} from '@/stores/counter';
	const counter = useCounterStore() //状态管理
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
		orderData.data=counter.BettingContent
	})
</script>

<style>
	.touguog{
		border-radius:10rpx;
		margin-left:10rpx;
		color: white;
		text-align: center;
		line-height:45rpx;
	}
	.tou2 {
		padding: 0rpx 10rpx;
		border-radius: 10rpx;
		color: white;
		font-weight: 550;
		line-height:45rpx;
	}
	.neir {
		padding:20rpx 20rpx;
		margin:auto;
		display: flex;
		align-items: center;
		color: black;
		justify-content: center;
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
	text{
		font-size:28rpx;
	}
</style>
