<template>
	<!-- 导航 -->
	<view class="navigation">
		<view class="status_bar"></view>
		<view style="height: 100rpx;display: flex;align-items: center;justify-content: center;">
			<uni-icons type="back" @click="back()" size="21" style='position: absolute;left: 30rpx;'></uni-icons>
			<text style="color: #484848;font-size: 36rpx;font-weight: bold;">提现记录</text>
			<view style="position: absolute;right: 30rpx;color: #3b3b3b;" @click="proxy.$refs.all.open()">
				<text style="font-size: 30rpx;margin: 0 5rpx;" >全部</text>
				<uni-icons type="bottom"></uni-icons>
			</view>
		</view>
	</view>
	<view style="height: var(--status-bar-height);padding-top: 100rpx"></view>
	<!-- 时间选择 -->
	<view style="margin-bottom: 20rpx;">
		<uni-datetime-picker type="daterange" :border="false" @change='dateFiltrate' />
	</view>
	
	<view style="height: 250rpx;width: 100%;">
		<scroll-view :scroll-y="true" :style="{height:common.scrollH()-240+'rpx'}">
			<z-paging
					ref="paging" 
					v-model="dataList" 
					@query="queryList"
					:fixed='false' 
					:use-page-scroll="false" 
					:auto-show-back-to-top='true'
					:back-to-top-bottom='150'
					>
				<view style="width: 100%;display: flex;justify-content: center;flex-direction: column;align-items: center;">
					<card :dataList='dataList' ref="car" v-if="dataList.length>0"></card>
				</view>
			</z-paging>
		</scroll-view>
	</view>

	<uni-popup ref="all" type="bottom">
		<view class="filtrate">
			<view @click="popupAll(item,index)" v-for="item,index in filtrateData" :key="index" 
				:class="openIndex==index?'filtrate_select_true':'filtrate_select_false'">
				<text >{{item}}</text>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import card from '@/components/home/HomeTopUP/yc-withdrawDeposit-recordCard/yc-withdrawDeposit-recordCard'
	
	import api from '@/common/vmeitime-http/'
	import common from "@/common/common.js"
	import { useCounterStore } from '@/stores/counter'
	const counter = useCounterStore(); //状态管理
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		getCurrentInstance,
		nextTick,
	} from 'vue'
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	
	const startTime = ref()//起始时间
	const endTime = ref()//结束时间
	// 加载列表
	const dataList = ref([])
	const queryList =(pageNo,pageSize)=>{
		api.history({
			'state':filtarteIndex.value,
			'startTime':startTime.value,
			'endTime':endTime.value,
			'per_page':pageSize,
			'current_page':pageNo})
		.then((res)=>{
			proxy.$refs.paging.complete(res.data.data.data)
		}).catch(res=>{
			proxy.$refs.paging.complete(false)
		})
	}
	
	//时间选择筛选  确认时间后触发
	const dateFiltrate = (e) =>{
		startTime.value = e[0]
		endTime.value = e[1]
		proxy.$refs.paging.refresh()
	}
	
	//筛选
	const filtarteIndex = ref(99)
	const openIndex=ref(0)
	const filtrateData = reactive(['全部','处理中','已结算','已撤销'])
	const popupAll = (e,index) =>{
		openIndex.value=index
		if(e=='全部'){
			filtarteIndex.value = 99
		}else if(e == '处理中'){
			filtarteIndex.value = 0
		}else if(e == '已结算'){
			filtarteIndex.value = 1 
		}else if(e == '已撤销'){
			filtarteIndex.value = 2
		}
		proxy.$refs.paging.refresh()
		proxy.$refs.all.close()
	}
	
	
	
	
	const back = () =>{
		uni.navigateBack()
	}
</script>

<style>
	body{
		background-color: #fafafa;
	}
	.status_bar {
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
	}
	
	/* 导航 */
	.navigation{
		width: 100%;
		background-color: white;
		position: fixed;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 1;
		box-shadow: 0 5rpx 15rpx -8rpx #ebebeb;
	}
	
	/* 筛选弹窗 */
	.filtrate{
		width: 100%;
		border-radius:20rpx 20rpx 0 0;
		padding:20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		background-color: white;
	}
	/* .filtrate text{
		color: #393939;
		font-size: 32rpx;
		padding: 20rpx 0;
	} */
	.filtrate_select_true{
		width:680rpx;
		padding:20rpx;
		background-color:#ff7979;
		border-radius:15rpx;
		text-align: center;
		color:white;
	}
	.filtrate_select_false{
		width:680rpx;
		padding:20rpx;
		border-radius:15rpx;
		text-align: center;
	}
</style>
