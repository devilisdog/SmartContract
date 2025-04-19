<template>
	<view class="status_bar"></view>
	<!-- 头部 -->
	<uni-nav-bar title="统计"  fixed="true"></uni-nav-bar>
	<!-- 日期选择 -->
	<view style="width:100%;background-color: #ffffff;display: flex;padding:10rpx 0rpx;">
		<view class="deta-text"  @click="openPicker">
			<text style="font-size: 24rpx;">{{title}}</text>
			<uni-icons type="bottom"></uni-icons>
		</view>
		<uni-datetime-picker type="daterange" :border="false" 
							:clear-icon="false" v-model="range"  @change='clickTimePicker'
		/>
	</view>
		<!-- 上半部分 -->
	<view style="width:720rpx;margin:20rpx auto;background-color: white;border-radius:15rpx;padding-bottom:20rpx;">
		<view class="topCard">
			<view class="pj" @click="pageSkip(0)">
				<text style="color:white;font-weight:bold;font-size:40rpx;">{{satistcsData.TotalInvoicingAmount}}</text>
				<text style="font-size: 24rpx; font-weight:normal;">出票总金额</text>
			</view>
			<view class="subsection"></view>
			<view class="pj" @click="pageSkip(1)">
				<text style="color:white;font-weight:bold;font-size:40rpx;">{{satistcsData.TotalAmountOfBonus}}</text>
				<text style="font-size: 24rpx; font-weight:normal;">中奖总金额(已派奖)</text> 	
			</view>
		</view>
		<uni-collapse>
			<!-- 因为list默认带一条分隔线，所以使用 titleBorder="none" 取消面板的分隔线 -->
			<uni-collapse-item title-border="none" :border="false" :show-animation="true">
				<template v-slot:title>
					<uni-list :border="false" >
						<view style="font-size:26rpx;padding:10rpx 45rpx;">
							<text style="">店主彩民跟单佣金1%:</text>
							<text style="color: red;">￥0.00</text>
						</view>
					</uni-list>
				</template>
				<view class="content">
					<view class="content-e">
						<text class="yrad">￥0.00</text>
						<text style="font-weight: bold;padding-top: 10rpx;">发单人佣金</text>
					</view>
					<view>:</view>
					<view class="content-e">
						<text class="yrad">￥0.00</text>
						<text style="font-weight: bold;padding-top: 10rpx;">本店</text>
					</view>
					<view>+</view>
					<view class="content-e">
						<text class="yrad">￥0.00</text>
						<text style="font-weight: bold;padding-top: 10rpx;">其他店</text>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>
		<view style="display: flex;justify-content: space-around;height:120rpx;align-items: center;">
			<view style="display: flex;align-items: center;" @click="pageSkip(0)">
				<image src="@/static/icon/statistics/cp.png" style="width: 50rpx;height: 50rpx;"></image>
				<text style="font-size: 28rpx;padding-left: 20rpx;">出票详情</text>
			</view>
			<view style="display: flex;align-items: center;" @click="pageSkip(1)">
				<image src="@/static/icon/statistics/hb.png" style="width: 50rpx;height: 50rpx;"></image>
				<text style="font-size: 28rpx;padding-left: 20rpx;">中奖详情</text>
				<text style="font-size: 20rpx; color: #5e5e5e ;">(已派奖)</text>
			</view>
		</view>
	</view>
	
	<view style="width:720rpx;margin:20rpx auto;" v-if="counter.shopBasicsData.group_id==2">
		<text style="font-size: 28rpx;margin-left: 10rpx;">对账汇总</text>
		<view class="accountCard">
			<view style="line-height: 45rpx;">
				<text style="font-size: 24rpx;color: #5e5e5e;">托管余额</text><br>
				<text style="color:red;font-weight:bold;font-size:36rpx;">{{satistcsData.TrusteeshipBalance}}</text>
			</view>
			<view style="line-height: 45rpx;">
				<text style="font-size: 24rpx;color: #5e5e5e;">服务费支出</text><br>
				<text style="color:red;font-weight:bold;font-size:36rpx;">{{satistcsData.ServiceFeeExpenditure}}</text>
			
			</view>
		</view>
	</view>
	
	<view class="rechargeCard" v-if="counter.shopBasicsData.group_id==2">
		<view  @click="gochong"
				  
				   style="display: flex;justify-content: space-between;height:80rpx;align-items: center;"
		>
			<view style="display: flex;align-items: center;">
				<image src="@/static/icon/statistics/cz.png" style="width: 40rpx;height: 40rpx;margin-right: 20rpx;" />
				<text style="font-size: 28rpx;">充值总金额</text>
			</view>
	
			<view style="display: flex;align-items: center;">
				<text style="color:red;font-weight:bold;">{{satistcsData.RechargeBalance}}</text>
				<uni-icons type="forward"></uni-icons>
			</view>
		</view>
		
		<view  @click="goti"
				
				   style="display: flex;justify-content: space-between;height:80rpx;align-items: center;"
		>
			<view style="display: flex;align-items: center;">
				<image src="@/static/icon/statistics/cz.png" style="width: 40rpx;height: 40rpx;margin-right: 20rpx;" />
				<text style="font-size: 28rpx;">提现总金额</text>
			</view>
			<view style="display: flex;align-items: center;">
				<text style="color:red;font-weight:bold;">{{satistcsData.WithdrawalBalance}}</text>
				<uni-icons type="forward"></uni-icons>
			</view>
		</view>
	</view>
	
	<view style="width: 720rpx;height: 150rpx;margin:30rpx auto;">
		<text style="font-size: 28rpx;margin-left: 10rpx;">加扣款统计</text>
		<view class="statisticsCard">
			<view class="jia_kuan" style="color: #FDC830;" @click="fasong(0)">
				<text style="font-size: 24rpx;">加款金额</text>
				<text style="color:#FDC830;font-weight:bold;">{{satistcsData.AmountIncrease}}</text>
			</view>
			<view class="jia_kuan" style="color: #ff7979;" @click="fasong(1)">
				<text style="font-size: 24rpx;">扣款金额</text>
				<text style="color:#ff7979;font-weight:bold;">{{satistcsData.Deduction}}</text>
			</view>
		</view>
	</view>
	
	<!-- 弹窗选择器 -->
	<jarvis-picker mode='bottom' :show='pickerState' @confirm='confirm' :range='staffArr' @cancel='pickerState=false' />
