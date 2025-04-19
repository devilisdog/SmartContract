<template>
	<z-paging ref="cardRef" v-model="orderCardData" @query='clickOrder' :auto='Props.pageIndex==0' :fixed="false">
		<template v-slot:top>
			<view class="tgaStyle">
				<text style="margin:0rpx 10rpx;">统计：￥{{tjmoney}}</text>
				<uni-datetime-picker @change='timeSet' type="daterange"></uni-datetime-picker>
			</view>
			
			<view class="setMoney" v-show="Props.pageIndex==0">
				<text style="margin:0rpx 10rpx;color:#FDC830;font-size: 26rpx;">金额区间:</text>
				<uni-number-box :max="5000" v-model="moneySection.min" />
				<text>~</text>
				<uni-number-box :max="5000" v-model="moneySection.max" />
				<view class="setMoneyButtom" style="background-color:#989898;" @click="resetMoney">重置</view>
				<view class="setMoneyButtom" style="background-color:#FDC830;" @click="setResetMoney">确定</view>
			</view>
		</template>
		<uni-list>
			<uni-list-item 
				:title="tita[Props.pageIndex]+' | '+itme.memo" 
				:note="getdatetime.getNowFormatDate(0,itme.create_time)" 
				clickable v-for="itme,index in orderCardData"
				@click="clickCard(itme,index)">
				<template v-slot:footer>
					<text :style="itme.after>itme.before?'color:red;':''">
						{{itme.after>itme.before?'+'+itme.money:itme.money}}
					</text>
				</template>
			</uni-list-item>
		</uni-list>
	</z-paging>
	
	<uni-popup ref="messagePopup" type="bottom">
		<view class="popupCard">
			<view style="text-align:center;font-size:52rpx;height:100rpx;">
				<text :style="clickPopupData.data.after>clickPopupData.data.before?'color:red;':''" style="line-height:100rpx;">
					{{clickPopupData.data.after>clickPopupData.data.before?'+'+clickPopupData.data.money:clickPopupData.data.money}}
				</text>
			</view>
			<view style="margin:20rpx;">
				<text style="color:#666666;">时间：</text>
				<text style="padding-left:30rpx;"> {{getdatetime.getNowFormatDate(0,clickPopupData.data.create_time)}}</text>
			</view>
			<view style="margin:20rpx;">
				<text style="color:#666666;">订单号：</text>
				<text>{{clickPopupData.data.id}}</text>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
		defineProps,
		watch
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	import getdatetime from "@/common/getdatetime.js"
	import api from "@/common/vmeitime-http/mine/mine.js"
	const Props=defineProps([
		'tabIndex',//正在显示的页面index
		'pageIndex',//循环每个页面的index
		'pageState',//区分是甩单还是接单页面
		'shop_id',//店铺id
	])
	const moneySection=reactive({
		max:0,
		min:0
	})
	
	const resetMoney=()=>{//重置金额区间
		moneySection.max=0
		moneySection.min=0
		proxy.$refs.cardRef.reload()
	}
	const timeData=ref([])
	const timeSet=(e)=>{//日期选择
		timeData.value=e
		proxy.$refs.cardRef.reload()
	}
	const setResetMoney=()=>{//确定金额区间
		proxy.$refs.cardRef.reload()
	}
	const orderCardData=ref([])
	const uploadValue=ref(false)
	const tjmoney =ref(0)
	const clickOrder=(e,k)=>{
		if(e==1){
			tjmoney.value = 0
		}
		
		api.GetCooperationBalance({
			"shop_id":Props.shop_id,
			"Coop_type":Number(Props.pageState)+1,
			"type":Number(Props.pageIndex)+1,
			"minMoney":moneySection.min==0&&moneySection.max==0?'':moneySection.min,
			"maxMoney":moneySection.max==0&&moneySection.max==0?'':moneySection.max,
			"startTime":timeData.value[0],
			"endTime":timeData.value[1],
			"per_page":k,
			"current_page":e
		}).then((res)=>{
			
			
			
			tjmoney.value = (res.data.data.tjmoney/100).toFixed(2)
			uni.hideLoading();
			proxy.$refs.cardRef.complete(res.data.data.data.data)
			uploadValue.value=true
		}).catch(res=>{
			uni.hideLoading();
			proxy.$refs.cardRef.complete(false)
			
		})
	}
	const tita = reactive(['出票', '充值','店主','奖金','提现']) //title数据
	watch(()=>Props.tabIndex,(newValue,oldValue)=>{
		if(newValue===Props.pageIndex){
			if(!uploadValue.value){
				uni.showLoading({
					title: '加载中~'
				});
				proxy.$refs.cardRef.reload()
				
			}
			
		}
	})
	const clickPopupData=reactive([])
	const clickCard=(itme,index)=>{
		clickPopupData.data=itme
		proxy.$refs.messagePopup.open()
	}
</script>

<style>
	.popupCard{
		width:100%;
		height:350rpx;
		background-color: white;
		border-top-left-radius:40rpx;
		border-top-right-radius:40rpx;
	}
	.setMoney{
		background-color: white;
		border-top:1rpx solid #e8e8e8;
		padding:10rpx 0rpx;
		display: flex;
		align-items: center;
	}
	.setMoneyButtom{
		font-size:26rpx;
		width:90rpx;
		height:50rpx;
		border-radius:5rpx;
		text-align: center;
		line-height:50rpx;
		margin:0rpx 10rpx;
		color: white;
	}
	.tgaStyle{
		width:100%;
		height:50rpx;
		font-size: 26rpx;
		display: flex;
		align-items: center;
		color:#FDC830;
		background-color: white;
		padding:10rpx 0rpx;
	}

</style>