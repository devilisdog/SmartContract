<template>
	<view class="statusBar"></view>
	<uni-nav-bar leftIcon="closeempty" @clickLeft="back()" title="下单记录">
	
		<template v-slot:right>
			<uni-datetime-picker @change='clickTime' type="daterange" @maskClick='mask'>选择时间</uni-datetime-picker>
		</template>
		
	</uni-nav-bar>
	<!-- 分段条 -->
	<scroll-view scroll-x="true" class="navigation">
		<view style="display: flex;">
			<view v-for="itme,index in tita" :key="index" @click="dianji_qiehuan(index)" style="margin: auto;">
				<view class="box" :style="index==daohang_value?'color:#FDC830;':''">{{itme}}</view>
			</view>
			<view class="xiabiao" :style="daohang_value==1 ? 'left:515rpx;' : false">
			</view>
		</view>
	</scroll-view>
	<!-- 内容 -->
	<swiper 
		@change="onChangeTab" 
		:current="daohang_value" 
		:style="{height:common.scrollH()-209-statusBarHeight+'rpx'}"
		duration="300">
		<swiper-item style="display: flex;"><!-- 内容1 -->
			<z-paging 
				@query='refreshCommonOrder' 
				ref="commonOrder" 
				v-model="commonOrderData" 
				:fixed='false' 
				:use-page-scroll="false"
				:auto-show-back-to-top='true' 
				:back-to-top-bottom='40'>
				<view class="orderCard" v-for="itme,index in commonOrderData" @click="clickOrderCard(itme,index)">
					<view style="display: flex;align-items: center;justify-content:space-between;">
						<view style="display: flex;align-items: center;">
							<image :src="common.findImg(itme.Type)" style="width:40rpx;height:40rpx;" />
							<text style="margin-left:10rpx;">{{itme.Type}}</text>
						</view>
						<!-- <text style="font-size: 26rpx;color:#686868;">未中奖</text> -->
						<view>
							<view class="label" v-if="itme.State==10">
								<text>{{common.orderState(itme.State)}}</text>
							</view>
							<text style="font-size:26rpx;color:#7d7d7d;" v-else-if="itme.State!=10">
								{{common.orderState(itme.State)}}
							</text>
						</view>
					</view>
					<view style="display: flex;flex-flow: column;font-size: 26rpx;color: #686868;margin-top:20rpx;">
						<text style="padding-bottom:10rpx;">订单号：{{itme.order_id}}</text>
						<text style="padding-bottom:10rpx;">
							下单时间：{{getdatetime.getNowFormatDate(0,itme.PayTime)}}
						</text>
						<text>投注金额：{{itme.BetMoney}}元</text>
					</view>
				</view>
			</z-paging>
		</swiper-item>
		<swiper-item style="display: flex;"><!-- 内容2 -->
			<z-paging 
				@query='refreshHemaiOrder' 
				ref="hemaiOrder" 
				v-model="hemaiData" 
				:fixed='false' 
				:use-page-scroll="false"
				:auto-show-back-to-top='true' 
				:back-to-top-bottom='40'>
				<view class="orderCard" v-for="itme,index in hemaiData" @click="clickOrderCard(itme,index)">
					<view style="display: flex;align-items: center;justify-content:space-between;">
						<view style="display: flex;align-items: center;">
							<image :src="common.findImg(itme.Type)" style="width:40rpx;height:40rpx;" />
							<text style="margin-left: 10rpx;">{{itme.Type}}</text>
						</view>
						<view>
							<view class="label" v-if="itme.State==10">
								<text>{{common.orderState(itme.State)}}</text>
							</view>
							<text style="font-size:26rpx;color:#7d7d7d;" v-else-if="itme.State!=10">
								{{common.orderState(itme.State)}}
							</text>
						</view>
					</view>
					<view style="display: flex;flex-flow: column;font-size: 26rpx;color: #686868;margin-top:20rpx;">
						<text style="padding-bottom:10rpx;">订单号：{{itme.order_id}}</text>
						<text style="padding-bottom:10rpx;">
							下单时间：{{getdatetime.getNowFormatDate(0,itme.PayTime)}}
						</text>
						<text>投注金额：{{itme.BetMoney}}元</text>
					</view>
				</view>
			</z-paging>
		</swiper-item>
		
	</swiper>
