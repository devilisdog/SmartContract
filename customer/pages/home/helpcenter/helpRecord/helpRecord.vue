<template>
	<z-paging
		ref="paging" 
		v-model="helpData" 
		@query="queryList"
	>
		<template v-slot:top>
			<view class="status_bar"></view>
			<uni-nav-bar 
				title="反馈记录" 
				:rightText="screenData[screenValue]" 
				leftIcon="back" 
				@clickLeft="back" 
				@clickRight="proxy.$refs.screen.open()">
			</uni-nav-bar>
		</template>
		<view class="card" v-for="itme,index in helpData">
			<view style="display: flex;flex-direction: row;align-items: center;">
				<view class="label"></view>
				<text style="font-size: 35rpx;font-weight: bold;">当前状态：</text>
				<text style="font-size: 36rpx; color: #5e5e5e;">待处理...</text>
			</view>
			<view style="display: flex;flex-direction:column;width:100%;word-break: break-all;margin:20rpx 0rpx;">
				<text style="font-size: 35rpx;font-weight: bold;">内容描述:</text>
				<text class="helpContent">{{itme.describe}}</text>
			</view>
			<view>
				<text style="font-size:35rpx;font-weight: bold;">图片内容:</text>
				<view class="image_box">
					<image
						v-for="itme02,index02 in itme.related_images" 
						:key="index02" 
						style="width: 150rpx;height: 150rpx;border-radius:10rpx;"
						:src="counter.baseUrl+itme02"
						@click="previewImage(itme.related_images,index02)"
						>
					</image>
				</view>
			</view>
			<view>
				<text style="font-size:35rpx;font-weight: bold;">处理回复:</text>
				<rich-text :nodes="itme.returnData"></rich-text>
				
			</view>
		</view>
	</z-paging>
	<uni-popup type="bottom" ref="screen">
		<view class="popupCard">
			<view 
				:class="index==screenValue?'popupButton_true':'popupButton'" 
				v-for="itme,index in screenData"
				@click="select(index)"
				>
				{{itme}}
			</view>
			<view 
				class="popupButton" style="background-color:#cacaca;font-weight: bold;"
				@click="proxy.$refs.screen.close()"
				>
				取消
			</view>
		</view>
	</uni-popup>
	
</template>

<script setup>
	import api from '@/common/vmeitime-http/'
	import common from "@/common/common.js"
	import { useCounterStore } from '@/stores/counter';
	const counter = useCounterStore();//状态管理
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
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const screenData=reactive(['全部','软件问题','订单问题','规则问题'])//筛选框选择
	const screenValue=ref(0)//筛选框默认选择值
	const previewImage=(arr,index)=>{//图片预览
		var newArr=[]
		for(var a=0;a<arr.length;a++){//将图数组里的url添加baseUrl
			newArr.push(counter.baseUrl+arr[a])
		}
		uni.previewImage({
			urls:newArr,
			current:index
		})
	}
	const select=(e)=>{
		if(screenValue.value!=e){
			screenValue.value=e
			proxy.$refs.screen.close()
		}
	}
	const helpData =ref()
	const queryList =(pageNo,pageSize)=>{
		api.GetHelpRecord().then((res)=>{
			// console.log('反馈记录回调数据',res);
			helpData.value = res.data.data
			proxy.$refs.paging.complete(helpData.value)
		}).catch(res=>{	
			proxy.$refs.paging.complete(false)
		})
	}
	
	const back =()=>{
		uni.navigateBack({
			delta: 1,
			animationType: 'pop-out',
			animationDuration: 250
		});
	}
</script>

<style>
	.popupButton{
		width:680rpx;
		padding:20rpx;
		text-align: center;
		border-radius:15rpx;
		margin:auto;
	}
	.popupButton_true{
		width:680rpx;
		padding:20rpx;
		text-align: center;
		border-radius:15rpx;
		margin:auto;
		background-color: #ffb83c;
		color:white;

	}
	.popupCard{
		width:100%;
		background-color: white;
		border-radius:20rpx 20rpx 0 0;
		padding:20rpx;
		box-sizing:border-box;
	}
	.image_box{
		display:grid;
		grid-template-columns:repeat(4,150rpx);
		grid-template-rows: repeat(auto,auto);
		justify-content: space-between;
		grid-row-gap:25rpx;
	}
	.label{
		width: 10rpx;
		height: 35rpx;
		background-color: #ffb83c;
		border-radius: 55rpx;
		margin-right: 10rpx;
	}
	.card{
		width:680rpx;
		padding:20rpx;
		background-color:white;
		box-shadow: 0rpx 5rpx 10rpx #f1f1f1;
		border-radius:15rpx;
		margin:20rpx auto;
		color: #686868;
	}
	body{
		background-color: #f8f8f8;
	}
	.status_bar {
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
	}
	.navBar{
		width: 100%; 
		height: 110rpx;
		background-color:#fff; 
		box-shadow: 0rpx 5rpx 10rpx #f1f1f1;
		}
		
		
	.helpContent{
		overflow: hidden;
		display: -webkit-box;
		text-overflow: ellipsis;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
</style>
