<template>
	<div style="background-color:white;width:680rpx;border-radius:10rpx;padding:20rpx;margin: auto;">
		<div style="display: flex;justify-content:space-between;margin-bottom:10rpx;align-items: center;">
			<text class="fontStyle">{{props.data.Type}} {{props.data.issue_code}}期</text>
			<div style="display:flex;">
				<!-- <div class="tou" style="background-color:red;">1倍</div> -->
				<div class="tou" style="background-color:deepskyblue;">共{{props.data.Note}}注</div>
			</div>
		</div>
		<view style="margin-bottom:10rpx;display: flex;align-items: center;" v-if="props.data.WinConten!=null">
			<text>本期开奖:</text>
			<view style="display: flex;align-items: center;">
				<view class="redBall_true" v-for="itme,index in props.data.WinConten.Winingnumber">
					{{itme}}
				</view>
			</view>
		</view>
		<div style="background-color:#f5f5f5;display: flex;margin:20rpx 0rpx;justify-content:space-between;">
			<text style="margin-left:40rpx;">序号</text>
			<text>投注内容</text>
			<text style="margin-right:40rpx;">注数信息</text>
		</div>

		<div style="display: flex;align-items: center;justify-content: space-between;"
			v-for="item,index in orderData.data" :style="index%2?'background-color: #f5f5f5;':''">
			<div style="flex:0.25;text-align: center;margin-right:30rpx;">
				<text style="">{{index+1}}、</text>
				<text style="">{{item.wanfa_type}}</text>
			</div>
			<view style="width:350rpx;word-wrap:break-word;flex:0.9;">
				<view
					v-if="item.type=='zhixuan_dingwei'" 
					v-for="itemX,indexX in item.data" 
					style="display: flex;align-items: center;"
				>
					<text>{{titleArr[indexX]}}:</text>
					<view class="zhixuan_dingwei">
						<view 
							v-for="itmeS,indexS in item.data[indexX]" 
							:class="truefunicon(itmeS,indexX,'corresponding')?'redBall_fill':'redBall'"
							>
							{{itmeS}}
						</view>
					</view>
				</view>
				
				<view 
					v-else-if="item.type=='zhixuan_fushi'||item.type=='zhixuan_hezhi'||item.type=='zhixuan_kuadufushi'||item.type=='zu3_fushi'||item.type=='zu3_kuadufushi'||item.type=='zu6_fushi'||item.type=='zu6_kuadufushi'||item.type=='zuxuan_hezhi'||item.type=='zuxuan_quanbao'"
					class="zhixuan_dingwei_double"
				>	
					<view v-for="itemX,indexX in item.data.data" class="redBall" v-if="item.type=='zhixuan_hezhi'">
						{{itemX}}
					</view>
					<view 
						v-for="itemX,indexX in item.data.data[0]"
						class="redBall" 
						v-else-if="item.type=='zu3_kuadufushi'">
						{{itemX}}
					</view>
					<view v-for="itemX,indexX in item.data[0]" class="redBall" v-else>
						{{itemX}}
					</view>
					
				</view>
				<view 
					v-else-if="item.type=='zhixuan_tuodan' || item.type=='zu3_tuodan' || item.type=='zu6_tuodan'" 
					class="zhixuan_dingwei_double"
				>
					<view 
						v-for="itemX,indexX in item.data.value[0]" 
						class="redBall" 
						v-if="item.type=='zhixuan_tuodan' || item.type=='zu6_tuodan'">
						{{itemX}}
					</view>
					<view 
						v-for="itemX,indexX in item.data.dan[0]" 
						class="buleBall" 
						v-if="item.type=='zhixuan_tuodan' || item.type=='zu6_tuodan'"
					>
						{{itemX}}
					</view>
					<view v-for="itemX,indexX in item.data.datadan[0]" class="redBall" v-if="item.type=='zu3_tuodan'">
						{{itemX}}
					</view>
					<view v-for="itemX,indexX in item.data.value[0]" class="buleBall" v-if="item.type=='zu3_tuodan'">
						{{itemX}}
					</view>
				</view>
				
				<view v-else class="zhixuan_dingwei_division">
					<view v-for="itemX,indexX in item.data.chong" class="redBall">
						{{itemX}}
					</view>
					<view style="color: red;">|</view>
					<view v-for="itemX,indexX in item.data.dan" class="redBall">
						{{itemX}}
					</view>
				</view>
			</view>

			<div style="display: flex;flex-flow: column;margin-right:40rpx;align-items:flex-end;">
				<div class="tou" style="background-color:red;margin-bottom:5rpx;">{{item.beilv}}倍</div>
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
	} from 'vue';
	const props = defineProps(['data'])
	const titleArr=reactive(['百位','十位','个位'])
	const orderData = reactive([])
	const truefunicon=(number,index,type)=>{
		if(props.data==null){
			return false
		}
		if(type=='corresponding' && typeof(props.data.WinConten)=='string'){
			if(props.data.WinConten.Winingnumber[index]==number){
				return true
			}
		}
	}
	onBeforeMount(() => {
		orderData.data = JSON.parse(props.data.BetContent)
		if(props.data.Type=='福彩3D'){
			if(typeof(props.data.WinConten)=='string'){//开奖数据解析
				props.data.WinConten=JSON.parse(props.data.WinConten)
				props.data.WinConten.Winingnumber=props.data.WinConten.Winingnumber.split(',')
			}
		}else{
			if(typeof(props.data.WinConten)=='string'){//开奖数据解析
				props.data.WinConten=JSON.parse(props.data.WinConten)
				props.data.WinConten.Winingnumber=props.data.WinConten.Winingnumber.split(' ')
			}
		}
	})
