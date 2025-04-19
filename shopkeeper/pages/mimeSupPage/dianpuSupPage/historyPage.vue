<template>
	<z-paging ref="historyOrder" v-model="historyOrderData" @query='historyRefresh'>
		<template v-slot:top>
			<view class="status_bar"></view>
			<uni-nav-bar title="历史记录" leftIcon="back" @clickLeft="back" rightText="筛选" @clickRight="open()" leftText="返回"/>
			<view style="background-color: white;">
				<uni-search-bar @input="search" placeholder="通过订单ID搜索"></uni-search-bar>
			</view>
		</template>
		
		<yc-mime-orderCard v-for="itme,index in historyOrderData" :order_list='itme' />
	</z-paging>
	<uni-popup ref="popup" type="right">
		<!-- 弹窗 -->
		<yc-all-Sizer @confirm='screen' :lastTimeData='lastTimeData' />
	</uni-popup>
</template>

<script setup>
	import common from '@/common/common'
	import getDate from "@/common/getdatetime.js"
	import api from "@/common/vmeitime-http/mine/mine.js"
	import {useCounterStore} from '@/stores/counter'
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		//defineEmits,//发送数据
		defineProps,//接收数据
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const historyOrderData=ref([])
	const Props=defineProps(['pageIndex','shop_id'])
	const counter = useCounterStore(); //状态管理
	const lastTimeData=ref({
		'彩种':{
			title:'全部订单',
			index:0
		},
		'时间':[],
		'状态':{
			title:'全部订单',
			index:0
		}
	})
	
	onBeforeMount(()=>{
		lastTimeData.value['时间'][0]=oneMonth()//计算一个月后的日期
		lastTimeData.value['时间'][1]=getDate.getNowFormatDate(1,(new Date().getTime()+86400000)/1000)//拿到今天的时间
	})
	const oneMonth =(time)=>{//计算一个月前的日期方法
		let myDate = new Date();//获取当前时间
		myDate.setMonth(myDate.getMonth()-1)
		myDate.setHours('00')
		myDate.setMinutes('00')
		myDate.setSeconds('00')
		return getDate.getNowFormatDate(1,myDate.getTime()/1000)
	}
	const screen=(screenArr)=>{
		uni.showLoading({title:'加载中~'})
		lastTimeData.value['彩种'].index=screenArr['彩种'].index
		lastTimeData.value['彩种'].title=screenArr['彩种'].title
		lastTimeData.value['状态'].index=screenArr['状态'].index
		lastTimeData.value['状态'].title=screenArr['状态'].title
		proxy.$refs.popup.close()
		proxy.$refs.historyOrder.reload()
	}
	const searchData=ref("")
	const search=(e)=>{//搜索
		searchData.value=e
		proxy.$refs.historyOrder.reload()
	}
	const historyRefresh=(pageNo,pageSize)=>{
		api.GetHistory({
			"shop_id":Props.shop_id,
			"type":Props.pageIndex+1,
			"search":searchData.value,
			"state":lastTimeData.value['状态'].index==0?'99':lastTimeData.value['状态'].index,
			"gametype":lastTimeData.value['彩种'].index==0?'99':lastTimeData.value['彩种'].index-1,
			"startTime":lastTimeData.value['时间'][0],
			"endTime":lastTimeData.value['时间'][1],
			"per_page":pageSize,
			"current_page":pageNo
		}).then((res)=>{
			proxy.$refs.historyOrder.complete(res.data.data.data)
			uni.hideLoading()
		}).catch(res=>{
			proxy.$refs.historyOrder.complete(false)
			uni.hideLoading()
		})
	}
	onBeforeMount(() => { //生命周期
		uni.showLoading({title:'加载中~'})
	})

	const back=()=>{
		uni.navigateBack()
	}
	const open = () => { //弹窗控制(开)
		proxy.$refs.popup.open()
	}
	const close = () => { //弹窗的控制(关)
		proxy.$refs.popup.close()
	}
</script>

<style>
	.bottmStyle {
		display: flex;
		align-items: flex-end;
		height: 330rpx;
		width: 580rpx;
		margin: auto;
		justify-content: space-between;
	}
	.caibottom {
		width: 175rpx;
		height: 55rpx;
		font-size: 22rpx;
		display: flex;
		justify-content: center;
		margin: 7.5rpx 7.5rpx;
		border-radius: 7rpx;
	}
	.caibuttom {
		width: 175rpx;
		height: 55rpx;
		font-size: 22rpx;
		display: flex;
		justify-content: center;
		margin: 7.5rpx 7.5rpx;
		border-radius: 7rpx;
	
	}
	body{
		background-color: #f3f3f3;
	}
	.popup {
		width: 600rpx;
		height: 100%;
		background-color: white;
		border-top-left-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
		padding: 20rpx 10rpx;
	}
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
