<template>
	<view>
		<view class="statusBar"></view>
		<uni-nav-bar
			title="推荐数据" 
			leftIcon="back" 
			@clickLeft="back()" 
			backgroundColor="#f04b49" 
			color="#ffffff"
			leftText="返回"
			border="false"
		/>
		<view class="usertoop">
			<uni-search-bar
				@input="input" 
				v-model="searchModel"
				placeholder="搜索用户昵称" 
				clearButton="auto" 
				cancelButton="always" 
				maxlength='20'
				@cancel='cancel'>
			</uni-search-bar>
			<!-- <view class="informationtext">
				<view class="" style="margin-left: 15rpx;">
					共邀请了： <text style="color: red;font-weight: bolder;">0</text>用户
				</view>
				<view class="" style="margin-right: 15rpx;">
					总金额： <text style="color: red;font-weight: bolder;">0</text>元
				</view>
			</view> -->
			<view class="" style="margin-top: 15rpx;">
				
				<uni-datetime-picker
					type="daterange"  
					ref="time"
					@change='clickTimePicker'
					:border="false"
					v-model="range"
					:clearIcon="true">
				</uni-datetime-picker>
			</view>
						<view class="" style="height: 20rpx;"></view>
		</view>
		<scroll-view scroll-x="true" class="navigation">
			<view style="display: flex;">
				<view v-for="itme,index in tita" :key="index" @click="dianji_qiehuan(index)" style="margin: auto;">
					<view class="box" :style="index==daohang_value?'color:#f04b49;':''">{{itme}}</view>
				</view>
				<view class="xiabiao" :style="daohang_value==1 ? 'left:495rpx;' : false">
				</view>
			</view>
		</scroll-view>
		<swiper
			@change="onChangeTab" 
			:current="daohang_value" 
			class="swipper"
			:style="{height:common.scrollH()-390-statusBarHeight+'rpx'}"
			duration="300">
			<swiper-item ><!-- 内容1 -->
			<view class="usertext">
				<view class="zhuceshujunum" style="overflow: hidden;">
					<view class="" style="margin-left: 15rpx;margin-top: 10rpx;">
						注册人数：<text>{{userdainum}}</text>人
					</view>
				</view>
				<view class="title">
					<view class="">
						用户名
					</view>
					<view class="">
						余额
					</view>
					<view class="">
						注册日期
					</view>
					<view class="">
					投注详情
					</view>
				</view>
			</view>
			
				<z-paging 
					@query='refreshCommonOrder' 
					ref="commonOrder" 
					v-model="commonOrderData" 
					:fixed='false' 
					:use-page-scroll="false"
					:auto-show-back-to-top='true' 
					:back-to-top-bottom='40'>
					<view class="xiangxilist" v-for="item,index in commonOrderData" :key="index">
						
						<view class="" style="width:180rpx;text-align: center;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
							{{item.nickname}}
						</view>
						<view class="" style="width: 150rpx;text-align: center;">
							{{item.money}}元
						</view>
						<view class="" style="width: 220rpx;text-align: center;">
							 {{getdatetime.getNowFormatDate(1,item.create_time*1000)}}
						</view>
						<view class="" style="margin-left: 70rpx;" @click="goxiang(item.user_id)">
							查看
						</view>
					</view>
				</z-paging>
			</swiper-item>
			<swiper-item><!-- 内容2 -->
			<view class="usertext">
				<view class="zhuceshujunum" style="overflow: hidden;">
					<view class="" style="margin-left: 15rpx;margin-top: 10rpx;">
						总金额：<text>{{userzongnum}}</text>元
					</view>
				</view>
				<view class="title">
					<view class="" style="">
						用户名
					</view>
					<view class="">
						余额
					</view>
					<view class="" >
						投注金额
					</view>
					<view class="">
					投注详情
					</view>
				</view>
			</view>
				<z-paging 
					@query='refreshHemaiOrder' 
					ref="hemaiOrder" 
					v-model="hemaiData" 
					:fixed='false' 
					:use-page-scroll="false"
					:auto-show-back-to-top='true' 
					:back-to-top-bottom='40'>
					<view class="xiangxilist" v-for="item,index in hemaiData" :key="index">
						
						<view class="" style="width:180rpx;text-align: center;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
							{{item.nickname}}
						</view>
						<view class="" style="width: 150rpx;text-align: center;">
							{{item.money}}元
						</view>
						<view class="" style="width: 220rpx;text-align: center;">
							{{item.bet_money}}元
						</view>
						<view class="" style="margin-left: 70rpx;" @click="goxiang(item.user_id)">
							查看
						</view>
					</view>
				</z-paging>
			</swiper-item>
			
		</swiper>
	</view>
</template>

