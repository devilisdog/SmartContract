<template>
	<view class="status_bar"></view>
	<view style="background-color: white;">
		<uni-search-bar 
			@input="input" 
			v-model="searchModel"
			placeholder="搜索专家" 
			clearButton="auto" 
			cancelButton="always" 
			maxlength='20'
			@cancel='cancel'>
		</uni-search-bar>
	</view>
	<uni-load-more status="loading" iconType='circle' v-show='jiazai == false&&inputSearch!==""'></uni-load-more>
	<view v-if="inputSearch==''"
		style="display: flex;flex-direction: row;padding: 30rpx 25rpx;justify-content: space-between;">
		<text style="color: #515151 ;">历史搜索 {{searchRecord.value}}</text>
		<text style="color: #c6c6c6;" @click="qk()">清除</text>
	</view>
	
	<scroll-view v-else
		scroll-y :style="{height:common.scrollH()-210+'rpx'}">
		<z-paging
				ref="paging" 
				v-model="dataList" 
				@query="queryList"
				:fixed='false' 
				:use-page-scroll="false" 
				:auto-show-back-to-top='true'
				:back-to-top-bottom='150'
				>
			<view v-for="item,index in dataList" :key="item" @click="skip(item.id)"
				style="width: 640rpx;height: 130rpx; background-color: white;display: flex;align-items: center;border-radius: 25rpx;padding: 30rpx;margin: 30rpx auto;">
				<image style="width: 100rpx; height: 100rpx;border-radius: 20rpx;" :src="item.avatar"></image>
				<text style="margin: 0 20rpx;font-size: 32rpx;color: #3e3e3e;">{{item.nickname}}</text>
			</view>
		</z-paging>
	</scroll-view>
	
	
	<view v-if="inputSearch==''&&searchRecord!==[]" 
		style="display: flex;flex-wrap: wrap;flex-direction: row;">
		<text v-for="item,index in searchRecord" :key="item" 
			@click="searchModel=item"
			:style="index > 20 ? 'display:none;':false"
			style="background-color: #eeeeee;color: #b1b1b1;margin: 10rpx 20rpx;border-radius: 55rpx;padding: 15rpx 20rpx;">{{item}}</text>
	</view>

</template>

<script setup>
	import common from "@/common/common.js"
	import api from '@/common/vmeitime-http/'
	import { useCounterStore } from '@/stores/counter';
	const counter = useCounterStore();//状态管理
	import {
		onBeforeMount,//加载前
		ref,
		reactive,
		defineProps, // 接收
		getCurrentInstance, //获取当前组件的实例
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	onBeforeMount(()=>{
		uni.getStorage({
			key: 'Search',
			success: function (res) {
				// console.log('取出',res);
				searchRecord.value=unique(res.data) 
			}
		});
	})
	//搜索栏的modal数据
	const searchModel = ref()
	const searchRecord = ref([])
	
	
	const jiazai = ref()
	const dataList =ref([])
	const queryList =(pageNo,pageSize)=>{
		jiazai.value = false
		setTimeout(()=>{
			api.GetFollowSearch({'search':inputSearch.value,'per_page':pageSize,'current_page':pageNo,}).then((res)=>{
				// console.log('搜索成功回调',res);
				// repetition()
				proxy.$refs.paging.complete(res.data.data.data)
				jiazai.value = true
				searchRecord.value.push(inputSearch.value)
				// uni.setStorage('Search',searchRecord.value)
				uni.setStorage({
					key: 'Search',
					data: searchRecord.value,
					success: function () {
						// console.log('success',searchRecord.value);
					}
				});
				// counter.followSearch.push(inputSearch.value)
			}).catch(res=>{
				proxy.$refs.paging.complete(false)
			})
		},500)
		searchRecord.value=unique(searchRecord.value) 
	}
	
	const inputSearch = ref('')
	//输入字符就触发
	const input = (e) =>{
		if(inputSearch.value !== ''){
			proxy.$refs.paging.reload()
		}
		inputSearch.value = e
		// console.log('输入内容',inputSearch.value);
	}
	
	//点击取消触发
	const cancel = () =>{
		uni.navigateBack()
	}
	
	//清空
	const qk = () =>{
		uni.setStorageSync('Search', '');
		searchRecord.value = []
	}
	
	//判断状态管理里面有没有重复数据
	const repetition = () =>{
		for(var i = 0 ; i < counter.followSearch.length ; i++){
			if(counter.followSearch[i] == inputSearch.value){
				counter.followSearch.splice(i,1)
			}
		}
	}
	
	const skip =(e)=>{
		// console.log('用户id',e);
		uni.navigateTo({
			url: '/pages/follow/homepage?userId='+e,
			animationType: "slide-in-right",
			animationDuration: 200
		});
	}
	
function unique (arr) {
  return Array.from(new Set(arr))
}
</script>

<style>
	body{
		background-color: #f8f8f8 ;
	}
	.status_bar {
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
