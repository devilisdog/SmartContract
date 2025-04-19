<template>
	<div style="width: 710rpx;">
		<div style="display: flex;justify-content: space-between;">
			<text style="font-size:32rpx;color:black;font-weight:bold;">双色球</text>	
			<div style="display:flex;">
				<div class="tou" style="background-color:red;">1倍</div>
				<div class="tou" style="background-color:deepskyblue;">1注</div>
			</div>
		</div>
		<div style="background-color:#f5f5f5;display: flex;justify-content:space-between;">
			<text style="margin-left:20px;">序号</text>
			<text>投注内容</text>
			<text style="margin-right:20px;">注数信息</text>
		</div>

		<div style="display: flex;align-items: center;justify-content:space-between;" 
			  v-for="item,index in orderData.data"

			  :style="index%2==0? 'background-color:white;':'background-color: #ebebeb;'">
			<div style="margin:0px 20px;text-align: center;">
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
	const props = defineProps(['content'])

	onBeforeMount(()=>{
		orderData.data=props.content

	})
</script>

<style>
	.redBall{
		width:30px;
		height:30px;
		background-color:#ffdedf;
		border:1px solid #ffa7a9;
		border-radius:100px;
		text-align: center;
		line-height:30px;
		color: red;
		margin:5px 5px;
	}
	.blueBall{
		width:30px;
		height:30px;
		background-color:#c6f2ff;
		color:#397eff;
		border:1px solid #8fd3ff;
		border-radius:100px;
		text-align: center;
		line-height:30px;
		margin:5px 5px;
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


</style>