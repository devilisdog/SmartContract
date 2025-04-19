<template>
	<view class="status_bar"></view>
	<!-- 头部 -->
	<uni-nav-bar title="统计" leftIcon="back" @clickLeft="back()" leftText="返回"/>
	<!-- 导航 -->
	<scroll-view scroll-x="true" class="navigation" >
		<view class="bg">
			<view v-for="itme,index in daohang" :key="index"
			@click="dianji_qiehuan(index)" style="margin: auto;">
			<view class="box">{{itme}}</view>
			</view>
			<view class="xiabiao"  
			:style="daohang_value==1 ? 'left:519rpx;' : false"></view>
		</view>
	</scroll-view>
	<!-- 内容 -->
	<swiper @change="onChangeTab" :current="daohang_value" easing-function='easeInOutCubic' 
		:style="{height:common.scrollH()-100+'rpx'}" duration="300">
		<swiper-item>
			<z-paging ref="addMoney" v-model="addMoneyListData" @query='addMoneyRefresh'>
				<view class="userDataCard" v-for="itme,index in addMoneyListData">
					<view style="margin-left:15rpx;">
						<text>系统 | {{itme.source}}-{{itme.user_id.nickname}}</text><br>
						<text style="font-size:26rpx;color: #7e7e7e;">
							{{getDate.getNowFormatDate(0,itme.create_time)}}
						</text>
					</view>
					<text style="margin-right:20rpx;color:red;font-weight: bold;">+{{itme.money}}</text>
				</view>
			</z-paging>
		</swiper-item>
		<swiper-item>
			<z-paging ref="deductMoney" v-model="deductMoneyListData" @query='deductMoneyRefresh'>
				<view class="userDataCard" v-for="itme,index in deductMoneyListData">
					<view style="margin-left:15rpx;">
						<text>系统 | {{itme.source}}-{{itme.user_id.nickname}}</text><br>
						<text style="font-size:26rpx;color: #7e7e7e;">
							{{getDate.getNowFormatDate(0,itme.create_time)}}
						</text>
					</view>
					<text style="margin-right:20rpx;color:#7e7e7e;font-weight: bold;">{{itme.money}}</text>
				</view>
			</z-paging>
		</swiper-item>
	</swiper>
</template>

<script setup>
	import common from "@/common/common.js"
	import getDate from "@/common/getdatetime.js"
	import api from "@/common/vmeitime-http/satistics/satistcs.js"
	import {
		ref,
		reactive,
		onMounted,
		onBeforeMount,
		getCurrentInstance,
		defineProps, // 接收
		defineEmits,// 发送
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	// 返回到上一个页面
	
	const addMoneyListData=ref([])
	const deductMoneyListData=ref([])
	const prop=defineProps(['state','time'])
	const daohang = reactive(['加款','扣款'])
	const daohang_value =ref(prop.state) // 导航默认
	
	const addMoneyRefresh=(pageNo, pageSize)=>{
		api.GetCollocationMoney({
			"type":"1","per_page":pageSize,
			"current_page":pageNo,
			"startTime":prop.time.split(',')[0],
			"endTime":prop.time.split(',')[1],
		}).then((res)=>{
			proxy.$refs.addMoney.complete(res.data.data.data);
			uni.hideLoading()
		}).catch(res=>{
			proxy.$refs.addMoney.complete(false);
			uni.hideLoading()
		})
	}
	const deductMoneyRefresh=(pageNo, pageSize)=>{
		api.GetCollocationMoney({
			"type":"2","per_page":pageSize,
			"current_page":pageNo,
			"startTime":prop.time.split(',')[0],
			"endTime":prop.time.split(',')[1],
		}).then((res)=>{
			proxy.$refs.deductMoney.complete(res.data.data.data);
			uni.hideLoading()
		}).catch(res=>{
			proxy.$refs.deductMoney.complete(false);
			uni.hideLoading()
		})
	}
	const back = () => {
		uni.navigateBack()
	}
	onBeforeMount(()=>{
		uni.showLoading({title:'加载中~'})
	})
	
	const dianji_qiehuan = (index) =>{ //点击切换导航
		if(daohang_value == index){
			return
		}else{
			daohang_value.value = index
		}
	}
	const onChangeTab = (e) =>{		//滑动导航栏跟随
		dianji_qiehuan(e.detail.current)
	}
</script>

<style>
	.userDataCard{
		width:735rpx;
		padding:20rpx 5rpx;
		background-color: white;
		border-bottom: 1rpx solid #ececec;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
	.navigation{
		width: 100%;
		height: 80rpx;
		background-color: #fff;
	}
	.bg{
		display: flex;
		background-color: white;
	}
	.box{
		width: 186rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		transition: .3s;
	}
	.xiabiao{
		position: absolute;
		width: 90rpx;
		height: 7rpx;
		background-color: #FDC830;
		/* z-index: -1; */
		border-radius: 50rpx;
		top: 73rpx;
		left: 143rpx;
		transition: .3s;
	}
	body {
		background-color: #f3f3f3;
	}
</style>
