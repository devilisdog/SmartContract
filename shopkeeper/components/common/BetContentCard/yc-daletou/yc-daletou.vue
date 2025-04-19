<template>
	<div style="background-color:white;width:680rpx;border-radius:10rpx;padding:20rpx;margin: auto;">
		<div style="display: flex;justify-content: space-between;align-items: center;margin-bottom:10rpx;">
			<text style="font-size:32rpx;color:black;font-weight:bold;">
				{{props.data.Type}} {{props.data.issue_code}}期
			</text>	
			<div style="display:flex;">
				<!-- <div class="tou" style="background-color:red;">1倍</div> -->
				<div class="tou" style="background-color:deepskyblue;">共{{props.data.Note}}注</div>
				<div class="tou" style="background-color:#ff9b69;" v-show="orderData.data[0]['switch']==1">
					追加
				</div>
			</div>
		</div>
		<view style="margin-bottom:10rpx;display: flex;align-items: center;" v-if="props.data.WinConten!=null">
			<text>本期开奖:</text>
			<view style="display: flex;align-items: center;">
				<view class="winRedBall" v-for="itme,index in props.data.WinConten.Winingnumber.red">
					{{itme}}
				</view>
				<view class="WinBulleBall" v-for="itme,index in props.data.WinConten.Winingnumber.blue">
					{{itme}}
				</view>
			</view>
		</view>
		<div style="background-color:#f5f5f5;display: flex;justify-content:space-between;">
			<text style="margin-left:20px;">序号</text>
			<text>投注内容</text>
			<text style="margin-right:20px;">注数信息</text>
		</div>
		
		<div style="display: flex;align-items: center;justify-content:space-between;margin:20rpx 0rpx;" 
			  v-for="item,index in orderData.data"
			  :style="index%2==0? 'background-color:white;':'background-color: #ebebeb;'">
			  
			<div style="margin:0px 10px;text-align: center;">
				<text>{{index+1}}、</text>
				<text>单式</text>
			</div>

			<div style="display: flex;flex-wrap: wrap;flex: 1;">
				<div :class="trueFunticon(itemS<10?'0'+itemS:itemS,'value')?'redBall_true':'redBall'"
					v-for="itemS,indexS in item.data.dan.red" v-if="item.data.dan" style="line-height:27rpx;">
					<text>{{itemS<10?'0'+itemS:itemS}}</text><br>
					<text>胆</text>
				</div>
				<div :class="trueFunticon(itemS<10?'0'+itemS:itemS,'value')?'redBall_true':'redBall'"
					v-for="itemS,indexS in item.data.dan"  style="line-height:27rpx;" v-if="item.data.dan && props.data.Type=='双色球'">
					<text>{{itemS<10?'0'+itemS:itemS}}</text><br>
					<text>胆</text>
				</div>
				
				<div :class="trueFunticon(itemS<10?'0'+itemS:itemS,'value')?'redBall_true':'redBall'" 
					v-for="itemS,indexS in item.data.list.red">
					<text>{{itemS<10?'0'+itemS:itemS}}</text>
				</div>
				
				
				<div :class="trueFunticon(itemS<10?'0'+itemS:itemS,'dan')?'blueBall_true':'blueBall'"
					v-for="itemS,indexS in item.data.dan.blue" style="line-height:27rpx;" v-if="item.data.dan">
					<text>{{itemS<10?'0'+itemS:itemS}}</text><br>
					<text>胆</text>
				</div>
				<div :class="trueFunticon(itemS<10?'0'+itemS:itemS,'dan')?'blueBall_true':'blueBall'" 
					v-for="itemS,indexS in item.data.list.blue">
					<text>{{itemS<10?'0'+itemS:itemS}}</text>
				</div>
			</div>

			<div style="display: flex;flex-flow:column;text-align: center;align-items: center;margin-right:30px;">
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
	const orderData=reactive([])
	const props = defineProps(['data'])
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
		orderData.data=JSON.parse(props.data.BetContent)
		// console.log(props.data);
		if(typeof(props.data.WinConten)=='string'){//开奖数据解析
			if(props.data.Type=='大乐透'){
				props.data.WinConten=JSON.parse(props.data.WinConten)
			}else{
				props.data.WinConten=JSON.parse(props.data.WinConten)
				props.data.WinConten.Winingnumber.red=props.data.WinConten.Winingnumber.red.split(',')
				props.data.WinConten.Winingnumber.blue=Array(props.data.WinConten.Winingnumber.blue)
			}
		}
	})
</script>

<style>
	.winRedBall{
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
	.redBall{
		width:60rpx;
		height:60rpx;
		background-color:#ffdedf;
		border:1px solid #ffa7a9;
		border-radius:100px;
		text-align: center;
		line-height:60rpx;
		color: red;
		margin:5rpx 4rpx;
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
		margin:5rpx 4rpx;
	}
	.redBall_true{
		width:60rpx;
		height:60rpx;
		background-color:red;
		border:1px solid red;
		border-radius:100px;
		text-align: center;
		line-height:60rpx;
		color: white;
		margin:5rpx 4rpx;
	}
	.blueBall_true{
		width:60rpx;
		height:60rpx;
		background-image: radial-gradient(#53a1ff,#397eff,#53a1ff);
		border:1rpx solid blue;
		color:white;
		border-radius:100px;
		text-align: center;
		line-height:60rpx;
		margin:5rpx 4rpx;
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
