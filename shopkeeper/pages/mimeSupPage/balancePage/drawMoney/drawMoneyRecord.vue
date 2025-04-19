<template>
	<z-paging ref="order" v-model="orderData" @query='orderList'>
		<template v-slot:top>
			<view class="status_bar"></view>
			<uni-nav-bar 
				title="提现记录" 
				leftIcon="back" 
				@clickLeft="back" 
				rightText="筛选" 
				leftText="返回" 
				@clickRight="open"
			/>
			<view class="timeBox">
				<view style="width:390rpx;">
					<uni-datetime-picker  @change='timeSet' type="daterange"/>
				</view>
			</view>
		</template>
		<view class="orderCard" v-for="itme,index in orderData">
			<view style="display: flex;justify-content: space-between;">
				<view style="display: flex;align-items: center;">
					<image 
						:src="itme.memo=='银行卡'?'/static/icon/mide/yhk_02.png':'/static/img/mimeImg/zfb.png'" 
						style="width:60rpx;height:60rpx;" 
					/>
					<text style="margin:0rpx 10rpx;font-weight:bold;font-size:38rpx;">
						{{itme.memo=='银行卡'?'银行卡提现':'支付宝提现'}}
					</text>
					<text class="tga" 
						:style="itme.state==0?'background-color:#4b93ff;'
						:itme.state==1?'background-color:#FDC830;'
						:'background-color:red;'"
					>
						{{itme.state==0?'处理中':itme.state==1?'成功结算':'拒绝提现'}}
					</text>
				</view>
				<text style="color:red;font-weight:bold;">-{{itme.money}}</text>
			</view>
			<view style="font-size:26rpx;color: #989898;line-height:45rpx;">
				<text>备注：{{itme.memo}}</text><br>
				<text>时间：{{gateDate.getNowFormatDate(0,itme.create_time)}}</text><br>
				<text>订单号：{{itme.OrderNumber}}</text><br>
				<text v-show="itme.state=='2'">拒绝理由：{{itme.retMemo}}</text>
				
			</view>
		</view>
	</z-paging>
	
	
	
	<uni-popup ref="bottomCard" type="bottom">
		<view class="popupCard">
			<view 
				class="popupButton" 
				v-for="itme,index in popupButtonArr"
				@click="clickButton(index)"
				:style="clickButtonValue==index?'background-color:#ebebeb;':''"
			>
				{{itme}}
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import gateDate from "@/common/getdatetime.js"
	import api from "@/common/vmeitime-http/mine/mine.js"
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		defineProps,
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const clickButtonValue=ref(0)
	const orderData=ref([])
	const back=()=>{
		uni.navigateBack()
	}
	const timeData=ref([])
	const popupButtonArr=reactive(['全部','成功','失败'])
	const open=()=>{
		proxy.$refs.bottomCard.open()
	}
	const orderList=async(pageNo,pageSize)=>{
		await api.GetDrawMoneyHistory({
			"state":clickButtonValue.value==0?'99':clickButtonValue.value,
			"startTime":timeData.value[0]==undefined?"":timeData.value[0],
			"endTime":timeData.value[1]==undefined?"":timeData.value[1],
			"per_page":pageSize,
			"current_page":pageNo
		}).then((res)=>{
			proxy.$refs.order.complete(res.data.data.data)
		}).catch((res)=>{
			proxy.$refs.order.complete(false)
		})
		await uni.hideLoading()
	}
	const clickButton=(index)=>{
		if(clickButtonValue.value!=index){
			uni.showLoading({
				title:'加载中~'
			})
			clickButtonValue.value=index
			proxy.$refs.bottomCard.close()
			proxy.$refs.order.reload()
		}
	}
	const timeSet=(e)=>{
		uni.showLoading({
			title:'加载中~'
		})
		timeData.value=e
		proxy.$refs.order.reload()
	}
</script>

<style>
	.timeBox{
		background-color: white;
		padding:10rpx 0rpx;
		border-top:1rpx solid #dfdfdf;
		display: flex;
		justify-content: center;
	}
	.tga{
		padding:5rpx 20rpx;
		
		border-radius:15rpx;
		font-size:26rpx;
		color:white;
		font-weight: bold;
	}
	.orderCard{
		width:680rpx;
		padding:20rpx;
		margin:15rpx auto;
		background-color: white;
		border-radius:15rpx;
	}
	.popupButton{
		width:100%;
		height:80rpx;
		text-align: center;
		line-height:80rpx;
		margin:15rpx 0rpx;
		/* transition: 0.1s; */
	}
	.popupCard{
		width:100%;
		padding:5rpx 0rpx;
		background-color: white;
		border-radius:20rpx 20rpx 0rpx 0rpx;
	}
	body{
		background-color: #f3f3f3;
	}
	.status_bar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}
</style>
