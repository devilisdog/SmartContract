<template>
	<view class="status_bar"></view>
	<uni-nav-bar title="账户明细" leftIcon="back" @clickLeft="back" leftText="返回" />
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
		@transition="swiperLocation"
		@animationfinish="swiperLocationEnd"
		easing-function="linear" 
		duration="300">
		<swiper-item  v-for="itme,index in tita" style="height:100%;"><!-- 内容1 -->
			<yc-userDetail-swiperItme
				:pageIndex='index'
				:confrimIndex='daohang_value'
			/>
		</swiper-item>
	</swiper>
</template>

<script setup>
	import common from "@/common/common.js"
	import {ref,reactive,onBeforeMount,getCurrentInstance} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const daohang_value = ref(0)
	const swiperLocation=(e)=>{//滑动swiper获取实时位置
		proxy.$refs.tabber.setDx(e.detail.dx)
	}
	const swiperLocationEnd=()=>{//滑动动画结束
		proxy.$refs.tabber.unlockDx()
	}
	const tabChange=(index)=>{//tab点击
		daohang_value.value=index
	}
	const onChangeTab = (e) => { //滑动导航栏跟随
		tabChange(e.detail.current)
	}
	const tita = reactive(['全部', '出票','充值','推广','店主跟单','玩家发单','店铺发单','平台跟单','红包','提现']) //分段器title数据
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