<template>
	<view class="mycard" @click="dianji(item,0)" v-for="item,index in Props.numindex" :key="index" v-if="proxy.identification == 0">
		<view class="imageBox">
			<image :src="GameTypein(item.Type)" style="width: 80rpx;height: 80rpx;"></image>
			<text style="margin-top: 10rpx;font-size: 30rpx;color: #535353;">{{item.Type}}</text>
		</view>
		<view class="card_right">
			<view style="display: flex;align-items:center;justify-content: space-between;">
				<view style="display: flex;align-items: center;">
					<text :style="{color:titleColor(item.State)}"
								  
						style="font-size: 34rpx;font-weight: bold;display: block;">{{zhuandai[item.State].stateData}}</text>
					<view class="fadan" v-show="item.default==1">
						<text>{{item.Issue == 1 ? "发单" : "跟单"}}</text>
					</view>
				</view>
				<view style="color:#ff6767;" class="subheading" v-show="item.AwardMoney>0">
					中奖{{item.AwardMoney}}元
				</view>
			</view>
			<view style="display: flex;align-items: center;justify-content: space-between;">
				<text style="color: #a5a5a5;font-size: 26rpx;">
					{{getTime.getNowFormatDate(0,item.PayTime*1000)}}
				</text>
				<view class="dingdanMoney" >
					<text>投注</text>
					<text style="color: red;">{{item.BetMoney}}</text><!-- {{item.BetMoney}} -->
					<text>元</text>
				</view>
			</view>
			<view style="display: flex;align-items: center;justify-content: space-between;">
				<text style="color: #a5a5a5;font-size: 26rpx;">
					订单编号：{{item.order_id}}
				</text>
				<text class="subheading" v-show="item.issue_code!='0' && item.issue_code!=null && item.issue_code!='' && item.issue_code!='null'">
					{{item.issue_code}}期
				</text>
			</view>
		</view>
	</view>
	<template v-for="item,index in Props.numindex" :key="index">
		<view  v-if="proxy.identification == 1" class="mycard" @click="dianji(item,1)">
			<view class="imageBox">
				<image :src="GameTypein(item.orderInfo.Type)" style="width: 80rpx;height: 80rpx;"></image>
				
				<text style="margin-top: 10rpx;font-size: 30rpx;color: #535353;">{{item.orderInfo.Type}}</text>
			</view>
			<view class="card_right">
				<view style="display: flex;align-items:center;justify-content: space-between;">
					<view style="display: flex;align-items: center;">
						<text :style="{color:titleColor(item.orderInfo.State)}" style="font-size: 34rpx;font-weight: bold;">
							{{zhuandai[item.orderInfo.State].stateData}}
						</text>
						<view class="fadan" :style="item.Issue==1?'background-color: #ff6767;':'background-color: #1198ff;'">
							<text>{{item.Issue == 1 ? "发起" : "参与"}}</text>
						</view>
					</view>
					<view style="color:#ff6767;" class="subheading" v-show="item.orderInfo.WinningMoney>0">
						中奖{{item.orderInfo.AwardMoney==null?item.orderInfo.WinningMoney:item.orderInfo.AwardMoney}}元
					</view>
				</view>
				<view style="display: flex;align-items: center;justify-content: space-between;">
					<text style="color: #a5a5a5;font-size: 26rpx;">
						订单编号：{{item.order_id}}
					</text>
					<view class="dingdanMoney" >
						<text>投注</text>
						<text style="color: red;">{{item.orderInfo.BetMoney}}</text><!-- {{item.BetMoney}} -->
						<text>元</text>
						<view style="margin-top: -3rpx;">
							<text>/自购</text>
							<text style="color: red;">{{item.orderInfo.OneselftMoney}}</text>
							<text>元</text>
						</view>
					</view>
				</view>
				<view style="display: flex;align-items: center;justify-content: space-between;">
					<text style="color: #a5a5a5;font-size: 26rpx;">
						{{getTime.getNowFormatDate(0,item.orderInfo.Deadline*1000)}}
					</text>
					<text class="subheading" v-show="item.orderInfo.issue_code!='0' && item.orderInfo.issue_code!=null && item.orderInfo.issue_code!='' && item.orderInfo.issue_code!='null'">
						{{item.orderInfo.issue_code}}期
					</text>
				</view>
			</view>
		</view>
	</template>
</template>

