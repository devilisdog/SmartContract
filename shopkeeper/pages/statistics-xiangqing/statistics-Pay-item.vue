<template>
	<z-paging ref="pay" v-model="payData" @query='payList'>
		<template v-slot:top>
			<view class="status_bar"></view>
			<uni-nav-bar :title="tabs_title" leftIcon="back" @clickLeft="back()" leftText="返回" />
			<view class="topTabsBox">
				<uni-datetime-picker type="daterange" style='margin-left:20rpx;' v-model="dateTime" @change='selectTime'/>
				<text style="color: #ff7979;font-size: 32rpx;font-weight: bold;position:relative;margin-right:20rpx;">
					共￥0.00元
				</text>
			</view>
		</template>
		<uni-list>
			<uni-list-item
				v-for="itme,index in payData"
				:title="itme.user_id.nickname+' | '+itme.memo" 
				:note="getDate.getNowFormatDate(0,itme.create_time)" 
				clickable 
				@click="clickCardIndex=index">
				<template v-slot:footer>
					<text style="color:red;">
						{{'+'+itme.money}}
					</text>
				</template>
			</uni-list-item>
		</uni-list>
	</z-paging>
	<uni-popup ref="messagePopup" type="bottom">
		<view class="popupCard">
			<view style="text-align:center;font-size:52rpx;height:100rpx;">
				<text style="color:red;line-height:100rpx;">
					{{'+'+payData[clickCardIndex].money}}
				</text>
			</view>
			<view style="margin:20rpx;">
				<text style="color:#666666;">来源：</text>
				<text style="padding-left:30rpx;">{{payData[clickCardIndex].user_id.nickname}}</text>
			</view>
			<view style="margin:20rpx;">
				<text style="color:#666666;">时间：</text>
				<text style="padding-left:30rpx;">
					{{getDate.getNowFormatDate(0,payData[clickCardIndex].OrderNumber.create_time)}}
				</text>
			</view>
			<view style="margin:20rpx;">
				<text style="color:#666666;">订单号：</text>
				<text>{{payData[clickCardIndex].OrderNumber}}</text>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import api from "@/common/vmeitime-http/satistics/satistcs.js"
	import {ref,reactive,onBeforeMount,getCurrentInstance,defineProps} from 'vue';
	import getDate from "@/common/getdatetime.js"
	const {proxy,ctx} = getCurrentInstance()
	const Props=defineProps(['title','id','time'])
	const tabs_title=ref('充值详情')//title
	const dateTime=ref([])//默认时间
	const payData=ref([])//list数据
	const clickCardIndex=ref(0)//用户点击的数据index
	const payList=(pageNo, pageSize)=>{
		api.GetPayInfo({
			"source_id":Props.id,
			"startTime":dateTime.value[0],
			"endTime":dateTime.value[1],
			"per_page":20,
			"current_page":pageNo
		}).then(res=>{
			proxy.$refs.pay.complete(res.data.data.data.data)
		})
	}
	const back=()=>{uni.navigateBack()}
	onBeforeMount(()=>{
		if(Props.time){
			dateTime.value=Props.time.split(',')//将接收到的时间转成数组并且复制给dateTime
		}
		tabs_title.value=Props.title
	})
	const selectTime=(e)=>{//时间选择触发
		dateTime.value=e
		proxy.$refs.pay.reload()
	}
</script>

<style lang="scss">
	.popupCard{
		width:100%;
		height:350rpx;
		background-color: white;
		border-top-left-radius:40rpx;
		border-top-right-radius:40rpx;
	}
	.topTabsBox{
		width:100%;
		height: 70rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
	body{
		background-color: #f7f7f7;
	}

</style>
