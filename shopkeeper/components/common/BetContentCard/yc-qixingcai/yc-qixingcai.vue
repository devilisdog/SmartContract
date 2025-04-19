<template>
	<div style="background-color: white;width:680rpx;border-radius:10rpx;margin: auto;padding:20rpx;">
		
		<div style="display: flex;justify-content:space-between;margin-bottom:20rpx;align-items: center;">
			<text style="font-size:32rpx;font-weight:bold;color: black;">
				{{props.data.Type}} {{props.data.issue_code}}期
			</text>
			<div style="display:flex;">
				<!-- <div class="tou" style="background-color:red;">1倍</div> -->
				<div class="tou" style="background-color:deepskyblue;">共{{props.data.Note}}注</div>
			</div>
		</div>
		<view style="margin-bottom:10rpx;display: flex;align-items: center;" v-if="props.data.WinConten!=null">
			<text>本期开奖:</text>
			<view style="display: flex;align-items: center;">
				<view class="redBall" v-for="itme,index in props.data.WinConten.Winingnumber">
					{{itme}}
				</view>
			</view>
		</view>
		<div style="background-color:#f5f5f5;display: flex;justify-content:space-between;">
			<text style="margin-left:20px;">序号</text>
			<text>投注内容</text>
			<text style="margin-right:20px;">注数信息</text>
		</div>
		
		<div style="display: flex;align-items: center;justify-content:space-between;"  
			v-for="item,index in orderData.data" :style="index%2?'background-color: #f5f5f5;':''">

			<div style="margin:0rpx 10rpx;">
				<text>{{index+1}}、</text>
				<text>单式</text>
			</div>

			<div style="color:white;margin:5px 0px;width:400rpx;word-wrap:break-word;">
				<span v-for="itemS,indexS in item.data">
					<span v-if=" indexS!=0 && indexS!='dan'&&indexS!='data'" style="color:black;">|</span>
					<span v-for="itemSX,indexSX in itemS" 
						  :class="trueFunticon(itemSX,indexS)?'shiQiu_true':'shiQiu'"
						  v-if="indexS!=6">
						  {{itemSX}}
					</span>
					<span v-for="itemSX,indexSX in itemS"
						  :class="trueFunticon(itemSX,indexS)?'blueBall_true':'blueBall'"
						  v-if="indexS==6">
						  {{itemSX}}
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
	const trueFunticon=(number,index)=>{
		if(props.data.WinConten==null){
			return false
		}
		if(props.data.WinConten.Winingnumber[index]==number){
			return true
		}
	}
	onBeforeMount(()=>{
		orderData.data=JSON.parse(props.data.BetContent)
		if(typeof(props.data.WinConten)=='string'){//开奖数据解析
			props.data.WinConten=JSON.parse(props.data.WinConten)
			props.data.WinConten.Winingnumber=props.data.WinConten.Winingnumber.split(' ')
		}
	})

</script>

<style scoped>
	.redBall{
		width:50rpx;
		height:50rpx;
		background-image: radial-gradient(#ff6f71,red,#ff6f71);
		/* background-color:red; */
		color:white;
		border-radius:50%;
		text-align: center;
		font-size:26rpx;
		line-height:50rpx;
		margin:5rpx;
	}
	.shiQiu{
		padding:8rpx 20rpx;
		border-radius: 100px;
		background-color: #ffdcdc;
		border: 1px #ffa4a4 solid;
		display: inline;
		color: red;
		line-height: 40px;
		margin: 0px 7px;
		word-wrap: break-word;
	}
	.shiQiu_true{
		padding:8rpx 20rpx;
		border-radius: 100px;
		background-color: red;
		border: 1px red solid;
		display: inline;
		color:white;
		line-height: 40px;
		margin: 0px 7px;
		word-wrap: break-word;
	}
	.blueBall{
		 color:#397eff;
		 border:1px solid #8fd3ff;
		 background-color:#c6f2ff;
		 padding:8rpx 20rpx;
		 border-radius: 100px;
		 display: inline;
		 line-height: 40px;
		 margin: 0px 7px;
		 word-wrap: break-word;
	}
	.blueBall_true{
		 color:white;
		 border:1px solid #8fd3ff;
		 background-image: radial-gradient(#53a1ff,#397eff,#53a1ff);
		 padding:8rpx 20rpx;
		 border-radius: 100px;
		 display: inline;
		 line-height: 40px;
		 margin: 0px 7px;
		 word-wrap: break-word;
	}
	
	.tou {
		width:fit-content;
		padding:8rpx 10rpx;
		height:25rpx;
		font-size:28rpx;
		line-height:26rpx;
		text-align: center;
		border-radius:5rpx;
		color: white;
		font-weight: bold;
		margin:5rpx 5rpx;
	}
</style>
