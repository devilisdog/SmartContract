<template>
	<!-- 内容 -->
	<z-paging ref="pay" v-model="payData" @query='payList' :loading-more-enabled="false">
		<template v-slot:top>
			<view class="status_bar"></view>
			<!-- 头部 -->
			<uni-nav-bar title="充值总金额" leftIcon="back" @clickLeft="back()" leftText="返回" />
			<!-- 日期栏 -->
			<view style="width:100%;height: 70rpx;background-color: #ffffff;padding:0rpx 20rpx;line-height:70rpx;text-align: right;box-sizing: border-box;display: flex;align-items: center;justify-content: space-between;">
				<uni-datetime-picker type="daterange" v-model="dateTime" @change='selectTime'/>
				<text style="color: #ff7979;font-size:26rpx;font-weight: bold;position:relative;margin-right:20rpx;">
					共￥{{allMoney.toFixed(2)}}元
				</text>
			</view>
		</template>
		<view class="payCard" v-for="itme,index in payData" @click="clickCard(itme.id,itme.name)">
			<view class="card_left">
				<image :src="counter.baseUrl+itme.icon"></image>
				<view>{{itme.name}}</view>
			</view>
			<view class="card_right">
				<view>{{itme.count+'条，共'+itme.count_money+'元'}}</view>
				<uni-icons type="forward" size="40rpx"></uni-icons>
			</view>
		</view>
	</z-paging>
</template>

<script setup>
	import api from "@/common/vmeitime-http/satistics/satistcs.js"
	import {useCounterStore} from '@/stores/counter'
	import {ref,reactive,getCurrentInstance,defineProps,onBeforeMount} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	// 返回到上一个页面
	const back = () => {uni.navigateBack()}
	const Props=defineProps(['time'])
	const payData=ref([])//刷新数据
	const allMoney=ref(0)//全部充值金额
	const dateTime=ref([])
	onBeforeMount(()=>{
		if(Props.time){
			dateTime.value=Props.time.split(',')//将接收到的时间转成数组并且复制给dateTime
		}
	})
	const clickCard=(id,name)=>{//点击卡片弹出弹窗
		uni.navigateTo({
			url:'/pages/statistics-xiangqing/statistics-Pay-item?title='+name+'&id='+id+'&time='+dateTime.value
		})
	}
	const selectTime=(e)=>{
		if(e.length>1){
			dateTime.value=e.split(',')
		}else{
			dateTime.value=[]
		}
		proxy.$refs.pay.reload()
	}
	const payList=(pageNo,pageSize)=>{
		allMoney.value=0
		api.GetRechargeDetails({"startTime":dateTime.value[0],"endTime":dateTime.value[1],}).then((res)=>{
			proxy.$refs.pay.complete(res.data.data)
			getAllMoney(res.data.data)
		})
	}
	const getAllMoney=(data)=>{
		data.forEach(function(itme,index){
			allMoney.value+=itme.count_money
		})
	}

</script>

<style lang="scss">
	.payCard{
		width:100%;
		padding:20rpx;
		background-color:white;
		box-sizing: border-box;
		border-top:1rpx solid #f0f0f0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.card_right{
			display: flex;
			align-items: center;
		}
		.card_left{
			display: flex;
			align-items: center;
			image{
				width:100rpx;
				height:100rpx;
				margin-right:10rpx;
			}
		}
	}
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
	body{
		background-color: #f7f7f7;
	}
	.deta-text{
		 width: 150rpx;
		 height: 50rpx;
		 background-color: #f0f0f0;
		 border-radius: 15rpx;
		 margin: 0 20rpx;
		 display: flex;
		 justify-content: center;
		 align-items: center;
	}
</style>
