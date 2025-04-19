<template>
	<view class="uni-goods-nav">
		<!-- 底部占位 -->
		<view class="uni-tab__seat" />
		<view class="uni-tab__cart-box flex">
			<view class="flex uni-tab__cart-sub-left">
				<view class="flex uni-tab__cart-button-left uni-tab__shop-cart" @click="onClick">
					<view class="uni-tab__icon">
						<uni-icons type="trash-filled" size="20" color="#646566"></uni-icons>
					</view>
					<text class="uni-tab__text">清空</text>
				</view>
			</view>
			<view style="width: 60%; height: 100%; margin:auto; text-align: center; display: flex; flex-direction: column;">
				<view class="" v-if="props.count<=9">
					<text>已选 </text>
					<text style="color: #ff0000;">{{props.count}}</text>
					<text>,仍需</text>
					<text style="color: #ff0000;">{{9-(props.count-0)}}</text>
					<text >场</text>
				</view>
				<text style="color: #ff0000;" v-else>比赛选择请勿超过9场</text>
				<view class="">
					<text style="font-size:24rpx;color:#7f7f7f;">预测奖金仅供参考 请以实票为准</text>
				</view>
			</view>
			<view class="flex uni-tab__cart-sub-right">
				<view style="background-image: linear-gradient(-225deg, #202736,#202737);"
					class="flex uni-tab__cart-button-right" @click="buttonClick">
					<text style="color: #ffffff;" class="uni-tab__cart-button-right-text">提交</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {defineProps,defineEmits} from 'vue';


	const props = defineProps(['count'])
	const emits = defineEmits(['clickempty','clickbutton'])
	const onClick = () => {
		emits('clickempty')
	}
	const buttonClick = () => {
		emits('clickbutton')
	}
</script>

<style lang="scss" scoped>
	.flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}
	
	.uni-goods-nav {
		/* 边框 */
		border-top: 1rpx solid #aaaaaa;
		  -webkit-box-sizing: border-box; 
		  box-sizing: border-box;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
	}
	
	.uni-tab__cart-box {
		flex: 1;
		height: 50px;
		background-color: #fff;
		z-index: 900;
	}
	
	.uni-tab__cart-sub-left {
		padding: 0 5px;
	}
	
	.uni-tab__cart-sub-right {
		flex: 1;
	}
	

	
	.uni-tab__cart-button-left {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		// flex: 1;
		position: relative;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin: 0 10px;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}
	
	.uni-tab__icon {
		width: 18px;
		height: 18px;
	}
	

	
	.uni-tab__text {
		margin-top: 3px;
		font-size: 12px;
		color: #646566;
	}
	
	.uni-tab__cart-button-right {
		border-radius:20rpx 0 0 20rpx;
		transition: all 0.3s;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		flex: 1;
		justify-content: center;
		align-items: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}
	
	.uni-tab__cart-button-right-text {
		font-size: 14px;
		color: #fff;
	}
	
	.uni-tab__cart-button-right:active {
		opacity: 0.7;
	}
	
	
	

</style>
