<template>
	<view class="status_bar" />
	<uni-transition :show="listShow" mode-class="slide-top">
		<view class="navigation_top">
			<view class="nav_left"></view>
			<view class="nav_middle">
				跟单大厅
				<uni-icons type="help" color="#fff" size="38rpx" />
			</view>
			<view class="nav_rigth">
				<uni-icons type="search" color="#fff" size="42rpx" @click="opens(0)"></uni-icons>
				<uni-icons type="person" color="#fff" size="42rpx" style="margin-left:20rpx;" @click="opens"></uni-icons>
			</view>
		</view>
		<view class="list_box">
			<view class="list_item" v-for="item,index in listData_title" :key="item.name" >
				<view class="item_box" >
					<image :src="item.imgs"></image><br>
					<text style="color:#1C2737;font-weight: 600; font-size:24rpx;">{{item.name}}</text>
				</view>
				<view class="item_box" v-for="itmeX,indexX in ListData[item.dataKey]" :key="itmeX.id" @click="list_click(itmeX)">
					<QS-image :image-url="itmeX.avatar" width="65rpx" height="65rpx" style="border-radius:8rpx;pointer-events:none;"/><br>
					<text style="font-size:24rpx;">{{itmeX.nickname}}</text>
				</view>
				<view class="item_box" v-for="itemX,index in 4-ListData[item.dataKey].length" :key="index">
					<image src="@/static/img/follow/allUser.png"></image><br>
					<text style="font-size:24rpx;">虚位以待</text>
				</view>
			</view>
		</view>
	</uni-transition>
	
	<view class="myTabs">
		<uni-segmented-control 
			:current="controlData.selectIndex" 
			:values="controlData.option" styleType="text" 
			color="#737373"
			active-color="#d85757" @clickItem="selectCardChenge"
		/>
	</view>
	
	<view class="follow_area"  :style="follow_area_style" @touchend="user_upglide" @touchstart="user_upglide" @mousedown="user_upglide">
		<z-paging ref="followList" @query="getfollowLsit" v-model="followData" :fixed="false" @touchend="user_upglide" @touchstart="user_upglide" @mousedown="user_upglide">
			<followCard v-for="itme,index in followData" :CardInfo="itme" :key="itme.id" @click="openFollow(itme)"/>
		</z-paging>
	</view>
	<uni-transition :show="!listShow" mode-class="slide-right" class="showButton" @click="showPage">
		<uni-icons type="arrow-up" size="52rpx" color="#fff"></uni-icons>
	</uni-transition>
	
	<uni-popup ref="follow_info" type="bottom" :maskClick="false" style="z-index: 999;" >
		<gendanCard @close="close_followCard" :order_id="openFollow_id" @look_follow="clickFollow_logo"></gendanCard>
	</uni-popup>
	<customtabbar :current="2"></customtabbar>
</template>

