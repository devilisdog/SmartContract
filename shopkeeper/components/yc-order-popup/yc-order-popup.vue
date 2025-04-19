<template>
	<view class="card">
		<text >彩种类型</text>
		<view class="buttonStyleBox">
			<view :class="index==selectValue[0].value?'clickButtonStyle':'buttonStyle'" 
				   v-for="item,index in cz" 
				   @click="clickButton(item,index)">
				<text>{{item}}</text>
			</view>
		</view>
		<text>排序方式</text>
		<view class="buttonStyleBox">
			<view :class="index==timeSelectValue[0].value?'clickButtonStyle':'buttonStyle'" 
				   v-for="item,index in px" 
				   @click="timeClickButton(item,index)">
				<text>{{item}}</text>
			</view>
		</view>
		<!-- 排序方式 -->
	</view>
</template>
<script setup>
	/*
	*发送：
	* closeValue:点击后发送一个关闭弹窗指令（还带了彩种选择的值和排序选择的值过去父组件）
	* --------------------------------------------------------------------------
	* 接收：
	* lastTimeValue:接收上次选择的值（彩种）
	* timeLastTimeValue:接收上传选择的值（排序）
	*/
	import common from "@/common/common.js";
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
		defineEmits,//发送数据
		defineProps,//接收数据
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	onBeforeMount(() => {
	
	})
	const Emits = defineEmits(['closeValue'])
	
	const Props=defineProps(['caiValue','timeValue'])
	
	const selectValue=reactive([{
		text:Props.caiValue[0].text,
		value:Props.caiValue[0].value
	}])
	const timeSelectValue=reactive([{
		text:Props.timeValue[0].text,
		value:Props.timeValue[0].value
	}])
	onBeforeMount(()=>{
	})
	const clickButton=(select,value)=>{
		selectValue[0].value=value
		selectValue[0].text=select
		Emits('closeValue',selectValue,timeSelectValue)
	}
	const timeClickButton=(timeSelect,value)=>{
		timeSelectValue[0].value=value
		timeSelectValue[0].text=timeSelect
		Emits('closeValue',selectValue,timeSelectValue)
	}
	


	const cz = reactive([
		'全部订单','竞彩足球','竞彩篮球','胜负过关',
		'北京单场','双色球','大乐透','排列三','排列五',
		'七星彩','七乐彩','快乐八','福彩3D','任选九','胜负彩'
	])
	const px = reactive(['下单时间','截止时间'])
</script>

<style>
	.card{
		width: 570rpx;
		height:100%;
		background-color: #fff;
		border-radius: 40rpx 0 0 40rpx;
		padding:30rpx;
		margin-top:var(--status-bar-height);
	}
	.buttonStyleBox{
		margin:20rpx 0rpx;
		display: grid;
		grid-template-rows:repeat(4,auto);
		grid-template-columns:repeat(3,160rpx);
		grid-gap:20rpx;
		justify-content: space-around;
	}
	.buttonStyle{
		width:160rpx;
		height:50rpx;
		border:2rpx solid #595959;
		text-align: center;
		line-height:50rpx;
		color: #595959;
		border-radius:7rpx;
	}
	.clickButtonStyle{
		width:160rpx;
		height:50rpx;
		border:2rpx solid #FDC830;
		text-align: center;
		line-height:50rpx;
		color:#FDC830;
		border-radius:7rpx;
	}
	
	.status_bar{
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}

</style>
