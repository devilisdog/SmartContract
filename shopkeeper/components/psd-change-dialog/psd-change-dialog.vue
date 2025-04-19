<!-- 隐私授权对话框 -->
<template>
	<view class="comp-container">
		<view class="dialog">
			<view class="title">密码重置成功</view>
			<view class="desc">
				当前密码<text class="privacy">{{Props.psdword}}</text>请尽快通知用户，登陆成功后第一时间修改密码并妥善保管。
			</view>
			<view class="footer">
				<button type="default"  class="btn agree"
					@click="handleAgree">知道了</button>
			</view>
		</view>
	</view>
</template>
<script setup>
	import {
		ref,
		reactive,
		onBeforeMount,
		onMounted,
		getCurrentInstance,
		defineProps,
		defineEmits
	} from 'vue';
	const Emits=defineEmits(['close','yeschange'])
	const Props=defineProps(['psdword'])
	const psdword=ref(0)
	const handleDisagree=()=>{
		Emits('close')
	}
	const handleAgree=()=>{
		Emits('yeschange')
	}
</script>
<style lang="scss" scoped>
	.comp-container {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 999;
	}

	.dialog {
		color: #333;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		border-radius: 20rpx;
		padding: 50rpx 40rpx;
		width: 560rpx;
		box-sizing: border-box;

		.title {
			width: 100%;
			color: #000;
			text-align: center;
			font-size: 32rpx;
			font-weight: 650;
			box-sizing: border-box;
		}

		.desc {
			line-height: 40rpx;
			box-sizing: border-box;
			margin-top: 50rpx;
			font-size: 26rpx;
			.privacy {
				color: #2f80ed;
			}
		}

		.footer {
			width: 100%;
			display: flex;
			align-items: center;
			margin-top: 30rpx;
			justify-content: center;
			.btn {
				color: #FFF;
				font-size: 28rpx;
				font-weight: 500;
				line-height: 80rpx;
				text-align: center;
				height: 80rpx;
				width: 90%;
				border-radius: 10rpx;
				border: none;
				background: #FDC830;
				&.disagree {
					color: #333;
					background: #f2f2f2;
				}
			}
		}

	}
</style>