<template>
	<z-paging ref="game" v-model="gameData" @query="gameDataList" :loading-more-enabled="false">
		<template v-slot:top>
			<view class="status_bar"></view>
			<!-- 头部 -->
			<uni-nav-bar 
				:title="Props.pageState==0?'出票详情':'派奖详情'" 
				leftIcon="back" 
				@clickLeft="back()" 
				fixed="true"
				leftText="返回">
			</uni-nav-bar>
			<!-- 日期 -->
			<view style="width: 100%;background-color: white;display: flex;justify-content: center;">
				<view style="padding:10rpx 0rpx;">
					<uni-datetime-picker v-model="range" type="daterange" @change='timeChenge'/>
				</view>
			</view>
			<!-- 统计 -->
			<!-- <view class="xinxi" v-if="Props.pageState==1">
				<view style="font-size: 28rpx;margin-left: 20rpx;">
					<text style="color: #818181;margin-right: 10rpx;">共中奖(已派奖)</text>
					<text style="font-weight: bold;">￥{{drawABillAllMoney}}</text>
				</view>
				<view style="font-size: 28rpx;margin-right: 20rpx;">
					<text style="color: #818181;margin-right: 10rpx;">用户</text>
					<text style="font-weight: bold;">￥{{drawABillAllMoney}}</text>
				</view>
			</view>
			<view class="xinxi" v-else>
				<view style="font-size: 28rpx;margin-left: 20rpx;">
					<text style="color: #818181;margin-right: 10rpx;">共出票</text>
					<text style="font-weight: bold;">￥{{drawABillAllMoney}}</text>
				</view>
				<view style="font-size: 28rpx;margin-right: 20rpx;font-weight: bold;">
					<text>{{gameData.length}}</text>
					<text style="margin-right: 10rpx;">种类型</text>
				</view>
			</view> -->
			<!-- 彩票类型 -->
			<!-- <view style="width: 100%;height: 50rpx;background-color: #fff;border-bottom:1rpx solid #f0f0f0;">
				<text style="font-size: 24rpx;padding-left: 25rpx;">彩票</text>
			</view> -->
		</template>
		<view class="gameCard" v-for="itme,index in gameData" @click="clickGameCard(itme.id)">
			<view style="display: flex;align-items: center;font-weight: bold;padding:10rpx;">
				<image :src="counter.baseUrl+itme.image" style="width:90rpx;height:90rpx;margin-right:10rpx;" />
				<text>{{itme.Type}}</text>
			</view>
			<view style="display: flex;align-items: center;padding:10rpx;">
				<text>{{itme.count}}单</text>
				<text style="margin-right:10rpx;">{{itme.InvoicingAmount}}元</text>
				<uni-icons type="forward" size="46rpx" />
			</view>
		</view>
	</z-paging>
</template>

<script setup>
	import {ref,reactive,onBeforeMount,getCurrentInstance,defineProps} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	import {useCounterStore} from '@/stores/counter'
	import api from "@/common/vmeitime-http/satistics/satistcs.js"
	const gameData=ref([])
	// 返回到上一个页面
	const back = () => {
		uni.switchTab({
			url: '/pages/index/statistics',
			animationType: 'none',
			animationDuration: 0
		});
	}
	const Props=defineProps(['pageState','time','clerk_id'])
	const counter = useCounterStore(); //状态管理
	const range =ref()
	const gameDataList=(pageNo,pageSize)=>{
		api.GetTicketingDetails({
			"clerk_id":Props.clerk_id,
			"game_id":"",
			"type":Props.pageState,
			"startTime":range.value[0],
			"endTime": range.value[1],
			"per_page": pageSize,
			"current_page":pageNo,
		}).then((res)=>{
			uni.hideLoading()
			proxy.$refs.game.complete(res.data.data)
		}).catch(res=>{
			proxy.$refs.game.complete(false)
		})
	}
	const drawABillAllMoney=ref(0)//出票总金额
	const AllMoneyState=ref(false)//是否计算过出票总金额
	const timeChenge=()=>{
		uni.showLoading({title:'加载中~'})
		proxy.$refs.game.reload()
	}
	onBeforeMount(()=>{
		range.value=Props.time.split(",")
		uni.showLoading({title:'加载中~'})	
	})
	const clickGameCard=(gameId)=>{
		uni.navigateTo({
			url:"../statistics-xiangqing/statisyics-award-contentPage?gameId="+gameId+'&pageState='+Props.pageState+'&time='+range.value
		})
	}
</script>

<style>
	.xinxi{
		width: 100%;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content:space-between;
	}
	.gameCard{
		width:100%;
		height:140rpx;
		background-color: white;
		display: flex;
		justify-content: space-between;
		border-bottom:1rpx solid #f7f7f7;
	}
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
	body {
		background-color: #f7f7f7;
	}
</style>
