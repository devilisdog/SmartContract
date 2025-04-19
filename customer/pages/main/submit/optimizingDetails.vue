<template>
	<view class="statusBar"></view>
	<uni-nav-bar title="拆单明细" leftIcon="closeempty" @clickLeft="back"></uni-nav-bar>
	<view style="margin:20rpx 0rpx;">
		<view  >
			<view class="table-tr" >
				<view style="width:10%;">序号</view>
				<view style="width:12%;border-left:none;border-right: none;">过关</view>
				<view style="width:50%;">拆单内容</view>
				<view style="width:18%;border-left:none;">注数分布</view>
				<view style="width:20%;font-size:24rpx;border-left:none;">预测金额</view>
			</view>
			<view v-for="itme,index in counter.BettingContent.bonusOptimize">
				<view class="table-td" @click="showTable(index)" >
					<view style="width:10%;">{{index+1}}</view>
					<view style="width:12%;border-left:none;border-right: none;">{{itme.data[0][5]}}</view>
					<view style="width:50%;display: flex;flex-flow: column;" v-if="itme.data.length>1">
						<text>
							{{itme.data[0][0].substring(2)+itme.data[0][1]+' | '+itme.data[0][3]+'('+itme.data[0][4]+')'}}
						</text>
						<text>
							{{itme.data[1][0].substring(2)+itme.data[1][1]+' | '+itme.data[1][3]+'('+itme.data[1][4]+')'}}
						</text>
						<uni-icons type="bottom"></uni-icons>
					</view>
					<view style="width:50%;display: flex;flex-flow: column;" v-else>
						<text>
							{{itme.data[0][0].substring(2)+itme.data[0][1]+' | '+itme.data[0][3]+'('+itme.data[0][4]+')'}}
						</text>
						<uni-icons type="bottom"></uni-icons>
					</view>
					<view style="width:18%;border-left:none;">{{itme.note}}</view>
					<view style="width:20%;font-size:28rpx;border-left:none;">{{itme.money}}</view>
				</view>
				
				<view v-show="showList==index"  style="background-color:#fde6d6;">
					<view class="table-tr-show">
						<view style="width:22%;">场次</view>
						<view style="width:25%;border-left:none;border-right: none;">主队</view>
						<view style="width:25%;">客队</view>
						<view style="width:38%;border-left:none;">投注内容</view>
					</view>
					<view class="table-td" v-for="xitme,xindex in itme.data">
						<view style="width:22%;">{{xitme[0]}}</view>
						<view style="width:25%;border-left:none;">{{xitme[1]}}</view>
						<view style="width:25%;border-left:none;">{{xitme[2]}}</view>
						<view style="width:38%;font-size:24rpx;border-left:none;">{{xitme[3]}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {useCounterStore} from '@/stores/counter'
	import {onBeforeMount,ref,reactive,getCurrentInstance,defineProps} from 'vue'
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const Props=defineProps(['money'])//接收此订单的金额
	const showList = ref(null)//折叠面板是否实现判断值
	const showListType=ref(0)//显示状态
	const showData=ref([])//拆单的数据arr
	const whetherRepetition=ref(true)//是否允许重复
	const showTable=(e)=>{
		if(showList.value==e){
			showList.value=null
		}else{
			showList.value=e
		}
	}
	const back=()=>{
		uni.navigateBack()
	}
</script>

<style lang="scss">
	.statusBar {
		width: 100%;
		height: var(--status-bar-height);
		background-color:white;
	}
	.topHint{
		display: flex;
		padding:15rpx;
		justify-content: flex-end;
		align-items: center;
	}
	.table-td{
		display: flex;
		view{
			text-align: center;
			font-size:28rpx;
			border:1rpx #b9b9b9 solid;
			padding:10rpx 0rpx;
			display: flex;
			align-items: center;justify-content: center;
		}
		
	}
	.table-tr{
		display: flex;
		view{
			text-align: center;
			font-size:28rpx;
			font-weight:bold;
			border:1rpx #b9b9b9 solid;
			border-bottom:none;
			padding:10rpx 0rpx;
		}
	}
	.table-tr-show{
		display: flex;
		view{
			text-align: center;
			font-size:28rpx;
			font-weight:bold;
			border:1rpx #b9b9b9 solid;
			border-top: none;
			border-bottom:none;
			padding:10rpx 0rpx;
		}
	}
</style>