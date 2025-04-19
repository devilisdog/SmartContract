<template>
	<!-- 背景 -->
<view class="header" >
	<view class="status_bar"></view>
	<!-- 导航栏 -->
	<view :style="ScrollJudge > 50 ? 'background-color: white;z-index:999;box-shadow: 0 5rpx 25rpx #efefef;' : false"
		class="navigation">
		<view>
			<uni-icons type="back" size='25' :color="ScrollJudge > 50 ? '#6b6b6b' : '#6b6b6b'" @click="back()"></uni-icons>
		</view>
		<text style="font-weight: bold;" :style="ScrollJudge > 50 ? 'color:#6b6b6b;' : 'color: #6b6b6b ;'">Ta的主页</text>
		<view style="position: absolute;right: 25rpx;">
			<uni-icons type="redo" size='25' :color="ScrollJudge > 50 ? '#6b6b6b' : '#6b6b6b'" ></uni-icons>
		</view>
	</view>
	<!-- 头像、名称... -->
	<view style="width: 100%; height: 400rpx; display: flex; align-items: center;">
		<view class="headPortrait">
			<image 
				style="width: 130rpx; height: 130rpx;border-radius: 85rpx;border: 5rpx #fff solid;" 
				:src="dataList.userInfo.avatar" mode="aspectFill"
				@click="lookLogo(dataList.userInfo.avatar)">
			</image>
			<view style="display: flex; flex-direction: column;line-height: 80rpx;margin-left: 20rpx;background-color: ;">
				
				<view style="display: flex;flex-direction: row;align-items: center;">
					<text style="font-size: 36rpx;color: #6b6b6b ;">{{dataList.userInfo.nickname}}</text>
					
					<view @click="attention()"
						style="background-color: #ffffff;border-radius:10rpx;margin: 0 20rpx;height:50rpx;line-height:50rpx;width:120rpx;text-align: center;">
						<text style="font-size:30rpx;color: #ff9500;">
							{{dataList.is_wink== false ? '+关注' : '已关注'}}
						</text>
					</view>
				</view>
				
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
	<view style="width: 100%; height: 400rpx; display: flex; align-items: center;margin-bottom: -90rpx;">
		<view class="zhanji">
			<view class="record">
				<view>
					<text style="font-size: 34rpx;color: #ff5c5c; font-weight: bold;">{{dataList.userInfo.WinningMoney}}元</text>
					<text style="color: #4f4f4f ;">累计奖金</text>
				</view>
				<view>  
					<!-- {{Number( dataList.userInfo.profit*100 ).toFixed(1)+'%' }} -->
					<text style="font-size: 34rpx;color: #ff5c5c; font-weight: bold;">{{ Number( dataList.userInfo.profit*100 ).toFixed(0)+'%'  }}</text>
					<text style="color: #4f4f4f ;">七日盈利</text>
				</view>
				<view>
					<text style="font-size: 34rpx;color: #ff5c5c; font-weight: bold;">{{dataList.userInfo.hit}}</text>
					<text style="color: #4f4f4f ;">七日命中</text>
				</view>
			</view>
		</view>
	</view>
	
	<!-- 最近五场 -->
	<view class="app" style="width: 100%; height: 100%; display: flex; align-items: center;">
		<view class="history">
			<view style="display: flex; align-items: center;margin: 25rpx;justify-content: space-between;">
				<view style="display: flex; align-items: center; width: 500rpx;">
					<view style="width: 10rpx; height: 45rpx; background-color: #ff6666; border-radius: 55rpx;"></view>
					<text style="margin-left: 20rpx;font-size: 32rpx;font-weight: bold; color: #464646 ;">近5场战绩</text>
				</view>
				<!-- 黑豆豆 -->
				<view style="width: 300rpx;display: flex;display: flex;justify-content: flex-end;">
				<view v-for="item,index in dataList.userInfo.FiveDayHistory" :key="index" style="padding: 0 10rpx;">
					<view :style="item == true ? 'background-color: #ff6666;' : 'background-color: #e8e8e8;'"
						style="width: 40rpx; height: 40rpx; border-radius: 50rpx;display: flex;align-items: center;justify-content: space-around;">
						<text style="color: white;font-size: 24rpx;">{{item == true ? '红' : '黑'}}</text>
					</view>
				</view>
				</view>
			</view>
			<scroll-view scroll-y="true" style="height: 700rpx;" >
				<z-paging
						ref="paging" 
						v-model="HeMaiList" 
						@query="queryList"
						:fixed='false' 
						:use-page-scroll="false" 
						>
				<view v-for="item,index in HeMaiList" :key="index" @click="openGendanCard(item.id)">
					<view style="display: flex;align-items: center;justify-content: space-between;">
						<view style="display: flex;align-items: center;margin: 30rpx;">
							<image :src="counter.baseUrl+item.gameInfo.image" style="width: 55rpx; height: 55rpx;"></image>
							<text style="margin-left: 20rpx;font-size: 30rpx;">{{item.Type}}</text>
						</view>
						<view style="margin-right: 20rpx;">
							<text style="color: #b3b3b3;">{{format(item.Deadline*1000)}}</text>
						</view>
					</view>
				
				<view style="display: flex;align-items: center;justify-content: space-between;padding:0 30rpx 30rpx 30rpx; border-bottom: 1rpx solid #eeeeee;">
					<view :style="orderState(item.state)" class="label">
						
						{{stateText(item.state)}} {{item.WinningMoney>0?item.WinningMoney:''}}{{item.state==10?'元':''}}
					</view>
					<view style="margin-right: -10rpx;">
						<text style="color: #4f4f4f;">自购:</text>
						<text style="color: #ff5c5c;">{{item.OneselftMoney}}</text>
						<text style="color: #4f4f4f;margin-right: 15rpx;">元</text>
						
						<text style="color: #4f4f4f;">跟单:</text>
						<text style="color: #ff5c5c;">{{item.followPeople.total}}</text>
						<text style="color: #4f4f4f;">人</text>
					</view>
				</view>
				</view>
				</z-paging>
			</scroll-view>
			<!-- 战绩卡片 -->
		</view>
	</view>
