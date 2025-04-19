<template>
	<div style="background-color: white;width:680rpx;border-radius:10rpx;margin: auto;padding:20rpx;">
		
		<div style="display: flex;justify-content:space-between;margin-bottom:20rpx;align-items: center;">
			<text style="font-size:32rpx;font-weight:bold;color: black;">{{props.data.Type}}</text>
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
		
		<div style="display: flex;align-items: center;justify-content:space-between;"  
			v-for="item,index in orderData.data" :style="index%2?'background-color: #f5f5f5;':''">

			<div style="margin:0px 10px;">
				<text>{{index+1}}、</text>
				<text>单式</text>
			</div>

			<div style="color:white;margin:5px 0px;width:300rpx;word-wrap:break-word;">
				<span v-for="itemS,indexS in item.data">
					<span v-if=" indexS!=0 && indexS!='dan'&&indexS!='data'" style="color:black;">|</span>
					<span v-for="itemSX,indexSX in itemS" 
						  :class="itemSX>=10?'shiQiu':'redQiu'"
						  :style='indexS==6?"color:#397eff;border:1px solid #8fd3ff;background-color:#c6f2ff;":""'>{{itemSX}}
					</span>
				</span>
			</div>

			<div style="display: flex;flex-flow:column;text-align: center;margin-right:20px;align-items:flex-end;">
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
	const wei=reactive(['第一位','第二位','第三位','第四位','第五位','第六位','第七位'])

	const props = defineProps(['data'])
	const orderData=reactive([])
	onBeforeMount(()=>{
		orderData.data=JSON.parse(props.data.BetContent)
	})

</script>

<style scoped>
	.redQiu{
		padding:8rpx 18.5rpx;
		border-radius:100px;
		background-color: #ffdcdc;
		border:1px #ffa4a4 solid;
		color: red;
		line-height:80rpx;
		margin:0px 10rpx;
	}
	.shiQiu{
		padding:10rpx;
		border-radius:100px;
		background-color: #ffdcdc;
		border:1px #ffa4a4 solid;
		color: red;
		line-height:80rpx;
		margin:0px 10rpx;
		
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
