<template>
	<view class="status_bar"></view>
	<uni-nav-bar title="合作店铺申请" leftIcon="closeempty" @clickLeft="back" />
	<scroll-view scroll-x="true" class="navigation">
		<view class="bg">
			<view v-for="itme,index in tita" :key="index" @click="dianji_qiehuan(index)" style="margin: auto;">
				<view class="box" :style="index==daohang_value?'color:#FDC830;':''">{{itme}}</view>
			</view>
			<view class="xiabiao" :style="daohang_value==1 ? 'left:515rpx;' : false">
			</view>
		</view>
	</scroll-view>
	<!-- 内容 -->
	<swiper 
		@change="onChangeTab" 
		:current="daohang_value" 
		:style="{height:common.scrollH()-200+'rpx'}"
		easing-function="linear"
		duration="300"
	>
		<swiper-item style="display: flex;">
			<z-paging ref="apply" v-model="applyData" @query='applyRefresh'>
				<view class="recordCard" v-for="itme,index in applyData">
					<view style="display: flex;">
						<image :src="itme.BranchStore_avatar" style="width:80rpx;height:80rpx;"></image>
						<view style="display: flex;flex-flow: column;margin-left:20rpx;">
							<text style="font-size:26rpx;color:#6b6b6b;">
								{{itme.BranchStore_name}}(ID：{{itme.BranchStore_id}})
							</text>
							<text style="color: #dcad29;padding-top:10rpx;" v-show="itme.gameCommission!=null">
								佣金：{{itme.gameCommission}}%
							</text>
							<view style="color: red;" v-show="itme.gameCommission==null">
								{{game_id(itme.game_id)}}
							</view>
						</view>
					</view>
					<view style="color: red;" v-show="itme.gameCommission!=null">
						{{game_id(itme.game_id)}}
					</view>
					<view>
						<view class="button" 
							  :style="indexButtom==0?'background-color:#ff4e4e;':'background-color:#ffaa00;'" 
							  v-for="itmeButtom,indexButtom in 2"
							  @click="clickApplyState(itme,indexButtom)">
							<text>{{indexButtom==0?'拒绝':'通过'}}</text>
						</view>
					</view>
				</view>
			</z-paging>
		</swiper-item>
		<swiper-item style="display: flex;">
			<z-paging ref="applyTwo" v-model="applyDataTwo" @query='applyRefreshTwo'>
				<view class="recordCard" v-for="itme,index in applyDataTwo" v-show="itme.state!=0">
					<view style="display: flex;height:120rpx;align-items: center;">
						<image :src="itme.BranchStore_avatar" style="width:80rpx;height:80rpx;"></image>
						<view style="display: flex;flex-flow: column;margin-left:20rpx;">
							<text style="font-size:26rpx;color:#6b6b6b;">
								{{itme.BranchStore_name}}(ID：{{itme.BranchStore_id}})
							</text>
							<text style="color: #dcad29;padding-top:10rpx;" v-show="itme.gameCommission!=null">
								佣金：{{itme.gameCommission}}%
							</text>
							<view :style="itme.game_id!=null?'':'color: red;'" v-show="itme.gameCommission==null">
								{{game_id(itme.game_id)}}
							</view>
						</view>
					</view>
					<view :style="itme.game_id!=null?'':'color: red;'" v-show="itme.gameCommission!=null">
						{{game_id(itme.game_id)}}
					</view>
					<view class="button" 
						:style="itme.state==0?'background-color:#0687ff;':
						itme.state==1?'background-color:#FDC830;':'background-color:#FDC830;'"
					>
						<text v-if="itme.state==1">已通过</text>
						<text v-else-if="itme.state==2">已拒绝</text>
						<text v-else>审核中</text>
					</view>
				</view>
			</z-paging>
		</swiper-item>
	</swiper>
	
	<!-- 对话框 -->
	<fui-dialog :show="show" @click="clickDialogButton" :content="contentDialog.content"></fui-dialog>
</template>

