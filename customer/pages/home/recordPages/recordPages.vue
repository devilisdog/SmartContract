<template>
	<view class="status_bar"></view>
	<view class="tabr">
		<view style="float:left;margin-top: 35rpx;margin-left: 30rpx;">
			<uni-icons type="back" color="#fff" size="40rpx" @click="back()"></uni-icons>
		</view>
		<view style="float: left;margin-left: 30%;margin-top:25rpx;">
			<text class="textMy">订单记录</text>
		</view>
		<view style="float: right;margin-top: 35rpx;margin-right:30rpx;" @click="open">
			<text style="font-size: 30rpx;color: #fff;">筛选</text>
			<uni-icons color="#fff" type="tune" size="40rpx"></uni-icons>
		</view>
	</view>
	<scroll-view class="daohang" scroll-x="true">
		<view class="daohang02">
			<view style="width:50%;height: 90rpx;" @click="tabClick(0)">
				<text :style="tabIndex == 0 ? 'color:#519a67;' : 'color: #3e3e3e;'">{{items[0]}}</text>
			</view>
			<view style="width:50%;height: 90rpx;" @click="tabClick(1)">
				<text :style="tabIndex == 1 ? 'color:#519a67;' : 'color: #3e3e3e;'">{{items[1]}}</text>
			</view>
			<view style="width:50%;height: 90rpx;" @click="tabClick(2)">
				<text :style="tabIndex == 2 ? 'color:#519a67;' : 'color: #3e3e3e;'">{{items[2]}}</text>
			</view>
			<view class="Slider" :style="tabIndex == 0 ? 'left: 10.5%;':tabIndex == 1?'left: 42.5%;':'left: 77%;'"></view>
		</view>
	</scroll-view>
		
	<swiper :style='{height:common.scrollH()-209-statusBarHeight+"rpx"}' @change="onChangeTab" :current="current">
		<!-- 购买滑块 -->
		<swiper-item>
			<z-paging
				ref="paging" 
				v-model="confirmE" 
				@query="queryList"
				:fixed='false' 
				:use-page-scroll="false" 
				:auto-show-back-to-top='true'
				:back-to-top-bottom='150'
				>
				<CardRecord :numindex='confirmE' @clickCard='clickCard' :identification="0" />
			</z-paging>
		</swiper-item>
		
		<!-- 合买滑块 -->
		<swiper-item>
			<z-paging
				ref="paging02" 
				v-model="Together" 
				@query="queryList02"
				:fixed='false' 
				:use-page-scroll="false" 
				:auto-show-back-to-top='true'
				:back-to-top-bottom='150'
				:auto="false"
				>
				<CardRecord :numindex='Together' @clickCard='clickCard' :identification="1"/>
			</z-paging>
		</swiper-item>
		
		<!-- 方案滑块 -->
		<swiper-item>
			<z-paging
				ref="paging03" 
				v-model="PlanData" 
				@query="queryList03"
				:fixed='false' 
				:use-page-scroll="false" 
				:auto-show-back-to-top='true'
				:back-to-top-bottom='150'
				
				>
				<CardRecord type='1' :numindex='PlanData' @clickCard='clickCard' :identification="0" />
			</z-paging>
		</swiper-item>
	</swiper>
	<!-- 筛选弹窗 -->
	<jarvis mode="bottom" :show.sync="show" :range="datalist" @confirm="confirm" @cancel="cancel"></jarvis>
	<uni-popup ref="popup" type="bottom" :maskClick="false">
		<!-- <view style="background-color:#f3f3f3;height:92vh;border-radius:30rpx 30rpx 0 0;"> -->
		<orderCard @close='close()'></orderCard>
		<!-- </view> -->
	</uni-popup>
	<uni-popup type="bottom" ref="popupTwo" :maskClick="false">
		<hemaiCard @close='close' :Hemaidata='togData' ></hemaiCard>
	</uni-popup>
	<customtabbar :current="4"></customtabbar>
</template>

