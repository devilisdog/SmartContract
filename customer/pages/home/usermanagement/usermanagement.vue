<template>
	<view>
		<view class="statusBar"></view>
		<uni-nav-bar title="用户管理" leftIcon="back" @clickLeft="back()" backgroundColor="#A6A6A6" color="#ffffff"
			leftText="返回" border="false" />
		<view class="usertop">
			<view class="">
				<view class="usertopimg">
					<view class="usertoptx">
						<image :src="counter.user_imgs" mode=""
							style="width: 100rpx;height: 100rpx;border-radius: 50%;"></image>
					</view>
					<view class="usertopname" style="margin-top: 15rpx;">
						<text>{{counter.nickname}}</text>
					</view>
				</view>
				<view class="usermoney">
					<view class="usermoneynum">
						{{userlist.commissionFreezeAmount}}
					</view>
					<view class="usermoneytext">
						当前冻结佣金
					</view>
				</view>
				<view class="usernum">
					<view class="usercaizhong">
						<view class="">
							累计购彩总额
						</view>
						<view class="">
							{{userlist.saleTotalAmount}}
						</view>
					</view>
					<view class="useryongzhong">
						<view class="">
							累计佣金总额
						</view>
						<view class="">
							{{userlist.commissionTotalAmount}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	<view class="userlist">

		<view class="set_content_itme" @click="openPage(0)" style="background-color: #ff6153;">
			<view class="set_content_itmetext">
				<text>本月销售累计 ></text>
			</view>
			<view class="set_content_itmenum">
				{{userlist.saleMonthAmount}}
			</view>
		</view>
		<view class="set_content_itme" @click="openPage(1)" style="background-color: #ff6153;">
			<view class="set_content_itmetext">
				<text>本月注册人数 ></text>
			</view>
			<view class="set_content_itmenum">
				<text>{{userlist.monthRegisterNums}}</text>
			</view>
		</view>
		<view class="set_content_itme" @click="openPage(2)" style="background-color: #ff6153;">
			<view class="set_content_itmetext">
				<text>今日销售累计 ></text>
			</view>
			<view class="set_content_itmenum">
				<text>{{userlist.saleTodayAmount}}</text>
			</view>
		</view>
		<view class="set_content_itme" @click="openPage(3)" style="background-color: #ff6153;">
			<view class="set_content_itmetext">
				<text>今日注册人数 ></text>
			</view>
			<view class="set_content_itmenum">
				<text>{{userlist.todayRegisterNums}}</text>
			</view>
		</view>
		<view class="set_content_itme" @click="openPage(4)" style="background-color: #A6A6A6;">
			<view class="set_content_itmetext" style="margin-left: 90rpx;">
				<text style="color: #ff2e2e;">邀请用户</text>
			</view>
			<view class="" style="margin-left: 110rpx;">
				<image src="@/static/img/home/share.png" alt="" style="width: 80rpx;height: 80rpx;"/>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onBeforeMount,
		ref,
		reactive,
		getCurrentInstance,
		defineProps,
		onMounted,
		watch,
		toRef
	} from 'vue';
	import api from "@/common/vmeitime-http/index.js";
	import {
		useCounterStore
	} from '@/stores/counter';
	const counter = useCounterStore(); //状态管理
	import GetDate from "@/common/getdatetime.js"
	const userlist = reactive({
		commissionFreezeAmount: '',
		commissionTotalAmount: '',
		monthRegisterNums: '',
		saleMonthAmount: '',
		saleTodayAmount: '',
		saleTotalAmount: '',
		todayRegisterNums: ''

	})
	const range = reactive([])
	const GetNowDate = () => { //获取今天0点到现在的时间
		var time = new Date()
		range[0] = GetDate.getNowFormatDate(1, time)
		range[1] = GetDate.getNowFormatDate(1, time)
	}
	const GetmonthDate = () => {
		var time = new Date()
		const num = time.setDate(1);
		// console.log(num)
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth() + 1; // 月份从0开始，需要加1
		const day = now.getDate();
		range[0] = GetDate.getNowFormatDate(1, num)
		range[1] = year + '-' + month + '-' + day
	}
	const openPage = (index) => { //用户设置页面跳转
	// console.log(index)
		if (index == 0) {
			GetmonthDate()
			uni.navigateTo({
				url: '/pages/home/userinformation/userinformation?user_id=' + counter.user_id + '&betime=' +
					range[0] + '&endtime=' + range[1]+'&currrent=1'
			})
		} else if (index == 1) {
			GetmonthDate()
			uni.navigateTo({
				url: '/pages/home/userinformation/userinformation?user_id=' + counter.user_id + '&betime=' +
					range[0] + '&endtime=' + range[1]+'&currrent=0'
			})
		} else if (index == 2) {
			GetNowDate()
			uni.navigateTo({
				url: '/pages/home/userinformation/userinformation?user_id=' + counter.user_id + '&betime=' +
					range[1] + '&endtime=' + range[0]+'&currrent=1'
			})
		} else if (index == 4) {
			uni.navigateTo({
				url: '/pages/home/sharePage/sharePage'
			})
		}else {
			GetNowDate()
			uni.navigateTo({
				url: '/pages/home/userinformation/userinformation?user_id=' + counter.user_id + '&betime=' +
					range[1] + '&endtime=' + range[0]+'&currrent=0'
			})
		}


	}
	onBeforeMount(() => {
		getuserinfon()
	})
	const back = () => {
		uni.navigateBack()
	}
	const getuserinfon = () => {
		api.GetagentInfo({}).then(res => {
			if (res.data.code == 1) {
				userlist.commissionFreezeAmount = res.data.data.commissionFreezeAmount
				userlist.commissionTotalAmount = res.data.data.commissionTotalAmount
				userlist.monthRegisterNums = res.data.data.monthRegisterNums
				userlist.saleMonthAmount = res.data.data.saleMonthAmount
				userlist.saleTodayAmount = res.data.data.saleTodayAmount
				userlist.saleTotalAmount = res.data.data.saleTotalAmount
				userlist.todayRegisterNums = res.data.data.todayRegisterNums
			}

		})
	}
