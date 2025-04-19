<template>
	<view class="Card">
		<view style="display: flex;align-items: center;justify-content: space-between;">
			<text style="font-weight:bold;" v-if="arrInquire(props.xiaoqin.Type)">
				{{xiaoqin.data.type}} {{xiaoqin.data.gametype}}
			</text>
			<text style="font-weight:bold;" v-else>{{props.xiaoqin.Type}}</text>
			<view style="display: flex;">
				<view class="tou" style="background-color:deepskyblue;">
					<text v-if="arrInquire(props.xiaoqin.Type)">{{xiaoqin.data.remarks.Note}}注</text>
					<text v-else>{{xiaoqin.data.length}}注</text>
				</view>
				<view class="tou" style="background-color:red;">
					<text v-if="arrInquire(props.xiaoqin.Type)">
						{{xiaoqin.data.remarks.Multiple}}倍
					</text>
					<text v-else>1倍</text>
				</view>
				<view v-if="arrInquire(props.xiaoqin.Type)&&props.xiaoqin.Type!='任选九'&&props.xiaoqin.Type!='胜负彩'">
					<view class="touguog" style="background-color:#898fff;"
						v-show=" xiaoqin.data.remarks.reachType.length <3">
						<text class="tou2" v-for="item,index in xiaoqin.data.remarks.reachType">
							{{item=='1单关1'?'单关':item}}
						</text>
					</view>
					<view class="touguog" style="background-color:#898fff;" @click="open()"
						v-show="xiaoqin.data.remarks.reachType.length >=3">
						<text class="tou2" v-for="item,index in xiaoqin.data.remarks.reachType">
							{{item=='1单关1'?'单关':item}}
						</text>
					</view>
				</view>
			</view>
		</view>
		<view style="height:320rpx;display: flex;align-items: center;justify-content: center;flex-flow: column;">
			<image src="@/static/icon/index/lock.png" style="width:150rpx;height:150rpx;"></image>
			<text>接单后显示投注内容</text>
		</view>
	</view>
	<uni-popup ref="popup" type="center" v-if="arrInquire(props.xiaoqin.Type)">
		<view class="popupCard">
			<text style="font-size:40rpx;font-weight:600;">过关方式</text>
			<view style="width:550rpx;margin-top:80rpx;display: flex;flex-wrap: wrap;align-items: center;">
				<text>您的过关方式为:</text>
				<view v-for="item,index in xiaoqin.data.remarks.reachType">
					<text class="tou" style="background-color:#898fff;">
						{{xiaoqin.data.type=='北京单场' && item=='1单关1'?'单关':item}}
					</text>
				</view>
				
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
		defineEmits,
		defineProps,
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const props=defineProps(['xiaoqin'])
	const xiaoqin=reactive([])
	const TypeState=reactive(['竞彩足球','竞彩篮球','胜负过关','北京单场','任选九','胜负彩'])
	
	const arrInquire=(itme)=>{//查找数组中是否有对应的值，返回true或者false
		var inquire=TypeState.includes(itme)
		return inquire
	}

	onBeforeMount(()=>{
		xiaoqin.data=JSON.parse(props.xiaoqin.BetContent)

	})
	const open = () => {
		proxy.$refs.popup.open()
	}
</script>

<style>
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
	.touguog {
		max-width:180rpx;
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
	.tou {
		width: fit-content;
		padding: 8rpx 10rpx;
		height: 25rpx;
		font-size: 28rpx;
		line-height: 25rpx;
		text-align: center;
		border-radius: 5rpx;
		color: white;
		font-weight: bold;
		margin: 5rpx 5rpx;
	}
	.Card{
		width:680rpx;
		height:400rpx;
		background-color: white;
		border-radius:10rpx;
		margin: auto;
		padding: 20rpx;
	}
	.popupCard {
		width: 600rpx;
		height: 300rpx;
		background-color: white;
		border-radius: 20rpx;
		display: flex;
		flex-flow: column;
		align-items: center;
	}

</style>
