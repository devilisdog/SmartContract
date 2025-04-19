<template>
	<div style="width:680rpx;margin: auto;padding: 20rpx;background-color: white;border-radius: 10rpx;">
		
		<div style="display: flex;align-items: center;justify-content: space-between;">
			<text class="fontStyle">{{orderData.data.type}} {{orderData.data.gametype}}</text>
			<div style="display: flex;align-items: center;">
				<text class="tou" style="background-color:deepskyblue;">{{orderData.data.remarks.Note}}注</text>
				<text class="tou" style="background-color:red;">{{orderData.data.remarks.Multiple}}倍</text>
				<view class="touguog" style="background-color:#898fff;"
					v-show=" orderData.data.remarks.reachType.length <3">
					<text class="tou2" v-for="item,index in orderData.data.remarks.reachType">
						{{item}}
					</text>
				</view>
				
				<view class="touguog" style="background-color:#898fff;" @click="open()"
					v-show="orderData.data.remarks.reachType.length >= 3">
					<text class="tou2" v-for="item,index in orderData.data.remarks.reachType">
						{{item}}
					</text>
				</view>
			</div>
		</div>
		<div style=" background-color:#f5f5f5;display: flex;justify-content: space-around;">
			<text>场次</text>
			<text>主队/客场</text>
			<text>投注内容</text>
			<text>赛果（全/半）</text>
		</div>
		
		<div class="neir" v-for="item,index in orderData.data.Content" :key="index" :style="index%2!=0?'background-color: #ececec;':''">
			<text style="font-size:30rpx;width:60px;">{{index+1}}</text>
			<div style="display: flex;align-items: center;justify-content: center;width:200px;">
				<div>
					<text>{{item.awayTeamAbbName}}</text>
				</div>
				<text style="font-size:24rpx;color:red;">VS</text>
				<div>
					<text>{{item.homeTeamAbbName}}</text>
				</div>
			</div>
			<div style="display: flex;flex-flow: column;align-items: center;width:130px">
				<div v-for="itemNr,indexNr in orderData.data.Content[index].data" style="display: flex;flex-flow:column;align-items: center;"
					:style="itemNr.zhongping > 0?'color:red;':''">
					<text>{{itemNr.res}}</text>
				</div>
			</div>
			<div style="display: flex;flex-flow: column;align-items: center;width:180px;">
				<text>-/-</text>
			</div>
		</div>

		<div style="text-align: center;margin:20rpx 0rpx;">
			<text style="color: red;">注意:</text>
			<text>北单为浮动赔率,购买时的赔率仅供参考</text><br>
			<text>北单奖金计算公式=2x所选场次的开奖SP值X</text>
			<text style="color: red;">65%</text>倍数
		</div>
	</div>
	<uni-popup ref="popup" type="center">
		<view class="popupCard">
			<text style="font-size:40rpx;font-weight:600;">过关方式</text>
			<view style="width:550rpx;margin-top:80rpx;display: flex;flex-wrap: wrap;align-items: center;">
				<text>您的过关方式为:</text>
				<view v-for="item,index in orderData.data.remarks.reachType">
					<text class="tou" style="background-color:#898fff;">{{item}}</text>
				</view>
			</view>
		</view>
	</uni-popup>
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
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const props = defineProps(['data'])
	const orderData=reactive([])
	onBeforeMount(()=>{
		orderData.data=props.data
	})
	const open = () => {
		proxy.$refs.popup.open()
	}
</script>

<style>
	.touguog {
		max-width:200rpx;
		padding: 8rpx 10rpx;
		height: 25rpx;
		font-size: 28rpx;
		line-height: 25rpx;
		text-align: center;
		border-radius: 5rpx;
		color: white;
		font-weight: bold;
		margin: 5rpx 5rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: keep-all;
	}
	
	.tou2 {
		width: fit-content;
		padding: 8rpx 10rpx;
		height: 25rpx;
		font-size: 28rpx;
		line-height: 25rpx;
		border-radius:5rpx;
		color: white;
		font-weight: bold;
	}
	.neir {
		padding:20rpx 20rpx;
		margin:auto;
		display: flex;
		align-items: center;
		justify-content:space-around;
		color: black;
		text-align: center;
	}
	.tou {
		width:fit-content;
		padding:0px 5px;
		height:25px;
		font-size:14px;
		line-height:25px;
		text-align: center;
		border-radius:5px;
		color: white;
		font-weight: bold;
		margin:5px 5px;
	}

	.fontStyle {
		font-size:32rpx;
		color: black;
		font-weight:bold;
	}
</style>