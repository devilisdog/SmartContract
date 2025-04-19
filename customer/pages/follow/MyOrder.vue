<template>
	<!-- 背景 -->
	<view class="header"></view>
	<!-- <view class="status_bar"></view> -->
	<!-- 导航栏 -->
	<view :style="ScrollJudge > 30 ? 'background-color: white;z-index:2;':false" class="navigation">
		<view>
			<uni-icons type="back" size='25' :color="ScrollJudge > 30 ? '#6b6b6b' : '#6b6b6b'" @click="back()"></uni-icons>
		</view>
		<text style="font-weight: bold;" :style="ScrollJudge > 30 ? 'color:#6b6b6b;' : 'color: #6b6b6b ;'">我的跟单</text>
		<view style="position: absolute;right: 25rpx;">
			<uni-icons type="redo" size='25' :color="ScrollJudge > 30 ? '#6b6b6b' : '#6b6b6b'" ></uni-icons>
		</view>
	</view>
	<!-- 头像、名称... -->
	<view style="width: 100%; height: 400rpx; display: flex; align-items: center;margin-top:-40%;" v-if="dataList!=null">
		<view class="headPortrait">
			<image 
				style="width: 130rpx; height: 130rpx;border-radius: 85rpx;border: 5rpx #fff solid;" 
				:src="dataList.userInfo.avatar"
				mode="aspectFill"
				@click="lookLogo(dataList.userInfo.avatar)">
			</image>
			<view style="display: flex; flex-direction: column;line-height: 80rpx;margin-left: 20rpx;">
				<text style="font-size: 36rpx;color: #6b6b6b ;">{{dataList.userInfo.nickname}}</text>
				<view style="display: flex;align-items: center;">
					<text style="color: #6f6f6f;font-size: 34rpx;">发单{{dataList.userInfo.IssueCount}}</text>
					<text style="padding: 0 10rpx;">|</text>
					<text style="color: #6f6f6f;font-size: 34rpx;">粉丝{{'很多'}}</text>
				</view>
				
			</view>
		</view>
		<view class="person"  style="margin-top: 170rpx;">
			<text>Ta没有留下任何介绍</text>
		</view>
	</view>


	<!-- 我滴战机 -->
	<view class="zhanji" v-if="dataList!=null">
		<view style="display: flex;flex-direction: row;align-items: center;">
			<view style="width: 10rpx; height: 40rpx; background-color: #ff5c5c;border-radius: 55rpx;"></view>
			<text style="font-size: 32rpx;color: #434343;font-weight: bold;padding: 0 20rpx;">我的战绩</text>
		</view>
		
		<view class="record">
			<view>
				<text style="font-size: 34rpx;color: #ff5c5c; font-weight: bold;">
					{{dataList.userInfo.WinningMoney}}元
				</text>
				<text style="color: #4f4f4f ;">累计奖金</text>
			</view>
			<view>  
				<text style="font-size: 34rpx;color: #ff5c5c; font-weight: bold;">
					{{Number( dataList.userInfo.profit*100 ).toFixed(0)+'%'}}
				</text>
				<text style="color: #4f4f4f ;">七日盈利</text>
			</view>
			<view>
				<text style="font-size: 34rpx;color: #ff5c5c; font-weight: bold;">{{dataList.userInfo.hit}}</text>
				<text style="color: #4f4f4f ;">七日命中</text>
			</view>
		</view>
		
		<view style="display: flex;margin-left: 20rpx;align-items: center;">
			<text style="font-size: 30rpx;color: #9f9f9f ;width: 170rpx;">近5场战绩</text>
			<view style="width:50rpx; height:50rpx; border-radius: 50rpx;margin: 0 20rpx;text-align:center;line-height:48rpx;"
				:style="item == false ? 'background-color: #969696;' : 'background-color: #ff5353;'"
				v-for="item,index in dataList.userInfo.FiveDayHistory" :key="index">
				<text style="color: white;font-size: 24rpx;">{{item == false ? "黑" : "红"}}</text>
			</view>
		</view>
	</view>
	
	<view class="content_card">
		<view style="width: 100%; height: 70rpx;">
			<view style="display:flex;height:70rpx;align-items:center;justify-content:space-around;">
				<text :style="tabIndex == 0 ? 'color:#ffa480;' : 'color: #3e3e3e;'" @click="tabClick(0)">我的跟单</text>
				<text :style="tabIndex == 1 ? 'color:#ffa480;' : 'color: #3e3e3e;'" @click="tabClick(1)">我的方案</text>
			</view>
			<view class="Slider" :style="tabIndex == 1 ? 'left: 67%;':false"></view>
		</view>
		<swiper @change="onChangeTab" :current="current" style="height:70vh;">
				<!-- 我的跟单 -->
			<swiper-item>
				<z-paging ref="paging" v-model="HeMaiList" @query="queryList" :use-page-scroll="false" >
					<view style="width: 100%;height: 150rpx;margin: 20rpx 0;border-bottom:2rpx solid #f4f4f4;" v-for="item,index in HeMaiList" :key="index" 
						@click="openCard(item.follow_pid)">
						<view style="display: flex;align-items: center;flex-direction: row;justify-content: space-between;">
							<view style="display: flex;flex-direction: row;align-items: center;">
								<image 
									style="width: 60rpx;height: 60rpx;margin-right: 20rpx;" 
									:src="counter.baseUrl+item.gameInfo.image">
								</image>
								<text>{{item.Type}}</text>
							</view>
							<view>
								<text style="color: #b8b8b8;">{{getTime.getNowFormatDate(0,(item.Deadline*1000))}}</text>
							</view>
						</view>
						
						<view style="display: flex;justify-content: space-between;padding: 20rpx 0;">
							<view class="stateCard" :style="stateStyle(item.State)">
								<text style="color:white;">{{stateData[item.State]}}</text>
							</view>
							<view style="display: flex;flex-direction: row;align-items: center;">
								<text>自购:</text>
								<text style="color: red;">{{item.BetMoney}}</text>
								<text style="margin-right: 20rpx;">元</text>
							</view>
						</view>
					</view>
				</z-paging>
			</swiper-item>
				
				<!-- 我的方案 -->
			<swiper-item>
				<z-paging ref="paging02" v-model="HeMaiList02" @query="queryList02" :use-page-scroll="false" >
					<view :style="index%2!==0?false:'border-bottom:2rpx solid #f4f4f4;'"
						style="width: 100%;height: 150rpx;margin: 20rpx 0;" v-for="item,index in HeMaiList02" :key="index"
						@click="openCard(item.id)">
						<view style="display: flex;align-items: center;flex-direction: row;justify-content: space-between;">
							<view style="display: flex;flex-direction: row;align-items: center;">
								<image 
									style="width: 60rpx;height: 60rpx;margin-right: 20rpx;" 
									:src="counter.baseUrl+item.gameInfo.image">
								</image>
								<text>{{item.Type}}</text>
							</view>
							<view>
								<text style="color: #b8b8b8;">{{getTime.getNowFormatDate(0,(item.Deadline*1000))}}</text>
							</view>
						</view>
						<view style="display: flex;justify-content: space-between;padding: 20rpx 0;">
							<view class="stateCard" :style="stateStyle(item.state)">
								<text style="color:white;">{{stateData[item.state]}}</text>
							</view>
							<view style="display: flex;flex-direction: row;align-items: center;">
								<text>自购:</text>
								<text style="color: red;">{{item.OneselftMoney}}</text>
								<text style="margin-right: 20rpx;">元</text>
								
								<text>跟单:</text>
								<text style="color: red;">{{item.followPeople.total}}</text>
								<text>人</text>
							</view>
						</view>
					</view>
				</z-paging>
			</swiper-item>
		</swiper>
	</view>
	<view style="width: 100%;height: 30rpx;"></view>
	<uni-popup type="bottom" ref="popup">
		<gendanCard :order_id="Props_order_id" @close="proxy.$refs.popup.close();isOpenPopup=false" @look_follow="_follow"></gendanCard>
	</uni-popup>
