<template>
	<z-paging ref="detail" v-model="detailData" @query='detailList' :auto='Props.pageIndex==0'>
		<template v-slot:top>
			<view class="timeBox">
				<text style="margin:0rpx 10rpx;">统计：￥{{tjmoney}}</text>
				<view style="width:390rpx;">
					<uni-datetime-picker  @change='timeSet' type="daterange"/>
				</view>
			</view>
			
		</template>
		<uni-list>
			<uni-list-item
				v-for="itme,index in detailData"
				:title="itme.source" 
				:note="getDate.getNowFormatDate(0,itme.create_time)" 
				:rightText="itme.money" :rightColor="itme.money>0?'red':''">
			</uni-list-item>
		</uni-list>
	</z-paging>
</template>

<script setup>
	import api from "@/common/vmeitime-http/mine/mine.js"
	import getDate from "@/common/getdatetime.js"
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
	const whetherloading=ref(false)//是否加载过的值
	const timeData=ref([])
	const Props=defineProps(
		[
			'pageIndex',
			'confrimIndex',
		]
	)
	const detailData=ref([])
	const tjmoney = ref(0)//统计金额
	const detailList= async(pageNo,pageSize)=>{
		await api.GetDetails({
			"type":Props.pageIndex==0?'99':Props.pageIndex,
			"startTime":timeData.value[0]==undefined?"":timeData.value[0],
			"endTime":timeData.value[1]==undefined?"":timeData.value[1],
			"per_page":pageSize+5,
			"current_page":pageNo
		}).then((res)=>{
			tjmoney.value=res.data.data.Statistics.toFixed(2)
			proxy.$refs.detail.complete(res.data.data.list.data)
			whetherloading.value=true
		}).catch(res=>{
			proxy.$refs.detail.complete(false)
		})
		await uni.hideLoading()
	}
	const timeSet=(e)=>{
		uni.showLoading({
			title:'加载中~'
		})
		timeData.value=e
		proxy.$refs.detail.reload()
	}
	watch(()=>Props.confrimIndex,(newValue,oldValue)=>{
		if(newValue===Props.pageIndex){
			if(!whetherloading.value){
				uni.showLoading({
					title:'加载中~'
				})
				proxy.$refs.detail.reload()
			}
			
		}
	})
</script>

<style>
	
	
	.timeBox{
		width:100%;
		height:50rpx;
		font-size: 26rpx;
		display: flex;
		align-items: center;
		color:#FDC830;
		background-color: white;
		padding:10rpx 0rpx;
		
		
		/* background-color: white;
		padding:10rpx 0rpx;
		border-top:1rpx solid #dfdfdf;
		display: flex;
		justify-content: center; */
	}
</style>