<script setup>
	import common from '@/common/common'
	import api from '@/common/vmeitime-http/mine/mine.js';
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	onBeforeMount(()=>{
		
	})
	const game_id=(e)=>{
		var gameArr=[
			'竞彩足球','竞彩篮球','胜负过关','北京单场','大乐透','排列三','排列五',
			'七星彩','任选九','胜负彩','双色球','七乐彩','快乐八','福彩3D'
		]
		if(e!=null){
			return gameArr[e]
		}else{
			return '店铺合作'
		}
	}
	const buttonValue=ref(0)//判断是否显示已通过（默认0已拒接，1为已通过）
	const applyData=ref([])//未处理列表数据
	const applyDataTwo=ref([])//已处理列表数据
	const daohang_value = ref(0)//tabbar的index
	const show=ref(false)//对话框显示
	const contentDialog=reactive({//对话框提示内容
		'content':null,
		'id':null,
		'buttomIndex':null
	})
	const tita = reactive(['未处理', '已处理']) //分段器title数据
	const applyRefresh=()=>{
		api.GetRecord({"state":"0","startTime":"","endTime":""}).then((res)=>{
			proxy.$refs.apply.complete(res.data.data)
		}).catch(res=>{
			proxy.$refs.apply.complete(false)
		})
	}
	const applyRefreshTwo=()=>{
		api.GetRecord({"state":"","startTime":"","endTime":""}).then((res)=>{
			proxy.$refs.applyTwo.complete(res.data.data)
		}).catch(res=>{
			proxy.$refs.applyTwo.complete(false)
		})
	}
	const back=()=>{
		uni.navigateBack()
	}
	const onChangeTab = (e) => { //滑动导航栏跟随
		dianji_qiehuan(e.detail.current)
	}
	const dianji_qiehuan = (index) => { //点击切换导航
		if (daohang_value == index) {
			return
		} else {
			daohang_value.value = index
		}
	}
	
	const clickDialogButton=(e)=>{//对话框按钮操作
		if(e.index==1){
			uni.showLoading({
				title:'处理中~'
			})
			if(contentDialog.buttomIndex==1){
				api.GetAdopt({"id":contentDialog.id}).then((res)=>{
					uni.hideLoading()
					uni.showToast({
						title:res.data.data,
						icon:res.data.msg
					})
					proxy.$refs.apply.reload()
				})
			}else{
				api.GetRefuse({"id":contentDialog.id}).then((res)=>{
					uni.hideLoading()
					uni.showToast({
						title:res.data.data,
						icon:res.data.msg
					})
					proxy.$refs.apply.reload()
				})
			}
		}
		
		show.value=false
	}
	const clickApplyState=(cardiData,buttomIndex)=>{
		contentDialog.content=buttomIndex==1?'确定要通过合作申请吗？':'确定要拒绝合作申请吗？'
		contentDialog.id=cardiData.id
		contentDialog.buttomIndex=buttomIndex
		show.value=true
	}
	
</script>

<style>
	.recordCard{
		width:680rpx;
		display: flex;
		align-items: center;
		justify-content:space-between;
		margin:20rpx auto;
		background-color: white;
		padding:0rpx 20rpx;
		border-radius:20rpx;
	}
	.button{
		width:120rpx;
		height:55rpx;
		text-align: center;
		line-height:55rpx;
		border-radius:10rpx;
		color: white;
		margin:20rpx 0;
	}
	.shenqin{
		width:710rpx;
		height:150rpx;
		background-color: white;
		margin:20rpx auto;
		border-radius:15rpx;
	}
	.navigation {
		width: 100%;
		height: 80rpx;
		background-color: #fff;
	}
	.bg {
		display: flex;
	}
	
	.box {
		width: 186rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		transition: .3s;
	}
	
	.xiabiao {
		position: absolute;
		width: 90rpx;
		height: 7rpx;
		background-color: #FDC830;
		/* z-index: -1; */
		border-radius: 50rpx;
		top: 73rpx;
		left: 140rpx;
		transition: .3s;
	}
	body {
		background-color: #f3f3f3;
	}
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
