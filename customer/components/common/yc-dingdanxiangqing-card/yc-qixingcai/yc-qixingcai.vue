<template>
	<view :style="'width:'+props.widths+'rpx;'"
		style="margin: auto;margin-top: 15rpx;background-color: white;padding: 20rpx;border-radius: 10rpx;">
		<view style="display: flex;justify-content:space-between;margin-bottom:20rpx;">
			<text style="font-size:32rpx;font-weight:600;">
				七星彩 {{counter.submitNewData[0].lssue}}期
			</text>
			<view>
				<!-- <text class="tou" style="background-color:red;">1倍</text> -->
				<text class="tou" style="background-color:deepskyblue;">共{{counter.allOrderData.Note}}注</text>
			</view>
		</view>
		<view style="margin-bottom:10rpx;display: flex;align-items: center;" v-if="counter.allOrderData.WinConten!=null">
			<text>本期开奖:</text>
			<view style="display: flex;align-items: center;">
				<view class="redBall" v-for="itme,index in counter.allOrderData.WinConten.Winingnumber">
					{{itme}}
				</view>
			</view>
		</view>
		<view style="background-color:#f5f5f5;display: flex;justify-content:space-between;">
			<text style="margin-left:20rpx;">序号</text>
			<text>投注内容</text>
			<text style="margin-right:20rpx;">注数信息</text>
		</view>
		<view style="display: flex;align-items: center;justify-content:space-between;"  v-for="item,index in counter.submitNewData" :style="index%2?'background-color: #f5f5f5;':''">
			<text style="margin-left:20rpx;">{{index+1}}</text>
			<text>单式</text>
			<view style="width:390rpx;word-wrap:break-word;padding:20rpx 0rpx;">
				<label v-for="itemS,indexS in item.data" :key="indexS">
					<label  style="margin:10rpx 5rpx;color:red;">
						<text v-show="indexS!=0" style="color:darkred;">|</text>
						<text v-for="itemSX,indexSX in itemS" class="qiu" 
							:style="indexS==6&&itemS[indexSX]>=10?'padding:14rpx 16rpx 14rpx 16rpx;background-color:#c6f2ff;color:#397eff;'
									:indexS==6?'background-color:#c6f2ff;color:#397eff;':''" 
							:key="indexS">{{itemSX}}</text>
					</label>
				</label>
			</view>
			<view style="display: flex;flex-flow:column;text-align: center;margin-right:20rpx;">
				<text class="tou" style="background-color:red;">{{item.beilv}}倍</text>
				<text class="tou" style="background-color:deepskyblue;">{{item.note}}注</text>
			</view>
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
	} from 'vue';
	import { useCounterStore } from '@/stores/counter'
	const props = defineProps(['widths'])
	const counter = useCounterStore() //状态管理
	onBeforeMount(()=>{
		if(typeof(counter.allOrderData.WinConten)=='string'){//开奖数据解析
			counter.allOrderData.WinConten=JSON.parse(counter.allOrderData.WinConten)
			counter.allOrderData.WinConten.Winingnumber=counter.allOrderData.WinConten.Winingnumber.split(' ')
		}
	})

</script>

<style>
	
	.redBall{
		width:50rpx;
		height:50rpx;
		background-image: radial-gradient(#ff6f71,red,#ff6f71);
		/* background-color:red; */
		color:white;
		border-radius:50%;
		text-align: center;
		font-size:26rpx;
		line-height:50rpx;
		margin:5rpx;
	}
	.qiu{
		padding:15rpx 26rpx;
		background-color:#ffdedf;
		border-radius:100rpx;
		margin:0rpx 5rpx;
		line-height:80rpx;
	}
	.tou {
		padding: 2rpx 15rpx 2rpx 15rpx;
		border-radius: 10rpx;
		color: white;
		margin:5rpx 5rpx;
		font-weight: 550;
	}
	text{
		font-size:28rpx;
	}
</style>
