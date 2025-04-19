<template>
	<view class="kap">
		<uni-card :style="'width:'+props.widths+'rpx;'"
		style="margin: auto;margin-top: 15rpx;" margin="0" spacing="20" padding="0" :border="false" shadow='0px 0px 3px 1px rgba(255, 255, 255, 0)'>
			<view style="width: 100%;height:80rpx;">
				<view style="padding-top:25rpx;padding-left:rpx;float: left;margin-left: 20rpx;">
					<text class="text">福彩3D</text>
					<text class="text" style="margin-left: 20rpx;">{{duoshaoqi}}</text>
				</view>
				<view style="float:right;margin-top: 25rpx;margin-right: 10rpx;">
					<text class="tou" style="background-color:red;">{{beilv}}倍</text>
					<text class="tou" style="background-color:deepskyblue;">{{beishu}}注</text>
				</view>
			</view>
			<view style="display: flex;flex-direction: row;margin-left: 20rpx;margin-top: 30rpx;" v-for="itme,index in kaijiang">
				<view style="margin-right: 30rpx;">
					<text style="font-size: 15px;">本期开奖</text>
				</view>
				<view class="topshuzhi2"  v-for="itme,index in kaijiang[index].kaiqiu.red"
					style="background-color: #ff0000;">
					<text style="color: white;font-size: 20px;">{{itme}}</text>	
				</view>
			</view>
			<view style="width: 100%; background-color:#f5f5f5;">
				<text class="lll">序号</text>
				<text class="lll" style="margin-left: 130rpx;">投注内容</text>
			</view>
			<uni-card margin="0" spacing="0" padding="0">
				<view v-for="itme,index in ceshi"
					style="display: flex;flex-direction: row;" :style="index%2==0? 'background-color:white;':'background-color: #ebebeb;'">
					<view	
						style="display: flex;align-items:center;text-align: center;justify-content: center;flex-flow: wrap;margin-left: 50rpx;">
						<text style="display: flex;font-size: 15px;">{{index+1}}</text>
					</view>
					<view
						style="flex-flow: wrap;display: flex;align-items:center;text-align: center;justify-content: center;margin-right: 30rpx;margin-left: 20rpx;">
						<text style="display: flex; font-size: 15px;">{{ceshi[index].danshi}}</text>
					</view>
					<view style="display: flex;flex-direction: column;">
						<view style="display: flex;flex:25; flex-flow: wrap;display:flex;align-items: center; margin-top: 20rpx;">
								<text style="font-size: 15px;">{{ceshi[index].baiwei}}</text>
							<view class="topshuzhi" v-for="itme,index in ceshi[index].bai">
								<view>
									<text class="tt2">{{itme}}</text>
								</view>
							</view>
						</view>
						<view  style="display: flex;flex-direction: row;flex:25;margin-top: 20rpx;">
								<text style="font-size: 15px;">{{ceshi[index].shiwei}}</text>
							<view class="topshuzhi" v-for="itme,index in ceshi[index].shi">
								<view >
									<text class="tt2"
										style="align-items: center;justify-content: center;display: flex;">{{itme}}</text>
								</view>
							</view>
						</view>
						<view  style="display: flex;flex-direction: row;flex:25;margin-bottom: 18rpx;margin-top: 20rpx;">
								<text style="font-size: 15px;">{{ceshi[index].geiwei}}</text>
							<view class="topshuzhi" v-for="itme,index in ceshi[index].ge">
								<view
									style="align-items: center;justify-content: center;display: flex;">
									<text class="tt2">{{itme}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</uni-card>
		</uni-card>
	</view>
	<uni-card style="width: 97%;margin-left: 10rpx; margin-top: 10rpx;" margin="0" spacing="0" padding="0">
		<yc-didanxiangqing-card></yc-didanxiangqing-card>
	</uni-card>
</template>

<script setup>
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		defineEmits, //发送数据
		defineProps,
		// nextTick
	} from 'vue';
	const props = defineProps(['widths'])
	const duoshaoqi = ref("2022078期")
	const beishu = ref("5")
	const beilv = ref("80")
	const kaijiang = reactive([{
		kaiqiu: {
			red: [3,6,9],
		},
	}])
	const ceshi = reactive([{
		danshi: "单选复式",
		baiwei: "百位:",
		shiwei: "十位:",
		geiwei: "个位:",
			ge: [1, 2, 3,4,5,6,7,8,9],
			shi: [3, 2, 1],
			bai: [3, 2],
	},
	{
		danshi: "单选复式",
		baiwei: "百位:",
		shiwei: "十位:",
		geiwei: "个位:",
			ge: [1, 2, 3,4,5,6,7,8,9],
			shi: [3, 2, 1],
			bai: [3, 2],
	}
	])
</script>

<style>
	.kap {
		width: 100%;
		height: 100%;
	}



	.lianse {
		background-color: deepskyblue;
		color: white;
		padding: 2rpx 10rpx;
		border-radius: 10rpx;
		margin-left: 10rpx;
	}

	.nibu {
		width: 96%;
		height: 82%;
		background-color: #202736; 
		margin: 11rpx auto;
	}

	.myCard2 {
		width: 700rpx;
		height: 300rpx;
		float: left;
		margin-bottom: 200rpx;
		border-radius: 10rpx;
		margin-left: 25rpx;

	}

	.chuang {
		color: white;
		padding: 2rpx 10rpx;
		border-radius: 10rpx;
		background-color: #9999ff;
		justify-content: center;
		margin-left: 10rpx;
	}

	.changtiao {
		width: 97%;
		height: 50rpx;
		background-color: #EBEBEB;
		display: flex;
		flex-direction: row;
		text-align: center;
		text-align: center;
		border-radius: 2px;
		margin-left: 10rpx;
		margin-top: 10rpx;
	}

	.lll {
		padding: 0rpx 35rpx 0rpx 40rpx;
	}
	.tou {
		padding: 0rpx 10rpx 0rpx 10rpx;
		border-radius: 10rpx;
		color: white;
		margin-left: 10rpx;
		font-weight: 550;
	}

	.text{
		font-size:32rpx;
		color: black;
		font-weight:bold;
	}

	.topshuzhi {
		width: 40rpx;
		height: 40rpx;
		color: white;
		border-radius: 50rpx;
		justify-content: center;
		align-items: center;
		text-align: center;
		display: flex;
		background-color: #ffe6e7;
		border-radius: 50rpx;
	}
	.topshuzhi2 {
		width: 45rpx;
		height: 45rpx;
		color: white;
		border-radius: 50rpx;
		justify-content: center;
		align-items: center;
		text-align: center;
		display: flex;
		margin-left: 10rpx;
		margin-bottom: 20rpx;
	}

	.tt2 {
		font-size: 10px;
		font-weight: 700;
		justify-content: center;
		align-items: center;
		text-align: center;
		display: flex;
		color: red;
		font-size: 20px;
	}
</style>
