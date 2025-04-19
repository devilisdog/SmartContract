<template>
	<view class="box">
		<nav-bar :title="'走势图表'" :back="true" :bgColor="bgColor"></nav-bar>
		<view style="padding: 20px 15px;">
			<view class="content">
				<view class="title">福彩</view>
				<view class="trend">
					<view class="trend_item" @click="btn(1)">双色球走势图</view>
					<view class="trend_item" @click="btn(2)">快乐8走势图</view>
					<view class="trend_item" @click="btn(3)">福彩3D走势图</view>
					<view class="trend_item" @click="btn(4)">七乐彩走势图</view>
				</view>
			</view>
			<view class="content">
				<view class="title">体彩</view>
				<view class="trend">
					<view class="trend_item" @click="btn(5)">大乐透走势图</view>
					<view class="trend_item" @click="btn(6)">排列三走势图</view>
					<view class="trend_item" @click="btn(7)">排列五走势图</view>
					<view class="trend_item" @click="btn(8)">七星彩走势图</view>
				</view>
			</view>
			<image src="@/static/img/main/trend.f3ca8c33.png"
				style="height:80px;position:fixed;bottom: 0px;width:91%;"></image>
		</view>
	</view>
</template>

<script>
	import navBar from "@/components/nav-bar/nav-bar.vue"
	export default {
		data() {
			return {
				bgColor: "",
				fontColor: ""
			}
		},
		onLoad() {
			this.bgColor = uni.getStorageSync("bgColor");
			// console.log(this.bgColor, '测试');
			this.fontColor = uni.getStorageSync("fontColor");
		},methods:{
			btn(index){
				let title;
				let url;
				if(index==1){
					title="双色球";
					url="https://m.jiangduoduo.com/chart?lotteryId=1001&iss&frm=C_RAINBOW&ct=T_BASE"
				}else if(index==2){
					title="快乐8";
					url="https://m.jiangduoduo.com/chart?lotteryId=1066&iss&frm=C_RAINBOW&ct=T_BASE"
				}else if(index==3){
					title="福彩3D";
					url="https://m.jiangduoduo.com/chart?lotteryId=1002&iss&frm=C_RAINBOW&ct=T_BASE"
				}else if(index==4){
					title="七乐彩";
					url="https://m.jiangduoduo.com/chart?lotteryId=1006&iss&frm=C_RAINBOW&ct=T_BASE"
				}else if(index==5){
					title="大乐透";
					url="https://m.jiangduoduo.com/chart?lotteryId=1000&iss&frm=C_RAINBOW&ct=T_BASE"
				}else if(index==6){
					title="排列三";
					url="https://m.jiangduoduo.com/chart?lotteryId=1003&iss&frm=C_RAINBOW&ct=T_BASE"
				}else if(index==7){
					title="排列五";
					url="https://m.jiangduoduo.com/chart?lotteryId=1004&iss&frm=C_RAINBOW&ct=T_BASE"
				}else if(index==8){
					title="七星彩";
					url="https://m.jiangduoduo.com/chart?lotteryId=1105&iss&frm=C_RAINBOW&ct=T_BASE"
				}
				let obj={}
				obj.title=title;
				obj.url=url
				uni.navigateTo({
					url:"/pages/trend/trendView?obj="+encodeURIComponent(JSON.stringify(obj))
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		margin-top: 27px;

		.title {
			font-size: 34upx;
			font-weight: 700;
			color: #333;
		}

		.trend {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.trend_item {
				margin-top: 15px;
				width: 47%;
				height: 72upx;
				line-height: 72upx;
				text-align: center;
				border: 1px solid #5f6779;
				border-radius: 20px;
				color: #4e5c7c;
				font-size: 26upx;
			}
		}
	}
</style>