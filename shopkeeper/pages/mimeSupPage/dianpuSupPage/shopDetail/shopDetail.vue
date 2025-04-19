<template>
	<view class="status_bar"></view>
	<uni-nav-bar title="合作余额明细" leftIcon="back" @clickLeft="back" leftText="返回" />
	<z-tabs
		:list="tita" 
		:current="daohang_value"
		@change="tabChange" 
		ref="tabber"
		activeColor="#FDC830"
	></z-tabs>
	<!-- 内容 -->
	<swiper 
		@change="onChangeTab" 
		:current="daohang_value" 
		:style="{height:common.scrollH()-209+'rpx'}" 
		easing-function="linear" 
		@transition="swiperLocation"
		@animationfinish="swiperLocationEnd"
		duration="300">
		<swiper-item  v-for="itme,index in 5"><!-- 内容1 -->
			<yc-swiper-itmeShopDetail 
				:tabIndex='daohang_value' 
				:pageIndex='index' 
				:pageState='Props.pageIndex' 
				:shop_id='Props.shop_id'>
			</yc-swiper-itmeShopDetail>
		</swiper-item>
	</swiper>
</template>

<script setup>
	import common from "@/common/common.js"
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
		defineProps
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const daohang_value = ref(0)
	const Props=defineProps(['pageIndex','shop_id'])
	
	const tabChange=(index)=>{
		daohang_value.value=index
	}
	const swiperLocation=(e)=>{//滑动swiper获取实时位置
		proxy.$refs.tabber.setDx(e.detail.dx)
	}
	const swiperLocationEnd=()=>{//滑动动画结束
		proxy.$refs.tabber.unlockDx()
	}
	
	const onChangeTab = (e) => { //滑动导航栏跟随
		tabChange(e.detail.current)
	}
	
	const tita = reactive(['出票', '充值','店主','奖金','提现']) //分段器title数据
	const back=()=>{
		uni.navigateBack()
	}
</script>

<style>
	.status_bar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}
	body {
		background-color: #f7f7f7;
	}
</style>