<script setup>
	import api from '@/common/vmeitime-http/'
	import CardRecord from "@/components/home/card-record.vue"
	import jarvis from "@/components/common/jarvis-picker/jarvis-picker.vue"
	import hemaiCard from "@/components/common/yc-hemai-card/yc-hemai-card.vue"
	import orderCard from "@/components/common/yc-common-BettingInfo/yc-common-BettingInfo.vue"
	import common from "@/common/common.js"
	import { useCounterStore } from '@/stores/counter'
	import {onBackPress} from '@dcloudio/uni-app'
	import {onBeforeMount,ref,reactive,defineProps,getCurrentInstance} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const statusBarHeight=ref(0)
	const Props=defineProps(['user_id','screenValue'])
	onBeforeMount(()=>{
		if(Props.user_id==undefined){
			Props.user_id=counter.user_id
		}
		if(Props.screenValue){
			index.value=Props.screenValue
		}
		if(Props.tabIndex){
			tabIndex.value=Props.tabIndex
			current.value = Props.tabIndex
		}
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight//获取手机状态栏高度
	})
	onBackPress(()=>{
		if(popup_isOpen.value){close();return true}
	})
	const counter = useCounterStore(); //状态管理
	//这个是下拉刷新组件的
	const queryList =(pageNo,pageSize)=>{
		api.GetUserStateData({
			"user_id":Props.user_id,
			"state":datalist[0][index.value].value,
			"per_page":pageSize,
			"current_page":pageNo,
		}).then((res)=>{
			proxy.$refs.paging.complete(res.data.data.data)
		}).catch(res=>{
			proxy.$refs.paging.complete(false)
		})
	}
	const queryList02 =(pageNo,pageSize)=>{
		api.GetUserOrdertogether({
			"user_id":Props.user_id,
			"state":datalist02[0][index.value].value,
			"per_page":pageSize,
			"current_page":pageNo,
		}).then((res)=>{
			proxy.$refs.paging02.complete(res.data.data.data)
		}).catch(res=>{
			proxy.$refs.paging02.complete(false)
		})
	}
	const queryList03 =(pageNo,pageSize)=>{
		api.GetUserStateData({
			"user_id":Props.user_id,
			"state":datalist[0][index.value].value,
			"default":3,
			"per_page":pageSize,
			"current_page":pageNo,
		}).then((res)=>{
			proxy.$refs.paging03.complete(res.data.data.data)
		}).catch(res=>{
			proxy.$refs.paging03.complete(false)
		})
	}
	
	//下面这些请求是为了弄筛选
	const confirmE = ref([])  //购买的数据
	const Together = ref([])  //合买数据
	const PlanData =ref([])  //保存数据
	
	const popup_isOpen=ref(false)
	
	const close=()=>{
		proxy.$refs.paging.refresh()
		proxy.$refs.paging02.refresh()
		proxy.$refs.paging03.refresh()
		proxy.$refs.popup.close()
		proxy.$refs.popupTwo.close()
		setTimeout(()=>{
			counter.allOrderData=[]
		},300)
		popup_isOpen.value=false
	}
	//打开普通购买弹窗
	const openCard=()=>{
		popup_isOpen.value=true
		proxy.$refs.popup.open()
	}
	const togData=ref([])
	//打开合买弹窗
	const openCardHeMai=(open_id)=>{
		api.GetTogetherInfo({'order_id':open_id}).then(res=>{
			uni.hideLoading()
			if(res.data.code==1){
				var arr=['福彩3D','快乐八','七乐彩','双色球','大乐透','排列三','排列五','七星彩']
				if(arr.indexOf(res.data.data.Order.Type) != -1){
					counter.submitNewData = JSON.parse(res.data.data.Order.BetContent)
					var newObj={
						WinConten:res.data.data.Order.WinConten,
						BetContent:res.data.data.Order.BetContent
					}
					counter.allOrderData['WinConten']=res.data.data.Order.WinConten
					counter.allOrderData['BetContent']=res.data.data.Order.BetContent
				}else{
					counter.BettingContent = JSON.parse(res.data.data.Order.BetContent)
				}
				togData.value=res.data.data.Order
				proxy.$refs.popupTwo.open()
				popup_isOpen.value=true
			}else{
				uni.showToast({
					title:res.data.data,
					icon:'none',
					position:'center',
					duration:2000,
				})
			}
		}).catch(err=>{
			uni.hideLoading()
			uni.showToast({
				title:'数据处理失败，请联系平台方~',
				icon:'none',
				position:'center'
			})
		})
	}
	
	const openData = ref([])
	const clickCard=(item,e)=>{
		openData.value = item
		counter.BettingContent=[]
		counter.submitNewData=[]
		counter.allOrderData=item
		if(e == 1){
			uni.showLoading({
				title:'获取数据中',
				mask:true
			})
			openCardHeMai(item.order_id)
		}else{
			openCard()
		}
	}
	//导航栏
	const items = reactive(['购买', '合买','保存'])
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
		if(e.detail.current==0){
			proxy.$refs.paging.refresh()
		}
		if(e.detail.current==1){
			proxy.$refs.paging02.refresh()
		}
		if(e.detail.current==2){
			proxy.$refs.paging03.refresh()
		}
		
		tabIndex.value = e.detail.current
		current.value = e.detail.current
	}
	

	
	//筛选
	const show = ref(false)
	const values = ref(99)
	const datalist = reactive([
		[	{
			label:'全部',
			value:99
			},
			{
				label: '待接单',
				value: 1
			},
			{
				label: '待出票',
				value: 2
			},
			{
				label: '待开奖',
				value: 6
			},
			{
				label: '待中奖',
				value: 7
			},
			{
				label: '未中奖',
				value: 8
			},
			{
				label: '待派奖',
				value: 9
			},
			{
				label: '已派奖',
				value: 10
			},
		]
	])
	const datalist02 = reactive([
		[	{
			label:'全部',
			value:99
			},
			{
				label: '待接单',
				value: 1
			},
			{
				label: '待出票',
				value: 2
			},
			{
				label: '待开奖',
				value: 6
			},
			{
				label: '待中奖',
				value: 7
			},
			{
				label: '未中奖',
				value: 8
			},
			{
				label: '待派奖',
				value: 9
			},
			{
				label: '已派奖',
				value: 10
			},
		]
	])
	const open = () => {
		show.value = true
	}
	// 顶部游戏选择器弹窗点击取消按钮 关闭弹窗
	const cancel = () => {
		show.value = false
	}
	const index=ref(0)
	// 顶部游戏选择器弹窗点击确定 初始化
	const confirm = (e) => {
		show.value = false
		index.value=e[0]
		proxy.$refs.paging.refresh ()
		proxy.$refs.paging02.refresh ()
		proxy.$refs.paging03.refresh ()
	}
	const back = () =>{
		
		uni.navigateBack()
		// uni.switchTab({
		// 	url: '/pages/home/home',
		// })
		counter.BettingContent=[]
		counter.submitNewData=[]
	}
	
</script>

<style>
	.status_bar {
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
	}
	.xuanxiang {
		padding-top: 100rpx;
		margin-left: 38%;
		width: 190rpx;
		height: 400rpx;
		/* 	background-color: #3b9dff; */
	}

	.saixuan {
		width: 100%;
		height: 500rpx;
		background-color: white;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;

	}

	.textMy {
		font-size: 40rpx;
		font-weight: bold;
		color: #fff;
	}

	.tabr {
		top: -20rpx;
		width: 100%;
		height: 100rpx;
		/* border-bottom: 1rpx #f7f7f7 solid; */
		background: #202736;
		margin-top: 20rpx;
	}
	
	.daohang {
		width: 100%; 
		height: 90rpx; 
		display: flex;
		flex-direction: row;
		justify-content: center;
		}.daohang02{
			display: flex;
			justify-content: center;
		}.daohang02 view{
			display: flex;
			align-items: center;
			justify-content: center;
		}.daohang02 view text{
			font-size: 32rpx;
		}.Slider{
			transition: all 0.6s;
			position: absolute;
			left: 18%;
			top: 88%;
			width: 100rpx;
			height: 8rpx;
			border-radius: 55px; 
			background-color: #519a67;
		}
</style>
