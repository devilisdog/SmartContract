<template>
	<!-- 主体 -->
	<view class="content">
		<!-- 表头 -->
		<view class="List-head">
			<text style="width: 20%;">过关</text>
			<text style="width: 30%;border-left: none;border-right: none;">单注组合</text>
			<text style="width: 30%;border-right: none;">注数分布</text>
			<text style="width: 20%;">预测奖金</text>
		</view>
		<!-- 表身 -->
		<view v-for="item,index in 10"
			style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
			
			<view class="List-body" style="height: 100%;">
				<view style="width: 20%;">2串1</view>
				<view style="width: 30%;display: flex;flex-direction: column;border-left: none;">
					<text>XXX|XX(0.00)</text>
					<text>XXX|XX(0.00)</text>
					<uni-icons 
						type="bottom" 
						style='margin-bottom: -20rpx;margin-top: 10rpx;'
						@click="List_Click(index)"></uni-icons>
				</view>
				<view style="width: 30%;border-left: none;border-right: none;">
					<uni-number-box @change="changeValue" :value="1" :min="1" :max="240" style='border: none;' />
				</view>
				<view style="width: 20%;">0.00</view>
			</view>
			
			<!-- 单注组合点击 -->
			<view style="background-color: #fff9eb;" v-show="showList==index">
				<!-- 点开以后的头 -->
				<view class="List-body-content-head">
					<text style="width: 25%;">场次</text>
					<text style="width: 25%;border-left: none;border-right: none;">主队</text>
					<text style="width: 25%;border-right: none;">客队</text>
					<text style="width: 25%;">投注内容</text>
				</view>
				<!-- 点开以后的内容 -->
				<view class="List-body-content-head">
					<text style="width: 25%;">周日110</text>
					<text style="width: 25%;border-left: none;border-right: none;">卡塔尔</text>
					<text style="width: 25%;border-right: none;">厄瓜多尔</text>
					<text style="width: 25%;">让胜(1.63)</text>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script setup>
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		getCurrentInstance,
	} from 'vue'
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	
	// 加减框
	const changeValue = (e) =>{
		cvalue.value = e
	}
	
	const showList = ref()
	const List_Click = (e) =>{
		if(showList.value != e){
			showList.value = e
		}else{
			showList.value = null
		}
	}
</script>

<style>
	.content{
		width: 100%;
		height: 100%;
		margin: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.List-head{
		width: 720rpx;
		height: 60rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		}.List-head text{
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: bold;
			color: #363636;
			padding: 15rpx 0;
			border: 1rpx solid #dedede;
		}
	
	.List-body{
		width: 720rpx;
		height: 60rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		}.List-body view{
			display: flex;
			align-items: center;
			justify-content: center;
			height: 150rpx;
			border: 1rpx solid #dedede;
			border-top: none;
		}
		
	.List-body-content-head{
		width: 720rpx;
		height: 60rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-top: 5rpx;
		margin-bottom: 5rpx;
		}.List-body-content-head text{
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: bold;
			color: #363636;
			padding: 15rpx 0;
			border: 1rpx solid #dedede;
			border-top: none;
		}

</style>
