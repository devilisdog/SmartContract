<template>
	<view class="status_bar"></view>
	<uni-nav-bar title="添加合作店铺" leftIcon="closeempty" @clickLeft="back" rightText="申请记录" @clickRight="popupRecord" leftText="返回"/>
	
	<view class="formCard">
		<form>
			<view style="display: flex;border-bottom:1rpx solid #e7e7e7;align-items: center;padding-bottom:20rpx;">
				<text style="font-weight: bold;">合作店铺ID：</text>
				<input placeholder="输入对方店铺ID(必填)" v-model="tijiaoData.id"/>
			</view>
			<!-- <view style="display: flex;padding:20rpx 0rpx;border-bottom:1rpx solid #e7e7e7;align-items: center;">
					<text style="font-weight: bold;">合作店铺名称：</text>
					<input placeholder="输入对方店铺名称(必填)" v-model="tijiaoData.shopName"/>
			</view> -->
			<view style="display: flex;align-items: center;padding-top:20rpx;">
				<text style="font-weight: bold;">申请说明：</text>
				<input placeholder="输入申请说明(选填)" v-model="tijiaoData.explain"/>
			</view>
		</form>
	</view>
	<view style="width:720rpx;margin: auto;">
		<view class="buttomStyle" @click="tijiao">提交</view>
		<text style="font-size: 26rpx;color:gray;">！合作期间，在确保合作店铺的真实性的同时，需及时监督出票方上传真实的票据，提醒对方按时派奖，如果发现异常，请及时关闭合作，并且反馈给客服进行处理</text>
	</view>
	
	<uni-popup type="bottom" ref="record" >
		<view style="width:100%;background-color:#f4f4f4;height:95vh;">
			<uni-nav-bar title="申请记录" leftIcon="closeempty" @clickLeft="closeRecord" @clickRight="openTime" />
			<view style="width:100%;background-color: white;padding:10rpx 0rpx;">
				<wly-datetime-picker 
					type="datetimerange"
					@change='clickScreen'
					returnType="timestamp"
				/>
			</view>
				
			<view class="recordCard" v-for="itme,index in applyRecordData">
				<view style="display: flex;">
					<image src="/static/lottery/101.png" style="width:80rpx;height:80rpx;"></image>
					<view style="display: flex;flex-flow: column;margin-left:20rpx;">
						<text style="font-size:26rpx;color:#6b6b6b;">ID：{{itme.MainStore_id}}</text>
						<text style="color: #dcad29;padding-top:10rpx;">佣金：5.00%</text>
					</view>
				</view>
				<view class="button" 
				:style="itme.state==0?'background-color:#0687ff;':
				itme.state==1?'background-color:#FDC830;':'background-color:red;'"><!--  -->
					<text v-show="itme.state==1">已通过</text>
					<text v-show="itme.state==2">已拒绝</text>
					<text v-show="itme.state==0">审核中</text>
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import common from '@/common/common'
	import {onBackPress} from "@dcloudio/uni-app"
	import api from '@/common/vmeitime-http/mine/mine.js';
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		//defineEmits,//发送数据
		//defineProps,//接收数据
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const tijiaoData=reactive({
		id:'',
		shopName:'',
		explain:'',
	})
	const buttonValue=ref(0)//判断是否显示已通过（默认0已拒接，1为已通过）
	const back=()=>{
		uni.navigateBack()
	}
	const openTime=()=>{
		proxy.$refs.time.show()
	}
	const popupRecord=()=>{
		applyRecord("","")
		proxy.$refs.record.open()
	}
	const closeRecord=()=>{
		proxy.$refs.record.close()
	}
	const tijiao=(e)=>{
		uni.showLoading({
			title:'提交中~'
		})
		if(tijiaoData.id != ''){
			api.GetAddCooperation({
				"id":tijiaoData.id,
				// "shopname":tijiaoData.shopName, 2023.11.06 应要求去掉
				"memo":tijiaoData.explain,
			}).then((res)=>{
				uni.hideLoading()
				uni.showToast({
					title:res.data.data,
					icon:res.data.code==1?res.data.msg:'error'
				})
			})
		}else{
			uni.showToast({
				title:'店铺ID/名称不能为空！',
				icon:'error'
			})
		}
		
	}
	const applyRecordData=ref([])
	const clickScreen=(e)=>{
		// console.log('开始',startPlaceholder.value/1000);
		// console.log('结束',endPlaceholder.value/1000);
		if(e[0]!=undefined){
			applyRecord(e[0]/1000,e[1]/1000)
		}else{
			applyRecord("","")
		}
	}
	const applyRecord=(star,end)=>{
		uni.showLoading({
			title:'加载中~'
		})
		api.GetMineRecord({"startTime":star,"endTime":end}).then((res)=>{
			uni.hideLoading()
			applyRecordData.value=res.data.data
		})
	}
</script>

<style>
	.buttomStyle{
		width:100%;
		height:80rpx;
		background-color:#FDC830;
		border-radius:15rpx;
		text-align: center;
		line-height:80rpx;
		color: white;
		margin:20rpx 0rpx;
		transition: show 0.5s;
	}
	.button{
		width:120rpx;
		height:55rpx;
		text-align: center;
		line-height:55rpx;
		border-radius:20rpx;
		color: white;
	}
	.recordCard{
		width:680rpx;
		height:100rpx;
		display: flex;
		align-items: center;
		justify-content:space-between;
		margin:10rpx auto;
		background-color: white;
		padding:20rpx;
		border-radius:20rpx;
	}
	.formCard{
		width:680rpx;
		margin:20rpx auto;
		background-color:white;
		padding:20rpx;
		border-radius:20rpx;
	}
	body {
		background-color: #f4f4f4;
	}
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