</view>
<uni-popup type="bottom" ref="popup">
	<!-- <view style="background-color: #f9f9f9;height:95vh;"> -->
		<gendanCard @close="proxy.$refs.popup.close();isOpenPopup=false" :order_id="Props_order_id" @look_follow="_follow"></gendanCard>
	<!-- </view> -->
</uni-popup>
</template>


<script setup>
	import api from '@/common/vmeitime-http/index.js'
	import common from "@/common/common.js"
	import gendanCard from "@/components/common/yc-gendan-card/yc-gendan-card.vue"
	import {useCounterStore} from '@/stores/counter'
	import { onPageScroll } from '@dcloudio/uni-app'
	const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight)
	import {onBackPress} from '@dcloudio/uni-app'
	const isOpenPopup=ref(false)
	import {onBeforeMount,ref,reactive, defineProps,getCurrentInstance,
	} from 'vue';
	const props = defineProps(['userId'])
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	onBackPress(()=>{if(isOpenPopup.value){proxy.$refs.popup.close();isOpenPopup.value=false;return true}})
	const dataList = ref({
		userInfo:{
			avatar:'/static/img/tabbar/user.png',
			nickname:null,
			IssueCount:null,
			WinningMoney:null,
			profit:null,
			hit:null,
		},
		history:{
			data:{}
		}
	})
	const Props_order_id=ref(0)
	onBeforeMount(()=>{
		getUserInfo()
	})
	const getUserInfo=()=>{
		api.GetFollowPerson({'user_id':props.userId}).then((res)=>{
			dataList.value = res.data.data
		})
	}
	const ScrollJudge = ref(0)
	//这个是uni监听页面滚动的生命周期
	onPageScroll((e)=>{
		ScrollJudge.value = e.scrollTop
	})
	const stateText=(state)=>{//订单状态文字处理
		var mayState=['0','1','2','7']
		if(mayState.indexOf(state) != -1){
			return '立即跟单'
		}
		var stateArr={
			'3':{title:"玩家撤销"},
			'4':{title:"店主撤销"},
			'5':{title:"系统撤销"},
			'6':{title:"待开奖"},
		}
		if(stateArr[String(state)]!=undefined){
			return stateArr[String(state)].title
		}else if(state=='8'){
			return '未中奖'
		}else{
			return '已中奖'
		}
	}
	const orderState=(state)=>{//订单状态样式处理
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
	const _follow=(id)=>{
		if(props.userId!=id){
			props.userId=id
			getUserInfo()
			proxy.$refs.popup.close()
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
	//列表组件
	const HeMaiList = ref([])
	const queryList =(pageNo,pageSize)=>{
		api.GetFollowPersonDataList({"user_id":props.userId,"per_page":pageSize,"current_page":pageNo,}).then((res)=>{
			var arr = Object.values(res.data.data.data);
			proxy.$refs.paging.complete(arr)
		}).catch(res=>{	
			proxy.$refs.paging.complete(false)
		})
	}
	
	// 打开跟单详情
	const openGendanCard =(id)=>{
		Props_order_id.value=id
		isOpenPopup.value=true
		proxy.$refs.popup.open()
	}
	//组件传值触发
	const close=()=>{
		proxy.$refs.paging.refresh()
	}
	//关注
	const attention =()=>{
		if(dataList.value.is_wink==false){
			api.atten({'user_id':props.userId,}).then((res)=>{
				if(res.data.code==1){
					dataList.value.is_wink=true
					uni.showToast({
						title:'关注成功',
						position:'center',
					})
				}else{
					uni.showToast({
						title:'关注失败',
						position:'center',
						icon:'error'
					})
				}
			})
		}else{
			api.cancelAtten({'user_id':props.userId,}).then((res)=>{
				if(res.data.code==1){
					uni.showToast({
						title:'取消成功',
						position:'center',
					})
					dataList.value.is_wink=false
				}else{
					uni.showToast({
						title:'取消失败',
						position:'center',
						icon:'error'
					})
				}
			})
		}
	}
	
	
	//时间转换
	function add0(m){return m<10?'0'+m:m }
	function format(shijianchuo)
	{
	//shijianchuo是整数，否则要parseInt转换
	var time = new Date(shijianchuo);
	var y = time.getFullYear();
	var m = time.getMonth()+1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
	}
	
	const back =()=>{
		uni.navigateBack()
	}
	
</script>


<style>
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	
	/* 背景 */
	.header {
		margin-bottom: -60rpx;
		background-repeat: no-repeat;
		background-size: cover;
		width: 100%; 
		height: 360rpx;
		background-image: url('/static/img/home/bg.png');
		border-radius:0 0 20rpx 20rpx;
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
			height: 170rpx;
			position: absolute; 
			margin:0 0 30rpx 70rpx; 
			display: flex;
			align-items: center;
		}
		
		
		/* 战绩 */
	.zhanji{
		width: 700rpx;
		height: 200rpx;
		margin: 0 auto;
		border-radius: 15rpx;
		margin-top: -180rpx;
		background-color: white;
		box-shadow: 0 5rpx 25rpx #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
		}.record{
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
		}.record view{
			width: 220rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;	
			line-height: 50rpx;
		}
		
		
		/* 近五 */
	.history{
		width: 700rpx;
		/* height: 100%; */
		margin: 0 auto;
		border-radius: 15rpx;
		margin-top: 340rpx;
		margin-bottom: 50rpx;
		background-color: white;
		box-shadow: 0 5rpx 25rpx #f5f5f5;
		}.label{
			padding: 3rpx 20rpx;
			height: 40rpx; 
			border-radius: 15rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			color: white;	
		}
	
	.app{
		/* #ifndef  APP-PLUS */
			margin-top: 0rpx;
		/*  #endif */
		/* #ifdef  APP-PLUS */
			margin-top: 30rpx;
		/*  #endif */
	}
</style>