</script>

<style scoped>
	.redBall{
		width:60rpx;
		height:60rpx;
		background-color:#ffdedf;
		border-radius:50%;
		text-align: center;
		line-height:60rpx;
		color:red;
		border:1rpx solid #ff6f71;
	}
	.redBall_fill{
		width:60rpx;
		height:60rpx;
		background-color:red;
		border-radius:50%;
		text-align: center;
		line-height:60rpx;
		color:white;
		border:1rpx solid red;
	}
	.buleBall{
		width:60rpx;
		height:60rpx;
		background-color:#b5efff;
		border-radius:50%;
		text-align: center;
		line-height:60rpx;
		color:#0055ff;
		border:1rpx solid #55d2ff;
	}
	
	.zhixuan_dingwei{
		display:grid;
		grid-template-columns:repeat(4,60rpx);
		grid-template-rows:repeat(auto,60rpx);
		align-items: center;
		grid-column-gap:20rpx;
		grid-row-gap:10rpx;
		max-width:320rpx;
		margin:20rpx 10rpx;
		
	}
	.zhixuan_dingwei_division{
		display:grid;
		grid-template-columns:repeat(5,auto);
		grid-template-rows:repeat(auto,auto);
		align-items: center;
		grid-column-gap:20rpx;
		grid-row-gap:10rpx;
		max-width:320rpx;
		margin:20rpx 10rpx;
	}
	.zhixuan_dingwei_double{
		display:grid;
		grid-template-columns:repeat(5,60rpx);
		grid-template-rows:repeat(auto,60rpx);
		align-items: center;
		grid-column-gap:20rpx;
		grid-row-gap:10rpx;
		max-width:320rpx;
		margin:20rpx 10rpx;
	}
	.redBall_true{
		width:50rpx;
		height:50rpx;
		background-image: radial-gradient(#ff6f71,red,#ff6f71);
		color:white;
		border-radius:50%;
		text-align: center;
		font-size:26rpx;
		line-height:50rpx;
		margin:5rpx;
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
		margin:0rpx 5rpx;
	}

	.fontStyle {
		font-size:32rpx;
		color: black;
		font-weight: bold;
	}
</style>
