<template>
	<div style="width:680rpx;margin: auto;padding: 20rpx;background-color:white;border-radius:10rpx;">
		<div style="display: flex;justify-content: space-between;align-items: center;">
			<text class="fontStyle">
				七乐彩 {{counter.submitNewData[0].lssue}}期
			</text>
			<div style="display:flex;">
				<!-- <div class="tou" style="background-color:red;padding:5rpx 10rpx;">1倍</div> -->
				<div class="tou" style="background-color:deepskyblue;padding:5rpx 10rpx;">
					共{{counter.allOrderData.Note}}注
				</div>
			</div>
		</div>
		<view style="margin-bottom:10rpx;display: flex;align-items: center;" v-if="counter.allOrderData.WinConten!=null">
			<text>本期开奖:</text>
			<view style="display: flex;align-items: center;">
				<view class="redBall" v-for="itme,index in counter.allOrderData.WinConten.Winingnumber.red">
					{{itme}}
				</view>
				<view class="WinBulleBall" v-for="itme,index in counter.allOrderData.WinConten.Winingnumber.blue">
					{{itme}}
				</view>
			</view>
		</view>
		<div style="display: flex;background-color: #f5f5f5;margin:10rpx 0rpx;justify-content:space-between;">
			<text style="margin-left:20px;">序号</text>
			<text>投注内容</text>
			<text style="margin-right:20px;">注数信息</text>
		</div>
		<div style="display: flex;align-items: center;justify-content:space-between;" 
					v-for="item,index in orderCardData.data" :style="index%2?'background-color: #f5f5f5;':''">
			<div style="margin:0px 20px;">
				<text>{{index+1}}、</text>
				<text v-if="item.data.value.length==7">单式</text>
				<text v-if="item.data.value.length!=7 && item.data.dan.length==0">复式</text>
				<text v-if="item.data.dan.length>0">胆拖</text>
			</div>
			
			<div style="display: flex;flex-wrap: wrap;align-items: center;flex: 1;">
				<div v-for="item,index in item.data.value" class="qiu" style="margin:5px;"
					 :style="truefunticon(item<10?'0'+item:item,'value')?'background-color:red;color:white;border:none;':''">
					{{item<10?'0'+item:item}}
				</div>
				<div v-for="item,index in item.data.dan" class="qiuDan" style="margin:5px;"
					 :style="truefunticon(item<10?'0'+item:item,'dan')?'background-color:red;color:white;border:none;':''">
					<text style="font-size:14px;">
						{{item<10?'0'+item:item}}
					</text>
					<text style="margin-top:-6px;">胆</text>
				</div>
			</div>
			<div style="display: flex;flex-flow:column;text-align: center;margin-right:20px;align-items: flex-end;">
				<div class="tou" style="background-color:red;">{{item.beilv}}倍</div>
				<div class="tou" style="background-color:deepskyblue;">{{item.note}}注</div>
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
	import { useCounterStore } from '@/stores/counter'
	const orderCardData=reactive([])
	const props = defineProps(['data'])
	const counter = useCounterStore() //状态管理
	const truefunticon=(itme,type)=>{
		if(counter.allOrderData.WinConten==null){//未开奖禁止判断
			return false
		}
		var initRed=counter.allOrderData.WinConten.Winingnumber.red
		var initBlue=counter.allOrderData.WinConten.Winingnumber.blue
		if(type=='value'){
			var index=initRed.indexOf(itme,0)
			if(index != -1){
				return true
			}
		}else{
			var index=initBlue.indexOf(itme,0)
			if(index != -1){
				return true
			}
		}
		
	}
	onBeforeMount(()=>{
		orderCardData.data=counter.submitNewData
		if(typeof(counter.allOrderData.WinConten)=='string'){//开奖数据解析
			counter.allOrderData.WinConten=JSON.parse(counter.allOrderData.WinConten)
			counter.allOrderData.WinConten.Winingnumber.red=counter.allOrderData.WinConten.Winingnumber.red.split(',')
			counter.allOrderData.WinConten.Winingnumber.blue=Array(counter.allOrderData.WinConten.Winingnumber.blue)
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
	.WinBulleBall{
		width:50rpx;
		height:50rpx;
		background-image: radial-gradient(#53a1ff,#397eff,#53a1ff);
		color:white;
		border-radius:50%;
		text-align: center;
		font-size:26rpx;
		line-height:50rpx;
		border:1px solid #8fd3ff;
		margin:5rpx;
	}
	.qiu{
		width:60rpx;
		height:60rpx;
		background-color:#ffdedf;
		border-radius:100px;
		color: red;
		display: flex;
		align-items: center;
		justify-content: center;
		
	}
	.qiuDan{
		width:60rpx;
		height:60rpx;
		background-color:#ffdedf;
		border-radius:100px;
		color: red;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
	}
	.tou{
		width:fit-content;
		padding:8rpx 10rpx;
		height:25rpx;
		font-size:28rpx;
		line-height:25rpx;
		text-align: center;
		border-radius:5rpx;
		color: white;
		font-weight: bold;
		margin:5rpx 5rpx;
	}
	.fontStyle {
		font-size:32rpx;
		font-weight: bold;
	}
</style>