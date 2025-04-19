<template>
	<z-paging @query='list' ref="refresh" v-model="userData.placeUser_list" :auto-show-back-to-top="true" :loading-more-enabled="false">
		<template v-slot:top>
			<view class="statusBar"></view><!-- 手机状态栏（适配） -->
			<uni-nav-bar title="用户"></uni-nav-bar><!-- tita -->
			<view style="background-color: white;">
				<uni-search-bar placeholder="搜索用户昵称或备注" @input="search"/><!-- 搜索框 -->
			</view>
			<view class="allUser" @click="allUser"><!-- 全部用户 -->
				<view style="display: flex;align-items: center;">
					<view class="allUserStyle">
						<image src="@/static/icon/Tabicon/wode_yellow.png" style="width:80rpx;height:80rpx;"></image>
					</view>
					<text>全部用户</text>
				</view>
				<uni-icons type="forward"></uni-icons>
			</view>
		</template>
		<uni-collapse v-show="userData.attentionUser_list.length>0">
			<uni-collapse-item :title="'标星用户('+userData.attentionUser_list.length+')'" >
				<uni-list>
					<template v-for="item,index in userData.attentionUser_list" :key="index">
						<uni-list-chat :title="nicknameDispose(item.nickname,item.config.remarks)"
									   :note="getdatetime.getNowFormatDate(0,item.update_time)" 
										link="false｜navigateTo"
										@click="userOrder(item.id)"
									   :avatar="item.avatar"
										thumbSize='lg'
						>
							<text style="font-size:26rpx;">{{item.money}}元</text>
							<view style="display: flex;align-items: center;">
								<view v-if="item.config.Star==1||item.config.expert==1||item.config.sale==1" 
									style="display: flex;align-items: center;">
									<uni-icons type="star-filled" size="22" color="#ffd53d" v-show="item.config.Star==1"/>
									<text style="margin:0rpx 10rpx;" class="labelTgp" v-show="item.config.expert==1">
										专家
									</text>
									<text class="labelTgp" v-show="item.config.sale==1">销售</text>
								</view>
								<view style="display: flex;" v-else>
									<view class="xiadian"
										  :style="itmeS==false?'background-color: black;':'background-color:red;'"
										  v-for="itmeS,indexS in item.FiveDayHistory">
									</view>
								</view>
							</view>
						</uni-list-chat>
					</template>
				</uni-list>
			</uni-collapse-item>
		</uni-collapse>
		<view class="topTitle">
			<text style="padding-left:20rpx;">下单用户</text>
		</view>
		<uni-list>
			<template v-for="item,index in userData.placeUser_list" :key="index">
				<uni-list-chat :title="nicknameDispose(item.nickname,item.config.remarks)"
							   :note="getdatetime.getNowFormatDate(0,item.update_time)" 
								link="true"
								@click="userOrder(item.id)"
							   :avatar="item.avatar"
								thumbSize='lg'
				>
					<text style="font-size:26rpx;">{{item.money}}元</text>
					<view style="display: flex;align-items: center;">
						<view v-if="item.config.Star==1||item.config.expert==1||item.config.sale==1"
							style="display: flex;align-items: center;">
							<uni-icons type="star-filled" size="22" color="#ffd53d" v-show="item.config.Star==1"/>
							<text style="margin:0rpx 10rpx;" class="labelTgp" v-show="item.config.expert==1">
								专家
							</text>
							<text class="labelTgp" v-show="item.config.sale==1">销售</text>
						</view>
						<view style="display: flex;" v-else>
							<view class="xiadian" 
								  :style="itmeS==false?'background-color: black;':'background-color:red;'"
								  v-for="itmeS,indexS in item.FiveDayHistory">
							</view>
						</view>
					</view>
				</uni-list-chat>
			</template>
		</uni-list>
	</z-paging>
</template>
<script setup>
	import {onShow} from "@dcloudio/uni-app"
	import common from '@/common/common'
	import api from '@/common/vmeitime-http/user/user.js'
	import getdatetime from "@/common/getdatetime.js"
	import {useCounterStore} from '@/stores/counter'
	import {ref,onBeforeMount,onMounted,reactive,getCurrentInstance} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	
	const counter = useCounterStore(); //状态管理
	const searchValue=ref(null)//搜索的值
	const userData = reactive({
		placeUser_list:[],
		attentionUser_list:[]
	}) //用户卡片数据
	const allUser = () => {
		uni.navigateTo({
			url: '/pages/userUupPage/allUserPage'
		})
	}
	onShow(()=>{
		if(proxy.$refs.refresh){proxy.$refs.refresh.refresh()}
	})
	const userOrder=(id)=>{//点击进入用户详细页面并传点击的ID
		uni.navigateTo({
			url:'/pages/userUupPage/userUupPage?id='+id
		})
	}
	const search=(e)=>{
		searchValue.value=e
		proxy.$refs.refresh.refresh()
	}
	const nicknameDispose=(nickname,remark)=>{//用户如果有备注就使用备注没有责正常显示昵称
		if(remark!=''&&remark!=null){
			return remark+'(昵称：'+nickname+')'
		}else{
			return nickname
		}
	}
	const getAttentionList=()=>{
		api.GetWinkList({'search':searchValue.value}).then(res=>{
			if(res.data.code==1){
				userData.attentionUser_list=res.data.data.data
			}else{
				uni.showToast({
					title:res.data.data,
					icon:"none",
					position:'center'
				})
			}
		}).catch(err=>{
			uni.showToast({
				title:'数据处理失败，请联系平台方',
				icon:"none",
				position:'center'
			})
		})
	}
	const list = (e,w) => {//获取用户列表
		api.GetUserList({"search":searchValue.value,"type":1}).then((res) => {
			proxy.$refs.refresh.complete(res.data.data.data)
			getAttentionList()
		}).catch(res => {
			proxy.$refs.refresh.complete(false)
		})
	}
</script>

<style>
	.topTitle{
		width:100%;
		height:60rpx;
		background-color:#f3f3f3;
		display: flex;
		align-items:center;
	}
	.labelTgp{
		font-size:24rpx;
		background-color:#ffd53d;
		padding:2rpx 10rpx;
		color: white;
		border-radius:10rpx;
	}
	.allUserStyle{
		background:rgba(254,240,172, 1);
		height:90rpx;
		width:90rpx;
		border-radius:10rpx;
		text-align:center;
		line-height:90rpx;
		margin-right:20rpx;
	}
	.xiadian {
		width: 20rpx;
		height: 20rpx;
		border-radius: 100rpx;
		margin-left: 10rpx;
	}

	.userData {
		width: 100%;
		height: 120rpx;
		display: flex;
		border-bottom: 1rpx solid #d8d8d8;
		align-items: center;
	}

	.allUser {
		width:100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		background-color: white;
		padding:0rpx 20rpx;
		padding-bottom:15rpx;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.statusBar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}
</style>
