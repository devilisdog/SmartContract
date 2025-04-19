<template>
	<view class="statusBar"></view>
	<uni-nav-bar title="托管余额" leftIcon="back" @clickLeft="back" leftText="返回" />
	<z-tabs
		:list="tabArr" 
		:current="daohang_value"
		@change="tabChange" 
		ref="tabber"
		scrollCount="6"
		activeColor="#FDC830"
	></z-tabs>
	<!-- 内容 -->
	<swiper @change="onChangeTab" 
			:current="daohang_value" 
			easing-function='easeInOutCubic'
			:style="{height:common.scrollH()-209-statusBarHeight+'rpx'}" 
			duration="300"
			@transition="swiperLocation"
			@animationfinish="swiperLocationEnd"
	>
			
		<!-- 待接单 -->
		<swiper-item>
			<z-paging ref="balance" v-model="balanceListData" @query='balanceRefresh'>
				<view class="userDataCard" v-for="itme,index in balanceListData">
					<view style="display: flex;align-items: center;margin-left:15rpx;">
						<image :src="itme.avatar" style="width:80rpx;height:80rpx;border-radius:10rpx;" />
						<view style="display: flex;flex-flow: column;ustify-content:space-between;margin-left:10rpx;">
							<text>{{itme.nickname}}</text>
							<text style="font-size:26rpx;color: #7e7e7e;">
								{{getDate.getNowFormatDate(0,itme.create_time)}}
							</text>
						</view>
					</view>
					<text style="margin-right:20rpx;">{{itme.money}}</text>
				</view>
			</z-paging>
		</swiper-item>
		
		<swiper-item>
			<z-paging ref="addMoney" v-model="addMoneyListData" @query='addMoneyRefresh' :auto='false'>
				<view class="userDataCard" v-for="itme,index in addMoneyListData">
					<view style="margin-left:15rpx;">
						<text>系统 | {{itme.source}}-{{itme.user_id.nickname}}</text><br>
						<text style="font-size:26rpx;color: #7e7e7e;">
							{{getDate.getNowFormatDate(0,itme.create_time)}}
						</text>
					</view>
					<text style="margin-right:20rpx;color:red;font-weight: bold;">+{{itme.money}}</text>
				</view>
			</z-paging>
		</swiper-item>
		
		<swiper-item>
			<z-paging ref="deductMoney" v-model="deductMoneyListData" @query='deductMoneyRefresh' :auto='false'>
				<view class="userDataCard" v-for="itme,index in deductMoneyListData">
					<view style="margin-left:15rpx;">
						<text>系统 | {{itme.source}}-{{itme.user_id.nickname}}</text><br>
						<text style="font-size:26rpx;color: #7e7e7e;">
							{{getDate.getNowFormatDate(0,itme.create_time)}}
						</text>
					</view>
					<text style="margin-right:20rpx;color:#7e7e7e;font-weight: bold;">{{itme.money}}</text>
				</view>
			</z-paging>
		</swiper-item>
		
	</swiper>
	

</template>

<script setup>
	import common from "@/common/common.js"
	import api from "@/common/vmeitime-http/mine/mine.js"
	import getDate from "@/common/getdatetime.js"
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	
	const statusBarHeight=ref(0)
	onBeforeMount(()=>{
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight
	})
	
	const swiperLocation=(e)=>{//滑动swiper获取实时位置
		proxy.$refs.tabber.setDx(e.detail.dx)
	}
	const swiperLocationEnd=()=>{//滑动动画结束
		proxy.$refs.tabber.unlockDx()
	}
	const tabChange=(index)=>{//tab点击
		daohang_value.value=index
	}
	const daohang_value = ref(0) // 导航默认
	const dianji_qiehuan = (index) => { //点击切换导航
		if (daohang_value == index) {
			return
		} else {
			daohang_value.value = index
			if(daohang_value.value==1 && addMoneyState.value==false){
				uni.showLoading({title:'加载中~'})
				proxy.$refs.addMoney.reload()
				addMoneyState.value=true
				
			}else if(daohang_value.value==2 && deductMoneyState.value==false){
				uni.showLoading({title:'加载中~'})
				deductMoneyState.value=true
				proxy.$refs.deductMoney.reload()
			}
		}
	}
	const onChangeTab = (e) => { //滑动导航栏跟随
		dianji_qiehuan(e.detail.current)
	}
	onBeforeMount(()=>{
		uni.showLoading({title:'加载中~'})
	})
	
	const back=()=>{
		uni.navigateBack()
	}
	const tabArr=reactive(['余额','加款','扣款'])
	const click=(e)=>{
		if(current.value != e.currentIndex){
			current.value=e.currentIndex
		}
	}
	const balanceListData=ref([])//余额数据以及刷新
	const balanceRefresh=(pageNo,pageSize)=>{
		api.GetBalanceList({"type":"0","per_page":pageSize,"current_page":pageNo}).then((res)=>{
			proxy.$refs.balance.complete(res.data.data.data)
			uni.hideLoading()
		}).catch(res=>{
			uni.hideLoading()
			proxy.$refs.balance.complete(false)
		})
	}
	
	const addMoneyListData=ref([])//加款数据以及刷新
	const addMoneyState=ref(false)
	const addMoneyRefresh=(pageNo,pageSize)=>{
		api.GetBalanceList({"type":"1","per_page":pageSize,"current_page":pageNo}).then((res)=>{
			proxy.$refs.addMoney.complete(res.data.data.data)
			uni.hideLoading()
		}).catch(res=>{
			proxy.$refs.addMoney.complete(false)
			uni.hideLoading()
		})
	}
	const deductMoneyListData=ref([])//扣款数据以及刷新
	const deductMoneyState=ref(false)
	const deductMoneyRefresh=(pageNo,pageSize)=>{
		api.GetBalanceList({"type":"2","per_page":pageSize,"current_page":pageNo}).then((res)=>{
			proxy.$refs.deductMoney.complete(res.data.data.data)
			uni.hideLoading()
		}).catch(res=>{
			proxy.$refs.deductMoney.complete(false)
			uni.hideLoading()
		})
	}
	
</script>

<style>
	.userDataCard{
		width:735rpx;
		padding:20rpx 5rpx;
		background-color: white;
		border-bottom: 1rpx solid #ececec;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.xiabiao {
		position: absolute;
		width: 90rpx;
		height: 7rpx;
		background-color: #FDC830;
		border-radius: 50rpx;
		top: 73rpx;
		left: 80rpx;
		transition: .3s;
	}
	.box {
		width: 186rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		transition: 0.5s;
	}
	.navigation {
		width: 100%;
		height: 80rpx;
		background-color: #fff;
		border-bottom:1rpx solid #f7f7f7;
	}
	body {
		background-color: #f3f3f3;
	}
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
	}
</style>
