<template>
	<z-paging ref="invite" v-model="invitData" @query='invitFionch' :refresher-enabled="false">
		<template v-slot:top>
			<view class="navigation">
				<view class="status_bar"></view>
				<view style="height: 100rpx;display: flex;align-items: center;justify-content: center;">
					<uni-icons type="back" style="position: absolute;left: 30rpx;" size="20" @click="back()"></uni-icons>
					<text style="color: #434343 ;font-size: 34rpx;font-weight: bold;">邀请记录</text>
				</view>
			</view>
			<!-- <view style="height: var(--status-bar-height);padding-top:100rpx"></view> -->
		<!-- 	<view class="characteristic">
				<text class="title">合计奖金：</text>
				<text class="title">0元</text>
			</view> -->
			<view class="list">
				<view class="list_one">
					<text class="title_list">今日，销售业绩排行（元）</text>
					<view class="list_content_box">
						<view class="list_card" v-for="itme,index in invitList.market_list">
							<image :src="itme.avatar" class="imageStyle" ></image><br>
							<text>{{itme.money}}</text>
						</view>
						<view class="list_card" v-for="itme,index in (5-invitList.market_list.length)">
							<image src="@/static/img/follow/allUser.png" class="imageStyle"></image><br>
							<text>暂无</text>
						</view>
						<uni-icons type="forward" size="68rpx"></uni-icons>
					</view>
				</view>
				<view class="list_two">
					<text class="title_list">今日，销售邀请排行（人）</text>
					<view class="list_content_box">
						<view class="list_card" v-for="itme,index in invitList.invitList">
							<image :src="itme.avatar" class="imageStyle" ></image><br>
							<text>{{itme.count}}</text>
						</view>
						<view class="list_card" v-for="itme,index in (5-invitList.invitList.length)">
							<image src="@/static/img/follow/allUser.png" class="imageStyle" mode="aspectFit"></image><br>
							<text>暂无</text>
						</view>
						<uni-icons type="forward" size="68rpx"></uni-icons>
					</view>
				</view>
			</view>
			<view class="screen_box">
				<uni-search-bar placeholder="搜索用户昵称" @input="change" v-model="searchValue"></uni-search-bar>
				<view style="display:flex;align-items:center;justify-content: space-between;">
					<view style="margin-left:20rpx;">
						<text>共邀请了:</text>
						<text style="color:red;font-weight: bold;">{{invitData.length}}</text>
						<text>用户</text>
					</view>
					<view style="margin-right:20rpx;" v-show="counter.UserConfig.sale=='1'">
						<text>总金额:</text>
						<text style="color:red;font-weight: bold;">{{allMoney}}</text>
						<text>元</text>
					</view>
				</view>
				<uni-datetime-picker type='range' @change='timeFionch' :border="false" return-type='timestamp' />
			</view>
		</template>
		<view class="card" v-for="itme,index in invitData" @click="openOrderInfo(itme.id)">
			<view class="card_left">
				<image :src="itme.avatar" style="width:100rpx;height:100rpx;border-radius:10rpx;"></image>
				<view style="display: flex;flex-flow: column;margin-left:20rpx;justify-content: space-between;">
					<text class="card_left_nema">
						{{itme.nickname}}
					</text>
					<text style="color: #a8a8a8;font-size:24rpx;">
						邀请时间:{{getTime.getNowFormatDate(1,itme.create_time*1000)}}
					</text>
				</view>
			</view>
			<view style="display: flex;align-items: center;" v-if="counter.UserConfig.sale=='1'">
				<text style="font-size:38rpx;font-weight: bold;color:red;margin-right:10rpx;">{{itme.SumBetMoney}}元</text>
				<text>投注</text>
			</view>
		</view>
	</z-paging>
</template>
<script setup>
	import api from "@/common/vmeitime-http/index.js"
	import getTime from "@/common/getdatetime.js"
	import {ref,reactive,getCurrentInstance,onBeforeMount} from'vue'
	import { useCounterStore } from '@/stores/counter'
	const counter = useCounterStore();//状态管理
	const {proxy,ctx} = getCurrentInstance()
	const invitData=ref([])//邀请用户数据
	const invitList=reactive({
		market_list:[],
		invitList:[]
		
	})//邀请用户榜单数据
	const allMoney=ref(0)
	onBeforeMount(()=>{
		invtiList()
	})
	const searchValue=ref('')
	const change=(e)=>{
		searchValue.value=e
		proxy.$refs.invite.refresh()
	}
	const back = () =>{uni.navigateBack()}
	const timeFionch=(e)=>{
		if(e[0]!=e[1]){
			timeArr.startTime=e[0]
			timeArr.endTime=e[1]
		}else{
			timeArr.startTime=''
			timeArr.endTime=''
		}
		proxy.$refs.invite.refresh()
	}
	const timeArr=reactive({
		'startTime':'',
		'endTime':''
	})
	const openOrderInfo=(userId)=>{
		if(counter.UserConfig.sale!='1'){
			return
		}
		uni.navigateTo({
			url:'../recordPages/recordPages?user_id='+userId
		})
	}
	const invitFionch=(pageNo,pageSize)=>{//获取邀请用户
		 api.getIncvtie({
			"startTime":timeArr.startTime==''?'':Number(timeArr.startTime)/1000,
			"endTime":timeArr.endTime==''?'':Number(timeArr.endTime)/1000,
			'search':searchValue.value,
		}).then(res=>{
			 proxy.$refs.invite.complete(res.data.data.data)
			 allMoney.value=res.data.data.sumMoney
		 }).catch(res=>{
			 proxy.$refs.invite.complete(false)
		 })
	}
	const invtiList=()=>{//获取邀请榜单数据
		api.getIncvtieList({}).then(res=>{
			invitList.market_list=res.data.data.list
			invitList.invitList=res.data.data.list_people
		})
	}
</script>

<style>
	.imageStyle{
		width:80rpx;
		height:80rpx;
		border-radius:10rpx;
	}
	.screen_box{
		background-color: #ffffff;
		margin-top:20rpx;
		border-radius: 0 0 20rpx 20rpx;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		padding-bottom:20rpx;
	}
	
	.list_content_box{
		margin:20rpx 10rpx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.title_list{
		font-size:38rpx;
		font-weight: bold;
	}
	.list{
		width:100%;
		padding:20rpx 10rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		border-radius:0 0 20rpx 20rpx;
	}
	.money{
		font-size:32rpx;
		font-weight: bold;
		color:#ff6060;
	}
	.title{
		font-size:32rpx;
		font-weight: bold;
		background-image: linear-gradient(to right, #ffb199,#ff0844);
		-webkit-background-clip: text;
		color:transparent;
	}
	.card_left_nema{
		font-size:42rpx;
		max-width:300rpx;
		word-break: break-all
	}
	.card_left{
		display: flex;
		font-weight:bold;
	}
	.card{
		width:680rpx;
		padding:20rpx;
		display: flex;
		justify-content: space-between;
		background-color:white;
		border-radius:15rpx;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		margin:20rpx auto;
	}
	body{
		background-color: #fbfbfb;
	}
	.status_bar {
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
	}
	.navigation{
		width: 100%;
		background-color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index:999;
		border-bottom:1rpx solid #f3f3f3;
	}
	.characteristic{
		width:100%;
		background-color:white;
		padding: 20rpx;
		box-sizing: border-box;
		margin: auto;
		display: flex;
		border-bottom: 4rpx solid #f8f8f8 ;
		flex-direction: row;
		align-items: center;
		margin-bottom: 10rpx;
		}.characteristic view{
			font-size: 30rpx;
			color: #a8a8a8;
		}
</style>
