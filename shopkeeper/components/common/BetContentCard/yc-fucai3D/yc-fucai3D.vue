<template>
	<div style="background-color:white;width:680rpx;border-radius:10rpx;padding:20rpx;margin: auto;">

		<div style="display: flex;justify-content:space-between;margin-bottom:20rpx;align-items: center;">
			<text class="fontStyle">{{props.data.data.Type}} {{props.data.data.issue_code}}</text>
			<div style="display:flex;">
				<div class="tou" style="background-color:red;">1倍</div>
				<div class="tou" style="background-color:deepskyblue;">1注</div>
			</div>
		</div>

		<div style="background-color:#f5f5f5;display: flex;margin:20rpx 0rpx;justify-content:space-between;">
			<text style="margin-left:40rpx;">序号</text>
			<text>投注内容</text>
			<text style="margin-right:40rpx;">注数信息</text>
		</div>

		<div style="display: flex;align-items: center;justify-content: space-between;"
			v-for="item,index in orderData.data" :style="index%2?'background-color: #f5f5f5;':''">

			<div style="text-align: center;margin-left:20rpx;flex:0.6;">
				<text style="">{{index+1}}</text>
				<text style="">{{item.wanfa_type}}</text>
			</div>

			<view style="width:300rpx;word-wrap: break-word;">
				<label v-for="itemS,indexS in item.data" :key="indexS"
					v-if="item.type != 'zu6_tuodan' && item.type != 'zu3_tuodan' && item.type!='zhixuan_tuodan'">
					<label style="margin:10rpx 5rpx;color: red;">
						<text v-show="indexS!=0 && indexS!='dan'&&indexS!='data'" style="color:darkred;">|</text>
						<text v-for="itemSX,indexSX in itemS" :class="itemSX>=10?'shiQiu':'redQiu'"
							:key="indexS">{{itemSX<10?'0'+itemSX:itemSX}}</text>
					</label>
				</label>
				<label v-for="itemS,indexS in item.data" :key="indexS"
					v-if="item.type==='zu6_tuodan'||item.type==='zhixuan_tuodan'">
					<label style="margin:10rpx 5rpx;color: red;">
						<text v-for="itemSX,indexSX in itemS[0]" :class="itemSX>=10?'shiQiu':'redQiu'" :key="indexS"
							:style="indexS==='value'?'background-color:#c6f2ff;color:#397eff;border:1rpx #b2deff solid;':''">
								{{itemSX<10?'0'+itemSX:itemSX}}
						</text>
					</label>
				</label>
				<label v-for="itemS,indexS in item.data.datadan" :key="indexS" v-if="item.type==='zu3_tuodan'">
					<label style="margin:10rpx 5rpx;color: red;">
						<text :class="itemSX>=10?'shiQiu':'redQiu'">
							{{itemS<10?'0'+itemS:itemS}}
						</text>
					</label>
				</label>
				<label v-for="itemS,indexS in item.data.value" :key="indexS" v-if="item.type==='zu3_tuodan'">
					<label style="margin:10rpx 5rpx;" v-for="itemSX,indexSX in itemS">
						<text :class="itemSX>=10?'shiQiu':'redQiu'"
							style="background-color:#c6f2ff;color:#397eff;border:1rpx #b2deff solid;">
								{{itemSX<10?'0'+itemSX:itemSX}}
							</text>
					</label>
				</label>
			</view>

			<div style="display: flex;flex-flow: column;margin-right:40rpx;align-items:flex-end;">
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
	} from 'vue';
	const props = defineProps(['data'])
	const orderData = reactive([])
	onBeforeMount(() => {
		orderData.data = JSON.parse(props.data.data.BetContent)
		if(typeof(props.data.data.WinConten)=='string'){//开奖数据解析
			props.data.data.WinConten=JSON.parse(props.data.data.WinConten)
				// props.data.WinConten.Winingnumber.red=props.data.WinConten.Winingnumber.red.split(',')
				// props.data.WinConten.Winingnumber.blue=Array(props.data.WinConten.Winingnumber.blue)
		}
		//console.log('123',props.data.WinConten,typeof(props.data.WinConten));
	})
</script>

<style scoped>
	.redQiu {
		padding: 10rpx 22rpx;
		border-radius: 100px;
		background-color: #ffdcdc;
		border: 1px #ffa4a4 solid;
		color: red;
		line-height: 40px;
		margin: 0px 5px;
	}

	.shiQiu {
		padding: 8rpx;
		border-radius: 100px;
		background-color: #ffdcdc;
		border: 1px #ffa4a4 solid;
		color: red;
		line-height: 40px;
		margin: 0px 5px;

	}

	.buleBall {
		padding: 10rpx 22rpx;
		border-radius: 100px;
		background-color: #c6f2ff;
		color: #397eff;
		border: 1px solid #8fd3ff;
		line-height: 40px;
		margin: 0px 5px;
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

	.fontStyle {
		font-size:32rpx;
		color: black;
		font-weight: bold;
	}
</style>
