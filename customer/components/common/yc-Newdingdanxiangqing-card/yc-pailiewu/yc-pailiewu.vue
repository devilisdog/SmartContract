<template>
	<div style="background-color: white;width:680rpx;border-radius:10rpx;margin: auto;padding:20rpx;">
		<div style="display: flex;justify-content:space-between;margin-bottom:20rpx;align-items: center;">
			<text style="font-size:32rpx;color:black;font-weight:bold;">{{props.data.Type}}</text>
			<div style="display:flex;">
				<div class="tou" style="background-color:red;">1倍</div>
				<div class="tou" style="background-color:deepskyblue;">{{orderData.data.length}}注</div>
			</div>

		</div>
		<div style="background-color:#f5f5f5;display: flex;margin:20rpx 0rpx;justify-content:space-between;">
			<text style="margin-left:20px;">序号</text>
			<text>投注内容</text>
			<text style="margin-right: 20px;">注数信息</text>
		</div>

		<div style="display: flex;align-items: center;justify-content:space-between;" 
			v-for="item,index in orderData.data" :style="index%2?'background-color: #f5f5f5;':''">

			<div style="margin:0px 10px;text-align: center;">
				<text>{{index+1}}、</text>
				<text>单式</text>
			</div>

			<div style="flex-wrap: wrap;color:white;;margin:5px 0px;width:350rpx;word-wrap: break-word;">
				<span v-for="itemS,indexS in item.data">
					<span v-if=" indexS!=0 && indexS!='dan'&&indexS!='data'" style="color:black;">|</span>
					<span v-for="itemSX,indexSX in itemS" class="redQiu">{{itemSX}}</span>
				</span>
			</div>

			<div style="display: flex;flex-flow:column;text-align: center;align-items:flex-end;margin-right:20px;">
				<div class="tou" style="background-color:red;">{{item.beilv}}倍</div>
				<div class="tou" style="background-color:deepskyblue;">{{item.note}}注</div>
			</div>
		</div>
	</div>
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

	const props = defineProps(['data'])
	const orderData=reactive([])
	onBeforeMount(()=>{
		orderData.data=JSON.parse(props.data.BetContent)
	})
	const wei=reactive(['第一位','第二位','第三位','第四位','第五位','第六位','第七位'])
</script>

<style scoped>
	.redQiu{
		padding:8rpx 19rpx;
		border-radius:100px;
		background-color: #ffdcdc;
		border:1px #ffa4a4 solid;
		color: red;
		line-height:50px;
		margin:0px 5px;
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
</style>
