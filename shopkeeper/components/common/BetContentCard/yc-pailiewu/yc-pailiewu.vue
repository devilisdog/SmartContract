<template>
	<view style="background-color: white;width:680rpx;border-radius:10rpx;margin: auto;padding:20rpx;">
		<view style="display: flex;justify-content:space-between;margin-bottom:20rpx;align-items: center;">
			<text style="font-weight:bold;font-size:32rpx;color:black;">
				{{props.data.Type}} {{props.data.issue_code}}期
			</text>
			<view style="display:flex;">
				<!-- <view class="tou" style="background-color:red;">1倍</view> -->
				<view class="tou" style="background-color:deepskyblue;">共{{props.data.Note}}注</view>
			</view>

		</view>
		<view style="margin-bottom:10rpx;display: flex;align-items: center;" v-if="props.data.WinConten!=null">
			<text>本期开奖:</text>
			<view style="display: flex;align-items: center;">
				<view class="redBall" v-for="itme,index in props.data.WinConten.Winingnumber">
					{{itme}}
				</view>
			</view>
		</view>
		<view style="background-color:#f5f5f5;display: flex;margin:20rpx 0rpx;justify-content:space-between;">
			<text style="margin-left:20px;">序号</text>
			<text>投注内容</text>
			<text style="margin-right: 20px;">注数信息</text>
		</view>

		<view style="display: flex;align-items: center;justify-content:space-between;" 
			v-for="item,index in orderData.data" :style="index%2?'background-color: #f5f5f5;':''">

			<view style="margin:0px 5px;text-align: center;">
				<text>{{index+1}}、</text>
				<text>单式</text>
			</view>

			<view class='contentBox'>
				<span v-for="itemS,indexS in item.data">
					<span v-if=" indexS!=0 && indexS!='dan'&&indexS!='data'" style="color:black;">|</span>
					<span v-for="itemSX,indexSX in itemS" 
						  :class="trueFunticon(itemSX,indexS)?'redQiu_true':'redQiu'">
						{{itemSX}}
					</span>
				</span>
			</view>
			<view style="display: flex;flex-flow:column;text-align: center;align-items:flex-end;margin-right:20px;">
				<view class="tou" style="background-color:red;">{{item.beilv}}倍</view>
				<view class="tou" style="background-color:deepskyblue;">{{item.note}}注</view>
			</view>
		</view>
	</view>
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
	const trueFunticon=(number,index)=>{
		if(props.data.WinConten==null){
			return false
		}else{
			if(props.data.WinConten.Winingnumber[index]==number){
				return true
			}
		}
	}
	onBeforeMount(()=>{
		orderData.data=JSON.parse(props.data.BetContent)
		if(typeof(props.data.WinConten)=='string'){//开奖数据解析
			props.data.WinConten=JSON.parse(props.data.WinConten)
			props.data.WinConten.Winingnumber=props.data.WinConten.Winingnumber.split(' ')
		}
	})
	const wei=reactive(['第一位','第二位','第三位','第四位','第五位','第六位','第七位'])
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
	.contentBox{
		flex-wrap:wrap;
		color:white;
		margin:10rpx 0rpx;
		width:350rpx;
		word-wrap:break-word;
	}

	.redQiu{
		padding:8rpx 20rpx;
		border-radius:100px;
		background-color: #ffdcdc;
		border:1px #ffa4a4 solid;
		color: red;
		line-height:40px;
		margin:0px 4px;
	}
	.redQiu_true{
		padding:8rpx 20rpx;
		border-radius:100px;
		background-color:red;
		border:1px #ffa4a4 solid;
		color:white;
		line-height:40px;
		margin:0px 4px;
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
