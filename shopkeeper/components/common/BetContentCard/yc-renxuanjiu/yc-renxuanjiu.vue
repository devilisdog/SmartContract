<template>
	<div style="width:680rpx;margin: auto;padding: 20rpx;background-color: white;border-radius: 10rpx;">
		<div style="display: flex;align-items: center;justify-content: space-between;margin-bottom:10rpx;">
			<text class="fontStyle">{{orderData.data.type}} {{orderData.data.gametype}} {{props.data.issue_code}}期</text>
			<div style="display: flex;align-items: center;">
				<text class="touguog" style="background-color:deepskyblue;">{{orderData.data.remarks.Note}}注</text>
				<text class="touguog" style="background-color:red;">{{orderData.data.remarks.Multiple}}倍</text>
			</div>
		</div>
		<div style=" background-color:#f5f5f5;display: flex;justify-content: space-around;">
			<text>场次</text>
			<text>主队/客场</text>
			<text>投注内容</text>
			<text>赛果</text>
		</div>
		
		<div class="neir" v-for="item,index in orderData.data.Content" :key="index" :style="index%2!=0?'background-color: #ececec;':''">
			<text style="font-size:30rpx;width:60px;">{{item.matchId}}</text>
			<div style="display: flex;align-items: center;justify-content: center;width:180px;">
				<div>
					<text>{{item.homeTeamAbbName}}</text>
				</div>
				<text style="font-size:24rpx;color:red;">VS</text>
				<div>
					<text>{{item.awayTeamAbbName}}</text>
				</div>
			</div>
			<div style="display: flex;flex-flow: column;align-items: center;width:130px">
				<div v-for="itemNr,indexNr in orderData.data.Content[index].data" style="display: flex;flex-flow:column;align-items: center;"
					:style="trueFunction(item.matchId)==itemNr.res?'color:red;':''">
					<text>{{itemNr.res}}</text>
				</div>
			</div>
			<div style="display: flex;flex-flow: column;align-items: center;width:80px;">
				<text>{{trueFunction(item.matchId)}}</text>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {ref,onBeforeMount,reactive,defineProps,} from 'vue';
	const props = defineProps(['data'])
	const orderData=reactive([])//解析后的比赛数据
	const trueFunction=(gameIndex)=>{
		if(props.data.WinConten==null){
			return '-/-'
		}
		var dictionaries={//赛果字典
			'0':'负',
			'1':'平',
			'3':'胜'
		}
		var newGameData=props.data.WinConten.Winingnumber[gameIndex-1]//按照比赛场次去对应的index找比赛结果
		return dictionaries[newGameData]//转换为中文并返回
		
	}
	onBeforeMount(()=>{
		orderData.data=JSON.parse(props.data.BetContent)
		if(typeof(props.data.WinConten)=='string'){
			props.data.WinConten=JSON.parse(props.data.WinConten)
			props.data.WinConten.Winingnumber=props.data.WinConten.Winingnumber.split(' ')
		}
		// console.log(props.data);
	})
</script>

<style>
	.touguog {
		max-width:200rpx;
		padding: 8rpx 10rpx;
		height: 25rpx;
		font-size: 28rpx;
		line-height: 25rpx;
		text-align: center;
		border-radius: 5rpx;
		color: white;
		font-weight: bold;
		margin: 5rpx 5rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: keep-all;
	}
	.neir {
		padding:20rpx 20rpx;
		margin:auto;
		display: flex;
		align-items: center;
		justify-content:space-around;
		color: black;
		text-align: center;
	}
	.fontStyle {
		font-size:32rpx;
		color: black;
		font-weight: 600;
	}
</style>