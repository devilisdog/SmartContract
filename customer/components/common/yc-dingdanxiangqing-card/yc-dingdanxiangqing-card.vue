<template>
	<view class="kap">
		<uni-card style="width: 97%;margin-left: 10rpx;margin-top: 30rpx;" margin="0" spacing="0" padding="0">
			<view style="width: 100%;height:80rpx;">
				<view style="padding-top:25rpx;padding-left:rpx;float: left;margin-left: 20rpx;">
					<text class="text">订单详情</text>
					<text class="text" style="margin-left: 20rpx;">{{duoshaoqi}}</text>
				</view>
				<view style="float:right;margin-top: 25rpx;margin-right: 20rpx;">
					<text class="tou" style="background-color:#898fff;">{{leixi}}</text>
					<text class="tou" style="background-color:red;">{{beilv}}倍</text>
					<text class="tou" style="background-color:deepskyblue;">{{beishu}}注</text>
				</view>
			</view>

			<view style="width: 725rpx; background-color:#f5f5f5; margin: auto;text-align:center;">
				<text style="margin-right: 40rpx;margin-left: 30rpx;">场次</text>
				<text style="margin-left: 70rpx;margin-right: 40rpx;">主队/客场</text>
				<text style="margin-left: 40rpx;margin-right: 40rpx;">投注内容</text>
				<text style="margin-left: 40rpx;margin-right: 40rpx;">赛果（全/半）</text>
			</view>
		<uni-card margin="0" spacing="0" padding="0">
			<view v-for="itme,index in ceshi" style="margin:20rpx auto;display: flex; flex-direction: row; "
				:style="index%2==0? 'background-color:white;':'background-color: #ececec;'">
				<!-- 通过index判断颜色 -->
				<view style="flex:16;display: flex;justify-content: center;" class="text">
					<view
						style="width: 100%; height: 100%;display: flex;justify-content: center;align-items:center;">
						<text style="font-size:25rpx;">{{ceshi[index].name}}</text>
					</view>
				</view>
				<view style="flex:20;flex-flow: wrap;display: flex;flex-direction: column;margin-top: 20rpx;"
					class="text">
					<view>
						<text>{{ceshi[index].shang}}</text>
					</view>
					<view style="margin-left: 130rpx;margin-top: -45rpx;" :style="ceshi[index].panduan-0 < 0 ? 'color:blue;' :ceshi[index].panduan-0 > 0? 'color:red;' :'' ">
					<text v-show="ceshi[index].panduan!=0 ">（{{ceshi[index].panduan}})</text>
					</view>	
					<view>
						<text>VS</text>
					</view>
					<view style="margin-top: 10rpx;">
						<text>{{ceshi[index].xiao}}</text>
						<view style="margin-left: 130rpx;margin-top: -45rpx;" :style="ceshi[index].panduang-0 < 0 ? 'color:blue;' :ceshi[index].panduang-0 > 0? 'color:red;' :'' ">
						<text v-show="ceshi[index].panduang!=0 ">({{ceshi[index].panduang}})</text>
						</view>	
					</view>
				</view>
				<view style="flex:25;margin-left:20rpx;" class="text">
					<view v-for="itme,index in ceshi[index].nr"
						style="margin-top: 10rpx;display: flex;flex-direction:column;flex-wrap:wrap; text-align:center;">
						<text style="font-size: 10rpx;">{{itme.xiao}}</text>
						<text>（{{itme.neir}}）</text>
					</view>
				</view>
				<view style="flex:25;float: left;margin-left:30rpx; " class="text">
					<view style="margin-top: 50rpx;display: flex;display: flex; flex-direction: column;">
						<text>{{ceshi[index].beilv2}}</text>
						<text>{{ceshi[index].saiguo}}</text>
		
					</view>
				</view>
			</view>
		</uni-card>
		<view style="text-align: center;font-size: 10px;display: flex;flex-direction: column;margin-top: 10rpx;margin-bottom: 10rpx;">
			<view>
				<text style="color: red;">注意:</text>
				<text>北单为浮动赔率,购买时的赔率仅供参考</text>
				</view>
			<view>
				<text>北单奖金计算公式=2x所选场次的开奖SP值X</text>
				<text style="color: red;">65%</text>倍数
			</view>
		</view>	
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
	const duoshaoqi =ref("2022078期")
	const beishu = ref("5")
	const beilv = ref("80")
	const leixi = ref("2串5")
	const ceshi = reactive([{
			name: "周日303",
			shang: "芬兰",
			panduan:"-1.20",
			xiao: "黑山",
			panduang:"1.20",
			nr: [{
					xiao: "让胜",
					neir: "1.27",
				},{
						xiao: "黑山",
						neir: "胜",
					},
					{
							xiao: "黑山",
							neir: "胜",
						}
				
			],
			
			beilv2: "1.86",
			saiguo: "-/-",
			zhi: "0"
		},
		{
				name: "周日303",
				shang: "芬兰",
				panduan:"-1.20",
				xiao: "黑山",
				panduang:"1.20",
				nr: [{
						xiao: "让胜",
						neir: "1.27",
					},
					
				],
				
				beilv2: "1.86",
				saiguo: "-/-",
				zhi: "0"
			},
	{
			name: "周日303",
			shang: "芬兰",
			panduan:"-1.20",
			xiao: "黑山",
			panduang:"1.20",
			nr: [{
					xiao: "让胜",
					neir: "1.27",
				},
				
			],
			
			beilv2: "1.86",
			saiguo: "-/-",
			zhi: "0"
		},
		{
				name: "周日303",
				shang: "芬兰",
				panduan:"-1.20",
				xiao: "黑山",
				panduang:"1.20",
				nr: [{
						xiao: "让胜",
						neir: "1.27",
					},
					{
						xiao: "黑山",
						neir: "胜",
					}
				],
				
				beilv2: "1.86",
				saiguo: "-/-",
				zhi: "0"
			},
		
	])
</script>

<style>
	.kap {
		width: 100%;
		height: 100%;
	}

	.hongse {
		background-color: red;
		color: white;
		padding: 2rpx 10rpx;
		border-radius: 10rpx;
		margin-left: 10rpx;
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
</style>
