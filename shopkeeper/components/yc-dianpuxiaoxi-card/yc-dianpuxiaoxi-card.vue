<template>
	<view style="width:100%;height:140rpx;background-color: white;border-bottom:1rpx #f3f3f3 solid;">
		<view style="display: flex;align-items: center;height:100%;">
			<view style="display: flex;justify-content: space-between;width:100%;">
				<view style="display: flex;margin-left:10rpx;">
					<image :src="counter.baseUrl+Props.gameList.gameInfo.image" style="width:110rpx;height:110rpx;"></image>
					<view style="display: flex;flex-flow:column;justify-content: space-between;margin-left:10rpx;">
						<view>
							<text style="font-weight: 600;">{{Props.gameList.gameInfo.title}}</text>
							
							<text style="font-weight:700;color:#43ca00;font-size:26rpx;" v-if="Props.pageIndex==1">
								{{Props.gameList.AutomaticOrder==1?'· 自动甩单':'· 手动甩单'}}
							</text>
							<text style="font-weight:700;font-size:26rpx;" v-else :style="Props.gameList.AutomaticOrderReceiving==1?'color:#43ca00;':'color:#ababab;'">
								{{Props.gameList.AutomaticOrderReceiving==1?'· 开启接单':'· 关闭接单'}}
							</text>
							
						</view>
						<view style="font-size:26rpx;">
							<text :style="Props.gameList.gameInfo.taState==1?'color:#FDC830;':'color:#ababab;'">
								{{Props.gameList.gameInfo.taState==1?'对方开启投注':'对方关闭投注'}}
							</text>

							<text style="color: red;"> | 佣金：{{Props.gameList.gameCommission}}%</text>
						</view>
					</view>
				</view>
				<view style="display: flex;flex-flow: column;justify-content: space-between;margin-right:10rpx;">
					<switch style="transform:scale(0.7);height:65rpx;" 
							color="#FDC830" 
							:checked="Props.pageIndex==0?Props.gameList.AutomaticOrder==1:Props.gameList.AutomaticOrderReceiving==1" 
							@change="clickSwitch($event,Props.gameList.game_id,)"/>
					
					<text style="font-size:26rpx;color:#43ca00;" v-if="Props.pageIndex==1">
						开始接单
					</text>
					<text style="font-size:26rpx;color:#43ca00;" v-else>
						自动甩单
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	/*
	接收：
	
	-----------------------------------------------------------
	发送：
	switchValue（卡片开关状态（布尔值））
	*/
   import {
   	ref,
   	onBeforeMount,
   	onMounted,
   	reactive,
   	getCurrentInstance,
   	defineEmits,//发送数据
   	defineProps,//接收数据
   } from 'vue';
   import {useCounterStore} from '@/stores/counter'
   import api from '@/common/vmeitime-http/mine/mine.js';
   const counter = useCounterStore(); //状态管理
   const Props=defineProps(['gameList','pageIndex','gameIndex'])
   const clickSwitch=(switchState,gameId)=>{//玩法开关
	   if(Props.pageIndex==0){
		   api.GetPushSwith({
			   "MainStore_id":Props.gameList.MainStore_id,
			   "game_id":gameId,
			   "value":switchState.detail.value==true?1:0,
			   }).then((res)=>{
				   counter.cooperationShopData.gamelist[Props.gameIndex].AutomaticOrder=switchState.detail.value==true?1:0
		   })
	   }else{
		   api.GetPullSwith({
			   "BranchStore_id":Props.gameList.BranchStore_id,
			   "game_id":gameId,
			   "value":switchState.detail.value==true?1:0
		   }).then((res)=>{
			   counter.cooperationShopData.gamelist[Props.gameIndex].AutomaticOrderReceiving=switchState.detail.value==true?1:0
		   })
	   }
	
   }
</script>

<style>

</style>