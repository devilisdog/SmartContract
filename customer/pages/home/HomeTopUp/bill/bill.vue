<template>
	<!-- 导航 -->
	<view class="navigation">
		<view class="statusBar"></view>
		<view class="taber">
			<uni-icons type="back" @click="back()" size="19" style="text-align: left;flex:1;"></uni-icons>
			<text style="color: #484848;font-size: 34rpx;text-align: center;flex:1;">账户明细</text>
			<view style="width:80rpx;text-align: right;flex:1;">
				<uni-datetime-picker
					type='daterange' 
					returnType="string"
					@change='pickerChange'
					:clearIcon="true" >
						筛选
				</uni-datetime-picker>
			</view>
		</view>
	</view>
	<!-- <view style="height: var(--status-bar-height);padding-top: 100rpx"></view> -->
	
	<!-- 分段条 -->
	<scroll-view scroll-x="true" class="navigations" style="border-bottom: 1rpx solid #fafafa ;">
		<view style="display: flex;">
			<view v-for="itme,index in tita" :key="index" @click="dianji_qiehuan(index)" style="margin: auto;">
				<view class="box" :style="index==daohang_value?'color:#f04b49;':''">{{itme}}</view>
			</view>
			<view class="xiabiao"
				:style="daohang_value==1 ? 'left:145rpx;' : false
						|| daohang_value==2 ? 'left:270rpx;' : false 
						|| daohang_value==3 ? 'left:390rpx;' : false
						|| daohang_value==4 ? 'left:520rpx;' : false 
						|| daohang_value==5 ? 'left:645rpx;' : false">
			</view>
		</view>
	</scroll-view>
	<!-- 内容 -->
	<swiper 
		@change="onChangeTab" 
		:current="daohang_value" 
		:style="{height:common.scrollH()-209-statusBarHeight+'rpx'}" 
		easing-function="linear" 
		duration="300">
		<swiper-item  v-for="itme,index in tita" style="height:100%;"><!-- 内容1 -->
			<itmeContent 
				:tabIndex='index' 
				:currentIndex='daohang_value' 
				:user_id ='counter.user_id' 
				:starTime='starTimeValue'
				:endTiem ='endTimeValue'
				ref='childRef'
				/>
		</swiper-item>
	</swiper>
</template>

<script setup>
	import itmeContent from '@/components/home/yc-swiper-itmeContent/yc-swiper-itmeContent.vue'
	import common from '@/common/common'
	import { useCounterStore } from '@/stores/counter'
	const counter = useCounterStore(); //状态管理
	import {ref,onBeforeMount,reactive,getCurrentInstance,defineProps} from 'vue';
	import {onShow} from "@dcloudio/uni-app"
	const {proxy,ctx} = getCurrentInstance()
	onBeforeMount(()=>{
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight//获取手机状态栏高度
	})
	const daohang_value = ref(0)
	const statusBarHeight=ref(0)
	const tita = reactive(['投注', '充值','系统','奖金','佣金','提现']) //分段器title数据
	const dianji_qiehuan = (index) => { //点击切换导航
		if (daohang_value == index) {
			return
		} else {
			daohang_value.value = index
			starTimeValue.value=''
			endTimeValue.value=''
		}
	}
	const onChangeTab = (e) => { //滑动导航栏跟随
		dianji_qiehuan(e.detail.current)
		starTimeValue.value=''
		endTimeValue.value=''
	}
	
	const starTimeValue =ref('')
	const endTimeValue=ref('')
	//选择日期 确认后触发
	//*****这个用来接收ref子组件暴露的方法
	const childRef=ref(null)
	const pickerChange = (e) =>{
		starTimeValue.value=e[0]
		endTimeValue.value=e[1]
	//*****这个用来调用子组件暴露的方法
		setTimeout(()=>{
			childRef.value[daohang_value.value].clickTimePicker()
		},300)
	}
	const back=()=>{
		uni.navigateBack()
	}
</script>

<style>
	.taber{
		height: 100rpx;
		width:100%;
		display: flex;
		align-items: center;
		justify-content:space-between;
		background-color: #fff;
		padding:0rpx 20rpx;
		box-sizing: border-box;
	}
	body {
		background-color: #f7f7f7;
	}
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
	}
	/* 导航 */
	.navigation{
		width: 100%;
		background-color: white;
		box-shadow: 0 5rpx 15rpx -8rpx #ebebeb;
		/* position: fixed; */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 1;
	}
	
	.popupStyle{
		width:100%;
		height:400rpx;
		background-color: white;
		border-top-left-radius:30rpx;
		border-top-right-radius:30rpx;
	}
	.navigations {
		width: 100%;
		height: 80rpx;
		background-color: #fff;
	}
	.box {
		width: 105rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		transition: .1s;
		margin:0rpx 10rpx;
	}
	.xiabiao {
		position: absolute;
		width: 90rpx;
		height: 7rpx;
		background-color: #fdb358;
		/* z-index: -1; */
		border-radius: 50rpx;
		top: 73rpx;
		left: 15rpx;
		transition: .1s;
	}

</style>