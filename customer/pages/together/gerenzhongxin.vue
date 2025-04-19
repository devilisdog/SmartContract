<template>
	<!-- 背景 -->
	<view class="header" style="margin-bottom: var(--status-bar-height);">
		<view class="header-a" style="border: 130px solid; transform: rotate(-150deg);left: -120rpx;top: 120rpx;border-color: transparent transparent rgba(255, 255, 255, .2) transparent;"></view>
		<view class="header-a" style="border: 160px solid; transform: rotate(140deg);top: -60rpx;border-color: transparent transparent rgba(255, 255, 255, 0.1) transparent;right: -300rpx;"></view>
	</view>
	<view style="padding-top: var(--status-bar-height);">
	<!-- 导航栏 -->
		<view :style="ScrollJudge > 50 ? 'background-color: white;z-index:999;box-shadow: 0 5rpx 25rpx #efefef;' : false"
			class="navigation">
			<view>
				<uni-icons type="back" size='25' :color="ScrollJudge > 50 ? '#6b6b6b' : '#fff'" @click="back()"></uni-icons>
			</view>
			<text style="font-weight: bold;" :style="ScrollJudge > 50 ? 'color:#6b6b6b;' : 'color: #fff ;'">个人中心</text>
		</view>

		<!-- 头像、名称... -->
		<view style="width: 100%; height: 400rpx; display: flex; align-items: center;">
			<view class="headPortrait">
				<image 
					style="width: 130rpx; height: 130rpx;border-radius: 85rpx;border: 5rpx #fff solid;" 
					:src="dataList.userInfo.avatar"
					mode="aspectFill">
				</image>
				<view style="display: flex; flex-direction: column;line-height: 80rpx;margin-left: 20rpx;">
					<text style="font-size: 36rpx;color: #fff ;">{{dataList.userInfo.nickname}}</text>
					<text style="color: #6f6f6f;font-size: 34rpx;">发单{{dataList.userInfo.IssueCount}}</text>
				</view>
			</view>
			<view class="person"  style="margin-top: 170rpx;">
				<text>Ta没有留下任何介绍</text>
			</view>
		</view>
		
		<!-- 我滴战机 -->
		<view style="width: 100%; height: 400rpx; display: flex; align-items: center;margin-bottom:-500rpx;">
			<view class="zhanji">
				<view style="display: flex; align-items: center;margin: 25rpx;">
					<view style="width: 10rpx; height: 45rpx; background-color: #e05251; border-radius: 55rpx;"></view>
					<text style="margin-left: 20rpx;font-size: 32rpx;font-weight: bold; color: #464646 ;">我的战绩</text>
				</view>
				
				<view class="record">
					<view>
						<text style="font-size: 34rpx;color: #e05251; font-weight: bold;">{{dataList.userInfo.WinningMoney}}元</text>
						<text style="color: #4f4f4f ;">累计奖金</text>
					</view>
					<view>
						<text style="font-size: 34rpx;color: #e05251; font-weight: bold;">
							{{Number(dataList.userInfo.profit).toFixed(2)}}%
						</text>
						<text style="color: #4f4f4f ;">七日盈利</text>
					</view>
					<view>
						<text style="font-size: 34rpx;color: #e05251; font-weight: bold;">{{dataList.userInfo.hit}}</text>
						<text style="color: #4f4f4f ;">七日命中</text>
					</view>
				</view>
			</view>
		</view>
	<!-- 最近五场 -->
	<view style="width: 100%; height: 100%; display: flex; align-items: center;">
		<view class="history">
			<view style="display: flex; align-items: center;margin: 25rpx;justify-content: space-between;">
				<view style="display: flex; align-items: center; width: 500rpx;">
					<view style="width: 10rpx; height: 45rpx; background-color: #e05251; border-radius: 55rpx;"></view>
					<text style="margin-left: 20rpx;font-size: 32rpx;font-weight: bold; color: #464646 ;">近5场战绩</text>
				</view>
				<!-- 黑豆豆 -->
				<view style="width: 300rpx;display: flex;display: flex;justify-content: flex-end;">
				<view v-for="item,index in dataList.userInfo.FiveDayHistory" :key="index" style="padding: 0 10rpx;">
					<view :style="item == true ? 'background-color: #e05251;' : 'background-color: #e8e8e8;'"
						style="width: 40rpx; height: 40rpx; border-radius: 50rpx;display: flex;align-items: center;justify-content: space-around;">
						<text style="color: white;font-size: 24rpx;">{{item == true ? '红' : '黑'}}</text>
					</view>
				</view>
				</view>
			</view>
			
			<!-- 战绩卡片 -->
			<view>
				<!-- :style='{height:common.scrollH()-305+"rpx"}' -->
				<scroll-view scroll-y="true" style="height: 750rpx;" >
					<z-paging
							ref="paging" 
							v-model="HeMaiList" 
							@query="queryList"
							:fixed='false' 
							:use-page-scroll="false" 
							:auto-show-back-to-top='true'
							:back-to-top-bottom='150'
							>
				<view v-for="item,index in HeMaiList" :key="index" @click="open(item.Type,item.order_id)">
				<view style="display: flex;align-items: center;justify-content: space-between;">
					<view style="display: flex;align-items: center;margin: 30rpx;">
						<image :src="counter.baseUrl+item.gameInfo.image" style="width: 55rpx; height: 55rpx;"></image>
						<text style="margin-left: 20rpx;font-size: 30rpx;">{{item.Type}}</text>
					</view>
					<view style="margin-right: 20rpx;">
						<text style="color: #b3b3b3;">{{format(item.PayTime*1000)}}</text>
					</view>
				</view>
				
				<view style="display: flex;align-items: center;justify-content: space-between;padding:0 30rpx 30rpx 30rpx; border-bottom: 1rpx solid #eeeeee;">
					<view :style="item.State == 0 ? 'background-color: #e05251;' : item.State == 10 ? 'background-color: #ff4e4e;' : 'background-color: #cacaca;'" 
						class="label">{{item.State == 0 ? "参与合买" : item.State == 10 ? "已派奖" : "未中奖"}}</view>
					<view>
						<text style="color: #4f4f4f;">方案总额:</text>
						<text style="color: #e05251;">{{item.BetMoney}}</text>
						<text style="color: #4f4f4f;">元</text>
					</view>
				</view>
				</view>
				</z-paging>
				</scroll-view>
			</view>
			
		</view>
	</view>
