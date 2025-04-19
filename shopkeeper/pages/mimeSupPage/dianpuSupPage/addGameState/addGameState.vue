<template>
	<view class="tabs_box">
		<view class="status_bar"></view>
		<uni-nav-bar title="玩法申请" leftIcon="closeempty" @clickLeft="back" />
	</view>
	
	<view class="cardBox">
		<view class="card" 
			  v-for="itme,index in counter.cooperationShopData.applyGmae" 
			  @click="clickButton(itme.title,itme.id,index)">
			<image :src="counter.baseUrl+itme.image" style="width:100rpx;height:100rpx;"></image><br>
			<text style="margin-top:-30rpx;">{{itme.title}}</text>
		</view>
	</view>
	

	<uni-popup ref="game" type="center">
		<view class="gamePopup">
			<view style="height:80rpx;text-align: center;font-weight:bold;">
				<text style="line-height:80rpx;">申请合作彩种</text>
			</view>
			<view style="width:600rpx;margin: auto;color:#8f8f8f;display: flex;flex-direction: column;justify-content: space-between;height:420rpx">
				<view>
					<text>彩种名称：</text>
					<text style="color: black;">{{clickGameData.title}}</text>
				</view>
				<view style="display: flex;">
					<text>佣金设置：</text>
					<uni-number-box v-model="clickGameData.brokerage" :max="7" :min="0"></uni-number-box>
					<text  style="color: black;"> %</text>
					<text>佣金范围0-7</text>
				</view>
				<view>
					<text>申请备注：</text>
					<uni-easyinput maxlength="130" v-model="clickGameData.applyRemark"></uni-easyinput>
				</view>
				<view style="display: flex;justify-content: space-between;margin:20rpx 0rpx;">
					<view class="closeButton" @click="proxy.$refs.game.close()">
						<text>取消</text>
					</view>
					<view class="submitButton" @click="confirm">
						<text>申请</text>
					</view>
				</view>
			</view>
		</view>
	</uni-popup>
	
</template>

<script setup>
	import common from "@/common/common.js"
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	import {useCounterStore} from '@/stores/counter'
	import api from '@/common/vmeitime-http/mine/mine.js';
	import {onShow,onBackPress,onTabItemTap,onReachBottom} from "@dcloudio/uni-app"
	const counter = useCounterStore(); //状态管理
	const back=()=>{
		uni.navigateBack()
	}
	const buttonValue=ref(null)
	
	const clickGameData=reactive({//用户点击的玩法信息
		title:'',//玩法名字
		gameId:'',//玩法id
		index:0,//点击玩法的index
		applyRemark:'',//申请玩法的备注
		brokerage:5//申请合作玩法佣金比例
	})
	const clickButton=(title,id,index)=>{
		clickGameData.title=title
		clickGameData.gameId=id
		clickGameData.index=index
		setTimeout(()=>{
			proxy.$refs.game.open()
		},150)
	}
	const confirm=()=>{
		uni.showLoading({
			title:'提交中~'
		})
		api.GetaddCooperationGame({
			"id":counter.cooperationShopData.mainStore.id,
			"game_id":clickGameData.gameId,
			"commission":clickGameData.brokerage,
			"memo":clickGameData.applyRemark
		}).then((res)=>{
			uni.hideLoading()
			if(res.data.code==1){
				uni.showToast({
					title:res.data.data,
					icon:'none',
					position:'center',
					duration:3000
				})
				counter.cooperationShopData.applyGmae.splice(clickGameData.index,1)
			}else{
				uni.showToast({
					title:res.data.data,
					icon:'none',
					position:'center'
				})
			}
			
		})
		proxy.$refs.game.close()
	}
</script>

<style>
	.tabs_box{
		z-index:1;
		position: -webkit-sticky;
		position: sticky;
		top:0rpx
	}
	.closeButton{
		width:250rpx;
		height:60rpx;
		background-color: #dfdfdf;
		color: #787878;
		text-align: center;
		line-height:60rpx;
		border-radius:5rpx;
	}
	.submitButton{
		width:320rpx;
		height:60rpx;
		background-color: #428ff3;
		color: #ffffff;
		text-align: center;
		line-height:60rpx;
		border-radius:5rpx;
	}
	
	.gamePopup{
		width:700rpx;
		height:500rpx;
		background-color:white;
		border-radius:20rpx;
		padding:10rpx 0rpx;
		
	}
	.cardBox{
		display: grid;
		grid-template-columns: repeat(3,180rpx);
		grid-template-rows: repeat(2,260rpx);
		grid-row-gap:40rpx;
		padding:20rpx;
		justify-content:space-around;
	}
	.card{
		wdisplay: inline-block;
		width: 180rpx;
		height:260rpx;
		border-radius:20rpx;
		background: #ffffff;
		box-shadow:-3px -3px 3px #f1f1f1, 5px 5px 5px #f1f3f4 ;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: .1s
	}
	.card:active{
		transition:.2s;
		transform: scale(0.9);
		box-shadow: none;
	}
	body{
		background-color: #ffffff;
	}
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
