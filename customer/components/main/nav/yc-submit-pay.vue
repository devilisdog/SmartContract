<template>
<!-- 	<view class="popup-content">
		<view style="text-align: center;">
			<text style="font-size: 35rpx;">支付给店主</text>
		</view>
		<view class="top-content">
			<view >
				<view class="left">
					{{type}}
				</view>
				<view class="right" style="margin-left: auto;">
					{{money}}元
				</view>
			</view>

			<view >
				<view class="left">
					店铺余额
				</view>
				<view class="right" style="margin-left: auto;">
					{{balance}}元
				</view>
			</view>
		</view>
		
		<view class="button-yuanjiao" @click="Confirm"
			:style="changeshow?'background: linear-gradient(90deg, #FFCD1E, #FF8A18);':'background: linear-gradient(90deg, #FFCD1E, #FF8A18);opacity:0.5'">
			确认支付
		</view>
		<view class="title" style="justify-content:center;display: flex;margin-top: 15rpx;">
			<checkBox :show="changeshow" iconcolor="#FFCD1E" @check-change="checkchange"></checkBox>
			<text style="color: red;font-size: 25rpx;">我已年满18周岁</text>
			<text style="color: #a5a5a5;font-size: 25rpx;">已阅读并同意</text>
			<text style="color: red;font-size: 25rpx;">《用户协议及法律声明》</text>
		</view>
	</view> -->
	
	<view class="popup-subject">
		<!-- <view class="cc" @click="proxy.$refs.tcpopup.close('bottom')">×</view> -->
		<view class="content">
			<view class="content-title">支付给店主</view>
			<view class="content-money">
				<view>{{type}}：</view>
				<view style="letter-spacing: 4rpx;">{{money}}元</view>
			</view>
			<view class="content-balances" style="border-bottom: none;">
				<view>剩余余额：</view>
				<view style="letter-spacing:4rpx;">{{balance.toFixed(2)}}元</view>
			</view>
			<view style="background-color: #f8f8f8;width: 100%;height: 1px;margin-bottom: 15rpx;"></view>
			<view @click="Confirm()" class="content-button" :style="openCheckbox == true ? false : 'pointer-events:none;'" >确认支付
				<view style="background-color: #e2e2e2;width:600rpx;position: absolute;height: 68rpx;border-radius: 55rpx;transition: all 0.6s;"
					:style="openCheckbox == true ? 'opacity:0;' : 'opacity:0.4;'"></view>
				</view>
				
			<view class="clause">
				<view class="clause-choose" @click="checkboxClick">
					<view style="width: 18rpx;height: 18rpx;border-radius: 55rpx;" :style="openCheckbox == false ? 'display:none;' : 'background-color:#ffd38b ;'"></view>
				</view>
				<text style="color: red;">我已年满18周岁</text>
				<text style="margin: 0 10rpx;">已阅读并同意</text>
				<text style="color: red;" @click="checkchange">《用户协议及法律声明》</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		getCurrentInstance, //获取当前组件的实例
		defineProps,//接收传值实例
		defineEmits,//发送传值实例
	} from 'vue';
	import checkBox from '@/components/common/yc-common-checkbox/yc-common-checkbox.vue'

	const props = defineProps(['type', 'balance', 'money', 'check-change']) //接收传值

	const emits = defineEmits(['ConfirmPayment']) //发送传值
	//用法：emits("ConfirmPayment")  ps：emits(方法名,value1,value2,...) //发送
	//获取用法：var a = props.type
	onBeforeMount(() => {
		openCheckbox.value=uni.getStorageSync('isAdult')
	})
	const openCheckbox = ref(false)
	const checkboxClick =()=>{
		openCheckbox.value=!openCheckbox.value
		uni.setStorageSync('isAdult',openCheckbox.value);
	}
	const Confirm = () => {
		if (openCheckbox.value === true) {
			emits("ConfirmPayment")
		}
	}

	const changeshow = ref(true)
	const checkchange = (e) => {
		changeshow.value = e

	}
</script>

<style lang="less">
	.popup-subject{
		width: 100%;
		height: 620rpx;
		background-color: #ffffff;
		border-radius: 40rpx 40rpx 0 0;
	}
		.popup-subject.content{
			display: flex;
			flex-direction: column;
		}
			.cc{
				width: 35rpx;
				height: 35rpx;
				border-radius: 55px;
				position: absolute;
				margin: 25rpx;
				right: 1%;
				border: 1px solid #e7e7e7;
				color: #e7e7e7;
				font-size: 30rpx;
				text-align: center;
				line-height: 35rpx;
			}
			.content-title{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 35rpx 0;
				font-size: 34rpx;
				font-weight: 500;
				color: #393939;
				border-bottom:1rpx solid #f8f8f8;
				border-radius: 25rpx 25rpx 0 0;
			}
			.content-money , .content-balances{
				width: 700rpx;
				margin: auto;
				font-size: 25rpx;
				padding: 30rpx 0;
				border-bottom:1rpx solid #f8f8f8;
				display: flex;
				justify-content: space-between;
			}
			.content-button{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 600rpx;
				height: 65rpx;
				margin: auto;
				border-radius: 55rpx;
				color: #ffffff;
				background: linear-gradient( 65deg, #ffd875, #ff7979);
			}
			.clause{
				display: flex;
				align-items: center;
				margin: auto;
				margin-top: 20rpx;
				}
				.clause-choose{
					width: 30rpx;
					height: 30rpx;
					margin: 0 10px;
					border-radius: 55px;
					border: 1px solid #5a5a5a;
					color: #393939;
					font-size: 24rpx;
					display: flex;
					transition: all 1s;
					align-items: center;
					justify-content: center;
				}
				.clause text{
					color: #3d3d3d;
					font-size: 24rpx;
				}

</style>
