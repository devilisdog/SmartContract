<template>
	<view class="container">
		<view class="box1">
			<view class="sword" :style="'border-bottom: 8rpx solid '+color"></view>
			<view class="sword" :style="'border-right: 8rpx solid '+color"></view>
			<view class="sword" :style="'border-top: 8rpx solid '+color"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'loading-sword',
		data() {
			return {};
		},
		props: {
			color: {
				type: String,
				default: "#ED213A"
			},
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.box1 {
		position: relative;
		width: 120rpx;
		height: 120rpx;
	}

	.sword {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.sword:nth-of-type(1) {
		left: 0%;
		top: 0%;
		animation: sword1 1s linear infinite;
	}

	.sword:nth-of-type(2) {
		right: 0%;
		top: 0%;
		animation: sword2 1s linear infinite;
	}

	.sword:nth-of-type(3) {
		right: 0%;
		bottom: 0%;
		animation: sword3 1s linear infinite;
	}

	@keyframes sword1 {
		0% {
			transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
		}

		100% {
			transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
		}
	}

	@keyframes sword2 {
		0% {
			transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
		}

		100% {
			transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
		}
	}

	@keyframes sword3 {
		0% {
			transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
		}

		100% {
			transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
		}
	}
</style>