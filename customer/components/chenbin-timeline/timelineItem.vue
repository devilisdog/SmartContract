<template>
	<view class="timelineItem">
		<view class="timeItem">
			<!-- <view class="leftTime">
				{{leftTime}}
			</view> -->
			<view class="leftContent">
				<slot name="left"></slot>
			</view>
			<view class="line">
				<view class="out" :style="{background: color == '' ? '' : color}">
					<slot name="content"></slot>
				</view>
			</view>
			<view class="rightContent">
				<slot name="right"></slot>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		props:{
			leftTime:{
				type:String,
				default:''
			},
			color:{
				type:String,
				default:''
			}
		},
		data(){
			return {
				
			}
		}
	}
</script>

<style scoped lang="less">
	.timelineItem {
		.timeItem {
			display: flex;
			.leftTime {
				width: 135rpx;
				padding: 0 10rpx;
				font-size:22rpx;
				font-family:PingFangSC-Medium,PingFang SC;
				font-weight:500;
				color:rgba(51,51,51,1);
				margin-right: 10rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.line {
				width:4rpx;
				background:#f04b49;
				position: relative;
				.out {
					position: absolute;
					top: 0;
					left: 50%;
					transform: translateX(-50%);
					display: flex;
					justify-content: center;
					align-items: center;
					width:50rpx;
					height:50rpx;
					background-color:#f04b49;
					border-radius: 50%;
					.inner {
						width: 18rpx;
						height: 18rpx;
						background : rgba(236,104,23,1);
						border-radius: 50%;
					}
				}
			}
			.rightContent {
				flex: 1;
				padding: 0 10rpx 40rpx;
				margin-left: 20rpx;
				min-height: 50rpx;
			}
			.leftContent {
				flex:1;
				padding: 0 10rpx 40rpx;
				display: flex;
				flex-flow: column;
				align-items: flex-end;
				margin-right:20rpx;
				min-height: 50rpx;
			}
		}
	}
</style>
