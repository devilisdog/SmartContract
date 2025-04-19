<template>
	<view class="card">
		<view class="topBox" @click="clickOrder">
			<view style="grid-row-start:1;grid-row-end:3;display: flex;align-items: center;">
				<image :src="arr[Props.order_list.Type].url"  style="width:95rpx;height:95rpx;" mode="aspectFit"></image>
			</view>
			<view style="display: flex;align-items: center;justify-content:space-between;">
				<text style="font-weight:600;font-weight:bold;">{{Props.order_list.Type}}</text>
				<view style="display: flex;">
					<yc-card-TGA
						:value='Props.order_list.default' 
						:orderState='Props.order_list.Issue' 
						:IsAllowRejection='Props.order_list.IsCooperative'
					/>
				</view>
			</view>
			<view style="display: flex;font-size:24rpx;justify-content: space-between;align-items: center;">
				<view>
					<text style="padding-right:10rpx;font-size: 24rpx;">{{Props.order_list.Note}}注</text>
					<text style="padding-right:10rpx;font-size: 24rpx;">
						{{typeFind(Props.order_list.Type)}}倍
					</text>
					<text style="color: red;font-size: 24rpx;">{{Props.order_list.BetMoney}}元</text>
				</view>
				<view style="color:#868686;">
					<text style="font-size:18rpx;">下单时间:{{getdatetime.getNowFormatDate(0,Props.order_list.PayTime)}}</text>	
				</view>
			</view>
		</view>
		<view class="bottomStyle">
			<text style="font-size: 24rpx;">截至时间:{{getdatetime.getNowFormatDate(0,Props.order_list.Deadline)}}</text>
			<view>
				<view class="bottm" 
					  @click="clickOrderReceiving" 
					  v-if="Props.order_list.State==1 && Props.CooperativeOrderState!=1">
					<text>接单</text>
				</view>
				<view class="bottm" 
					  @click="clickOrderDetails" 
					  v-else-if="Props.order_list.State==2 && Props.CooperativeOrderState!=1">
					<text>查看详细</text>
				</view>
				<view v-else-if='Props.CooperativeOrderState==1' style="color:slateblue;">
					{{common.orderState(Props.order_list.State)}}~
				</view>
				<view v-else style="color:seagreen;">认购中~</view>
			</view>
		
		</view>
	</view>
</template>

<script setup>
	/*
	* 接收：
	* title：订单玩法title
	* zhu：注数信息
	* bei：注倍数信息
	* xiadanTime：下单时间
	* jiezhiTime：截至时间
	* money：订单金额
	* state:订单状态（0:待接单。1:待出票）
	* 
	* -----------------------------------
	* 发送：
	* orderReceiving（点击接单回调）
	* OrderDetails（点击订单详情回调）
	* clickOrder（点击空白区域回调）
	*/
	import common from '@/common/common'
	import getdatetime from "@/common/getdatetime.js"
	
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		defineEmits,//发送数据
		defineProps,//接收数据
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const orderList=reactive([])
	const Emits=defineEmits(['orderReceiving','OrderDetails','clickOrder'])
	const Props=defineProps([
		'order_list',//订单数据
		'CooperativeOrderState'//是否为合作订单(1==true/！=1false,默认是fasle)
	])
	const typeFind=(title)=>{
		var a=title
		var arr=['竞彩足球','竞彩篮球','胜负过关','北京单场','任选九','胜负彩']
		if(arr.includes(a)==true){
			return JSON.parse(Props.order_list.BetContent).remarks.Multiple
		}else{
			return 1
		}
	}
	const arr=reactive({//接单卡片图片数据（根据获取到的title判断使用哪个url）
		'竞彩足球':{url:'../../static/lottery/407.png'},
		'竞彩篮球':{url:'../../static/lottery/406.png'},
		'胜负过关':{url:'../../static/lottery/404.png'},
		'北京单场':{url:'../../static/lottery/405.png'},
		'双色球':{url:'../../static/lottery/101.png'},
		'大乐透':{url:'../../static/lottery/201.png'},
		'排列三':{url:'../../static/lottery/202.png'},
		'排列五':{url:'../../static/lottery/203.png'},
		'七星彩':{url:'../../static/lottery/204.png'},
		'七乐彩':{url:'../../static/lottery/104.png'},
		'快乐八':{url:'../../static/lottery/105.png'},
		'福彩3D':{url:'../../static/lottery/102.png'},
		'任选九':{url:'../../static/lottery/402.png'},
		'胜负彩':{url:'../../static/lottery/401.png'},
		
	})
	const clickOrderReceiving=()=>{//点击接单回调
		Emits('orderReceiving')
	}
	const clickOrderDetails=()=>{//点击订单详情回调
		Emits('OrderDetails')
	}
	const clickOrder=()=>{//点击空白区域回调
		Emits('clickOrder')
	}
	onBeforeMount(()=>{
		//console.log(Props.order_list);
		//console.log(Props.cooperationValue);
	})
</script>

<style>
	.topBox{
		display:grid;
		border-bottom:2rpx solid #e3e3e3;
		grid-template-columns:110rpx 1fr;
		grid-template-rows:repeat(2,60rpx);
		transition:.2s;
	}
	.topBox:active{
		transition:.2s;
		transform: scale(0.98);
	}
	.bottomStyle{
		 height:80rpx;
		 display: flex;
		 align-items: center;
		 justify-content: space-between;
		 margin: auto;
	}
	.bottm{
		width:200rpx;
		height:50rpx;
		text-align: center;
		color:#FDC830;
		font-weight: bold;
		border:1px solid #FDC830;
		/* background-color: #FDC830; */
		
		border-radius:7rpx;
		font-size:32rpx;
		line-height:50rpx;
		transition:.2s;
	}
	.bottm:active{
		transition:.2s;
		transform: scale(0.9);
	}
	
	.card{
		width:680rpx;
		height:200rpx;
		background-color: white;
		margin:20rpx auto;
		border-radius: 10rpx;
		padding: 0rpx 20rpx;
	
	}

</style>