<script setup>
	import api from '@/common/vmeitime-http/'
	import { useCounterStore } from '@/stores/counter'
	import common from "@/common/common.js"
	import getTime from "@/common/getdatetime.js"
	import {
		ref,
		reactive,
		defineProps, // 接收
		defineEmits, // 发送
		getCurrentInstance,//获取当前组件的实例
		onBeforeMount
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const Props = defineProps(['numindex','identification'])
	
	const Emits=defineEmits(['clickCard'])
	
	const titleData=reactive(['竞彩足球','竞彩篮球','胜负过关','任选九','北京单场','胜负彩'])
	
	const titleColor=(State)=>{//卡片title颜色判断
		if(State == 3||State == 4||State == 5||State == 11){
			return '#dddddd'
		}else if( State == 10 || State==9){
			return '#ff6767'
		}else if(State == 8){
			return '#bcbcbc'
		}else if(State == 0){
			return '#ff8c4a'
		}else{
			return '#383838'
		}
	}
	const dianji=(item,index)=>{//点击卡片传值
		Emits('clickCard',item,index)
		var arr =titleData.includes(item.Type)
		if(index==0){
			if(arr==true){
				counter.submitNewData=[]
				counter.BettingContent=JSON.parse(item.BetContent)
			}else{
				counter.BettingContent=[]
				counter.submitNewData=JSON.parse(item.BetContent)
			}
		}else{
			if(arr==true){
				counter.submitNewData=[]
				counter.BettingContent=item
			}else{
				counter.BettingContent=[]
				counter.submitNewData=item
			}
		}
		counter.allOrderData=item
	}
	const zhuandai=reactive([//订单状态对照表
		{value:0,stateData:"认购中"},
		{value:1,stateData:"待接单"},
		{value:2,stateData:"待出票"},
		{value:3,stateData:"玩家撤销"},
		{value:4,stateData:"店主撤销"},
		{value:5,stateData:"系统撤销"},
		{value:6,stateData:"待开奖"},
		{value:7,stateData:"待中奖"},
		{value:8,stateData:"未中奖"},
		{value:9,stateData:"待派奖"},
		{value:10,stateData:"已派奖"},
		{value:11,stateData:"已流单"},
	])
	const GameTypein = (e) =>{//订单头像对照表
		
		if(e == "七星彩"){
			return '/static/img/lottery/204.png'
		}else if(e == '双色球'){
			return '/static/img/lottery/101.png'
		}else if(e == '福彩3D'){
			return '/static/img/lottery/102.png'
		}else if(e == '七乐彩'){
			return '/static/img/lottery/104.png'
		}else if(e == '快乐八'){
			return '/static/img/lottery/105.png'
		}else if(e == '大乐透'){
			return '/static/img/lottery/201.png'
		}else if(e == '排列三'){
			return '/static/img/lottery/202.png'
		}else if(e == '排列五'){
			return '/static/img/lottery/203.png'
		}else if(e == '胜负彩'){
			return '/static/img/lottery/401.png'
		}else if(e == '任选九'){
			return '/static/img/lottery/402.png'
		}else if(e == '胜负过关'){
			return '/static/img/lottery/404.png'
		}else if(e == '北京单场'){
			return '/static/img/lottery/405.png'
		}else if(e == '竞彩篮球'){
			return '/static/img/lottery/406.png'
		}else if(e == '竞彩足球'){
			return '/static/img/lottery/407.png'
		}
	}
	
</script>
<style>
	.subheading{
		font-weight:bold;
		color: #383838;
		font-size: 30rpx;
	}
	.card_right{
		padding:20rpx 20rpx 20rpx 10rpx;
		flex:1;
		display: flex;
		flex-flow: column;
		justify-content: space-between;
	}
	.imageBox{
		width:150rpx;
		display: flex;
		flex-direction: column;
		height: 200rpx;
		margin:0rpx 10rpx;
		align-items: center;
		justify-content:center;
	}
	
	/* 卡片主体 */
	.mycard{
		display: flex;
		margin:20rpx auto;
		width:720rpx;
		height:200rpx;
		background-color:white;
		border-radius: 10rpx;
		border: 1rpx #fafafa solid;
		box-shadow: 0rpx 5rpx 12rpx #ececec;
	}
	
	/* 发单小标签 */
	.fadan{
		margin: 0 15rpx;
		height: 35rpx; 
		background-color: #1198ff;
		border-radius: 55rpx;
		display: flex;
		align-items: center;
		justify-items: center;
		}
		.fadan text{
			color: white;
			padding: 0 10rpx;
			font-size: 25rpx;
			font-weight: bold;
		}
	
	
	.dingdanMoney{
		/* max-width: 100rpx;*/
		/* overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap; */
		display: flex;
		align-items: center;
		/* background-color: #1198ff; */
	}.dingdanMoney text{
		font-size: 24rpx;
		max-width:220rpx;
		/* max-width: 50rpx; */
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>