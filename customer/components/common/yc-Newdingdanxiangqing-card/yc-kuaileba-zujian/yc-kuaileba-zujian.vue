<template>
	<div style="width:680rpx;margin: auto;padding: 20rpx;background-color:white;border-radius:10rpx;">
		<div style="display: flex;justify-content: space-between;">
			<div class="fontStyle">
				<text >{{props.data.Type}}</text>
			</div>
			<div style="display:flex;">
				<div class="tou" style="background-color:red;">1倍</div>
				<div class="tou" style="background-color:deepskyblue;">{{orderCardData.data.length}}注</div>
			</div>
		</div>
		<div style="display: flex;background-color: #f5f5f5;margin:10rpx 0rpx;justify-content:space-between;">
			<text style="margin-left:20px">序号</text>
			<text>投注内容</text>
			<text style="margin-right:20px;">注数信息</text>
		</div>
		<div style="display: flex;align-items: center;justify-content:space-between;margin:20rpx 0rpx;" 
			 v-for="item,index in orderCardData.data" :style="index%2?'background-color: #f5f5f5;':''">

			<div style="margin:0px 20px">
				<text>{{index+1}}、</text>
				<text>{{titleData[item.happy8Type-1].title}}</text><br>
				<text v-if="item.data.value.length <= item.happy8Type && item.data.dan.length==0">单式</text>
				<text v-if="item.data.value.length > item.happy8Type && item.data.dan.length==0">复式</text>
				<text v-if="item.data.dan.length > 0">胆拖</text>
			</div>
		
			<div style="display: flex;flex-wrap: wrap;flex:1;align-items: center;margin:5px 0px;">
				<div  class="qiuDan" v-for="itemS,indexS in item.data.dan" style="margin:5px;">
					<text style="font-size:28rpx;">{{itemS}}</text>
					<text style="margin-top:-18px;">胆</text>
				</div>
				<div  class="qiu" v-for="itemS,indexS in item.data.value" style="margin:5px;">{{itemS}}</div>
			</div>
			<div style="display: flex;flex-flow: column;text-align: center;margin-right:20px;align-items: flex-end;">
				<text class="tou" style="background-color:red;">{{item.beilv}}倍</text>
				<text class="tou" style="background-color:deepskyblue;">{{item.note}}注</text>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onBeforeMount,
		reactive,
		getCurrentInstance,
		defineProps,
	} from 'vue';
	const props = defineProps(['data'])
	const orderCardData=reactive([])
	onBeforeMount(()=>{
		orderCardData.data=JSON.parse(props.data.BetContent)
	})

	const titleData=reactive([
		{title:'选一'},
		{title:'选二'},
		{title:'选三'},
		{title:'选四'},
		{title:'选五'},
		{title:'选六'},
		{title:'选七'},
		{title:'选八'},
		{title:'选九'},
		{title:'选十'}
	])
</script>

<style>
	.qiu{
		width:60rpx;
		height:60rpx;
		background-color: #ffdcdc;
		border:1px #ffa4a4 solid;
		border-radius: 100px;
		text-align: center;
		color: red;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.qiuDan{
		width:60rpx;
		height:60rpx;
		background-color: #ffdcdc;
		border:1px #ffa4a4 solid;
		border-radius: 100px;
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
		color:black;
		font-weight:bold;
	}
</style>
