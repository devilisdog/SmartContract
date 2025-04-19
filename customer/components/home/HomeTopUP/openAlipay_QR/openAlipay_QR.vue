<template>
	<view class="bigCard">
		<view class="title_box">
			<image v-show="Props.paytype=='zfb'" src="@/static/img/home/aliPay.png"></image>
			<image v-show="Props.paytype=='ysf'" src="@/static/img/home/ysf.png"></image>
			<image v-show="Props.paytype=='wx'" src="@/static/img/home/WeChat.png"></image>
			<text v-show="Props.paytype=='zfb'">支付宝扫码支付</text>
			<text v-show="Props.paytype=='ysf'">云闪付扫码支付</text>
			<text v-show="Props.paytype=='wx'">微信扫码支付</text>
		</view>
		<view class="money">￥{{Props.money}}</view>
		<view style="text-align: center;">
			<tki-qrcode :val="Props.src" ref="openQrcode" :size="600"></tki-qrcode>
		</view>
		<view class="cut-off"></view>
		<view class="reminder_box">
			<image src="@/static/img/home/ScanQR.png"></image>
			<view style="display: flex;flex-flow: column;justify-content: space-between;">
				<text>请使用{{Props.paytype=='zfb'?'支付宝':'云闪付'}}扫一扫</text>
				<text>扫描二维码完成支付</text>
			</view>
		</view>
		<view class="button_box">
			<view class="initButtonStyle" style="flex:1;border-right:1rpx solid #e5e5e5;" @click="onClick(0)">取消</view>
			<view class="initButtonStyle" style="flex:1;color:#1678ff;" @click="onClick(1)">已支付</view>
		</view>	
	</view>
</template>

<script setup>
	/**
	 * Countdown 支付宝支付
	 * @description 支付宝弹窗组件
	 * @property {String} money 支付金额
	 * @property {String} src 二维码访问地址
	 * @event {Function} onClickButton 点击卡片按钮触发(0==取消/1==已支付)
	 */
	import {onShow} from "@dcloudio/uni-app"
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		getCurrentInstance,
		defineProps,
		defineEmits
	} from 'vue'
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const Emits=defineEmits(['onClickButton'])
	const Props=defineProps({
		'money':{
			default:'0.00',
			type:String||Number,
		},
		'src':{
			default:'www.baidu.com',
			type:String,
		},
		'paytype':{
			default:'zfb',
			type:String,
		},
	})
	onBeforeMount(()=>{
		setTimeout(()=>{//生成二维码
			proxy.$refs.openQrcode._makeCode()
		},500)
	
	})
	const onClick=(e)=>{//点击按钮发送按钮index
		Emits('onClickButton',e)
	}
</script>

<style lang="scss">
	.button_box{
		display: flex;
		align-items: center;
		margin-top:40rpx;
		.initButtonStyle{
			height:80rpx;
			text-align: center;
			line-height:80rpx;
		}
	}
	.money{
		font-size:62rpx;
		font-weight: bold;
		text-align: center;
		margin:20rpx 0rpx;
	}
	.title_box{
		display: flex;
		align-items: center;
		justify-content: center;
		text{
			font-size:42rpx;
			font-weight:bold;
		}
		image{
			width: 80rpx;
			height:80rpx;
			margin-right: 20rpx;
		}
	}
	.reminder_box{
		display: flex;
		justify-content: center;
		margin:20rpx 0rpx;
		view{
			text{
				font-size:42rpx;
			}
		}
		image{
			width:120rpx;
			height:120rpx;
			margin-right:20rpx;
		}
	}
	.cut-off{
		width:100%;
		border:1rpx dashed #e5e5e5;
		height:1rpx;
		margin:20rpx 0;
	}
	.bigCard{
		width:1200rpx;
		padding: 20rpx;
		border-radius:20rpx;
		background-color:white;
		
	}

</style>
