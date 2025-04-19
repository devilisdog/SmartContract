<template>
	<view :style="'width:'+props.widths+'rpx;'"
		style="margin: auto;margin-top: 15rpx;background-color: white;padding: 20rpx;border-radius: 10rpx;" >
		<view style="display: flex;justify-content:space-between;margin-bottom:20rpx;">
			<text class="text">
				{{counter.submitNewData[0].name}} {{counter.submitNewData[0].lssue}}期
			</text>
			<view>
				<!-- <text class="tou" style="background-color:red;">1倍</text> -->
				<text class="tou" style="background-color:deepskyblue;">共{{counter.allOrderData.Note}}注</text>
			</view>
		</view>
		<view style="margin-bottom:10rpx;display: flex;align-items: center;" v-if="counter.allOrderData.WinConten!=null">
			<text>本期开奖:</text>
			<view style="display: flex;align-items: center;">
				<view class="redBall_true" v-for="itme,index in counter.allOrderData.WinConten.Winingnumber">
					{{itme}}
				</view>
			</view>
		</view>
		<view style="background-color:#f5f5f5;display: flex;margin:20rpx 0rpx;justify-content:space-between;">
			<text style="margin-left:20rpx;">序号</text>
			<text>投注内容</text>
			<text style="margin-right:20rpx;">注数信息</text>
		</view>
		<view style="display: flex;align-items: center;justify-content: space-between;" 
			v-for="item,index in counter.submitNewData" :style="index%2?'background-color: #f5f5f5;':''">
			
			<view style="flex:0.25;text-align: center;margin-right:30rpx;">
				<text style="margin-left:15rpx;">{{index+1}}</text>
				<text style="padding-left:20rpx;">{{item.wanfa_type}}</text>
			</view>
			
			<view style="width:350rpx;word-wrap:break-word;padding:15rpx 0rpx;flex:0.9;">
				<view 
					v-if="item.type=='zhixuan_dingwei'" 
					v-for="itemX,indexX in item.data" 
					style="display: flex;align-items: center;"
				>
					<text>{{titleArr[indexX]}}:</text>
					<view class="zhixuan_dingwei">
						<view 
							v-for="itmeS,indexS in item.data[indexX]" 
							:class="truefunicon(itmeS,indexX,'corresponding')?'redBall_fill':'redBall'"
							>
							{{itmeS}}
						</view>
					</view>
				</view>
				
				<view 
					v-else-if="item.type=='zhixuan_fushi'||item.type=='zhixuan_hezhi'||item.type=='zhixuan_kuadufushi'||item.type=='zu3_fushi'||item.type=='zu3_kuadufushi'||item.type=='zu6_fushi'||item.type=='zu6_kuadufushi'||item.type=='zuxuan_hezhi'||item.type=='zuxuan_quanbao'"
					class="zhixuan_dingwei_double"
				>	
					<view v-for="itemX,indexX in item.data.data" class="redBall" v-if="item.type=='zhixuan_hezhi'">
						{{itemX}}
					</view>
					<view 
						v-for="itemX,indexX in item.data.data[0]"
						class="redBall" 
						v-else-if="item.type=='zu3_kuadufushi'">
						{{itemX}}
					</view>
					<view v-for="itemX,indexX in item.data[0]" class="redBall" v-else>
						{{itemX}}
					</view>
					
				</view>
				<view 
					v-else-if="item.type=='zhixuan_tuodan' || item.type=='zu3_tuodan' || item.type=='zu6_tuodan'" 
					class="zhixuan_dingwei_double"
				>
					<view 
						v-for="itemX,indexX in item.data.value[0]" 
						class="redBall" 
						v-if="item.type=='zhixuan_tuodan' || item.type=='zu6_tuodan'">
						{{itemX}}
					</view>
					<view 
						v-for="itemX,indexX in item.data.dan[0]" 
						class="buleBall" 
						v-if="item.type=='zhixuan_tuodan' || item.type=='zu6_tuodan'"
					>
						{{itemX}}
					</view>
					<view v-for="itemX,indexX in item.data.datadan[0]" class="redBall" v-if="item.type=='zu3_tuodan'">
						{{itemX}}
					</view>
					<view v-for="itemX,indexX in item.data.value[0]" class="buleBall" v-if="item.type=='zu3_tuodan'">
						{{itemX}}
					</view>
				</view>
				
				<view v-else class="zhixuan_dingwei_division">
					<view v-for="itemX,indexX in item.data.chong" class="redBall">
						{{itemX}}
					</view>
					<view style="color: red;">|</view>
					<view v-for="itemX,indexX in item.data.dan" class="redBall">
						{{itemX}}
					</view>
				</view>
				
			</view>
			
			<view style="display: flex;flex-flow: column;text-align: center;margin-right:20rpx;">
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
	const props = defineProps(['widths'])
	import { useCounterStore } from '@/stores/counter'
	const counter = useCounterStore() //状态管理
	const titleArr=reactive(['百位','十位','个位'])
	const truefunicon=(number,index,type)=>{
		if(counter.allOrderData==null){
			return false
		}
		if(type=='corresponding' && typeof(counter.allOrderData.WinConten)=='string'){
			if(counter.allOrderData.WinConten.Winingnumber[index]==number){
				return true
			}
		}
	}
	onBeforeMount(()=>{
		if(counter.allOrderData.Type=='福彩3D'){
			if(typeof(counter.allOrderData.WinConten)=='string'){//开奖数据解析
				counter.allOrderData.WinConten=JSON.parse(counter.allOrderData.WinConten)
				counter.allOrderData.WinConten.Winingnumber=counter.allOrderData.WinConten.Winingnumber.split(',')
			}
		}else{
			if(typeof(counter.allOrderData.WinConten)=='string'){//开奖数据解析
				counter.allOrderData.WinConten=JSON.parse(counter.allOrderData.WinConten)
				counter.allOrderData.WinConten.Winingnumber=counter.allOrderData.WinConten.Winingnumber.split(' ')
			}
		}
	})
