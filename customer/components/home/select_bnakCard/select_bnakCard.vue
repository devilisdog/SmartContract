<template>
	<view class="bg_box">
		<view class="title_box">支付银行卡选择</view>
		<scroll-view :scroll-y="true" class="content_scroll">
			<view class="card" v-for="itme,index in dataList" :key="itme.app_id" @click="clickSelect(index)">
				<view class="card_top">
					<view class="top_left">
						<view class="logo_Box"><image src="@/static/img/home/yh.png" class="image_style" /></view>
						<view class="bankTilei">
							<text style="font-size:32rpx;font-weight: bold;">{{itme.bank_name}}</text><br>
							<text>绑定手机：{{itme.tel_no}}</text>
						</view>
					</view>
					<view class="top_right"><text>{{itme.card_id}}</text></view>
				</view>
				<view class="card_middle">
					<view class="select_box">
						<view class="select" v-show="index==select_index"></view>
					</view>
				</view>
				<view class="card_bottom">
					<text>
						添加时间：{{setTime.getNowFormatDate(0,Number(itme.created_time)*1000)}}
					</text>
				</view>
			</view>
			<view class="addBankcard" @click="addBankCard">
				<image class="add_image" src="../../../static/img/main/add.png"></image>
			</view>
			<view style="height:1rpx;"></view>
		</scroll-view>
		<view class="buttom_card">
			<view class="buttomStyle" style="flex:0.8;margin-right:10rpx;" @click="close">
				取消
			</view>
			<view class="buttomStyle" style="flex:1.2;background-color: #202736; "  @click="select">
				确定
			</view>
		</view>
	</view>
</template>

<script setup>
	import setTime from "@/common/getdatetime.js"
	import api from "@/common/vmeitime-http/index.js"
	import {ref,reactive,getCurrentInstance,onBeforeMount,defineEmits,defineProps} from 'vue';
	const Emits=defineEmits(['select','close'])
	const Props=defineProps(['select_value'])
	const dataList=ref([])
	const select_index=ref(Props.select_value)
	onBeforeMount(()=>{
		getBankCardList()
	})
	const close=()=>{
		Emits('close')
	}
	const select=()=>{
		Emits('select',dataList.value[select_index.value],select_index.value)
	}
	const addBankCard=()=>{//添加银行卡跳转
		Emits('close')
		uni.navigateTo({url:'../../../pages/home/bankCardSet/bankCardSet'})
	}
	const clickSelect=(index)=>{
		if(select_index.value==index){
			select_index.value=null
		}else{
			select_index.value=index
		}
	}
	const getBankCardList=()=>{
		uni.showLoading({title:'获取数据中~',mask:true})
		api.CardQuery({}).then(res=>{
			uni.hideLoading()
			if(res.data.code==1){
				dataList.value=JSON.parse(res.data.data)
			}else{
				uni.showToast({
					title:res.data.data,
					icon:'error',
				})	
			}
		}).catch(err=>{
			uni.hideLoading()
			uni.showToast({
				title:'数据处理失败，请联系平台客服',
				icon:'none',
				position:'center'
			})
		})
	}
</script>

<style lang="scss">
	.card_middle{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.select_box{
			width:60rpx;
			height:60rpx;
			border-radius:50%;
			border:1rpx solid #efefef;
			background-color:#fff;
			display: flex;
			align-items: center;
			justify-content: center;
			.select{
				width:80%;
				height:80%;
				background-color:salmon;
				border-radius:50%;
			}
		}
	}
	
	.card{
		width:680rpx;
		padding:20rpx;
		border-radius:20rpx;
		background-image: linear-gradient(-225deg, #202736,#202737);
		margin:15rpx auto;
		color:#fff;
		height:250rpx;
		display: flex;
		flex-flow: column;
		justify-content: space-between;
		.card_bottom{
			width:100%;
			text-align: right;
		}
		.card_top{
			display: flex;
			justify-content: space-between;
			.top_left{
				display: flex;
				.bankTilei{
					margin-left:20rpx;
				}
			}
		}
	}
	.addBankcard{
		width:680rpx;
		padding:20rpx;
		border-radius:20rpx;
		background-color: #fff;
		margin:15rpx auto;
		height:250rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		.add_image{
			width:200rpx;
			height:200rpx;
		}
	}
	.image_style{
		width:70rpx;
		height:70rpx;
	}
	.logo_Box{
		border-radius:50%;
		background-color:#fff;
		width:90rpx;
		height:90rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.content_scroll{
		width:100%;
		height:82vh;
		background-color:#f5f5f5;
		border-radius:20rpx;
	}
	.title_box{
		text-align: center;
		padding:20rpx;
		font-size:38rpx;
		font-weight: bold;
	}
	.bg_box{
		width:100%;
		border-radius:20rpx 20rpx 0 0;
		height:95vh;
		background-color:#fff;
	}
	.buttom_card{
		display: flex;
		justify-content: space-between;
		position: absolute;
		width:720rpx;
		left:calc(50% - 360rpx);
		bottom:20rpx;
		.buttomStyle{
			height:80rpx;
			background-color: #bababa;
			text-align: center;
			line-height:80rpx;
			border-radius:10rpx;
			color:white;
		}
	}
</style>
