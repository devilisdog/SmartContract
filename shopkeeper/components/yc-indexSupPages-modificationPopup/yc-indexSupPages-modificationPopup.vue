<template>
	<view class="popupCard">
		<view class="top">
			<text style="margin: auto;">出票确认</text>
			<uni-icons type="closeempty" size="38rpx" @click="close"></uni-icons>
		</view>
		<scroll-view scroll-y="true" style="max-height:1200rpx;">
			<view class="contentBox" v-for="itme,index in props.orderData.Content">
				<text>{{itme.matchNumStr}}</text>
				<view class="game">
					<view class="game-title">
						<text>{{itme.homeTeamAbbName}}</text>
						<text>VS</text>
						<text>{{itme.awayTeamAbbName}}</text>
					</view>
					<view class="game-content" v-for="Xitme,Xindex in itme.data">
						<view class="game-content-left">{{Xitme.res}}</view>
						<view class="game-content-right">
							<uni-number-box 
								:min="1" 
								:step="0.01" 
								v-model='JSON.parse(counter.orderData.BetContent).Content[index].data[Xindex].rate' 
								@change="alter($event,index,Xindex)"
							/>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="buttom-box">
			<view class="buttom" @click="submit">提交</view>
		</view>
		
	</view>
</template>

<script setup>
	import api from "@/common/vmeitime-http/index/index.js"
	import {
		getCurrentInstance,
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		defineProps,
		defineEmits,//发送数据
	} from 'vue';
	import {onShow} from "@dcloudio/uni-app"
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	import {useCounterStore} from '@/stores/counter'
	const counter = useCounterStore(); //状态管理
	const props=defineProps(['imgValue','orderData'])
	const Emits=defineEmits(['closePupop'])
	
	const close=()=>{//用户点击关闭弹窗
		Emits('closePupop')
	}
	const oldData=ref([])
	
	const booleAlter=ref(false)
	const alter=(number,orderIndex,orderSupIndex)=>{//出票确认检查是否修改了赔率
		props.orderData.Content[orderIndex].data[orderSupIndex].rate=number.toString()
		if(props.orderData.Content[orderIndex].data[orderSupIndex].rate==JSON.parse(counter.orderData.BetContent).Content[orderIndex].data[orderSupIndex].rate){
			booleAlter.value=false
		}else{
			booleAlter.value=true
		}
	}
	
	const pd_is_need_img=(data)=>{
		
		var type = counter.orderData.Type
		if(type =='竞彩足球'  || type=='竞彩篮球'  || type =='北京单场' || type=='胜负过关'){
			
			if(counter.orderData.bonusmax>counter.isneedimgnumber){
				return true
			}else{
				return false
			}
			
		}else{
			return true
		}
		
	}
	
	const submit=()=>{//用户点击提交
		counter.clickOrderState=true//开启自动接单
		if(booleAlter.value){
			props.orderData.oldContent=JSON.parse(counter.orderData.BetContent).Content
			counter.orderData.BetContent=props.orderData
		}
		uni.showLoading({title:'出票中~'})
		api.OrderDrawDraft({
			"order_id":counter.orderData.order_id,
			"newContent":booleAlter.value==false?0:counter.orderData.BetContent,
		}).then((res)=>{
			uni.hideLoading()
			if(res.data.code==1){
				uni.showToast({title:'出票成功',icon:"success"})
				uni.navigateBack()
				counter.staffLoginInfo.Info.TotalInvoicingAmount+=Number(counter.orderData.BetMoney)
			}else if(res.data.code == 402){
				counter.clickOrderState=false
				uni.showModal({
					title: '提示',
					content: '店铺余额不足~',
					confirmText:'立即充值',
					confirmColor:"#FDC830",
					success: function (res) {
						if (res.confirm) {
							uni.navigateTo({
								url:'/pages/mimeSupPage/balancePage/rechargePage',
								animationType:"slide-in-bottom"
							})
						}
					}
				});
			}else{
				counter.clickOrderState=false
				uni.showToast({
					title:res.data.data,
					icon:'error'
				})
			}
		})
	}
</script>

<style lang="scss">
	.popupCard{
		width:660rpx;
		padding:20rpx;
		background-color: white;
		border-radius:15rpx;
		.top{
			display: flex;
			align-items: center;
			border-bottom:1rpx solid #e3e3e3;
			padding-bottom:20rpx;
		}
		.contentBox{
			display: flex;
			justify-content:space-around;
			align-items: center;
			border-bottom:1rpx solid #e3e3e3;
			padding-bottom:20rpx;
			.game{
				flex:0.7;
				.game-title{
					display: flex;
					justify-content:space-evenly;
					margin:15rpx 0rpx;
				}
				.game-content{
					border-radius: 10rpx;
					border: 1rpx solid #e3e3e3;
					padding:5rpx;
					display: flex;
					align-items: center;
					margin:15rpx 0rpx;
					.game-content-left{
						flex: 1;
						text-align: center;
						color: red;
					}
					.game-content-right{
						flex: 1;
						text-align: center;
					}
				}
			}
		}
		.buttom-box{
			display: flex;
			justify-content: center;
			margin-top:20rpx;
			.buttom{
				width:480rpx;
				height:80rpx;
				background-color:#ffaa00;
				text-align: center;
				color: white;
				line-height:80rpx;
				border-radius:15rpx;
			}
			.buttom:active{
				background-color: #ffca4e;
			}
		}
	}
</style>