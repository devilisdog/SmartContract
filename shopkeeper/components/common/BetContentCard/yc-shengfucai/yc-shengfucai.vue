<template>
	<div style="width:680rpx;margin: auto;background-color: white;padding:20rpx;border-radius:10rpx;">
		<div style="display: flex;align-items: center;justify-content: space-between;margin:10rpx;">
			<text class="fontStyle">{{detailData.data.type}} {{detailData.data.gametype}} {{props.data.issue_code}}期</text>
			<div style="display: flex;align-items: center;">
				<div class="tou" style="background-color:deepskyblue;">{{detailData.data.remarks.Note}}注</div>
				<div class="tou" style="background-color:red;">{{detailData.data.remarks.Multiple}}倍</div>
			</div>
		</div>
		<div style=" background-color:#f5f5f5;display: flex;justify-content: space-around;margin: auto;">
			<text>场次</text>
			<text>主队/客场</text>
			<text>投注内容</text>
			<text>赛果</text>
		</div>
		<div class="neir" v-for="item,index in detailData.data.Content" :key="index"
			:style="index%2!=0?'background-color: #ececec;':''">
			<text style="font-size:30rpx;width:80rpx;">{{item.matchId}}</text>
			<div style="display: flex;align-items: center;justify-content: center;width:200rpx;">
				<div>
					<text>{{item.homeTeamAbbName}}</text>
				</div>
				<text style="font-size:24rpx;color:red;">VS</text>
				<div>
					<text>{{item.awayTeamAbbName}}</text>
				</div>
			</div>
			<div style="display: flex;flex-flow: column;align-items: center;width:140rpx;">
				<div v-for="itemNr,indexNr in item.data"
					style="display: flex;flex-flow:column;align-items: center;"
					:style="trueFunction(item.matchId)==itemNr.res?'color:red;':''">
					<text>{{itemNr.res}}</text>
				</div>
			</div>
			<div style="display: flex;flex-flow: column;align-items: center;width:80rpx;">
				<text>{{trueFunction(item.matchId)}}</text>
			</div>
		</div>
	</div>
</template>
<script setup>
	import {ref,onBeforeMount,reactive,defineProps} from 'vue';
	const detailData=reactive([])
	const props = defineProps(['data'])
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
	onBeforeMount(() => {
		detailData.data=JSON.parse(props.data.BetContent)
		if(typeof(props.data.WinConten)=='string'){
			props.data.WinConten=JSON.parse(props.data.WinConten)
			props.data.WinConten.Winingnumber=props.data.WinConten.Winingnumber.split(' ')
		}
		
	})
</script>

<style>
	.tou {
		width: fit-content;
		padding: 8rpx 10rpx;
		height: 25rpx;
		font-size: 28rpx;
		line-height: 25rpx;
		text-align: center;
		border-radius: 5rpx;
		color: white;
		font-weight: bold;
		margin: 5rpx 5rpx;
	}
	.neir {
		margin:20rpx 0rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		color: black;
		text-align: center;
	}
	.fontStyle {
		font-size:32rpx;
		color: black;
		font-weight: 600;
	}
	text{
		font-size:28rpx;
	}
</style>
