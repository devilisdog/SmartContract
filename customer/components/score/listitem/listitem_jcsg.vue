<template>
	<view class="Card_zuqiu">
		<view class="top">
			<view style="flex: 1;display: flex; flex-direction: column; ">
				
				<text style="font-size: 20rpx; color: blueviolet;">{{props.cardInfo.short_comp}}</text>
				<text style="font-size: 20rpx;">{{props.cardInfo.issue_num}}</text>
			</view>
			<view style="display: flex; flex-direction: row; ;flex: 8;justify-content: center;align-items: center; margin-right: 50rpx;">
				
				<text style="font-size: 35rpx;;width: 200rpx; text-align: right ;">{{props.cardInfo.short_home}}</text>
				
				<view style="flex: 1 ;display: flex;flex-direction: column;text-align: center;">
					<text style="color: red; font-size: 45rpx;" v-if="props.cardInfo.home_score&&props.cardInfo.away_score">{{props.cardInfo.home_score+":"+props.cardInfo.away_score}}</text>
					<text style="color: red; font-size: 45rpx;" v-else>VS</text>


					<text v-if="props.cardInfo.type=='1'&&props.cardInfo.half_home_score&&props.cardInfo.half_away_score" style="color:  darkgray; font-size: 20rpx;">半场({{props.cardInfo.half_home_score+":"+props.cardInfo.half_away_score}})</text>
				</view>
					
				
				<text style="font-size: 35rpx;width: 200rpx; ">{{props.cardInfo.short_away}}</text>
			</view>
		</view>
		<!-- 足球 -->
		<view class="bottom" v-if="props.cardInfo.type=='1'">
			<view style="margin: 25rpx;display: flex; flex-direction: column;text-align: center;">
				<text style="color: red;" v-if="props.cardInfo.spf">{{props.cardInfo.spf.split(',')[0]=='3'?"胜":props.cardInfo.spf.split(',')[0]=='1'?"平":"负"}}</text>
				<text v-if="props.cardInfo.spf">{{props.cardInfo.spf.split(',')[1]}}</text>
			</view>
			<view style="margin: 25rpx;display: flex; flex-direction: column;text-align: center;">
				<text style="color: red;" v-if="props.cardInfo.rq">({{props.cardInfo.rq.split(',')[0]=='0'?"":props.cardInfo.rq.split(',')[0]}}){{props.cardInfo.rq.split(',')[1]=='3'?"胜":props.cardInfo.rq.split(',')[1]=='1'?"平":"负"}}</text>
				<text v-if="props.cardInfo.rq">{{props.cardInfo.rq.split(',')[2]}}</text>
			</view>
			<view style="margin: 25rpx;display: flex; flex-direction: column;text-align: center;">
				<text style="color: red;" v-if="props.cardInfo.jq">{{props.cardInfo.jq.split(',')[0]}}球</text>
				<text v-if="props.cardInfo.jq">{{props.cardInfo.jq.split(',')[1]}}</text>
			</view>
			<view style="margin: 25rpx;display: flex; flex-direction: column;text-align: center;">
				<text style="color: red;" v-if="props.cardInfo.bf">{{props.cardInfo.bf.split(',')[0]=='-1:-H'?'胜其它':props.cardInfo.bf.split(',')[0]=='-1:-A'?'负其它':props.cardInfo.bf.split(',')[0]=='-1:-D'?'平其它':props.cardInfo.bf.split(',')[0]}}</text>
				<text v-if="props.cardInfo.bf">{{props.cardInfo.bf.split(',')[1]}}</text>
			</view>
			<view style="margin: 25rpx;display: flex; flex-direction: column;text-align: center;">
				<text style="color: red;" v-if="props.cardInfo.bqc">{{props.cardInfo.bqc.split(',')[0]=='3'?"胜":props.cardInfo.bqc.split(',')[0]=='1'?"平":"负"}}-{{props.cardInfo.bqc.split(',')[1]=='3'?"胜":props.cardInfo.bqc.split(',')[1]=='1'?"平":"负"}}</text>
				<text v-if="props.cardInfo.bqc">{{props.cardInfo.bqc.split(',')[2]}}</text>
			</view>
			
			
		</view>
		<!-- 篮球 -->
		<view class="bottom" v-if="props.cardInfo.type=='2'">
			<view style="margin: 25rpx;display: flex; flex-direction: column;text-align: center;">
				<text style="color: red;" v-if="props.cardInfo.sf">{{props.cardInfo.sf.split(',')[0]=='3'?"胜":"负"}}</text>
				<text v-if="props.cardInfo.sf">{{props.cardInfo.sf.split(',')[1]}}</text>
			</view>
			<view style="margin: 25rpx;display: flex; flex-direction: column;text-align: center;">
				<text style="color: red;" v-if="props.cardInfo.rf">{{props.cardInfo.rf.split(',')[1]=='3'?"胜":"负"}}({{props.cardInfo.rf.split(',')[0]=='0'?"":props.cardInfo.rf.split(',')[0]}})</text>
				<text v-if="props.cardInfo.rf">{{props.cardInfo.rf.split(',')[2]}}</text>
			</view>
			<view style="margin: 25rpx;display: flex; flex-direction: column;text-align: center;">
				<text style="color: red;" v-if="props.cardInfo.sfc">{{sfczidian(props.cardInfo.sfc.split(',')[0])}}</text>
				<text v-if="props.cardInfo.sfc">{{props.cardInfo.sfc.split(',')[1]}}</text>
			</view>
			<view style="margin: 25rpx;display: flex; flex-direction: column;text-align: center;">
				<text style="color: red;" v-if="props.cardInfo.dxf">{{props.cardInfo.dxf.split(',')[1]=='0'?"小分":"大分"}}({{props.cardInfo.rf.split(',')[0]=='0'?"":props.cardInfo.dxf.split(',')[0]}})</text>
				<text v-if="props.cardInfo.dxf">{{props.cardInfo.dxf.split(',')[2]}}</text>
			</view>
		</view>
	</view>
