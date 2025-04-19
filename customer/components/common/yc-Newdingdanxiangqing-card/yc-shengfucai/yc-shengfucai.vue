<template>
	<div style="width:680rpx;margin: auto;background-color: white;padding:20rpx;border-radius:10rpx;">
		<div style="display: flex;align-items: center;justify-content: space-between;margin:10rpx;">
			<text class="fontStyle">{{detailData.data.type}} {{detailData.data.gametype}}</text>
			<div style="display: flex;align-items: center;">
				<div class="tou" style="background-color:deepskyblue;">{{detailData.data.remarks.Note}}注</div>
				<div class="tou" style="background-color:red;">{{detailData.data.remarks.Multiple}}倍</div>
				<view class="touguog" style="background-color:#898fff;"
					v-show=" detailData.data.remarks.reachType.length <3">
					<text class="tou2" v-for="item,index in detailData.data.remarks.reachType">
						{{item}}
					</text>
				</view>
				<view class="touguog" style="background-color:#898fff;" @click="open()"
					v-show="detailData.data.remarks.reachType.length >= 3">
					<text class="tou2" v-for="item,index in detailData.data.remarks.reachType">
						{{item}}
					</text>
				</view>
			</div>
		</div>
		<div style=" background-color:#f5f5f5;display: flex;justify-content: space-around;margin: auto;">
			<text>场次</text>
			<text>主队/客场</text>
			<text>投注内容</text>
			<text>赛果（全/半）</text>
		</div>
		<div class="neir" v-for="item,index in detailData.data.Content" :key="index"
			:style="index%2!=0?'background-color: #ececec;':''">
			<text style="font-size:30rpx;width:90rpx;">{{index+1}}</text>
			<div style="display: flex;align-items: center;justify-content: center;width:190rpx;">
				<div>
					<text>{{item.awayTeamAbbName}}</text>
				</div>
				<text style="font-size:24rpx;color:red;">VS</text>
				<div>
					<text>{{item.homeTeamAbbName}}</text>
				</div>
			</div>
			<div style="display: flex;flex-flow: column;align-items: center;width:140rpx;">
				<div v-for="itemNr,indexNr in item.data"
					style="display: flex;flex-flow:column;align-items: center;"
					:style="itemNr.zhongping > 0?'color:red;':''">
					<text>{{itemNr.res}}</text>
				</div>
			</div>
			<div style="display: flex;flex-flow: column;align-items: center;width:180rpx;">
				<text>-/-</text>
			</div>
		</div>
		<div style="text-align: center;">
			<div>
				<text style="color: red;">注意:</text>
				<text>北单为浮动赔率,购买时的赔率仅供参考</text>
			</div>
			<div>
				<text>北单奖金计算公式=2x所选场次的开奖SP值X</text>
				<text style="color: red;">65%</text>倍数
			</div>
		</div>
	</div>
	<uni-popup ref="popup" type="center">
		<view class="popupCard">
			<text style="font-size:40rpx;font-weight:600;">过关方式</text>
			<view style="width:550rpx;margin-top:80rpx;display: flex;flex-wrap: wrap;align-items: center;">
				<text>您的过关方式为:</text>
				<view v-for="item,index in detailData.data.remarks.reachType">
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
	const detailData=reactive([])
	const props = defineProps(['data'])
	const orderData = reactive([])
	
	onBeforeMount(() => {
		detailData.data=props.data
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
		margin:20rpx 0rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		color: black;
		text-align: center;
	}

	.tou {
		width:fit-content;
		padding:8rpx 10rpx;
		height:25rpx;
		font-size:28rpx;
		line-height:25rpx;
		text-align: center;
		border-radius:5rpx;
		color: white;
		font-weight: bold;
		margin:5rpx 5rpx;
	}

	.fontStyle {
		font-size:32rpx;
		color: black;
		font-weight:bold;
	}
	text{
		font-size:28rpx;
	}
</style>
