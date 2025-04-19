<template>
	<view class="statusBar"></view>
	<uni-nav-bar leftIcon="back" @clickLeft="back" title="账号明细" />
	<!-- 分段条 -->
	<scroll-view scroll-x="true" class="navigation" style="border-bottom: 1rpx solid #fafafa ;">
		<view style="display: flex;">
			<view v-for="itme,index in tita" :key="index" @click="dianji_qiehuan(index)" style="margin: auto;">
				<view class="box" :style="index==daohang_value?'color:#f04b49;':''">{{itme}}</view>
			</view>
			<view class="xiabiao"
				:style="daohang_value==1 ? 'left:145rpx;' : false
						|| daohang_value==2 ? 'left:270rpx;' : false 
						|| daohang_value==3 ? 'left:390rpx;' : false
						|| daohang_value==4 ? 'left:520rpx;' : false 
						|| daohang_value==5 ? 'left:645rpx;' : false">
			</view>
		</view>
	</scroll-view>
	<!-- 内容 -->
	<swiper 
		@change="onChangeTab" 
		:current="daohang_value" 
		:style="{height:common.scrollH()-209-statusBarHeight+'rpx'}" 
		easing-function="linear" 
		duration="300">
		<swiper-item  v-for="itme,index in tita" style="height:100%;"><!-- 内容1 -->
			<itmeContent 
				:tabIndex='index' 
				:currentIndex='daohang_value' 
				:user_id='counter.user_id' 
			/>
		</swiper-item>
	</swiper>
</template>

<script setup>
	import itmeContent from '@/components/home/yc-swiper-itmeContent/yc-swiper-itmeContent.vue'
	import common from '@/common/common'
	import { useCounterStore } from '@/stores/counter'
	const counter = useCounterStore(); //状态管理
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		//defineEmits,//发送数据
		defineProps,//接收数据
	} from 'vue';
	import {onShow} from "@dcloudio/uni-app"
	const {
		proxy,
		ctx
	} = getCurrentInstance()

	const back=()=>{
		uni.navigateBack()
	}
	const daohang_value = ref(0)
	const statusBarHeight=ref(0)
	onBeforeMount(()=>{
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight//获取手机状态栏高度
	})
	
	
	const dianji_qiehuan = (index) => { //点击切换导航
		if (daohang_value == index) {
			return
		} else {
			daohang_value.value = index
		}
	}
	const onChangeTab = (e) => { //滑动导航栏跟随
		dianji_qiehuan(e.detail.current)
	}
	const tita = reactive(['投注', '充值','系统','奖金','佣金','提现']) //分段器title数据
</script>


<style>
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
	}
	
	.popupStyle{
		width:100%;
		height:400rpx;
		background-color: white;
		border-top-left-radius:30rpx;
		border-top-right-radius:30rpx;
	}
	.navigation {
		width: 100%;
		height: 80rpx;
		background-color: #fff;
	}
	.box {
		width: 105rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		transition: .1s;
		margin:0rpx 10rpx;
	}
	.xiabiao {
		position: absolute;
		width: 90rpx;
		height: 7rpx;
		background-color: #202736; 
		/* z-index: -1; */
		border-radius: 50rpx;
		top: 73rpx;
		left: 15rpx;
		transition: .1s;
	}

	body {
			background-color: #f7f7f7;
		}
</style>