<script setup>
	import {onBeforeMount,ref,reactive,getCurrentInstance,defineProps,onMounted,watch} from 'vue';
	import {onShow} from "@dcloudio/uni-app"
	import common from '@/common/common'
	import api from "@/common/vmeitime-http/index.js"
	import getdatetime from "@/common/getdatetime.js"
	const{
		proxy,
		ctx
	}=getCurrentInstance()
	//搜索栏的modal数据
	const searchModel = ref()
	const range = reactive([])
	const statusBarHeight=ref(0)
	const Props=defineProps(['user_id','betime','endtime','currrent'])
	const tita = reactive(['注册数据', '投注数据']) //分段器title数据
	const back=()=>{
		uni.navigateBack()
	}
	onBeforeMount(()=>{
		// uni.showLoading({title:'加载中~'})
		range[0]=Props.betime
		range[1]=Props.endtime
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight//获取手机状态栏高度
		daohang_value.value=Props.currrent
	})
	//点击取消触发
	const cancel = () =>{
		uni.navigateBack()
	}
	onShow(()=>{
		// console.log(range.length)
		if(range.length>0){
		}else{
			range[0]=Props.betime
			range[1]=Props.endtime
		}
	})
	//输入字符就触发
	const input = (e) =>{
		// if(inputSearch.value !== ''){
		
		// }
		inputSearch.value = e
		proxy.$refs.commonOrder.refresh()
		proxy.$refs.hemaiOrder.refresh()
		// console.log('输入内容',inputSearch.value);
	}
	const clickTimePicker = (time) => {
		// console.log(time)
		if(time.length==0){
			// console.log('123')
		}
		if (time[0] == time[1]) {
			range[0]=Props.betime
			range[1]=Props.endtime
			//转换未yyyy/dd/mm避免ios无法转换时间戳
		// 	var starinit = time[0].split('-')
		// 	var endinit = time[1].split('-')
		// 	var newStarinit = starinit.join('/')
		// 	var newEndinit = endinit.join('/')
		// 	var date_star = new Date(newStarinit)
		// 	var date_end = new Date(newEndinit)
		// 	date_star.setHours(0)
		// 	date_end.setDate(date_end.getDate() + 1)
		// 	date_end.setHours(0)
		// 	range[0] = date_star.getFullYear() + '-' + (date_star.getMonth() + 1) + '-' + date_star.getDate()
		// 	range[1] = date_end.getFullYear() + '-' + (date_end.getMonth() + 1) + '-' + date_end.getDate()
		refreshCommonOrder(1,10)
		refreshHemaiOrder(1,10)
			return
		}
		range[0] = time[0]
		range[1] = time[1]
		refreshCommonOrder(1,10)
		refreshHemaiOrder(1,10)
	}
	const commonOrderData=ref([])
	const hemaiData=ref([])
	const userdainum =ref(0)
	const inputSearch = ref(null)
	const refreshCommonOrder=(pageNo,pageSize )=>{
	
		api.Getuserdaili({
			"agentId":Props.user_id,
			"type":"1",
			"per_page":pageSize,
			"nickname":inputSearch.value,
			"current_page":pageNo,
			"endTime":range[1],
			"startTime":range[0]
			}).then((res)=>{
				userdainum.value=res.data.data.total
				proxy.$refs.commonOrder.complete(res.data.data.data)
				uni.hideLoading()
		}).catch(res=>{
			proxy.$refs.commonOrder.complete(false)
			uni.hideLoading()
		})
	}
	const userzongnum=ref(0)
	const refreshHemaiOrder=(pageNo,pageSize)=>{
		api.Getuserdaili({
			"agentId":Props.user_id,
			"type":"2",
			"per_page":pageSize,
			"current_page":pageNo,
			"nickname":inputSearch.value,
			"endTime":range[1],
			"startTime":range[0]
			}).then((res)=>{
				userzongnum.value=res.data.data.bet_total_amount
				proxy.$refs.hemaiOrder.complete(res.data.data.data)
				uni.hideLoading()
		}).catch(res=>{
			proxy.$refs.hemaiOrder.complete(false)
			uni.hideLoading()
		})
	}
		const daohang_value = ref(0)
	const dianji_qiehuan = (index) => { //点击切换导航
		if (daohang_value == index) {
			return
		} else {
			daohang_value.value = index
		}
	}
	const onChangeTab = (e) => { //滑动导航栏跟随
		dianji_qiehuan(e.detail.current)
	}
	 const goxiang=(id)=>{
		 console.log(id)
		 uni.navigateTo({
			url:'/pages/home/userUupPage/userUupPage?id='+id
		 })
	 }
</script>

<style>
.informationtext{
	display: flex;
	justify-content: space-between;
}
.usertoop{
	border-radius: 0 0 10rpx 10rpx;
	box-shadow:0rpx 20rpx 10rpx -15rpx #c2c2c2 ;
}
.navigation {
		/* width: 1; */
		height: 80rpx;
		margin: 0 auto;
		background-color: #fff;
		margin-top: 25rpx;
	}
	.xiabiao {
		position: absolute;
		width:130rpx;
		height: 3rpx;
		background-color: #202736; 
		/* z-index: -1; */
		border-radius: 50rpx;
		top: 40rpx;
		left:125rpx;
		transition: .3s;
	}
	.zhuceshujunum{
		height: 60rpx;
		background-color:#ffaaa4;
		color:red ;
	}
	.orderCard{
		width:680rpx;
		height:200rpx;
		background-color: white;
		padding:20rpx;
		margin:15rpx auto;
		border-radius:10rpx;
	}
	.swipper{
		/* width: 80%; */
		/* margin: 0 auto; */
	}
	.title{
		display: flex;
		margin-top: 20rpx;
		justify-content: space-around;
	}
	.xiangxilist{
		height: 90rpx;
		display:flex;
		align-items: center;
	}
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: #202736; 
	}
</style>