</script>

<style>
	.usertop {
		background-image: url("../../../static/img/home/bg1.png");
		overflow: hidden;
	}

	.usertopimg {
		height: 150rpx;
		margin: 0 auto;
		margin-top: 50rpx;
	}

	.usertoptx {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin: 0 auto;

	}

	.usertopname {
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
	}

	.usertopname text {
		font-size: 40rpx;
		color: white;
	}

	.usermoney {
		width: 200rpx;
		height: 150rpx;
		margin: 0 auto;
		margin-top: 15rpx;
	}

	.usermoneynum {
		color: white;
		font-size: 45rpx;
		font-weight: bolder;
		text-align: center;
	}

	.usermoneytext {
		color: white;
		font-size: 25rpx;
		font-weight: bolder;
		text-align: center;
		margin-top: 15rpx;
	}

	.usernum {
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
	}

	.usercaizhong {
		width: 250rpx;
		color: white;
		text-align: center;
		line-height: 50rpx;
	}

	.useryongzhong {
		width: 250rpx;
		color: white;
		text-align: center;
		line-height: 50rpx;
	}

	.userlist {
		height: 500rpx;
		margin-top: 50rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}

	.set_content_itme {
		width: 300rpx;
		height: 150rpx;
		border-radius: 10rpx;
		color: white;
		font-weight: bolder;
	}

	.set_content_itmetext {
		margin-left: 25rpx;
		margin-top: 15rpx;
	}

	.set_content_itmetext text {
		font-size: 35rpx;
		font-weight: bolder;
	}

	.set_content_itmenum {
		max-width: 70rpx;
		max-height: 30rpx;
		height: auto;
		padding: 10rpx 10rpx;
		margin-left: 80rpx;
		text-align: center;
		line-height: 30rpx;
		border-radius: 10rpx;
		background: white;
		color: black;
		margin-top: 15rpx;

	}

	.set_content_itmenum text {
		font-weight: bolder;
	}
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: #202736; 
	}
</style>