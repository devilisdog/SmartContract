<template>
	<view :style="'width:'+props.widths+'rpx;'"
		style="margin: auto;margin-top: 15rpx;background-color: white;padding: 20rpx;border-radius: 10rpx;">
		<view style="display: flex;justify-content:space-between;margin-bottom:20rpx;">
			<text style="font-size:32rpx;font-weight:600;">
				排列五 {{counter.submitNewData[0].lssue}}期
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
		<view style="background-color:#f5f5f5;display: flex;margin:20rpx 0rpx;justify-content:space-between;">
			<text style="margin-left:20rpx;">序号</text>
			<text>投注内容</text>
			<text style="margin-right: 20rpx;">注数信息</text>
		</view>
		<view style="display: flex;align-items: center;justify-content:space-around;" v-for="item,index in counter.submitNewData" :style="index%2?'background-color: #f5f5f5;':''">
			<view>
				<text>{{index+1}}</text>
				<text style="padding-left:20rpx;">单式</text>
			</view>
			<view style="width:390rpx;word-wrap:break-word;padding:15rpx 15rpx;">
				<label v-for="itemS,indexS in item.data" :key="indexS">
					<label style="margin:10rpx 5rpx;color: red;">
						<text v-show="indexS!=0" style="color:darkred;">|</text>
						<text v-for="itemSX,indexSX in itemS" class="qiu" 
							:key="indexSX"
							:style="truefunticon(itemSX,indexS)?'background-color:red;color:white;border:none;':''"
							>{{itemSX}}</text>
					</label>
				</label>
			</view>
			<view style="display: flex;flex-flow:column;text-align: center;">
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
	const counter = useCounterStore() //状态管理
	const props = defineProps(['widths'])
	const wei=reactive(['第一位','第二位','第三位','第四位','第五位','第六位','第七位'])
	const truefunticon=(itme,index)=>{
		if(counter.allOrderData.WinConten==null){
			return false
		}
		if(counter.allOrderData.WinConten.Winingnumber[index]==itme){
			return true
		}else{
			return false
		}
	}
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
		padding:13rpx 23rpx 13rpx 23rpx;
		background-color:#ffdedf;
		border:1rpx #ffcdcd solid;
		border-radius:100rpx;
		margin:0rpx 5rpx;
		line-height:80rpx;
	}
	.tou {
		padding: 0rpx 10rpx 0rpx 10rpx;
		margin:5rpx 5rpx;
		border-radius: 10rpx;
		color: white;
		margin-left: 10rpx;
		font-weight: 550;
	}
	text{
		font-size:28rpx;
	}
</style>
