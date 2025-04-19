<template>
	<div style="background-color:white;width:680rpx;border-radius:10rpx;padding:20rpx;margin: auto;">
		<div style="display: flex;justify-content: space-between;align-items: center;margin-bottom:10rpx;">
			<text style="font-size:32rpx;color:black;font-weight:bold;">
				{{counter.submitNewData[0].name}} {{counter.submitNewData[0].lssue}}期
			</text>	
			<div style="display:flex;">
				<!-- <div class="tou" style="background-color:red;">1倍</div> -->
				<div class="tou" style="background-color:deepskyblue;">共{{counter.allOrderData.Note}}注</div>
				<div class="tou" style="background-color:#ff9b69;" v-show="counter.submitNewData[0].switch==1">
					追加
				</div>
			</div>
		</div>
		<view style="margin-bottom:10rpx;display: flex;align-items: center;" v-if="counter.allOrderData.WinConten!=null">
			<text>本期开奖:</text>
			<view style="display: flex;align-items: center;">
				<view class="WinRedBall" v-for="itme,index in counter.allOrderData.WinConten.Winingnumber.red">
					{{itme}}
				</view>
				<view class="WinBulleBall" v-for="itme,index in counter.allOrderData.WinConten.Winingnumber.blue">
					{{itme}}
				</view>
			</view>
		</view>
		<div style="background-color:#f5f5f5;display: flex;justify-content:space-between;">
			<text style="margin-left:20px;">序号</text>
			<text>投注内容</text>
			<text style="margin-right:20px;">注数信息</text>
		</div>
		<div style="display: flex;align-items: center;justify-content:space-between;margin:20rpx 0rpx;" 
			  v-for="item,index in counter.submitNewData"
			  :style="index%2==0? 'background-color:white;':'background-color: #ebebeb;'">
			  
			<div style="margin:0px 15px;text-align: center;">
				<text>{{index+1}}、</text>
				<text>单式</text>
			</div>

			<div style="display: flex;flex-wrap: wrap;flex: 1;">
				<div :class="truefunicon(itemS<10?'0'+itemS:itemS,'red')?'WinRedBall':'redBall'"
					v-for="itemS,indexS in item.data.dan.red" style="line-height:29rpx;" v-if="item.data.dan">
					<text>{{itemS<10?'0'+itemS:itemS}}</text><br>
					<text style="font-size:24rpx;">胆</text>
				</div>
				
				<div :class="truefunicon(itemS<10?'0'+itemS:itemS,'red')?'WinRedBall':'redBall'"
					v-for="itemS,indexS in item.data.dan" style="line-height:29rpx;" v-if="counter.allOrderData.Type=='双色球'&& item.data.dan">
					<text>{{itemS<10?'0'+itemS:itemS}}</text><br>
					<text  style="font-size:24rpx;">胆</text>
				</div>
				
				<div :class="truefunicon(itemS<10?'0'+itemS:itemS,'red')?'WinRedBall':'redBall'" 
					v-for="itemS,indexS in item.data.list.red">
					<text>{{itemS<10?'0'+itemS:itemS}}</text>
				</div>
				
				<div :class="truefunicon(itemS<10?'0'+itemS:itemS,'bule')?'WinBulleBall':'blueBall'"
					 v-for="itemS,indexS in item.data.dan.blue" style="line-height:29rpx;" v-if="item.data.dan">
					<text>{{itemS<10?'0'+itemS:itemS}}</text><br>
					<text  style="font-size:24rpx;">胆</text>
				</div>
				<div :class="truefunicon(itemS<10?'0'+itemS:itemS,'bule')?'WinBulleBall':'blueBall'"
					 v-for="itemS,indexS in item.data.list.blue">
					<text>{{itemS<10?'0'+itemS:itemS}}</text>
				</div>
			</div>
			<div style="display: flex;flex-flow:column;text-align: center;align-items: center;margin-right:30px;">
				<div class="tou" style="background-color:red;">{{item.beilv}}倍</div>
				<div class="tou" style="background-color:deepskyblue;">{{item.note}}注</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {ref,onBeforeMount,reactive,getCurrentInstance,defineProps,} from 'vue';
	import { useCounterStore } from '@/stores/counter'
	const orderData=reactive([])
	const props = defineProps(['data'])
	const counter = useCounterStore() //状态管理
	const truefunicon=(numer,type)=>{//开奖
		if(counter.allOrderData.WinConten==null){
			return false
		}
		var newRed=counter.allOrderData.WinConten.Winingnumber.red
		var newBule=counter.allOrderData.WinConten.Winingnumber.blue
		if(type=='red'){
			var redIndex=newRed.indexOf(numer,0)
			if(redIndex != -1){
				return true
			}else{
				return false
			}
		}else{
			if(counter.allOrderData.Type=='大乐透'){
				var BuleIndex=newBule.indexOf(numer,0)
				if(BuleIndex != -1){
					return true
				}else{
					return false
				}
			}else{
				if(newBule==numer){
					return true
				}else{
					return false
				}
			}
			
		}
	}
	onBeforeMount(()=>{
		if(counter.allOrderData.Type=='大乐透'){
			if(typeof(counter.allOrderData.WinConten)=='string'){//开奖数据解析
				counter.allOrderData.WinConten=JSON.parse(counter.allOrderData.WinConten)
			}
		}else{
			if(typeof(counter.allOrderData.WinConten)=='string'){//开奖数据解析
				counter.allOrderData.WinConten=JSON.parse(counter.allOrderData.WinConten)
				counter.allOrderData.WinConten.Winingnumber.red=counter.allOrderData.WinConten.Winingnumber.red.split(',')
				counter.allOrderData.WinConten.Winingnumber.blue=counter.allOrderData.WinConten.Winingnumber.blue.split(',')
			}
		}
	})
</script>

<style>
	.WinRedBall{
		width:60rpx;
		height:60rpx;
		background-image: radial-gradient(#ff6f71,red,#ff6f71);
		border:1px solid #ffa7a9;
		color:white;
		border-radius:50%;
		text-align: center;
		font-size:26rpx;
		line-height:60rpx;
		margin:5rpx;
	}
	.WinBulleBall{
		width:60rpx;
		height:60rpx;
		background-image: radial-gradient(#53a1ff,#397eff,#53a1ff);
		color:white;
		border-radius:50%;
		text-align: center;
		font-size:26rpx;
		line-height:60rpx;
		border:1px solid #8fd3ff;
		margin:5rpx;
	}
	.redBall{
		width:60rpx;
		height:60rpx;
		background-color:#ffdedf;
		border:1px solid #ffa7a9;
		border-radius:100px;
		text-align: center;
		line-height:60rpx;
		color: red;
		margin:5rpx 5rpx;
	}
	.blueBall{
		width:60rpx;
		height:60rpx;
		background-color:#c6f2ff;
		color:#397eff;
		border:1px solid #8fd3ff;
		border-radius:100px;
		text-align: center;
		line-height:60rpx;
		margin:5rpx 5rpx;
	}
	.tou {
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
</style>