</template>
<script setup>
	/*
	 * list 列表
	 * @description 比赛列表组件
	 * 
	 */
	import getTime from "@/common/getdatetime.js"
	import {defineProps,onBeforeMount,ref,reactive,watch,defineEmits} from 'vue'
	const props = defineProps(['cardInfo'])
	const Emits=defineEmits(['onClick'])
	watch(()=>props.cardInfo,(newValue,oldValue)=>{
		// if(props.cardInfo.score[5]){
		// 	props.cardInfo['allScore']=0
		// 	props.cardInfo['size']=0
		// 	var splitData=props.cardInfo.score[5].split(':')
		// 	props.cardInfo['allScore']=Number(splitData[0])+Number(splitData[1])
		// 	var size=Number(splitData[0])-Number(splitData[1])
		// 	props.cardInfo['size']=size>0?size:Math.abs(size)
		// }
	})
	onBeforeMount(()=>{
		// if(props.cardInfo.score[5]){
		// 	props.cardInfo['allScore']=0
		// 	props.cardInfo['size']=0
		// 	var splitData=props.cardInfo.score[5].split(':')
		// 	props.cardInfo['allScore']=Number(splitData[0])+Number(splitData[1])
		// 	var size=Number(splitData[0])-Number(splitData[1])
		// 	props.cardInfo['size']=size>=0?size:Math.abs(size)
		// }
	})
	
	const sfczidian = (e)=>{
		var arr = ['客胜1~5','客胜6~10','客胜11~15','客胜16~20','客胜21~25','客胜26+','主胜1~5','主胜6~10','主胜11~15','主胜16~20','主胜21~25','主胜26+']
		return arr[e-1];
	}
	
</script>

<style lang="scss">
	.Card_zuqiu{
		width:690rpx;
		background-color:white;
		border-radius:15rpx;
		margin:10rpx auto;
		padding:20rpx;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		.top{
			display: flex;
			flex-direction: row;
		}
		.bottom{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}
	}
</style>