</template>


<script setup>
	import api from '@/common/vmeitime-http/index.js'
	import common from "@/common/common.js"
	import getTime from "@/common/getdatetime.js"
	import gendanCard from "@/components/common/yc-gendan-card/yc-gendan-card.vue"
	import {useCounterStore} from '@/stores/counter'
	import { onPageScroll } from '@dcloudio/uni-app'
	import orderCard from "@/components/home/card-record.vue"
	import {onBeforeMount,onMounted,ref,reactive, getCurrentInstance,} from 'vue';
	import {onBackPress} from '@dcloudio/uni-app'
	const {proxy,ctx} = getCurrentInstance()
	const isOpenPopup=ref(false)
	const counter = useCounterStore(); //状态管理
	const dataList = ref()
	const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight)
	onBackPress(()=>{if(isOpenPopup.value){isOpenPopup.value=false;proxy.$refs.popup.close();return true}})
	onBeforeMount(()=>{//获取个人信息
		api.GetFollowPerson({'user_id':counter.user_id}).then((res)=>{
			dataList.value = res.data.data
		})
	})
	const ScrollJudge = ref(0)
	
	onPageScroll((e)=>{//这个是uni监听页面滚动的生命周期
		ScrollJudge.value = e.scrollTop
	})
	const Props_order_id=ref(0)
	const openCard=(follow_id)=>{//打开跟单详情弹窗
		Props_order_id.value=follow_id
		isOpenPopup.value=true
		proxy.$refs.popup.open()
	}
	const stateStyle=(state)=>{
		var stateArr=['3','4','5','8']
		var winState=['9','10']
		var mayState=['0','1','2','6','7']
		if(stateArr.indexOf(state) != -1){
			return 'background-color:#eaeaea;'
		}
		if(winState.indexOf(state) != -1){
			return 'background-color: #ff6b6b;'
		}
		if(mayState.indexOf(state) != -1){
			return 'background: linear-gradient(120deg, #f04b49 0%, #fdae96 100%);'
		}else{
			return 'background-color:#eaeaea;'
		}
	}
	const _follow=(id)=>{//用户点击头像
		if(counter.user_id!=id){
			proxy.$refs.popup.close()
			uni.navigateTo({
				url:'/pages/follow/homepage?userId='+id
			})
		}else{
			uni.showToast({
				title:'已经是ta的主页啦~',
				position:'center',
				icon:'error'
			})
		}
	}
	const lookLogo=(src)=>{//查看头像
		uni.previewImage({
			urls:Array(src)
		})
	}
	const stateData=reactive(['认购中','待接单','待出票','玩家撤销','店主撤销','系统撤销','待开奖','待中奖','未中奖','待派奖','已派奖'])
	//列表组件//我的跟单
	const HeMaiList = ref([])
	const queryList =(pageNo,pageSize)=>{
		api.GetFollowPersonDataList({
			"user_id":counter.user_id,
			"per_page":pageSize,
			"current_page":pageNo,
			"type":'myfollow'
		}).then((res)=>{
			proxy.$refs.paging.complete(res.data.data.data)
		}).catch(res=>{	
			proxy.$refs.paging.complete(false)
		})
	}
	
	//列表组件//我的方案
	const HeMaiList02 = ref([])
	const queryList02 =(pageNo,pageSize)=>{
		api.GetFollowPersonDataList({
			"user_id":counter.user_id,
			"per_page":pageSize,
			"current_page":pageNo,
			'type':'scheme'
		}).then((res)=>{
			proxy.$refs.paging02.complete(res.data.data.data)
		}).catch(res=>{	
			proxy.$refs.paging02.complete(false)
		})
	}
	
	//组件传值触发
	const close=()=>{
		isOpenPopup.value=true
		proxy.$refs.paging.refresh()
		proxy.$refs.popup.close()
	}
	
	const back =()=>{
		uni.navigateBack()
	}
	
	//导航栏
	const current= ref(0)
	const tabIndex = ref(0)
	const tabClick =(e)=>{
		if(tabIndex.value && current.value == e){
			return
		}else{
			tabIndex.value = e
			current.value = e
		}
	}
	const onChangeTab =(e)=>{
		tabIndex.value = e.detail.current
		current.value = e.detail.current
	}
