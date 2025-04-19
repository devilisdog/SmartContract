<template>
	<view class="status_bar"></view>
	<uni-nav-bar title="ta的邀请" leftIcon="back" @clickLeft="back" leftText="返回"/>
	<view style="background-color: white;">
		<uni-search-bar @input="inviteValue" placeholder="搜索用户昵称"/>
	</view>
	<view style="background-color: white;padding:20rpx;display: flex;justify-content: space-between;">
		<view style="font-size:26rpx;">
			<text>共邀请了:</text>
			<text style="color: red;font-size:32rpx;font-weight:bold;">{{Props.invitationNumber}}</text>
			<text>个用户</text>
		</view>
		<view>
			<uni-datetime-picker type="daterange" @change='time'></uni-datetime-picker>
		</view>
	</view>
	<view style="padding:20rpx;color:red;text-align: right;">
		<text>投注总金额：{{allMoney.toFixed(2)}}</text>
	</view>
	<view style="background-color: white;">
		<uni-segmented-control :current="pagingValue" :values="pagingData" styleType="text"
			@clickItem="clickPaging" activeColor="#FDC830"/>
		
	</view>
	<view v-show="pagingValue===0">
		<view style="display: flex;justify-content: space-around;padding:20rpx 0rpx;background-color: white;">
			<text>用户名</text>
			<text>注册时间</text>
			<text>详情</text>
		</view>
		<z-paging  ref="InviterRef" v-model="userInviteData" @query='refreshUserRegList' :use-page-scroll="true">
			<view class="userCard" v-for="item,index in userInviteData">
				<view style="display: flex;flex:1;align-items:center;margin-left:20rpx;">
					<image :src="item.avatar" style="width:80rpx;height:80rpx;"></image>
					<view style="margin-left:5rpx;">
						<text>{{item.nickname}}</text><br>
						<text>{{item.mobile}}</text>
					</view>
				</view>
				<view style="flex:1;text-align:center;">
					<text>{{getDate.getNowFormatDate(0,item.create_time)}}</text>
				</view>
				<view style="color:#FDC830;flex:0.95;text-align:center;" @click="orderRecord(item.id)">详情</view>
			</view>
		</z-paging>
	</view>
	
	<view v-show="pagingValue==1">
		<view style="display: flex;justify-content: space-around;padding:20rpx 0rpx;background-color: white;">
			<text>用户名</text>
			<text>投注金额</text>
			<text>详情</text>
		</view>
		<z-paging ref="InviterBatRef" v-model="userInviteBatData" @query='refreshUserBetList' :use-page-scroll="true" :loading-more-enabled="false">
			<view class="userCard" v-for="item,index in userInviteBatData">
				<view style="display: flex;flex:1;align-items:center;margin-left:20rpx;">
					<image :src="item.avatar" style="width:80rpx;height:80rpx;"></image>
					<view style="margin-left:5rpx;">
						<text>{{item.nickname}}</text><br>
						<text>{{item.mobile}}</text>
					</view>
				</view>
				<view style="flex:1;text-align:center;" :style="item.getuserbetmoney_sum>0?'color:red;':''">
					<text>{{item.getuserbetmoney_sum}}元</text>
				</view>
				<view style="color:#FDC830;flex:0.95;text-align:center;" @click="orderRecord(item.id)">详情</view>
			</view>
		</z-paging>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onBeforeMount,
		onMounted,
		getCurrentInstance,
		defineProps,
	} from 'vue';
	import api from '@/common/vmeitime-http/user/user.js'
	import getDate from "@/common/getdatetime.js"
	const {proxy,ctx} = getCurrentInstance()
	const pagingData = reactive(['注册数据', '投注数据'])
	const Props=defineProps(['userID','invitationNumber'])
	const pagingValue = ref(0)
	const InviterRuantity=ref(0)
	const userInviteData = ref([])//注册数据
	const userInviteBatData = ref([])//投注数据
	onBeforeMount(()=>{
		uni.showLoading({title: '加载中~'})
	})
	const refreshUserRegList = (pageNo,pageSize) => {//注册数据刷新
		api.GetInviterList({
			"id":Props.userID,
			"type": "reg",
			"search":searchValue.value,
			"per_page":pageSize,
			"current_page":pageNo,
			"startTime":timeData.value[0],
			"endTime":timeData.value[1],
		}).then((res) => {
			proxy.$refs.InviterRef.complete(res.data.data.data);
			uni.hideLoading()
		}).catch(res=>{
			proxy.$refs.InviterRef.complete(false);
			uni.hideLoading()
		})
	}
	const allMoney=ref(0)
	const refreshUserBetList = (pageNo,pageSize) => {//投注数据刷新
		api.GetInviterList({
			"id":Props.userID,
			"type": "bet",
			"search":searchValue.value,
			"startTime":timeData.value[0],
			"endTime":timeData.value[1],
		}).then((res) => {
			allMoney.value=res.data.data.moneySum
			proxy.$refs.InviterBatRef.complete(res.data.data.data);
			uni.hideLoading()
		}).catch(res=>{
			proxy.$refs.InviterBatRef.complete(false);
			uni.hideLoading()
		})
	}
	
	const searchValue=ref(null)
	const inviteValue=(e)=>{
		searchValue.value=e
		if(pagingValue.value==0){
			proxy.$refs.InviterRef.reload()
		}else{
			proxy.$refs.InviterBatRef.reload()
		}
	}
	const clickPaging = (e) => { //点击分段器内容改变
		if (pagingValue.vlaue != e.currentIndex) {
			pagingValue.value = e.currentIndex
		}
	}
	
	const timeData=ref([])
	const time=(e)=>{
		uni.showLoading({title: '加载中~'})
		timeData.value=e
		if(pagingValue.value==0){
			proxy.$refs.InviterRef.reload()
		}else{
			proxy.$refs.InviterBatRef.reload()
		}
	}
	const back = () => {
		uni.navigateBack();
	}
	const orderRecord=(userID)=>{
		uni.navigateTo({
			url:'/pages/userUupPage/userSupPageSup/userTouzu?user_id='+userID+'&orderState=98',
			animationType:'slide-in-bottom'
		})
	}
</script>

<style>
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
	.userCard {
		width: 100%;
		background-color: white;
		border-top: 1rpx solid #dcdcdc;
		height: 100rpx;
		display: flex;
		align-items: center;
		font-size: 26rpx;

	}

	body {
		background-color: #f7f7f7;
	}
</style>
