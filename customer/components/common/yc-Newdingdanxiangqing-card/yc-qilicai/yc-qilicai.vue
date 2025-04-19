<template>
	<div style="width:680rpx;margin: auto;padding: 20rpx;background-color:white;border-radius:10rpx;">
		<div style="display: flex;justify-content: space-between;align-items: center;">
			
			<div class="fontStyle"><text>{{props.data.Type}}</text></div>
			
			<div style="display:flex;">
				<div class="tou" style="background-color:red;padding:5rpx 10rpx;">1倍</div>
				<div class="tou" style="background-color:deepskyblue;padding:5rpx 10rpx;">{{orderCardData.data.length}}注</div>
			</div>
		</div>
		<div style="display: flex;background-color: #f5f5f5;margin:10rpx 0rpx;justify-content:space-between;">
			<text style="margin-left:20px;">序号</text>
			<text>投注内容</text>
			<text style="margin-right:20px;">注数信息</text>
		</div>
		<div style="display: flex;align-items: center;justify-content:space-between;" 
					v-for="item,index in orderCardData.data" :style="index%2?'background-color: #f5f5f5;':''">
			<div style="margin:0px 20px;">
				<text>{{index+1}}、</text>
				<text v-if="item.data.value.length==7">单式</text>
				<text v-if="item.data.value.length!=7 && item.data.dan.length==0">复式</text>
				<text v-if="item.data.dan.length>0">胆拖</text>
			</div>
			
			<div style="display: flex;flex-wrap: wrap;align-items: center;flex: 1;">

				<div v-for="item,index in item.data.dan" class="qiuDan" style="margin:5px;">
					<text style="font-size:14px;">{{item}}</text>
					<text style="margin-top:-15px;">胆</text>
				</div>

				<div v-for="item,index in item.data.value" class="qiu" style="margin:5px;">{{item}}</div>

			</div>

			<div style="display: flex;flex-flow:column;text-align: center;margin-right:20px;align-items: flex-end;">
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
	const orderCardData=reactive([])
	onBeforeMount(()=>{
		orderCardData.data=JSON.parse(props.data.BetContent)
	})
</script>

<style>
	.qiu{
		width:60rpx;
		height:60rpx;
		background-color:#ffdedf;
		border:1px #ffcdcd solid;
		border-radius:100px;
		color: red;
		display: flex;
		align-items: center;
		justify-content: center;
		
	}
	.qiuDan{
		width:60rpx;
		height:60rpx;
		background-color:#ffdedf;
		border:1px #ffcdcd solid;
		border-radius:100px;
		color: red;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
	}
	.tou{
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

</style>
