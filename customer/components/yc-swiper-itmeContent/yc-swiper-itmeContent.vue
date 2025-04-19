<template>
	<z-paging ref="cardRef" v-model="orderCardData" @query='clickOrder' :auto='Props.tabIndex==0?true:false' :fixed="false">
		<template v-slot:top>
			<view style="width:100%;display: flex;justify-content: center;background-color: white;">
				<uni-datetime-picker
					type="daterange"  
					ref="time"
					returnType="timestamp"
					@change='clickTimePicker'
					:clearIcon="true">
				</uni-datetime-picker>
			</view>
			<view class="tgaStyle">
				<text>统计：￥{{(statisticsValue/100).toFixed(2)}}</text>
			</view>
		</template>
		<uni-list>
			<uni-list-item 
				:title="titleData[itme.type]+' | '+itme.memo+'('+itme.source+')'" 
				:note="getdatetime.getNowFormatDate(0,itme.create_time*1000)" 
				clickable v-for="itme,index in orderCardData"
				@click="clickCard(itme,index)">
				<template v-slot:footer>
					<text :style="itme.money>0?'color:red;':''">
						{{itme.money>0?'+'+itme.money:itme.money}}
					</text>
				</template>
			</uni-list-item>
		</uni-list>
	</z-paging>
	
	<uni-popup ref="messagePopup" type="bottom">
		<view class="popupCard">
			<view style="text-align:center;font-size:52rpx;height:100rpx;">
				<text :style="clickPopupData.data.after>clickPopupData.data.before?'color:red;':''" style="line-height:100rpx;">
					{{clickPopupData.data.after>clickPopupData.data.before?'+'+clickPopupData.data.money:clickPopupData.data.money}}
				</text>
			</view>
			<view style="margin:20rpx;">
				<text style="color:#666666;">来源：</text>
				<text style="padding-left:30rpx;"> {{clickPopupData.data.source}}</text>
			</view>
			<view style="margin:20rpx;">
				<text style="color:#666666;">时间：</text>
				<text style="padding-left:30rpx;"> {{getdatetime.getNowFormatDate(0,clickPopupData.data.create_time*1000)}}</text>
			</view>
			<view style="margin:20rpx;">
				<text style="color:#666666;">订单号：</text>
				<text>{{clickPopupData.data.OrderNumber}}</text>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import common from '@/common/common'
	import api from '@/common/vmeitime-http/index.js'
	import getdatetime from "@/common/getdatetime.js"
	import {onShow} from "@dcloudio/uni-app"
	import {
		ref,
		reactive,
		getCurrentInstance,
		onBeforeMount,
		defineEmits,
		defineProps,
		watch,
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const orderCardData=ref([])
	const whetherLoad=ref(false)
	const statisticsValue=ref(0)
	const clickOrder=(pageNo,pageSize)=>{
		api.getUserdailiyong({
			"id":Props.user_id,
			"type":Props.tabIndex,
			"startTime":starTimeValue.value,
			"endTime":endTimeValue.value,
			"per_page":pageSize,
			"current_page":pageNo,
		}).then((res)=>{
			whetherLoad.value=true
			uni.hideLoading();
			statisticsValue.value=res.data.data.Statistics
			proxy.$refs.cardRef.complete(res.data.data.list.data)
		}).catch(res=>{
			uni.hideLoading();
			proxy.$refs.cardRef.complete(false)
			
		})
	}
	const titleData=reactive(['投注','充值','系统','奖金','佣金','提现'])
	const Props=defineProps(['tabIndex','currentIndex','user_id'])
	const pageIndex=ref(Props.currentIndex)
	
	const starTimeValue =ref('')
	const endTimeValue=ref('')
	const clickTimePicker=(e)=>{
		starTimeValue.value=e[0]
		endTimeValue.value=e[1]
		proxy.$refs.cardRef.reload()
	}
	const clickPopupData=reactive([])
	const clickCard=(itme,index)=>{
		clickPopupData.data=itme
		proxy.$refs.messagePopup.open()
	}
	watch(()=>Props.currentIndex,(newValue,oldValue)=>{
		if(newValue===Props.tabIndex){
			if(!whetherLoad.value){
				uni.showLoading({
					title: '加载中~'
				});
				proxy.$refs.cardRef.reload()
				
			}
			
		}
	})
</script>

<style>
	.popupCard{
		width:100%;
		height:350rpx;
		background-color: white;
		border-top-left-radius:40rpx;
		border-top-right-radius:40rpx;
	}
	.tgaStyle{
		height:50rpx;
		font-size: 26rpx;
		display: flex;
		align-items: center;
		margin-left:20rpx;
		color:#519a67;
	}
</style>