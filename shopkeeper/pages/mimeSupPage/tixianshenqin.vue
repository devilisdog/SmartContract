<template>
	<view class="status_bar"></view>
	<!-- 头部 -->
	<uni-nav-bar title="提现申请" leftIcon="back" right-text="历史记录" @clickLeft="back()" @clickRight="open()" leftText="返回"/>
	<!-- 导航 -->
	
	<scroll-view style="background-color: white;">
		<view class="tabber">
			<view @click="dianji_qiehuan(0)"
				class="dh" 
				:style="daohang[0].value==0? '' : 'background-color: #FDC830;color:#fff;'">
				<text>{{daohang[0].name}}</text>
			</view>
			<view @click="dianji_qiehuan(1)"
				class="clickdh"  
				:style="daohang[1].value==0? '' : 'background-color: #FDC830;color:#fff;'">
				<text>{{daohang[1].name}}</text></view>
		</view>
	</scroll-view>
	<swiper @change="onChangeTab" :current="daohang_value" easing-function='easeInOutCubic'
			:style="{height:common.scrollH()-209-statusBarHeight+'rpx'}" duration="300">
		<swiper-item>
			<z-paging ref="withdrawalSlip" v-model="withdrawalSlipData" @query='withdrawalSlipList'>
				<yc-withdrawDeposit-card 
					:data='itme' 
					v-for="itme,index in withdrawalSlipData"
					@operationCallback='change'>
				</yc-withdrawDeposit-card>
			</z-paging>
		</swiper-item>
		<swiper-item>
			<z-paging ref="withdrawalSlipTeamwork" v-model="withdrawalSlipDataTeamwork" @query='withdrawalSlipListTeamwork'>
				<yc-withdrawDeposit-card
					:data='itme' 
					v-for="itme,index in withdrawalSlipDataTeamwork"
					@operationCallback='change'>
				</yc-withdrawDeposit-card>
			</z-paging>
		</swiper-item>
	</swiper>
</template>
<script setup>
	import api from "@/common/vmeitime-http/satistics/satistcs.js"
	import common from "@/common/common.js"
	import { onLoad,onShow,onHide } from "@dcloudio/uni-app"
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	
	const statusBarHeight=ref(0)//状态栏高度
	onBeforeMount(()=>{
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight//获取手机状态栏高度
	})
	const withdrawalSlipData=ref([])//店内提现列表
	const withdrawalSlipDataTeamwork=ref([])//店内提现列表
	const daohang_value = ref(0)//tab的index
	const daohang = reactive([{//tab数据
			name: '店内提现',
			value: 1
		},
		{
			name: '合作店铺提现',
			value:0
		},
	])
	const withdrawalSlipListTeamwork=(pageNo,pageSize)=>{
		api.GetPayoutRequestList({
			"type": "2",
			"per_page":pageSize,
			"current_page":pageNo
		}).then((res)=>{
			proxy.$refs.withdrawalSlipTeamwork.complete(res.data.data.data)
		}).catch(res=>{
			proxy.$refs.withdrawalSlipTeamwork.complete(false)
		})
	}
	const change=()=>{//点击卡片操作后
		proxy.$refs.withdrawalSlipTeamwork.refresh()
		proxy.$refs.withdrawalSlip.refresh()
	}
	const withdrawalSlipList=(pageNo,pageSize)=>{
		api.GetPayoutRequestList({
			"type": "1",
			"per_page":pageSize,
			"current_page":pageNo
		}).then((res)=>{
			proxy.$refs.withdrawalSlip.complete(res.data.data.data)
		}).catch(res=>{
			proxy.$refs.withdrawalSlip.complete(false)
		})
	}
	const back = () => {// 返回到上一个页面
		uni.navigateBack()
	}
	const open=()=>{//打开历史记录
		uni.navigateTo({
			url:'/pages/statistics-xiangqing/statistics-history'
		})
	}
	const dianji_qiehuan = (index) =>{ //点击切换导航
		daohang_value.value=index
		if(index==0){
			daohang[0].value=1
		}else{
			daohang[0].value=0
		}
		if(index==1){
			daohang[1].value=1
		}else{
			daohang[1].value=0
		}
	}
	const onChangeTab = (e) =>{	//滑动导航栏跟随
		dianji_qiehuan(e.detail.current)
	}
</script>
<style>
	.tabber{
		display: flex;
		flex-direction: row;
		font-size: 28rpx;
		color: #FDC830;
		height: 100rpx;
		align-items: center;
		justify-content: center;
	}
	button::after {
		border: initial;
	}
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
	body {
		background-color: #f7f7f7;
	}

	.xz {
		width: 600;
		height: 95rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 30rpx 30rpx 0 0;
	}

	.xz:active {
		background: rgba(104, 104, 104, 0.1);
	}

	.qx {
		width: 100%;
		height: 90rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.qx:active {
		background: rgba(104, 104, 104, 0.1);
	}
	.dh {
		width: 320rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 25rpx 0 0 25rpx;
		border: 1rpx solid #FDC830;
		transition: 0.3s;
	}
	.clickdh{
		width: 320rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0 25rpx 25rpx 0;
		border: 1rpx solid #FDC830;
		transition: 0.3s;
	}
	.dh_02 {
		background-color: #FDC830;
		color:#fff;
		border-radius: 25rpx 0 0 25rpx;
		border: 1rpx solid #FDC830;
	}
</style>
