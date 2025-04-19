<template>
	<z-paging ref="List" @query='loadList' v-model="board_list" :loading-more-enabled="false">
		<template v-slot:top>
			<view class="statusBar"></view>
			<uni-nav-bar title="历史公告" left-icon="back" left-text="返回" @clickLeft="back"></uni-nav-bar>
		</template>
		<view class="announcement_card" v-for="itme,index in board_list">
			<view class="card_title">发布时间：2023-08-21 20：10：00</view>
			<view class="content_box">
				{{itme.content}}
			</view>
		</view>
	</z-paging>
</template>

<script setup>
	import {onBeforeMount,ref,reactive,getCurrentInstance,defineProps} from 'vue';
	import api from "@/common/vmeitime-http/index.js"
	const {proxy,ctx} = getCurrentInstance()
	const board_list=ref([])
	const back=()=>{
		uni.navigateBack()
	}
	const loadList=()=>{//获取公告列表
		api.get_notice_board_list({}).then(res=>{
			proxy.$refs.List.complete(res.data.data)
		}).catch(err=>{
			uni.showToast({
				title:'数据处理失败',
				icon:'none'
			})
		})
	}
</script>

<style lang="scss">
	.content_box{
		width:100%;
		word-wrap:break-word;
		text-indent:4mm;
	}
	.card_title{
		width:100%;
		padding-bottom:10rpx;
		border-bottom:1rpx solid #cccccc;
		font-size:28rpx;
	}
	
	.announcement_card{
		width:680rpx;
		padding:20rpx;
		background-color: #fff;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		border-radius:20rpx;
		margin:20rpx auto;
	}
	body{
		background-color:#fbfbfb;
	}
	.statusBar{
		width:100%;
		height:var(--status-bar-height);
		background-color:white;
	}
</style>
