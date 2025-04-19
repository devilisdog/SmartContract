<template>
	<view class="status_bar"></view>
	<view class="tabColor">
		<uni-nav-bar 
			title="红包记录" 
			leftIcon="back" 
			@clickLeft="back()" 
			backgroundColor="rgba(220,38,38,0)" 
			color="#fff"
			leftText="返回"
		/>
	</view>
	<view class="top_card">
		<view class="openPopup_box">
			<view class="openPopup_button" @click="openPopup">
				<text>{{Nav[0][pickerValue].label}}年</text>
				<uni-icons type="bottom" color="#ffcf0c"></uni-icons>
			</view>
		</view>
		<view class="user_info">
			<view class="user_info_box">
				<image :src="counter.user_imgs" mode="aspectFill"></image>
				<text>{{counter.nickname}} 共收到</text>
				<text class="info_box_money">{{allMoney}}元</text>
			</view>
		</view>
		<view class="user_data">
			<view class="data_box">
				<text>{{allRedPacke}}</text>
				<text>收到红包</text>
			</view>
			<view class="data_box">
				<text>{{allLuck}}</text>
				<text>手气最佳</text>
			</view>
		</view>
	</view>
	
		
	<scroll-view scroll-y="true" style="height:960rpx;">
		<z-paging
			ref="redPacketList" 
			@query='redPacket' 
			v-model="redPackeData"
			:auto='false'
			:fixed='false'
			:refresher-enabled='false'
			>
			<view class="user" v-for="itme,index in redPackeData">
				<view class="user_top">
					<text>{{itme.shop_Data.nickname}}</text>
					<text class="user_top_money">{{itme.get_money}}元</text>
				</view>
				<view class="user_time">
					<text>{{common.dateFormat(itme.create_time*1000)}}</text>
				</view>
			</view>
		
		</z-paging>
	</scroll-view>
	
	<JarvisPicker 
		mode="bottom" 
		:show.sync="popupShow" 
		:range="Nav" 
		@confirm="confirm"
		@cancel="cancel"
		>
	</JarvisPicker>
</template>

<script setup>
	import JarvisPicker from "@/components/common/jarvis-picker/jarvis-picker.vue"
	import { useCounterStore } from '@/stores/counter'
	import api from "@/common/vmeitime-http/index.js"
	import common from "@/common/common.js"
	import {
		onBeforeMount,//加载前
		onMounted,//加载完毕  页面生命周期
		ref,
		reactive,
		defineProps, // 接收
		defineEmits, // 发送
		getCurrentInstance, //获取当前组件的实例
		nextTick//强制刷新实例
	} from 'vue';
	const popupShow=ref(false)
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	onBeforeMount(()=>{
		yearFunicon()
	})
	const redPackeData=ref([])//红包记录列表数据
	
	const allRedPacke=ref(0)//所有收到的红包
	const allMoney=ref(0)//总金额
	const allLuck=ref(0)//手气最佳
	
	const pickerValue=ref(0)//年份选择器选择的值
	const redPacket=(pageNo,pageSize)=>{//红包记录列表数据
		api.getRedPacketRecord({
			"Year":Nav[0][pickerValue.value].label,
			"per_page":pageSize,
			"current_page":pageNo,
		}).then(res=>{
			allRedPacke.value=res.data.data.data.total
			allLuck.value=res.data.data.luck
			allMoney.value=res.data.data.sum
			proxy.$refs.redPacketList.complete(res.data.data.data.data)
		}).catch(res=>{
			proxy.$refs.redPacketList.complete(false)
		})
	}
	
	const openPopup=()=>{
		popupShow.value=true
	}
	const confirm=(e)=>{//分类选择点击确定触发
		pickerValue.value=e[0]
		popupShow.value=false
		proxy.$refs.redPacketList.refresh()
	}
	const cancel=()=>{//分类选择器点击取消触发
		popupShow.value=false
	}
	const yearFunicon=()=>{
		let timestamp = Date.parse(new Date());
		let date = new Date(timestamp);
		let thieYear = date.getFullYear();//获取当前年份
		for(var i=0;i<5;i++){//生成近五年的年份
			var ojd={
				label:thieYear,
				value:i
			}
			Nav[0].push(ojd)
			thieYear--
		}
		setTimeout(()=>{
			proxy.$refs.redPacketList.refresh()
		},300)
	}
	const Nav = reactive([
		[]
	])
	const back=()=>{
		uni.navigateBack()
	}
</script>

<style lang="scss">
	.user{
		width:100%;
		padding:20rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #f3f3f3;
		.user_time{
			font-size:26rpx;
			color: #8f8f8f;
		}
		.user_top{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.user_top_money{
				font-weight:bold;
			}
		}
	}
	.user_data{
		display: flex;
		align-items: center;
		justify-content: space-around;
		.data_box{
			display: flex;
			flex-flow: column;
			align-items: center;
			font-size:52rpx;
			color:#a1a1a1;
		}
	}
	.user_info{
		.user_info_box{
			display: flex;
			flex-flow: column;
			align-items: center;
			line-height:100rpx;
			.info_box_money{
				font-size:52rpx;
				font-weight:bold;
			}
			image{
				width:140rpx;
				height:140rpx;
				border-radius:10rpx;
			}
		}
	}
	.top_card{
		background-color:#f3f3f3;
		padding-bottom:40rpx
	}
	.openPopup_box{
		display: flex;
		justify-content: flex-end;
		.openPopup_button{
			margin:20rpx;
			display: flex;
			flex-flow: column;
			align-items: center;
			font-size:32rpx;
			color:#ffcf0c;
		}
	}
	
	.tabColor{
		background-color:#1C2737;
	}
	.status_bar {
		background-color:#1C2737;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
