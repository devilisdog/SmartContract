<template>
	<div style="background-color:white;width:680rpx;border-radius:10rpx;padding:20rpx;margin: auto;">
		<div style="display: flex;justify-content: space-between;align-items: center;margin-bottom:20rpx;">
			<text style="font-size:32rpx;color:black;font-weight:bold;">{{orderData.data[0].name}}</text>	
			<div style="display:flex;">
				<div class="tou" style="background-color:red;">1倍</div>
				<div class="tou" style="background-color:deepskyblue;">{{orderData.data.length}}注</div>
			</div>
		</div>
		<div style="background-color:#f5f5f5;display: flex;justify-content:space-between;">
			<text style="margin-left:20px;">序号</text>
			<text>投注内容</text>
			<text style="margin-right:20px;">注数信息</text>
		</div>
		
		<div style="display: flex;align-items: center;justify-content:space-between;margin:20rpx 0rpx;" 
			  v-for="item,index in orderData.data"
			  :style="index%2==0? 'background-color:white;':'background-color: #ebebeb;'">
			  
			<div style="margin:0px 15px;text-align: center;">
				<text>{{index+1}}、</text>
				<text>单式</text>
			</div>

			<div style="display: flex;flex-wrap: wrap;flex: 1;">
				<div class="redBall" v-for="itemS,indexS in item.data.list.red">
					<text>{{itemS}}</text>
				</div>
				<div class="blueBall" v-for="itemS,indexS in item.data.list.blue">
					<text>{{itemS}}</text>
				</div>
			</div>

			<div style="display: flex;flex-flow:column;text-align: center;align-items: center;margin-right:30px;">
				<div class="tou" style="background-color:red;">{{1}}倍</div>
				<div class="tou" style="background-color:deepskyblue;">{{1}}注</div>
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
	const orderData=reactive([])
	const props = defineProps(['data'])

	onBeforeMount(()=>{
		orderData.data=JSON.parse(props.data.BetContent)
	})
</script>

<style>
	.redBall{
		width:60rpx;
		height:60rpx;
		background-color:#ffdedf;
		border:1px solid #ffa7a9;
		border-radius:100px;
		text-align: center;
		line-height:60rpx;
		color: red;
		margin:5rpx 5rpx;
	}
	.blueBall{
		width:60rpx;
		height:60rpx;
		background-color:#c6f2ff;
		color:#397eff;
		border:1px solid #8fd3ff;
		border-radius:100px;
		text-align: center;
		line-height:60rpx;
		margin:5rpx 5rpx;
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