</template>

<script setup>
	import common from "@/common/common.js"
	import {onShow} from "@dcloudio/uni-app"
	import api from "@/common/vmeitime-http/satistics/satistcs"
	import {useCounterStore} from '@/stores/counter'
	import GetDate from "@/common/getdatetime.js"
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
		defineProps, // 接收
		defineEmits, // 发送
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const fasong=(e)=>{
		uni.navigateTo({
			url:'../statistics-xiangqing/statistics-statisticsTwo?state='+e+'&time='+range
		})
	}
	var range =reactive([])
	const satistcsData=reactive({
		'TotalInvoicingAmount':'0.00',//出票总金额
		'TotalAmountOfBonus':'0.00',//派奖总金额
		'TrusteeshipBalance':'0.00',//托管余额
		'ServiceFeeExpenditure':'0.00',//服务费支出
		'AmountIncrease':'0.00',//加款金额
		'Deduction':'0.00',//扣款金额
		'RechargeBalance':'0.00',//充值总金额
		'WithdrawalBalance':'0.00'//提现中金额
	})
	const gochong=()=>{
		uni.navigateTo({
			url:'/pages/statistics-xiangqing/statistics-Pay?time='+range
		})
	}
	const goti=()=>{
		uni.navigateTo({
			url:'/pages/statistics-xiangqing/statistics-history?time='+range
		})
	}
	const counter = useCounterStore(); //状态管理
	const pageSkip=(e)=>{
		uni.navigateTo({
			url:'/pages/statistics-xiangqing/statistics-award?pageState='+e+'&time='+range+'&clerk_id='+staffArr[0][pickerValue.value].value
		})
	}
	const clickTimePicker=(time)=>{
		if(time[0]==time[1]){
			//转换未yyyy/dd/mm避免ios无法转换时间戳
			var starinit=time[0].split('-')
			var endinit=time[1].split('-')
			var newStarinit=starinit.join('/')
			var newEndinit=endinit.join('/')
			var date_star=new Date(newStarinit)
			var date_end=new Date(newEndinit)
			date_star.setHours(0)
			date_end.setDate(date_end.getDate()+1)
			date_end.setHours(0)
			range[0]=date_star.getFullYear()+'-'+(date_star.getMonth()+1)+'-'+date_star.getDate()
			range[1]=date_end.getFullYear()+'-'+(date_end.getMonth()+1)+'-'+date_end.getDate()
			GetSatistcsData()
			return
		}
		range[0]=time[0]
		range[1]=time[1]
		GetSatistcsData()
	}
	const timeBle=ref(false)//判断是否执行过时间计算函数

	onShow(()=>{
		if(timeBle.value==false){
			GetNowDate()
		}
		GetSatistcsData()
	})
	const GetNowDate=()=>{//获取今天0点到现在的时间
		var time=new Date()
		range[0]=GetDate.getNowFormatDate(1,time/1000)
		range[1]=GetDate.getNowFormatDate(1,time/1000+86400)
		timeBle.value=true
	}

	const GetSatistcsData=()=>{
		api.GetSatistcsIndex({
			"clerk_id":staffArr[0][pickerValue.value].value,
			"startTime":range[0],
			"endTime": range[1],
		}).then((res)=>{
			satistcsData.AmountIncrease=res.data.data.AmountIncrease
			satistcsData.Deduction=res.data.data.Deduction
			satistcsData.ServiceFeeExpenditure=res.data.data.ServiceFeeExpenditure//服务费支出
			satistcsData.TotalInvoicingAmount=res.data.data.TotalInvoicingAmount//出票总额
			satistcsData.TotalAmountOfBonus=res.data.data.TotalAmountOfBonus//派奖总额
			satistcsData.TrusteeshipBalance=res.data.data.TrusteeshipBalance//托管余额
			satistcsData.RechargeBalance=res.data.data.RechargeBalance//用户充值总金额
			satistcsData.WithdrawalBalance=res.data.data.WithdrawalBalance//用户提现金额
			counter.shopBasicsData.TrusteeshipBalance=res.data.data.TrusteeshipBalance//修正托管余额
			if(staffArr[0].length<=res.data.data.ClerkList.length){
				for(var i=0;i<res.data.data.ClerkList.length;i++){
					var arr={
						label:res.data.data.ClerkList[i].nickname,
						value:res.data.data.ClerkList[i].id
					}
					staffArr[0].push(arr)
				}
			}
			uni.hideLoading()
		})
	}

	const title = ref('全部')	// 顶部选择器弹窗显示内容
	const confirm = (e) => {	// 顶部游戏选择器弹窗点击确定
		uni.showLoading({title:'加载中~'})
		pickerState.value=false
		title.value=staffArr[0][e[0]].label
		pickerValue.value=e[0]
		GetSatistcsData()
	}
	const pickerValue=ref(0)
	const pickerState=ref(false)
	const openPicker=()=>{
		pickerState.value=!pickerState.value
	}
	const staffArr=reactive([[
		{
			label:'全部',
			value:0
		},
	]])
