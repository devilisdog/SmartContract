<template>
	<view class="big_box">
		<view class="title_box">使用说明(向下滑动)</view>
		<scroll-view class="scroll_style" :scroll-y="true">
			<text>1,打开微信扫码二维码↓</text>
			<image src="@/static/img/mimeImg/1.png" class="imageSize" style="height:500rpx;"></image>
			<text>2,关注公众号回复密钥↓</text>
			<image src="@/static/img/mimeImg/2.png" class="imageSize"></image>
			<text>3,复制返回链接↓</text>
			<image src="@/static/img/mimeImg/3.png" class="imageSize"></image>
			<text>4,打开店主端点击用户设置->绑定推送↓</text>
			<image src="@/static/img/mimeImg/4.png" class="imageSize"></image>
			<text>5,粘贴链接->点击确定，之后如有新订单会直接发送到微信喔~↓</text>
			<image src="@/static/img/mimeImg/5.png" class="imageSize"></image>
			<text>6,如无法收到信息，可关闭公众号的消息免打扰~</text>
			<image src="@/static/img/mimeImg/6.png" class="imageSize"></image>
			<image src="@/static/img/mimeImg/7.png" class="imageSize"></image>
			<view class="closeButton" @click="openErweima">了解，打开二维码</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import {ref,onBeforeMount,reactive,defineEmits} from 'vue';
	const Emits=defineEmits(['onclickOpen'])
	const openErweima=()=>{
		Emits('onclickOpen')
	}
</script>

<style lang="scss">
	.closeButton{
		width:100%;
		height:80rpx;
		line-height:80rpx;
		border-radius:20rpx;
		text-align: center;
		color:white;
		background-color:#feb856;
	}
	.imageSize{
		width: 100%;
		height: 1420rpx;
		object-fit: cover;
	}
	.scroll_style{
		width:100%;
		max-height:70vh;
		border-radius:20rpx;
		overflow: hidden;
		text-align: center;
		text{
			color:red;
			font-weight: bold;
		}
	}
	.title_box{
		width:100%;
		text-align: center;
		font-size:38rpx;
		font-weight: bold;
		margin-bottom:20rpx;
	}
	.big_box{
		padding:20rpx;
		width:680rpx;
		border-radius:20rpx;
		background-color: #fff;
	}
</style>
