<template>
	<div style="width:680rpx;margin: auto;padding: 20rpx;background-color:white;border-radius:10rpx;">
		<div style="display: flex;justify-content: space-between;align-items: center;">
			
			<div class="fontStyle">
				<text>{{props.data.Type}}</text>
				<text>{{' '+props.data.issue_code}}期</text>
			</div>
			
			<div style="display:flex;">
				<!-- <div class="tou" style="background-color:red;padding:5rpx 10rpx;">1倍</div> -->
				<div class="tou" style="background-color:deepskyblue;padding:5rpx 10rpx;">
					共{{props.data.Note}}注
				</div>
			</div>
		</div>
		<view style="margin-bottom:10rpx;display: flex;align-items: center;" v-if="props.data.WinConten!=null">
			<text>本期开奖:</text>
			<view style="display: flex;align-items: center;">
				<view class="redBall" v-for="itme,index in props.data.WinConten.Winingnumber.red">
					{{itme}}
				</view>
				<view class="WinBulleBall" v-for="itme,index in props.data.WinConten.Winingnumber.blue">
					{{itme}}
				</view>
			</view>
		</view>
		<div style="display: flex;background-color: #f5f5f5;margin:10rpx 0rpx;justify-content:space-between;">
			<text style="margin-left:20px;">序号</text>
			<text>投注内容</text>
			<text style="margin-right:20px;">注数信息</text>
		</div>
		<div style="display: flex;align-items: center;justify-content:space-between;" 
					v-for="item,index in orderCardData.data" :style="index%2?'background-color: #f5f5f5;':''">
			<div style="margin:0px 10px;font-size:26rpx;">
				<text>{{index+1}}、</text>
				<text v-if="item.data.value.length==7">单式</text>
				<text v-if="item.data.value.length!=7 && item.data.dan.length==0">复式</text>
				<text v-if="item.data.dan.length>0">胆拖</text>
			</div>
			
			<div style="display: flex;flex-wrap: wrap;align-items: center;flex: 1;">
				<div v-for="item,index in item.data.value" 
					:class="trueFunticon(item<10?'0'+item:item,'value')?'winQiu':'qiu'" 
					style="margin:5px;"
				>
					{{item<10?'0'+item:item}}
				</div>
				<div v-for="item,index in item.data.dan" 
					:class="trueFunticon(item<10?'0'+item:item,'dan')?'winQiuDan':'qiuDan'" 
					style="margin:5px;">
					<text style="font-size:14px;">
						{{item<10?'0'+item:item}}
					</text>
					<text style="margin-top:-6px;">胆</text>
				</div>
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
	const trueFunticon=(number,type)=>{
		if(props.data.WinConten==null){
			return false
		}else if(type=='value'){
			var red=props.data.WinConten.Winingnumber.red
			var index=red.indexOf(number,0)
			if(index != -1){
				return true
			}
		}else{
			var bule=props.data.WinConten.Winingnumber.blue
			var index=bule.indexOf(number,0)
			if(index != -1){
				return true
			}
		}
	}
	onBeforeMount(()=>{
		orderCardData.data=JSON.parse(props.data.BetContent)
		if(typeof(props.data.WinConten)=='string'){//开奖数据解析
			props.data.WinConten=JSON.parse(props.data.WinConten)
			props.data.WinConten.Winingnumber.red=props.data.WinConten.Winingnumber.red.split(',')
			props.data.WinConten.Winingnumber.blue=Array(props.data.WinConten.Winingnumber.blue)
		}
	})
</script>

<style>
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
	.WinBulleBall{
		width:50rpx;
		height:50rpx;
		background-image: radial-gradient(#53a1ff,#397eff,#53a1ff);
		color:white;
		border-radius:50%;
		text-align: center;
		font-size:26rpx;
		line-height:50rpx;
		border:1px solid #8fd3ff;
		margin:5rpx;
	}
	.winQiu{
		width:60rpx;
		height:60rpx;
		background-color:red;
		border:1px solid red;
		border-radius:100px;
		color:white;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.qiu{
		width:60rpx;
		height:60rpx;
		background-color:#ffdedf;
		border:1px solid #ffa7a9;
		border-radius:100px;
		color: red;
		display: flex;
		align-items: center;
		justify-content: center;
		
	}
	.winQiuDan{
		width:60rpx;
		height:60rpx;
		background-color:red;
		border:1px solid red;
		border-radius:100px;
		color:white;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
	}
	.qiuDan{
		width:60rpx;
		height:60rpx;
		background-color:#ffdedf;
		border:1px solid #ffa7a9;
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
		font-weight: 600;
	}

</style>
