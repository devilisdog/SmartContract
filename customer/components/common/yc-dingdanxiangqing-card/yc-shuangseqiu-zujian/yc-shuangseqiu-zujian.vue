<template>
	<view class="kap">
		<uni-card style="width: 97%;margin-left: 10rpx;margin-top: 30rpx;" margin="0" spacing="0" padding="0">
			<view style="width: 100%;height:80rpx;">
				<view style="padding-top:25rpx;padding-left:rpx;float: left;margin-left: 20rpx;">
					<text class="text">双色球</text>
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
				<view class="topshuzhi2" v-for="itme,index in 6" style="background-color: #ff0000;">
					<text style="color: white;font-size: 20px;">{{itme}}</text>
				</view>
				<view  class="topshuzhi2" v-for="itme,index in 1" style="background-color: #0000ff;">
					<text style="font-size: 20px;">{{itme}}</text>
				</view>
			</view>
			<view style="width: 100%; background-color:#f5f5f5; margin: auto;">
				<text class="lll">序号</text>
				<text class="lll" style="margin-left: 130rpx;">投注内容</text>
			</view>
			<uni-card margin="0" spacing="0" padding="0">
				<view v-for="itme,index in ceshi" style="width: 100%;display: flex;flex-direction: row;"
					:style="index%2==0? 'background-color:white;':'background-color: #ebebeb;'">
					<view style="display: flex;margin-left: 50rpx;margin-right: 30rpx; align-items: center;">
						<text>{{index+1}}</text>
					</view>
					<view style="display: flex;margin-left: 10rpx;margin-right: 30rpx; align-items: center;" v-for="itme,index in ceshi[index].danshi">
						<text>{{itme}}</text>
					</view>
					<view>
						<view class="box"
							style="text-align:center; justify-content: center;align-items: center;width: 100%; height: 100%;flex: 80;">
							<view style="display: flex;flex-direction: row;">
								<view style="display: flex;flex-flow: wrap;align-items: center;margin-top: 10rpx;"
									v-show="ceshi[index].dan.length!=0">
									<view
										style="justify-content: center;align-items: center;text-align: center;display: flex;flex-direction: column;"
										class="yuan" v-for="itme,index in ceshi[index].dan">
										<view>
											<text style="font-size: 20px;">{{itme}}</text>
										</view>
										<view>
											<text
												style="display: flex;justify-content: center;align-items: center;text-align: center;margin-top: -15rpx;font-size: 10px;">胆</text>
										</view>
									</view>
								</view>
							</view>
							<view style="display: flex;flex-direction: row;flex-flow: wrap;">
								<view class="topshuzhi"
									style="align-items: center;justify-content: center;display: flex;background-color: #ffe6e7;border-radius: 50rpx;flex-flow: wrap;"
									v-for="itme,index in ceshi[index].red">
									<text class="tt2"
										style="align-items: center;justify-content: center;display: flex;color: #ff585b;">{{itme<10?'0'+itme:itme}}</text>
								</view>
								<view style="display: flex;flex-direction: row;">
									<view class="topshuzhi"
										style="align-items: center;justify-content: center;display: flex;background-color: #cffffc;border-radius: 50rpx; margin-bottom: 25rpx;"
										v-for="itme,index in ceshi[index].bule">
										<text class="tt2"
											style="align-items: center;justify-content: center;display: flex;color: #11c0ff;">{{itme<10?'0'+itme:itme}}</text>
									</view>
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
	const duoshaoqi = ref("2022078期")
	const beishu = ref("5")
	const beilv = ref("80")
	const kaijiang = reactive([{
		kaiqiu: {
			red: [3,6,9],
		},
	
	}])
	const ceshi = reactive([{
			danshi: "单式",
			dan: [1, 2, 3],
			red: [1, 2, 3, 4, 5,6],
			bule: [11,],
		},
		{	
		danshi: "单式",
		dan: [1, 2, 3],
		red: [1, 2, 3, 4, 5,6],
		bule: [11,],
		},
	])
</script>

<style>
	.kap {
		width: 100%;
		height: 100%;
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

	.text {
		font-size: 25rpx;
		text-align: center;
	}

	.topshuzhi {
		margin: 0rpx 5rpx;
		width: 65rpx;
		height: 65rpx;
		color: white;
		text-align: center;
		border-radius: 50rpx;
	}
	.topshuzhi2 {
		margin: 0rpx 5rpx;
		width: 45rpx;
		height: 45rpx;
		color: white;
		border-radius: 50rpx;
		justify-content: center;
		text-align: center;
		align-items: center;
		display: flex;
		margin-left: 10rpx;
		margin-bottom: 20rpx;
	}

	.tt2 {
		font-size: 20px;
		font-weight: 700;
		justify-content: center;
		display: flex;
		align-items: center;

	}

	.yuan {
		margin: 0rpx 5rpx;
		width: 65rpx;
		height: 65rpx;
		color: white;
		border-radius: 50rpx;
		justify-content: center;
		display: flex;
		background-color: #ffe6e7;
		border-radius: 50rpx;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
		color: red;
	}
</style>