</script>


<style>
	.content_card{
		padding:20rpx;
		width:680rpx;
		background-color:white;
		border-radius:15rpx;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		margin:20rpx auto;
	
	}
	.stateCard{
		width: 150rpx;
		height: 45rpx;
		border-radius:10rpx;
		text-align: center;
		line-height:45rpx;
	}
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	

	/* 导航栏 */
	.navigation{
		width: 100%;
		height: 100rpx;
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.7s;
		top:0;
		padding-top:var(--status-bar-height);
		/* background-color: white; */
		}.navigation text{
			font-size: 36rpx;
			font-weight: 500;
			flex: 1;
		}.navigation view{
			margin-left: 20rpx;
			flex: 0.65;
		}
	
		/* 头像什么什么的 */
	.person{
		width: 700rpx;
		height: 200rpx;
		background-color: white;
		box-shadow: 0 5rpx 25rpx #f5f5f5;
		margin: 0 auto;
		border-radius: 15rpx;
		display: flex;
		align-items: flex-end;
		}.person text{
			margin: 40rpx;
			font-size: 30rpx;
			color: #585858;
		}.headPortrait{
			width:500rpx;
			height: 170rpx;
			position: absolute; 
			margin:0 0 30rpx 70rpx; 
			display: flex;
			align-items: center;
		}
		/* 战绩 */
	.zhanji{
		width:680rpx;
		margin:20rpx auto;
		border-radius: 15rpx;
		background-color: white;
		padding:20rpx;
		box-shadow: 0 5rpx 25rpx #f5f5f5;
		}.record{
			display: flex;
			justify-content:space-between;
			align-items: center;
			margin:20rpx;
		}.record view{
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;	
			line-height: 50rpx;
		}
		
		.slide{
			width: 100%;
			height: 70rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}.Slider{
			transition: all 0.6s;
			position:relative;
			top:-10rpx;
			left:17%;
			width: 110rpx;
			height: 8rpx;
			border-radius: 55px; 
			background-color: #ffa484;
		}
		
		.app{
			
		}
</style>

<style lang="scss">
	.header {
		background-repeat: no-repeat;
		background-size: cover;
		width: 100%; 
		height:20vh;
		// #ifdef APP-PLUS
		height:25vh;
		// #endif
		background-image: url('/static/img/home/bg.png');
		border-radius:0 0 20rpx 20rpx;
	}
</style>