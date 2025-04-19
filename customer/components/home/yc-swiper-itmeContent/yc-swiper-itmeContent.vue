<template>
	<z-paging ref="cardRef" v-model="orderCardData" @query='clickOrder' :auto='Props.tabIndex==0?true:false' :fixed="false">
		<template v-slot:top>
			<view class="tgaStyle">
				<text style="font-size: 34rpx;color: #626262 ;">统计：</text>
				<text style="font-weight: bold;	background: linear-gradient(45deg, #ffad92, #ff7979);-webkit-background-clip: text;color: transparent;font-size: 36rpx;">
					￥{{statisticsValue/100}}
				</text>
			</view>
		</template>
		<uni-list>
			<uni-list-item 
				:title="titleData[itme.type]+' | '+itme.memo+'('+itme.source+')'" 
				:note="getdatetime.getNowFormatDate(0,itme.create_time*1000)" 
				clickable v-for="itme,index in orderCardData"
				@click="clickCard(itme,index)">
				<template v-slot:footer>
					<text :style="Number(itme.before)<Number(itme.after)?'color:red;':''">
						{{itme.money}}
					</text>
				</template>
			</uni-list-item>
		</uni-list>
	</z-paging>
	
	<uni-popup ref="messagePopup" type="bottom">
		<view class="popupCard">
			<view style="text-align:center;height:100rpx;font-weight:bold;">
				<text :style="Number(clickPopupData.data.before)<Number(clickPopupData.data.after)?'color:red;':''" style="line-height:100rpx;font-size:42rpx;">
					{{clickPopupData.data.money}}
				</text>
			</view>
			<view style="margin:20rpx;">
				<text style="color:#666666;">来源：</text>
				<text style="padding-left:30rpx;">
					{{clickPopupData.data.source}}
				</text>
			</view>
			<view style="margin:20rpx;">
				<text style="color:#666666;">时间：</text>
				<text style="padding-left:30rpx;">
					{{getdatetime.getNowFormatDate(0,clickPopupData.data.createt_ime)}}
				</text>
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
	import api from '@/common/vmeitime-http/'
	import getdatetime from "@/common/getdatetime.js"
	import {onShow} from "@dcloudio/uni-app"
	import {ref,reactive,getCurrentInstance,onBeforeMount,defineProps,watch} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const Props=defineProps(['tabIndex','currentIndex','user_id','starTime','endTiem'])
	const orderCardData=ref([])
	const whetherLoad=ref(false)
	const statisticsValue=ref(0)
	const clickOrder=(pageNo,pageSize)=>{
		api.GetHomeDetail({
			"id":Props.user_id,
			"type":Props.tabIndex,
			"startTime":starTimeValue.value,
			"endTime":endTimeValue.value,
			"per_page":pageSize+5,
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
	const pageIndex=ref(Props.currentIndex)
	
	//日期的值 用来筛选
	const starTimeValue =ref('')
	const endTimeValue=ref('')
	const clickTimePicker=()=>{
		starTimeValue.value=Props.starTime
		endTimeValue.value=Props.endTiem
		proxy.$refs.cardRef.reload()
	}
	//*****暴露子组件方法 用以父组件调用 
	defineExpose({clickTimePicker})
	
	const clickPopupData=reactive([])
	const clickCard=(itme,index)=>{
		clickPopupData.data=itme
		proxy.$refs.messagePopup.open()
	}
	watch(()=>Props.currentIndex,(newValue,oldValue)=>{
		if(newValue===Props.tabIndex){
			if(!whetherLoad.value){
				uni.showLoading({title: '加载中~'});
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
		display: flex;
		align-items: center;
		margin-left:30rpx;
		padding: 18rpx 0;
		color:#fdb358;
	}
</style>