</template>

<script setup>
	import common from '@/common/common'
	import api from '@/common/vmeitime-http/user/user.js'
	import getdatetime from "@/common/getdatetime.js"
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		defineProps,//接收数据
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	import {useCounterStore} from '@/stores/counter'
	const counter = useCounterStore(); //状态管理
	const Props=defineProps([
		'user_id',//接收用户id（必要参数）
		'orderState'//接收需要请求的订单state值（99=全部订单/98=不显示未出票的订单）
	])
	
	const commonOrderData=ref([])
	const hemaiData=ref([])
	const statusBarHeight=ref(0)
	onBeforeMount(()=>{
		uni.showLoading({title:'加载中~'})
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight//获取手机状态栏高度
	})
	const refreshCommonOrder=(pageNo,pageSize )=>{
		api.GetuserBetRecord({
			"id":Props.user_id,
			"type":"0",
			"per_page":pageSize,
			"current_page":pageNo,
			"state":Props.orderState,
			"startTime":ScreenTime.value[0],
			"endTime":ScreenTime.value[1],
			}).then((res)=>{
				proxy.$refs.commonOrder.complete(res.data.data.data)
				uni.hideLoading()
		}).catch(res=>{
			proxy.$refs.commonOrder.complete(false)
			uni.hideLoading()
		})
	}
	const refreshHemaiOrder=(pageNo,pageSize)=>{
		api.GetuserBetRecord({
			"id":Props.user_id,
			"type":"1",
			"per_page":pageSize,
			"current_page":pageNo,
			"state":Props.orderState,
			"startTime":ScreenTime.value[0],
			"endTime":ScreenTime.value[1],
			}).then((res)=>{
				proxy.$refs.hemaiOrder.complete(res.data.data.data)
				uni.hideLoading()
		}).catch(res=>{
			proxy.$refs.hemaiOrder.complete(false)
			uni.hideLoading()
		})
	}
	const clickOrderCard=(data,index)=>{
		counter.orderData=data
		uni.navigateTo({
			url:'/pages/indexSupPages/indexSupPages',
			animationType: "slide-in-bottom",
		})
	}
	const mask=(e)=>{
		console.log('12312312');
	}
	const ScreenTime=ref([])//日期选择的值
	const clickTime=(e)=>{//日期选择器确定后触发
		console.log(e);
		uni.showLoading({title:'加载中~'})
		ScreenTime.value=e
		if(daohang_value.value==0){
			proxy.$refs.commonOrder.reload()
		}else{
			proxy.$refs.hemaiOrder.reload()
		}
	}
	const back=()=>{
		uni.navigateBack()
	}
	const daohang_value = ref(0)
	const dianji_qiehuan = (index) => { //点击切换导航
		if (daohang_value == index) {
			return
		} else {
			daohang_value.value = index
		}
	}
	const onChangeTab = (e) => { //滑动导航栏跟随
		dianji_qiehuan(e.detail.current)
	}
	const tita = reactive(['普通', '合买']) //分段器title数据
	
</script>


<style>
	.label{
		width:90rpx;
		height:40rpx;
		background: linear-gradient(to top, #ff0000, #ffaeae);
		border-top-left-radius:15rpx;
		border-bottom-right-radius:15rpx;
		font-size:24rpx;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.orderCard{
		width:680rpx;
		height:200rpx;
		background-color: white;
		padding:20rpx;
		margin:15rpx auto;
		border-radius:10rpx;
	}
	.orderCard:active{
		transition:.2s;
		transform: scale(0.95);
	}
	.navigation {
		width: 100%;
		height: 80rpx;
		background-color: #fff;
	}
	.box {
		width: 186rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		transition: .3s;
	}
	.xiabiao {
		position: absolute;
		width: 90rpx;
		height: 7rpx;
		background-color: #FDC830;
		/* z-index: -1; */
		border-radius: 50rpx;
		top: 73rpx;
		left: 140rpx;
		transition: .3s;
	}
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
	}
	body {
		background-color: #f1f1f1;
	}
</style>
