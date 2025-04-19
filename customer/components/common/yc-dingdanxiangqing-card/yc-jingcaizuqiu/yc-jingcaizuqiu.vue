<template>
	<uni-card :style="'width:'+props.widths+'rpx;'"
		style="margin: auto;margin-top: 15rpx;" margin="0" spacing="20" padding="0" :border="false" shadow='0px 0px 3px 1px rgba(255, 255, 255, 0)' >
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
			<text>主队/客场</text>
			<text>投注内容</text>
			<text>赛果</text>
		</view>
		<view class="neir" v-for="item,index in orderData.data.Content" :key="index" :style="index%2!=0?'background-color: #f5f5f5;':''">
			<text style="font-size:30rpx;flex:0.4;text-align: center;">{{item.matchNumStr}}</text>
			<view style="display: flex;flex-flow:column;align-items: center;flex:1.5;">
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
			<view style="display: flex;flex:1.6;justify-content:space-around;">
				<view style="display: flex;flex-flow: column;align-items: center;">
					<view v-for="itemNr,indexNr in orderData.data.Content[index].data"
						style="margin-bottom:20rpx;text-align: center;" :style="itemNr.isWin?'color:red;':''">
						<text>{{itemNr.res}}</text><br>
						<text>({{itemNr.rate}})</text>
					</view>
				</view>
				<view style="display: flex;flex-flow: column;margin-bottom:20rpx;text-align:center;justify-content: center;">
					<text v-if="item.Result">
						{{item.Result.home_score+':'+item.Result.away_score}}<br>
						({{item.Result.half_home_score+':'+item.Result.half_away_score}})
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
		// nextTick
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	import {useCounterStore} from '@/stores/counter';
	const props = defineProps(['widths'])
	const counter = useCounterStore() //状态管理
	const orderData=reactive([])
	const duoData=ref('')
	const zhiData=reactive([])
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
	.touguog{
		color: white;
		text-align: center;
		font-weight: 600;
		border-radius:10rpx;
		margin-left:10rpx;
		line-height:45rpx;
	}
	.tou2 {
		padding: 5rpx 10rpx;
		border-radius: 10rpx;
		color: white;
		font-weight: 600;
		
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
		font-weight: 600;
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
