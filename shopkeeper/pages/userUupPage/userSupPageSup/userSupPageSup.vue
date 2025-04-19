<template>
	<view class="statusBar"></view>
	<uni-nav-bar leftIcon="back" @clickLeft="back" title="账号明细"  leftText="返回"/>
	

	<z-tabs
		:list="tita" 
		:current="daohang_value"
		@change="tabChange" 
		ref="tabber"
		scrollCount="6"
		activeColor="#FDC830"
	></z-tabs>


	<!-- 内容 -->
	<swiper 
		@change="onChangeTab" 
		:current="daohang_value" 
		:style="{height:common.scrollH()-209-statusBarHeight+'rpx'}"
		@transition="swiperLocation"
		@animationfinish="swiperLocationEnd"
		easing-function="linear" 
		duration="300">
		<swiper-item  v-for="itme,index in tita" style="height:100%;"><!-- 内容1 -->
			<yc-swiper-itmeContent 
				:tabIndex='index' 
				:currentIndex='daohang_value' 
				:user_id='Props.user_id' />
		</swiper-item>
	</swiper>
</template>

<script setup>
	import common from '@/common/common'
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
	const Props=defineProps(['user_id'])

	const back=()=>{
		uni.navigateBack()
	}
	
	const swiperLocation=(e)=>{//滑动swiper获取实时位置
		proxy.$refs.tabber.setDx(e.detail.dx)
	}
	const swiperLocationEnd=()=>{//滑动动画结束
		proxy.$refs.tabber.unlockDx()
	}
	const tabChange=(index)=>{//tab点击
		daohang_value.value=index
	}
	
	const daohang_value = ref(0)
	const statusBarHeight=ref(0)
	onBeforeMount(()=>{
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight//获取手机状态栏高度
	})
	
	const onChangeTab = (e) => { //滑动导航栏跟随
		tabChange(e.detail.current)
	}
	const tita = reactive(['投注', '充值','系统','奖金','佣金','提现']) //分段器title数据
</script>


<style>
	
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
		background-color: #FDC830;
		/* z-index: -1; */
		border-radius: 50rpx;
		top: 73rpx;
		left: 15rpx;
		transition: .1s;
	}
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
	}
	body {
			background-color: #f7f7f7;
		}
</style>