</script>

<style>
	uni-picker-view {
	   display: block;
	}
	 uni-picker-view .uni-picker-view-wrapper {
	   display: flex;
	   position: relative;
	   overflow: hidden;
	   height: 100%;
	   background-color: white;
	 }
	 uni-picker-view[hidden] {
	  display: none;
	 }
	 picker-view {
	   width: 100%;
		height: 300upx;
	   margin-top:20upx;
	}
	.staff{
		width:100%;
		height:500rpx;
		background-color:white;
		padding:20rpx 0rpx;
		border-top-left-radius:30rpx;
		border-top-right-radius:30rpx;
	}
	.statisticsCard{
		background-color: white;
		border-radius:15rpx;
		display: flex;
		padding:20rpx 0rpx;
		justify-content: space-around;
	}
	.rechargeCard{
		display: flex;
		width: 680rpx;
		padding:20rpx;
		background-color: #ffffff;
		margin:20rpx auto;
		border-radius: 15rpx;
		flex-direction: column;
	}
	.accountCard{
		background-color:white;
		border-radius: 15rpx;
		padding:20rpx;
		display: flex;
		justify-content: space-around;
		text-align: center;
	}
	.subsection{
		width:2rpx;
		height:50rpx;
		background-color: #ffffff;
		border-radius:15rpx;
		box-shadow: #f3ce6f 0px 0px 2px 0.5px ;
	}
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}

	body {
		background-color: #f4f4f4;
	}
	.topCard{
		width: 720rpx;
		height: 150rpx;
		border-radius: 15rpx;
		background: linear-gradient(140deg, #ffd875, #ff7979);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.pj {
		width: 350rpx;
		height: 150rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #fff;
	}

	.pj text {
		padding-top: 10rpx;
		font-size: 38rpx;
		font-weight: bold;
	}

	.content {
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: auto;
	}

	.content-e {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: auto;
		width: 200rpx;
	}
	.deta-text{
		 width: 150rpx;
		 height: 50rpx;
		 background-color: #f0f0f0;
		 border-radius: 15rpx;
		 margin: 0 20rpx;
		 display: flex;
		 justify-content: center;
		 align-items: center;
	}
	.yrad {
		color: #ff0000;
		line-height: 30rpx;
	}
	.jia_kuan{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
