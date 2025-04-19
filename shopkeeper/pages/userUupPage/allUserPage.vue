<template>
	<z-paging ref="list" v-model="userData" @query='refresh'  :auto-show-back-to-top="true">
		<template v-slot:top>
			<view class="statusBar"></view>
			<uni-nav-bar title="全部用户" leftIcon="back" @clickLeft="back" leftText="返回" />
			<view style="background-color: white;">
				<uni-search-bar @input="sous" placeholder="搜索用户昵称或备注"></uni-search-bar>
			</view>
		</template>
			<!-- 内容区 -->
		<uni-list >
			<uni-list-chat :title="nicknameDispose(item.nickname,item.config.remarks)" 
							:note="getdatetime.getNowFormatDate(0,item.update_time)"  
							link="false｜navigateTo"
							@click="userOrder(item.id)"
							:avatar="item.avatar" v-for="item,index in userData" :key="index"
							thumbSize='lg'>
				<text style="font-size:26rpx;">{{item.money}}元</text>
				<view style="display: flex;align-items: center;">
					<view v-if="item.config.Star==1||item.config.expert==1||item.config.sale==1||item.config.agent==1"
						style="display: flex;align-items: center;">
						<uni-icons type="star-filled" size="22" color="#ffd53d" v-show="item.config.Star==1"/>
						<text style="margin:0rpx 10rpx;" class="labelTgp" v-show="item.config.expert==1">
							专家
						</text>
						<text class="labelTgp" v-show="item.config.sale==1">销售</text>
						<text class="labelTgp" v-show="item.config.agent==1">代理</text>
					</view>
					<view style="display: flex;" v-else>
						<view class="xiadian"
							  :style="itmeS==false?'background-color: black;':'background-color:red;'"
							  v-for="itmeS,indexS in item.FiveDayHistory">
						</view>
					</view>
				</view>
			</uni-list-chat>
		</uni-list>
	</z-paging>
</template>

<script setup>
	import {onShow} from "@dcloudio/uni-app"
	import common from '@/common/common'
	import api from '@/common/vmeitime-http/user/user.js'
	import getdatetime from "@/common/getdatetime.js"
	import {onBeforeMount,reactive,ref,getCurrentInstance} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const back=()=>{
		uni.navigateBack()
	}
	const souoValue=ref(null)
	const sous=(e)=>{
		souoValue.value=e
		list.value.refresh()
	}
	const userData=ref([])
	const list=ref(null)
	onShow(()=>{
		if(list.value){list.value.refresh()}
	})
	const refresh=(e,w)=>{
		api.GetUserList({"search":souoValue.value,"type": 0,"per_page":w,"current_page":e}).then((res)=>{
			list.value.complete(res.data.data.data)
		}).catch(()=>{
			list.value.complete(false)
		})
	}
	const userOrder=(id)=>{//点击进入用户详细页面并传点击的ID
		uni.navigateTo({
			url:'/pages/userUupPage/userUupPage?id='+id
		})
	}
	
	const nicknameDispose=(nickname,remark)=>{
		if(remark!=''&&remark!=null){
			return remark+'(昵称：'+nickname+')'
		}else{
			return nickname
		}
	}
</script>

<style>
	.labelTgp{
		font-size:26rpx;
		background-color:#ffd53d;
		padding:5rpx 15rpx;
		color: white;
		border-radius:10rpx;
	}
	.xiadian{
		width:20rpx;
		height:20rpx;
		border-radius:100rpx;
		margin-left:10rpx;
	}
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
	}
	body {
		background-color: #f3f3f3;
	}
</style>
