<template>
	<view>
		<view class="status_bar"></view>
		<uni-nav-bar title="代理统计"></uni-nav-bar>
		<view class="" style="display: flex;margin-top: 20rpx;">
			<view class="" style="width: 150rpx;">
				
			</view>
			<uni-datetime-picker type="daterange" :border="false"
								:clear-icon="false" v-model="range"  @change='clickTimePicker'
			/>
		</view>
		<view class="resumendatos">
			<view class="resumendatosbox">
				<view class="resumendatosboxtop">
					<text>数据概览</text>
					<text style="font-size: 25rpx;color: gray;">(显示全部代理数据)</text>
				</view>
				<view class="resumendatosboxtbottom">
					<view class="resumendatosboxleft">
						<view class="" style="text-align: center;margin-top: 50rpx;">
							<text style="color: gray;font-size: 30rpx;">代理注册数</text>
						</view>
						<view class=""style="text-align: center;margin-top: 10rpx;">
							<text style="font-size: 30rpx;font-weight: bolder;">{{usernum.total}}人</text>
						</view>
					</view>
					<view class="subsection">
						
					</view>
					<view class="resumendatosboxright">
						<view class="" style="text-align: center;margin-top: 50rpx;">
							<text style="color: gray;font-size: 30rpx;">代理销售额</text>
						</view>
						<view class="" style="text-align: center;margin-top: 10rpx;">
							<text  style="font-size: 30rpx;font-weight: bolder;">{{usernum.agentSaleAmount}}元</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="resumendatosds">
			<view class="resumendatosdiv">
				<view class="resumendatosboxtop">
					<text>代表列表</text>
					<text style="font-size: 25rpx;color: gray;">({{usernum.total}}个)</text>
				</view>
			</view>
		</view>
		<swiper :style="{height:common.scrollH()-650-statusBarHeight+'rpx'}">
			<swiper-item style="height: 100%;">
				<z-paging ref="list" v-model="userData" @query='refresh'  :fixed='false'
				:use-page-scroll="false" :auto-show-back-to-top='true' :back-to-top-bottom='50'>
				<view class="" v-for="item,index in userData" :key="index" @click="userOrder($event,item.user_id)" >
					<view class="" style="display: flex;justify-content: space-between;">
						<view class="listbox">
							<view class="usercabeza">
								<image :src="item.avatar" mode="aspectFit" style="width: 70rpx;height: 70rpx;border-radius: 50%;" ></image>
							</view>
							<view class="username">
								<text>{{item.nickname}}</text>
							</view>
							<view class="usercomision">
								佣金比例{{item.rate}}%
							</view>
						</view>
						<!-- <view class="switch">
							<switch :checked="item.config.sale==1" @click="clickSetSwitch($event,item,index)" color="#FDC830"/>
							<uni-icons type="right" size="30"></uni-icons>
						</view> -->
					</view>
					<view class="listtextbox">
						<view class="dailidiv">
							<view class="dailibox">
							<text>代理时长</text>
							</view>
							<view class="dailitext">
								{{item.registerDays}}天
							</view>
						</view>
						<view class="subsection"></view>
						<view class="dailidiv1">
							<view class="dailibox">
							<text>代理销售额</text>
							</view>
							<view class="dailitext">
								{{item.saleAmount}}
							</view>
						</view>
						<view class="subsection"></view>
						<view class="dailidiv2">
							<view class="dailibox">
							<text>佣金</text>
							</view>
							<view class="dailitext">
								{{item.commissionAmount}}
							</view>
						</view>
					</view>
				</view>
					</z-paging>
			</swiper-item>
		</swiper>

	</view>
</template>