</script>

<style>
	.redBall{
		width:60rpx;
		height:60rpx;
		background-color:#ffdedf;
		border-radius:50%;
		text-align: center;
		line-height:60rpx;
		color:red;
		border:1rpx solid #ff6f71;
	}
	.redBall_fill{
		width:60rpx;
		height:60rpx;
		background-color:red;
		border-radius:50%;
		text-align: center;
		line-height:60rpx;
		color:white;
		border:1rpx solid red;
	}
	.buleBall{
		width:60rpx;
		height:60rpx;
		background-color:#b5efff;
		border-radius:50%;
		text-align: center;
		line-height:60rpx;
		color:#0055ff;
		border:1rpx solid #55d2ff;
	}
	
	.zhixuan_dingwei{
		display:grid;
		grid-template-columns:repeat(4,60rpx);
		grid-template-rows:repeat(auto,60rpx);
		align-items: center;
		grid-column-gap:20rpx;
		grid-row-gap:10rpx;
		max-width:320rpx;
		margin:20rpx 10rpx;
		
	}
	.zhixuan_dingwei_division{
		display:grid;
		grid-template-columns:repeat(5,auto);
		grid-template-rows:repeat(auto,auto);
		align-items: center;
		grid-column-gap:20rpx;
		grid-row-gap:10rpx;
		max-width:320rpx;
		margin:20rpx 10rpx;
	}
	.zhixuan_dingwei_double{
		display:grid;
		grid-template-columns:repeat(5,60rpx);
		grid-template-rows:repeat(auto,60rpx);
		align-items: center;
		grid-column-gap:20rpx;
		grid-row-gap:10rpx;
		max-width:320rpx;
		margin:20rpx 10rpx;
	}
	.redBall_true{
		width:50rpx;
		height:50rpx;
		background-image: radial-gradient(#ff6f71,red,#ff6f71);
		color:white;
		border-radius:50%;
		text-align: center;
		font-size:26rpx;
		line-height:50rpx;
		margin:5rpx;
	}
	.qiu{
		padding:13rpx 23rpx;
		background-color:#ffdedf;
		border-radius:100rpx;
		margin:0rpx 3rpx;
		line-height:80rpx;
		
	}
	.qiu2{
		padding:12rpx 14rpx;
		background-color:#ffdedf;
		border-radius:100rpx;
		margin:0rpx 3rpx;
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
	.text{
		font-size: 32rpx;
		font-weight:bold;
	}
</style>