<script setup>
	import api from '@/common/vmeitime-http/'
	import common from "@/common/common.js"
	import gendanCard from "@/components/common/yc-gendan-card/yc-gendan-card.vue"
	import {onBeforeMount,ref,reactive,getCurrentInstance,watch} from 'vue';
	import {onBackPress,onShow} from '@dcloudio/uni-app'
	import { useCounterStore } from '@/stores/counter';
	import followCard from "@/components/follow/follow_card.vue"
	import customtabbar from "@/components/nav-bottom/nav-bottom.vue"
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore();//状态管理
	onBackPress(()=>{if(isOpenPopup.value){close_followCard();return true}})
	
	onBeforeMount(()=>{
		getList('ExpertList')
		// getList('ProfitabilityList')
		getList('DoubleRedList')
		getList('WinningAmount')
	})
	const openFollow_id=ref(0)
	const listData_title=reactive([//榜单卡片头部数据
		{imgs:'/static/img/follow/study.png',name:'推荐专家',dataKey:'ExpertList'},
		{imgs:'/static/img/follow/flag.png',name:'连红榜单',dataKey:'DoubleRedList'},
		// {imgs:'/static/img/follow/trophy.png',name:'胜率榜单',dataKey:'ProfitabilityList'},//响应速度太久 暂时取消
		{imgs:'/static/img/follow/up.png',name:'盈利榜单',dataKey:'WinningAmount'},
	])
	const controlData=reactive({//分段器数据
		option:['人气跟单','自购金额','跟单金额','我的关注'],
		selectIndex:0
	})
	const ListData=reactive({//榜单数据
		ExpertList:[],//专家榜单
		DoubleRedList:[],//连红榜单
		ProfitabilityList:[],//胜率榜单
		WinningAmount:[]//盈利榜单
	})
	const followData=ref([])//可跟单列表
	const user_start_glideNumber=ref(0)//用户开始滑动时的Y值
	const listShow=ref(true)//榜单列表显示控制
	const follow_area_style=ref('')//可跟单区域style
	const isOpenPopup=ref(false)
	const list_click=(userinfo)=>{
		if(userinfo.user_id==counter.user_id || userinfo.id==counter.user_id){//点击自己的头触发
			opens()//打开自己的信息主页
		}else{
			var user_id=userinfo.user_id?userinfo.user_id:userinfo.id
			uni.navigateTo({
				url:'/pages/follow/homepage?userId='+user_id
			})
		}
	}
	const openFollow=(cardData)=>{//打开跟单详情页
		openFollow_id.value=cardData.id
		isOpenPopup.value=!isOpenPopup.value
		proxy.$refs.follow_info.open()
		uni.hideTabBar()
	}
	const close_followCard=()=>{//跟单卡片关闭触发
		proxy.$refs.followList.refresh()
		proxy.$refs.follow_info.close()
		uni.showTabBar()
		isOpenPopup.value=!isOpenPopup.value
	}
	const showPage=()=>{
		listShow.value=true
		// #ifdef APP-PLUS
		follow_area_style.value='calc(45vh - var(--status-bar-height));overflow: hidden'
		// #endif
		// #ifdef H5
		follow_area_style.value='calc(45vh - 40px);overflow: hidden'
		// #endif
	}
	const opens =(e)=>{//搜索和个人中心点击
		if(e==0){
			uni.navigateTo({
				url: '/pages/follow/followSearch/followSearch',
				animationType:'fade-in'
			});
		}else{
			uni.navigateTo({
				url: '/pages/follow/MyOrder',
			});
		}
	}
	const clickFollow_logo=(id)=>{//用户点击跟单详情里的用户头像触发
		close_followCard()
		setTimeout(()=>{
			uni.navigateTo({
				url:'/pages/follow/homepage?userId='+id,
				animationType:'slide-in-bottom'
			})
		},300)
	}
	const selectCardChenge=(e)=>{//跟单分段选项卡点击触发
		if(controlData.selectIndex!=e.currentIndex){
			controlData.selectIndex=e.currentIndex
			proxy.$refs.followList.reload()
		}
	}
	const user_upglide=(e)=>{//用户开始滑动和停止滑动触发
		if(!listShow.value){return}
		var SystemInfo=uni.getSystemInfoSync()
		var tabBarHeight=SystemInfo.screenHeight-SystemInfo.safeArea.bottom
		if(e.type=='touchstart' || e.type=='onTouchstart'){
			user_start_glideNumber.value=e.changedTouches[0].clientY
		}else{
			var glideDistance=user_start_glideNumber.value-e.changedTouches[0].clientY
			if(glideDistance>150){//用户滑动距离超过150px执行
				listShow.value=false
				// #ifdef APP-PLUS
				follow_area_style.value=`height:calc(100vh - 40px - var(--status-bar-height));overflow:auto`
				// #endif
				// #ifdef H5
				follow_area_style.value=`height:calc(100vh - 75rpx - 50px);overflow:auto`
				// #endif
			}
		}
	}

	const getfollowLsit=(page_n,page_q)=>{//获取可跟单列表
		var typeArr=['popularity','OneselftMoney','FollowMoney','MyAttention']
		api.getUsableFollowList({
			'type':typeArr[controlData.selectIndex],
			'per_page':page_q,
			'current_page':page_n,
		}).then(res=>{
			proxy.$refs.followList.complete(res.data.data.data)
			
		}).catch(err=>{
			proxy.$refs.followList.complete(false)
			uni.showToast({
				title:'可跟单列表数据处理失败~',
				icon:'none',
				position:'center'
			})
		})
	}
	
	const getList=(e)=>{//获取榜单数据
		api.GetFollowList({"type": e}).then(res=>{
			//数据赋值
			if(e=='ExpertList'){
				ListData.ExpertList=res.data.data.ExpertList.data
			}else{
				var newArr=[]
				if(res.data.data[e].data){
					for(var i=0;i<res.data.data[e].data.length;i++){
						var newObj={
							avatar:res.data.data[e].data[i].user_id.avatar,
							id:res.data.data[e].data[i].user_id.id,
							nickname:res.data.data[e].data[i].user_id.nickname
						}
						newArr.push(newObj)
					}
				}else{
					var newArr=[]
					for(var i=0;i<res.data.data[e].length;i++){
						var newObj={
							avatar:res.data.data[e][i].user_id.avatar,
							id:res.data.data[e][i].user_id.id,
							nickname:res.data.data[e][i].user_id.nickname
						}
						newArr.push(newObj)
					}
				}
				ListData[e]=newArr
			}
			
		}).catch(err=>{
			uni.showToast({
				title:'榜单数据处理失败~',
				icon:'none',
				position:'center'
			})
		})
	}
</script>

<style lang="scss" scoped>
	.myTabs{
		width:100%;
		background-color:#fff;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		transition: all 0.5s;
	}
	.showButton{
		position:fixed;
		bottom:60px;
		width:80rpx;
		height:80rpx;
		right:20rpx;
		background-color: #4a4a4a;
		border-radius:50%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index:99;
	}
	.follow_area{
		// #ifdef APP-PLUS
			height:calc(60vh - var(--status-bar-height));//原45vh去掉一个榜单之后改为60
		// #endif
		// #ifdef H5
			height:calc(60vh - 40px);////原45vh去掉一个榜单之后改为60
		// #endif
		width:100%;
		overflow: hidden;
	}
	.list_item{
		width:680rpx;
		padding:20rpx;
		border-radius:20rpx;
		background-color:#fff;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		margin:20rpx auto;
		display: flex;
		.item_box{
			text-align: center;
			width:140rpx;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space:nowrap;
			text{
				text-overflow: ellipsis;
				overflow: hidden;
				white-space:nowrap;
			}
			image {
				width:65rpx;
				height:65rpx;
			}
		}
	}
	.navigation_top{
		width:100%;
		height:80rpx;
		background-color: #A6A6A6;
		display: flex;
		align-items: center;
		padding:0rpx 20rpx;
		box-sizing: border-box;
		color:#fff;
		border-radius:0 0 20rpx 20rpx;
		.nav_middle{
			flex:1;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size:38rpx;
			font-weight: bold;
		}
		.nav_rigth{
			flex:1;
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}
		.nav_left{
			flex:1;
			display: flex;
			align-items: center;
		}
	}
	.status_bar{
		background-color:#f04b49;
		height: var(--status-bar-height);
		position: -webkit-sticky;
		position: sticky;
	}
	body{
		background-color: #fbfbfb;
	}
</style>