<script setup>
	import {
		onShow
	} from "@dcloudio/uni-app"
	import common from '@/common/common'
	import getdatetime from "@/common/getdatetime.js"
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance
	} from 'vue';
	import api from '@/common/vmeitime-http/user/user.js'
	const {proxy,ctx} = getCurrentInstance()
	var range = reactive([])
	const list = ref(null)
	const flg = ref(false)
	const userData=ref([])
	onShow(() => {
		GetmonthDate()
		if (list.value) {
			list.value.refresh()
			
		}
	})
		const statusBarHeight=ref(0)//状态栏高度
	onBeforeMount(()=>{
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight//获取手机状态栏高度
	})
	const GetmonthDate=()=>{
		var time=new Date()
		const num=time.setDate(1);
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth() + 1; // 月份从0开始，需要加1
		const day = now.getDate();
		range[0]=getdatetime.getNowFormatDate(1,num/1000)
		range[1]=year+'-'+month+'-'+day
	}
	const usernum=reactive({
		"agentSaleAmount":"",
		"total":""
	})
	const refresh = (e, w) => {
		api.Getdaililist({
			"type": 0,
			"per_page":w,
			"current_page":e,
			"endTime":range[1],
			"startTime":range[0]
			}).then((res)=>{
			usernum.agentSaleAmount=res.data.data.agentSaleAmount
			usernum.total=res.data.data.total
			list.value.complete(res.data.data.data)
		}).catch(()=>{
			list.value.complete(false)
		})
	}
	const clickTimePicker = (time) => {
		if (time[0] == time[1]) {
			//转换未yyyy/dd/mm避免ios无法转换时间戳
			var starinit = time[0].split('-')
			var endinit = time[1].split('-')
			var newStarinit = starinit.join('/')
			var newEndinit = endinit.join('/')
			var date_star = new Date(newStarinit)
			var date_end = new Date(newEndinit)
			date_star.setHours(0)
			date_end.setDate(date_end.getDate() + 1)
			date_end.setHours(0)
			range[0] = date_star.getFullYear() + '-' + (date_star.getMonth() + 1) + '-' + date_star.getDate()
			range[1] = date_end.getFullYear() + '-' + (date_end.getMonth() + 1) + '-' + date_end.getDate()
			refresh(1,10)
			return
		}
		// console.log(time)
		range[0] = time[0]
		range[1] = time[1]
			refresh(1,10)
	}
	const nicknameDispose = (nickname, remark) => {
		if (remark != '' && remark != null) {
			return remark + '(昵称：' + nickname + ')'
		} else {
			return nickname
		}
	}
	const clickSetSwitch= async (event,state,index)=>{//底部开关
	event.stopPropagation()
	if(state.config.sale==1){
		userData.value[index].config.sale=0
	}else{
				userData.value[index].config.sale=1
	}
	}
	const userOrder=(event,id)=>{//点击进入用户详细页面并传点击的ID
		uni.navigateTo({
				url:'/pages/userUupPage/userinformation/userinformation?user_id='+id
			})
	}
</script>

<style>
.resumendatos{
/* 	height: 350rpx; */
	background-color: white;
	padding: 40rpx 20rpx;
}
.resumendatosds{
	background-color: white;
	padding: 10rpx 20rpx;
}
.resumendatosbox{
	height:300rpx;
	background-color: white;
	border-radius: 10rpx;
	box-shadow: 0px 0px 19px -5px rgba(0, 0, 0, 0.3);
	}
	.resumendatosboxtop{
		height:70rpx;
		background: linear-gradient(to right, #ffcd58, #ffffff);
		display: flex;
		line-height: 70rpx;
		text-indent: 10rpx;
		border-radius: 10rpx 10rpx 0 0;
		
	}
	.resumendatosboxtop text{
		font-size: 30rpx;
		font-weight: bold;
		
	}
	.resumendatosboxtbottom{
		height: 220rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.resumendatosboxleft{
		width: 330rpx;
		height: 220rpx;
	}
	.lin{
		height: 60rpx;
		border: 5rpx solid #c7c7c7;
	}
	.resumendatosboxright{
		width: 330rpx;
			height: 220rpx;
	}
	.resumendatosdiv{
	}
	.listbox{
		height: 100rpx;
		display:flex;
		padding: 10rpx 26rpx;
		align-items: center;
	}
	.username{
		height: 70rpx;
		line-height: 70rpx;
		margin-left: 15rpx;
	}
	.usercomision{
		height: 60rpx;
		border-radius: 10rpx;
		background-color: rgba(255, 205,88,.3);
		line-height: 60rpx;
		margin-left: 15rpx;
		padding: 5rpx 10rpx;
		color: rgba(185, 149, 64, 0.8);
	}
	.switch{
		display: flex;
		align-items: center;
		z-index: 9999;
	}
	.listtextbox{
		display: flex;
		align-items: center;
		padding: 10rpx 10rpx;
		justify-content:space-evenly;
	}
	.dailibox{
		height: 50rpx;
		text-align: center;
	}
	.dailitext{
		text-align: center;
		font-weight: bolder;
	}
	.subsection{
		width:2rpx;
		height:50rpx;
		background-color: #c7c7c7;
		border-radius:15rpx;
		/* box-shadow: #f3ce6f 0px 0px 2px 0.5px ; */
	}
	/* .dailidiv{
		width: 200rpx;
	}
	.dailidiv1{
		width: 180rpx;
	}
	.dailidiv2{
		width: 100rpx;
	}
	.dailidiv3{
		width: 220rpx;
	} */
	.status_bar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}
</style>
