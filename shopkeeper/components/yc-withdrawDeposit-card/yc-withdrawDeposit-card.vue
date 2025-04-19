<template>
	<view class="card">
		<view style="display: flex;align-items: center;justify-content: space-between;border-bottom:1rpx solid #d4d4d4;">
			<view @click="clickCoyp(clickCoyp(Props.data.user_remarks!=undefined?Props.data.user_remarks:Props.data.user_nickname))">
				<text>用户昵称：{{Props.data.user_remarks!=undefined?Props.data.user_remarks:Props.data.user_nickname}}({{'ID:'+Props.data.user_id}})</text>
				<uni-icons type="folder-add"></uni-icons>
			</view>
			<view>
			</view>
			<view style="display: flex;align-items: center;margin-bottom:10rpx;">
				<text style="color: red;margin:0rpx 10rpx;">{{Props.data.money}}元</text>
				<image src="@/static/icon/mide/zfb.png" class="mediumImage" v-if="Props.data.memo=='支付宝'"/>
				<image src="@/static/icon/mide/yhk_02.png" class="mediumImage" v-else/>
			</view>
		</view>
		<view style="margin:20rpx 0rpx;display: flex;font-size:28rpx;">
			<image :src="Props.data.user_avatar" class="miaxImag"></image>
			<view style="line-height:46rpx;margin-left:10rpx;">
				<view style="display: flex;align-items: center;" @click="clickCoyp(Props.data.number)">
					<image src="@/static/icon/mide/zfb.png" class="minImag" v-if="Props.data.memo=='支付宝'"/>
					<image src="@/static/icon/mide/yhk_02.png" class="minImag" v-else/>
					<text style="margin:0rpx 5rpx;">{{Props.data.number}}</text>
					<uni-icons type="folder-add"></uni-icons>
				</view>
				<view style="display: flex;align-items: center;" @click="clickCoyp(Props.data.contact)">
					<uni-icons type="phone-filled"></uni-icons>
					<text style="margin:0rpx 5rpx;">{{Props.data.contact}}</text>
					<uni-icons type="folder-add"></uni-icons>
				</view>
				<text @click="clickCoyp()">
					真实姓名：{{Props.data.user_RealName}})
				</text>
				<uni-icons type="folder-add"></uni-icons><br>
				<text>申请时间：{{getDate.getNowFormatDate(0,Props.data.update_time)}}</text>
			</view>
		</view>
		<view style="display: flex;justify-content: space-between;align-items: center;">
			<view class="buttonStyle" style="background-color:#eeeeee;color:#888888;" @click="proxy.$refs.retReason.open()">
				拒绝
			</view>
			<view class="buttonStyle" style="background-color:#FDC830; color:white;" @click="setSithdrawalSlip(1)">
				同意
			</view>
		</view>
	</view>
	
	<!-- 对话框 -->
	<fui-dialog :show="show" @click="clickDialogButton" :content="dialogContent"></fui-dialog>
	<uni-popup ref="retReason" type="dialog" >
		<uni-popup-dialog 
			title='提示' 
			mode='input' 
			:value="retReasontext.value" 
			placeholder="请输入拒绝的理由避免纠纷~" 
			@confirm="clickDialogretReason"
			@close="">
		</uni-popup-dialog>
	</uni-popup>
</template>

<script setup>
	import getDate from "@/common/getdatetime.js"
	import api from "@/common/vmeitime-http/satistics/satistcs.js"
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
		defineProps,
		defineEmits
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const Props=defineProps(['data'])
	const Emits=defineEmits([
		'operationCallback'//点击卡片后操作回调
	])
	const buttonState=ref(1)
	const show=ref(false)//对话框显示
	const retReasontext =ref('')//拒绝文本
	const dialogContent=ref('')//对话内容
	const clickCoyp=(text)=>{//点击需要复制的内容
		uni.setClipboardData({
			data:String(text),
		})
	}
	
	//拒绝按钮的取消
	const closeDialog=()=>{
		show.value=false
	}
	//拒绝提现
	const clickDialogretReason= async (e)=>{
		
			
			uni.showLoading({
				title:'处理中~'
			})
			await api.PostHandle({"type":'2',"id":Props.data.id,'retReason':e}).then((res)=>{
				if(res.data.code==1){
					uni.showToast({
						title:'成功~'
					})
				}else{
					uni.showToast({
						title:'失败~',
						icon:'error'
					})
				}
			})
			await Emits('operationCallback')
		
	}
	
	//同意提现
	const clickDialogButton= async (e)=>{
		
		if(e.index==1){
			uni.showLoading({
				title:'处理中~'
			})
			await api.PostHandle({"type":buttonState.value,"id":Props.data.id}).then((res)=>{
				if(res.data.code==1){
					uni.showToast({
						title:'成功~'
					})
				}else{
					uni.showToast({
						title:'失败~',
						icon:'error'
					})
				}
			})
			await Emits('operationCallback')
		}
		show.value=false
	}
	const setSithdrawalSlip=(e)=>{
		buttonState.value=e
		
		if(buttonState.value==1){
			dialogContent.value='确定同意('+Props.data.user_RealName+')的提现申请吗？'
			show.value=true
		}
		
	}
	
</script>

<style>
	.buttonStyle{
		width:300rpx;
		height:60rpx;
		color: white;
		font-weight: bold;
		text-align: center;
		line-height:60rpx;
		border-radius:10rpx;
		transition:.2s;
	}
	.buttonStyle:active{/* 点击 */
		transition:.2s;
		transform: scale(0.9);
	}
	
	.mediumImage{
		width:50rpx;
		height:50rpx;
	}
	.miaxImag{
		width:180rpx;
		height: 180rpx;
		border-radius:10rpx;
	}
	.minImag{
		width:35rpx;
		height:35rpx;
	}
	.card{
		width:680rpx;
		background-color:white;
		border-radius:15rpx;
		padding:20rpx;
		margin:20rpx auto;
	}
</style>