<template>
	<view class="status_bar"></view>
	<!-- 导航 -->
	<uni-nav-bar title="奖金优化" leftIcon="back" @clickLeft="back()"></uni-nav-bar>
	
	<!-- 分段选择器 -->
	<view style="margin: 20rpx 15rpx;height: 90rpx;">
		<uni-segmented-control :current="current" styleType="button" :values="groupitems" activeColor="#ffbe79"
			@clickItem="clickItem">
		</uni-segmented-control>
	</view>
	
	<view v-if="current === 0">
		<listAverage :listData='repetitionData' @max_min='max_min' :showTabIndex='current'/>
	</view>
	<view v-if="current === 1">
		<listmMinmum :listData='repetitionData' @max_min='max_min' :showTabIndex='current' v-if="pageShow==1" @show='page'/> 
		<listAverage :listData='repetitionData' @max_min='max_min' :showTabIndex='current' v-else/>
	</view>
	<view v-if="current === 2">
		<listmMaximum :listData='repetitionData' @max_min='max_min' :showTabIndex='current' v-if="pageShow==1" @show='page'/>
		<listAverage :listData='repetitionData' @max_min='max_min' :showTabIndex='current' v-else/>
	</view>
	
	<view style="height: 250rpx;"></view>
	<!-- 底部导航 -->
	<view class="footer" style="">
		<!-- </view> -->
		<view class="submit">
			<view style="width: 100%;height: 60rpx;background-color: #fff;border-top: 2rpx solid #e5e5e5;border-bottom: 2rpx solid #e5e5e5;display: flex;align-items: center;justify-content: center;">
				<text style="color: #484848 ;">单注预测奖金：</text>
				<text style="color: #ff6767;">{{max_minValue.min}}~{{max_minValue.max}}</text>
			</view>
			<view class="submit-bottom">
				<view style="color: #484848;width: 360rpx;display: flex;justify-content: center;align-items: center;">
					<text>方案共</text>
					<text style="color: red;">{{max_minValue.money}}</text>
					<text>元</text>
				</view>
				<view class="bottom-button" style=" height: 85rpx; width: 360rpx;margin-right: 20rpx;">
					<view 
						class="bottom-button02"
						style="border-radius: 20rpx 0 0 20rpx;background-color: #ffeac4;"
						@click="cooperation"
						>
						<text style="font-size: 30rpx;color: #5f5f5f ;">发起合买</text>
					</view>
					<view 
						class="bottom-button02" 
						style="border-radius: 0 20rpx 20rpx 0;background: #202736;"
						@click="submit">
						<text style="font-size: 30rpx;">确认提交</text>
					</view>
				</view>
			</view>
		</view>
	</view>
	<uni-popup ref="pupopPay" type="bottom">
		<SubmitPay
			:type="counter.BettingContent.type"
			:money="max_minValue.money" 
			:balance="counter.user_money-max_minValue.money"
			@ConfirmPayment="getNewMoney"
			>
		</SubmitPay>
	</uni-popup>
	<uni-popup ref="orderPopup" type="bottom" style="border-radius:20rpx 20rpx 0 0;">
		<!-- <view style="background-color:#f3f3f3;height:95vh;border-radius:30rpx 30rpx 0 0;"> -->
			<orderPop @close='closeOrder()'></orderPop>
		<!-- </view> -->
	</uni-popup>
</template>