</view>
	<uni-popup type="bottom" ref="popup" style='z-index:999;'>
		<!-- <view style="background-color: #f9f9f9;height:95vh;"> -->
			<hemaiCard @close='close' :Hemaidata='openData'></hemaiCard>
		<!-- </view> -->
	</uni-popup>
</template>


<script setup>
	import api from '@/common/vmeitime-http/index.js'
	import common from "@/common/common.js"
	import hemaiCard from "@/components/common/yc-hemai-card/yc-hemai-card.vue"
	import {useCounterStore} from '@/stores/counter'
	import { onPageScroll } from '@dcloudio/uni-app'
	const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight)
	import { onShow,onBackPress} from '@dcloudio/uni-app'
	import {onBeforeMount,ref,reactive, defineProps,getCurrentInstance} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const props = defineProps(['userId'])
	const counter = useCounterStore(); //状态管理
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
	const popup_isOpen=ref(false)
	 onBeforeMount(()=>{
		api.GetHemaiPerson({'user_id':props.userId}).then((res)=>{
			dataList.value = res.data.data
		})
	})
	onBackPress(()=>{if(popup_isOpen.value){close();return true}})
	const ScrollJudge = ref(0)
	//这个是uni监听页面滚动的生命周期
	onPageScroll((e)=>{
		ScrollJudge.value = e.scrollTop
	})
	const HeMaiList = ref([])
	const queryList =(pageNo,pageSize)=>{
		api.GetHeMaiList({"user_id":props.userId, "per_page":pageSize,"current_page":pageNo}).then((res)=>{
			proxy.$refs.paging.complete(res.data.data.history.data)
		}).catch(res=>{	
			proxy.$refs.paging.complete(false)
		})
	}
	
	//传给弹窗的数据
	const openData = ref([])
	//未中奖判断
	const zj = ref()
	const open = (title,orderid) =>{
		popup_isOpen.value=true
		uni.showLoading({title:'获取数据中',mask:true})
		api.GetTogetherInfo({'order_id':orderid}).then((res)=>{
			uni.hideLoading()
			if(title=='福彩3D'||title=='快乐八'||title=='七乐彩'||title=='双色球'||title=='大乐透'||title=='排列三'||title=='排列五'||title=='七星彩'){
				counter.submitNewData = JSON.parse(res.data.data.Order.BetContent)
				var newObj={
					WinConten:res.data.data.Order.WinConten,
					BetContent:res.data.data.Order.BetContent
				}
				counter.allOrderData=newObj
			}else{
				counter.BettingContent = JSON.parse(res.data.data.Order.BetContent)
			}
			openData.value=res.data.data.Order
			proxy.$refs.popup.open()
		}).catch((err)=>{
			uni.hideLoading()
			uni.showToast({
				title:'无法获取到合买信息，请反馈平台方',
				icon:'none',
				position:'center'
			})
		})
	}
	const close=()=>{
		popup_isOpen.value=false
		counter.allOrderData=[]
		proxy.$refs.popup.close()
		proxy.$refs.paging.refresh()
	}
	
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
	/* 背景 */
	.header {
		position: absolute;
		z-index: -1;
		background-repeat: no-repeat;
		background-size: cover;
		width: 100%; 
		height: 360rpx;
		overflow: hidden;
		background: linear-gradient(rgb(37, 51, 76) 0%, rgb(18, 27, 43) 100%);
		/* background-image: url(/static/img/main/bg.png); */
		}.header-a{
			position: absolute;
			transform: rotate(-30deg);
			width: 0px;    
			height: 0px;  
			backdrop-filter: blur(20px);
		}
	/* 导航栏 */
	.navigation{
		top: var(--status-bar-height);
		width: 100%;
		height: 100rpx;
		position: fixed;
		z-index: 5;
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
			margin: 30rpx;
			font-size: 30rpx;
			color: #585858;
		}.headPortrait{
			width:500rpx;
			height: 170rpx;
			position: absolute; 
			margin:0rpx 0 30rpx 70rpx; 
			display: flex;
			align-items: center;
		}
		/* 战绩 */
	.zhanji{
		width: 700rpx;
		height: 250rpx;
		margin: 0 auto;
		border-radius: 15rpx;
		margin-top: -120rpx;
		background-color: white;
		box-shadow: 0 5rpx 25rpx #f5f5f5;
		}.record{
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			margin-top: 40rpx;
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
		margin-top: 400rpx;
		margin-bottom: 50rpx;
		background-color: white;
		box-shadow: 0 5rpx 25rpx #f5f5f5;
		}.label{
			width: 150rpx;
			height: 40rpx; 
			border-radius: 15rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			color: white;
		}
</style>
