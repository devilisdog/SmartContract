<template>
	<uni-card :style="'width:'+props.widths+'rpx;'"
		style="margin: auto;margin-top: 15rpx;" margin="0" spacing="20" padding="0" :border="false" shadow='0px 0px 3px 1px rgba(255, 255, 255, 0)'>
		<view style="display: flex;align-items: center;flex-wrap: wrap;padding:20rpx 0rpx;">
			<text class="text">{{orderData.data.type}} {{orderData.data.gametype}}</text>
			<view style="display: flex;margin:10rpx auto">
				<text class="tou" style="background-color:deepskyblue;">{{orderData.data.remarks.Note}}注</text>
				<text class="tou" style="background-color:red;" v-show="orderData.data.bonusOptimize==undefined">
					{{orderData.data.remarks.Multiple}}倍
				</text>
				<view class="touguog" style="background-color:#898fff;" >
					<text class="tou2" v-for="item,index in orderData.data.remarks.reachType">
						{{item=='1单关1'?'单关':item}}
					</text>
				</view>
			</view>
		</view>
		<view style=" background-color:#f5f5f5;display: flex;justify-content: space-around;margin: auto;">
			<text>场次</text>
			<text>客场/主队</text>
			<text>投注内容</text>
			<text>赛果</text>
		</view>
		<view class="neir" :style="index%2!=0?'background-color: #ececec;':''" v-for="item,index in orderData.data.Content">
			<text style="font-size:30rpx;flex:0.4;text-align: center;">
				{{item.matchNumStr}}
			</text>
			<view style="display: flex;flex-flow:column;align-items: center;flex:1.5;">
				<view style="text-align: center;">
					<text>{{item.awayTeamAbbName}}</text>
				</view>
				<text style="font-size:24rpx;">VS</text>
				<view style="text-align: center;">
					<text>{{item.homeTeamAbbName}}</text>
					<text style="color:red;">
						{{item.goal?'('+item.goal+')':''}}
					</text><br>
					<text :style="item.size?'color:blue;':''">{{item.size?item.size:''}}</text>
				</view>
			</view>
			<view style="display: flex;flex:1.5;justify-content: space-around;">
				<view>
					<view style="text-align: center;margin-bottom:20rpx;" :style="itemData.isWin?'color:red;':''"
						v-for="itemData,indexData in item.data">
						<text>{{itemData.res}}</text><br>
						<text>({{itemData.rate}})</text>
					</view>
				</view>
				<view style="display: flex;flex-flow: column;margin-bottom:20rpx;text-align: center;justify-content: center;">
					<text v-if="item.Result">
						{{item.Result.away_score+':'+item.Result.home_score}}<br>
					</text>
					<text v-else>-/-</text>
				</view>
			</view>
		</view>
		<view class="optimizingText" v-show="orderData.data.bonusOptimize!=undefined">
			<navigator 
				animation-type="slide-in-bottom" 
				open-type="navigate" 
				url="/pages/main/submit/optimizingDetails">
				<text @click="optimizingDetails">奖金优化详情</text>
			</navigator>
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
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	import {useCounterStore} from '@/stores/counter';
	const props = defineProps(['widths'])
	const counter = useCounterStore() //状态管理
	const orderData=reactive([])
	onBeforeMount(()=>{
		orderData.data=counter.BettingContent
	})
	const optimizingDetails=()=>{
		uni.navigateTo({
			url:'/pages/main/submit/optimizingDetails'
		})
	}
</script>

<style>
	.optimizingText{
		font-size:28rpx;
		font-weight: bold;
		color:#f04b49;
		text-align: center;
		border-top:1rpx dashed #dcdcdc;
		padding:10rpx 0rpx;
	}
	.tou2 {
		padding: 0rpx 10rpx;
		border-radius: 10rpx;
		color: white;
		font-weight: 550;
		line-height:45rpx;
	}
	.touguog{
		border-radius:10rpx;
		margin-left:10rpx;
		color: white;
		text-align: center;
		line-height:45rpx;
	}
	.neir {
		padding:20rpx 20rpx;
		margin:auto;
		display: flex;
		align-items: center;
		color: black;
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
		font-weight: 600;
	}
	text{
		font-size:28rpx;
	}
</style>