<script setup>
	import listAverage from '@/components/main/optimizing-List/yc-optimizing-List-average.vue'
	import listmMaximum from "@/components/main/optimizing-List/yc-optimizing-List-maximum.vue"
	import listmMinmum from "@/components/main/optimizing-List/yc-optimizing-List-minmum.vue"
	import SubmitPay from "/components/main/nav/yc-submit-pay.vue"
	import {useCounterStore} from '@/stores/counter';
	import orderPop from "@/components/common/yc-common-BettingInfo/yc-common-BettingInfo.vue"
	import common from "@/common/common.js"
	import api from "@/common/vmeitime-http/beting.js"
	import {onBeforeMount,onMounted,ref,reactive,getCurrentInstance,} from 'vue'
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore() //状态管理
	const current = ref(0)//tabbar的index
	const groupitems = reactive(['奖金平均', '博热优化','博冷优化'])
	const clickItem = (e) => {
		if (current.value != e.currentIndex) {
			current.value = e.currentIndex;
		}
	}
	const cooperation=()=>{//发起合买
		uni.navigateTo({
			url:'/pages/main/submit/buyTogether?Amount='+counter.BettingContent.remarks.Amount+'&Note='+counter.BettingContent.remarks.Note+'&bonusmin='+counter.BettingContent.remarks.bonusmin*counter.BettingContent.remarks.Multiple+'&bonusmax='+counter.BettingContent.remarks.bonusmax*counter.BettingContent.remarks.Multiple+'&lssue='+counter.BettingContent.lssue,
			animationType:'slide-in-bottom'
		})
	}
	
	const closeOrder=()=>{//关闭订单弹窗
		proxy.$refs.orderPopup.close()
		setTimeout(()=>{
			uni.navigateBack({delta:3})
		},300)
	}
	const submit=()=>{//打开支付弹窗
		proxy.$refs.pupopPay.open()
	}
	//确认支付
	const getNewMoney=()=>{
		proxy.$refs.pupopPay.close()
		
		if(max_minValue.money<counter.gameAstrict.MinBetAmount){
			uni.showToast({
				title:'店主限制最小投注金额'+counter.gameAstrict.MinBetAmount+'元',
				position:"center",
				icon:'none',
				duration:3000
			})
			return
		}
		uni.showLoading({title:'提交中~',mask:true})
		uni.request({
			url:counter.baseUrl+'/api/bettingend.mine.Transaction/notWithdraw',
			header:{'server':1,'ba-user-token':counter.access_token,},
			success(res){
				counter.user_money=Number(res.data.data.withdraw)+Number(res.data.data.not_withdraw)
				submitPay()
			},
			fail(err){
				uni.showToast({
					title:'获取金额失败',
					icon:'error',
					position:'center'
				})
				submitPay()
			}
		})
	}
	const submitPay=()=>{
		if(counter.user_money-max_minValue.money<0){
			uni.hideLoading()
			uni.showModal({
				title: '注意',
				content: '余额不足！',
				confirmText:'立即充值',
				confirmColor:'#f04b49',
				success: function (res) {
					if (res.confirm) {
						uni.navigateTo({
							url:'/pages/home/HomeTopUp/HomeTopUp',
							animationType:'slide-in-bottom'
						})
					}
				}
			});
			return
		}
		var delIndex=counter.BettingContent.remarks.reachType.indexOf('1单关1')
		if(delIndex != -1){
			counter.BettingContent.remarks.reachType[delIndex]='单关'
		}
		api.Betjczq({
			"default":0,
			"Type":common.playType(counter.BettingContent.type),
			"BetContent":counter.BettingContent,
			// "BuyingContent": [],
			// "FollowContent": [],
			"Note":max_minValue.note,
			"BetMoney":max_minValue.money,
			"bonusmin":max_minValue.min,
			"bonusmax":max_minValue.max,
			'lssue' :'0',
			"Deadline":common.minTiem(counter.BettingContent.Content),
			"drawDeadine":common.maxTiem(counter.BettingContent.Content)
		}).then((res)=>{
			uni.hideLoading()
			if(res.data.code==1){
				counter.allOrderData=res.data.data.orderInfo
				counter.setMoney('Dele',max_minValue.money)
				proxy.$refs.orderPopup.open()
			}else{
				uni.showToast({
					title:res.data.data,
					icon:'error'
				})
			}
		})
	}
	const max_minValue=reactive({
		'max':0,
		'min':0,
		'money':0,
		'note':0,
	})
	const pageShow=ref(1)
	const max_min=(e,money,show,note,dataList)=>{
		max_minValue.money=money
		max_minValue.min=e[0]
		max_minValue.max=e[1]
		max_minValue.note=note
		counter.BettingContent.remarks.bonusmax=(max_minValue.max/counter.BettingContent.remarks.Multiple)
		counter.BettingContent.remarks.bonusmin=(max_minValue.min/counter.BettingContent.remarks.Multiple)
		counter.BettingContent.bonusOptimize=dataList
	}
	const page=(e)=>{
		pageShow.value=e
	}
	
	const repetitionData=ref([])//处理完成后的数据
	onBeforeMount(()=>{
		var Xarr=[]
		for(var u=0;u<counter.BettingContent.remarks.reachType.length;u++){
			//根据用户选了几个过关方式来执行多次组合方法并合并在Xarr里
			var NumberLabel=counter.BettingContent.remarks.reachType[u]
			if(NumberLabel=='1单关1'){
				var newNumber='1'
			}else{
				var newNumber=NumberLabel.split('串')[0]
			}
			Xarr.push(initNewArr(counter.BettingContent.Content,Number(newNumber)))
		}
		repetitionData.value=Xarr.reduce(function (a, b) { return a.concat(b)} );//转一维数组
	})
	const initNewArr = (arr,number) => {//数组组合初处理
		var initArr=arr//初始数据
		var formattingArr=[]//拼接处理后的数据
		var label=number+'关'
		for(var i=0;i<initArr.length;i++){
			for(var p=0;p<initArr[i].data.length;p++){
					formattingArr.push(initArr[i].matchNumStr+'|'+initArr[i].homeTeamAbbName+'|'+initArr[i].awayTeamAbbName+'|'+initArr[i].data[p].res+'|'+initArr[i].data[p].rate+'|'+label+'|'+initArr[i].matchId)
			}
		}
		return	combination(formattingArr,number)
	}
	function combination(arr, m) {//数组组合
		let r = [];
		temporary([], arr, m);
		var repetition=[];
		
		for(var o=0;o<r.length;o++){
			var arr = []
			for(var p=0;p<r[o].length;p++){
				arr.push(r[o][p].substring(2,5))
			}
			if(!isRepeat(arr)){
				repetition.push(r[o])
			}
		}
		function isRepeat(ary) {
			var a=false
			for (var i = 0; i < ary.length; i++) {
				if(ary.indexOf(ary[i]) != i) {
					a = true
				}
			}
			return a
		}
		return repetition;
		function temporary(t, a, m) {
			//t:临时数组 a:目标数组 m：多少个数进行组合
			if (m === 0) {
				r[r.length] = t; //相当于push
				return;
			}
			for (let i = 0; i <= a.length - m; i++) {
				//从0开始 到n-m
				let b = t.slice(); //将t赋值给b 不能用=赋值，使用slice会形成新的数组赋值
				b.push(a[i])
				temporary(b, a.slice(i + 1), m - 1);
			}
		}
	}
	const back = () =>{
		uni.navigateBack()
		counter.BettingContent.bonusOptimize=undefined
	}
	
</script>

<style>
	body{
		background-color: #fcfcfc;
	}
	
	.status_bar {
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
	}
	
	/* 导航 */
	.navigation{
		width: 100%;
		height: 90rpx;
		z-index: 9999;
		background-color: white;
		box-shadow: 0 5rpx 15rpx #f7f7f7;
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	 /* 底部导航 */
	.submit {
		width: 100%;
		height: 175rpx;
		bottom: 0;
		position: fixed;
		}
		.submit-bottom {
			width: 100%;
			height: 115rpx;
			display: flex;
			background-color: #fff;
			align-items: center;
			justify-content: space-between;
		}
		.submit-bottom view text {
			font-size: 30rpx;
		}
		.bottom-button {
			border-radius: 20rpx;
			display: flex;
		}
		.bottom-button02 {
			width: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
		}
</style>