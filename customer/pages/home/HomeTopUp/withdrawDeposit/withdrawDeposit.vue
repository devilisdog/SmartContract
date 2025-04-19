<template>
	<view class="status_bar"></view>
	<!-- 导航 -->
	<view class="navigation">
		<uni-icons type="back" @click="back()" size="21" style='position: absolute;left: 30rpx;'></uni-icons>
		<text style="color: #484848;font-size: 36rpx;font-weight: bold;">提现</text>
		<text style="position: absolute;right: 30rpx;color: #3b3b3b;font-size: 30rpx;" @click="skip()">提现记录</text>
	</view>
	<view style="height: 130rpx;"></view>
	
	<!-- 内容 -->
	<view class="bodyc">
		<scroll-view class="daohang" scroll-x="true">
			<view class="daohang02">
				<view style="width:50%;height: 90rpx;" @click="tabClick(0)">
					<text style="font-size: 30rpx;" :style="tabIndex == 0 ? 'color:#ffa480;' : 'color: #666666;'">提现到支付宝</text>
				</view>
				<view style="width:50%;height: 90rpx;" @click="tabClick(1)">
					<text style="font-size: 30rpx;" :style="tabIndex == 1 ? 'color:#ffa480;' : 'color: #666666;'">提现到银行卡</text>
				</view>
				<view class="Slider" :style="tabIndex == 1 ? 'left: 69.5%;':false"></view>
			</view>
		</scroll-view>
		<!-- 支付宝 -->
		<swiper @change="onChangeTab" :current="current" style="transition: all 0.5s;height: 930rpx;">
			<swiper-item style="display: flex;display: flex;flex-direction: column;align-items: center;">
				<view class="card" @click="proxy.$refs.payNumber.open()">
					<view style="display: flex;align-items: center;" v-if="userSelectData!=null">
						<image src="@/static/img/home/aliPay.png" style="height:80rpx;width:80rpx;"></image>
						<view>
							<text style="margin-left: 10rpx;color: #5a5a5a;font-size: 32rpx;">{{userSelectData.name}}</text><br>
							<text style="margin-left: 10rpx;color: #5a5a5a;font-size: 32rpx;">{{userSelectData.number}}</text>
						</view>
						<uni-icons type="right" style='position: absolute;right: 30rpx;'></uni-icons>
					</view>
					<view style="display: flex;align-items: center;" v-else>
						<image src="@/static/img/home/add.png" style="height:80rpx;width:80rpx;"></image>
						<text style="margin-left: 10rpx;color: #5a5a5a;font-size: 32rpx;">添加支付宝账号</text>
						<uni-icons type="right" style='position: absolute;right: 30rpx;'></uni-icons>
					</view>
				</view>
				<view style="display: flex;flex-direction: column;justify-content: center;width: 670rpx;margin: 10rpx 0;">
					<text style="padding: 20rpx 0;font-size: 32rpx;color: #474747;margin-left: 20rpx;">提现金额</text>
					<view style="width: 630rpx;margin-left: 40rpx;">
						<uni-easyinput 
							:placeholder="'可提现金额 '+normalMoney+'元'"
							v-model='easyinputVal'
							type="digit"
							maxlength="9"
							prefixIcon="wallet" 
							:inputBorder="false" 
							placeholderStyle='font-size:28rpx;'
							@blur="moneySet"
							>
						</uni-easyinput>
					</view>
					<view style="padding: 20rpx 0;display: flex;justify-content: space-between;">
						<text style="color: #343434;font-size: 30rpx;">有 {{not_withdraw}}元 不可提现</text>
						<text style="color: #ff7979;font-size: 30rpx;" @click="proxy.$refs.popupText.open()">查看原因</text>
					</view>
				</view>
				
				<view class="TopUpButton" @click="tijiao(1)"
					:style="easyinputVal==''||userSelectData===null?'pointer-events:none;':false">
					<view :style="easyinputVal==''||userSelectData===null?'opacity:0.4;':'opacity:0;'"
						style=" width: 670rpx;height: 82rpx;position: absolute;background-color: #f0f0f0;border-radius:25rpx;transition: all 0.5s;">
					</view>
					<text style="color: #fff;font-size: 30rpx;">提现</text>
				</view>
				<texts></texts>
			</swiper-item>
			<!-- 银行卡 -->
			<swiper-item style="display: flex;display: flex;flex-direction: column;align-items: center;">
				<view class="card" @click="proxy.$refs.payNumber.open()">
					<view style="display: flex;align-items: center;" v-if="userSelectData!=null">
						<image src="@/static/img/home/yh.png" style="height:80rpx;width:80rpx;"></image>
						<view>
							<text style="margin-left: 10rpx;color: #5a5a5a;font-size: 32rpx;">{{userSelectData.name}}</text><br>
							<text style="margin-left: 10rpx;color: #5a5a5a;font-size: 32rpx;">{{userSelectData.number}}</text>
						</view>
						<uni-icons type="right" style='position: absolute;right: 30rpx;'></uni-icons>
					</view>
					<view style="display: flex;align-items: center;" v-else>
						<image src="@/static/img/home/add.png" style="height:80rpx;width:80rpx;"></image>
						<text style="margin-left: 10rpx;color: #5a5a5a;font-size: 32rpx;">添加提现银行</text>
						<uni-icons type="right" style='position: absolute;right: 30rpx;'></uni-icons>
					</view>
				</view>
				<view style="display: flex;flex-direction: column;justify-content: center;width: 670rpx;margin: 10rpx 0;">
					<text style="padding: 20rpx 0;font-size: 32rpx;color: #474747;margin-left: 20rpx;">提现金额</text>
					<view style="width: 630rpx;margin-left: 40rpx;">
						<uni-easyinput 
							:placeholder="'可提现金额 '+normalMoney+'元'"
							v-model='easyinputVal02'
							type="digit"
							maxlength="9"
							prefixIcon="wallet" 
							:inputBorder="false" 
							placeholderStyle='font-size:28rpx;'
							@blur="moneySet"
							>
						</uni-easyinput>
					</view> 
					<view style="padding: 20rpx 0;display: flex;justify-content: space-between;">
						<text style="color: #343434;font-size: 30rpx;">有 {{not_withdraw}}元 不可提现</text>
						<text style="color: #ff7979;font-size: 30rpx;" @click="proxy.$refs.popupText.open()">查看原因</text>
					</view>
				</view>
				<view class="TopUpButton" @click="tijiao(2)" style="z-index: 9999;"
					:style="easyinputVal02==''?'pointer-events: none;':false">
					<view :style="easyinputVal02==''?'opacity:0.4;':'opacity:0;'"
						style=" width: 670rpx;height: 82rpx;position: absolute;background-color: #f0f0f0;border-radius:25rpx;transition: all 0.5s;">
					</view>
					<text style="color: #fff;font-size: 30rpx;">提现</text>
				</view>
				<texts></texts>
			</swiper-item>
		</swiper>
	</view>
	<uni-popup ref="popupText" type="center">
		<view style="width: 550rpx;height: 700rpx;background-color: white;border-radius: 25rpx;display: flex;flex-direction: column;">
			<view style="width: 550rpx;height: 100rpx;display: flex;align-items: center;justify-content: center;">
				<text>温馨提示</text>
			</view>
			<view class="popupTxte" >
				<text>1、为防止套现和洗钱，充值、赠送的金额不能直接提现，您可用于投注。仅中奖奖金可提现。(如充值金额需要提现，可与店主协商处理)</text>
				<text>2、本平台为店主的数字化管理工具，提现需要店主手动打款，用户资金是由店主托管和监管，如出现资金问题请及时联系店主处理与平台无关</text>
				<text>3、如有联系不上店主需要帮助的，请在首页右上角点击投诉并描述具体情况和诉求,平台客服会协助您处理</text>
				<text>4、投注使用金额也会优先使用不可提现金额喔~</text>
			</view>
			<view style="width: 100%;height: 90rpx;border-top: 1rpx solid #f0f0f0;margin-top: 20rpx;display: flex;align-items: center;justify-content: center;" @click="proxy.$refs.popupText.close()">
				<text style="color:#ff7979 ;">知道了</text>
			</view>
		</view>
	</uni-popup>

	<uni-popup ref="payNumber" type="center" :mask-click="false">
		<view class="payRecord_card">
			<view class="card_title">
				<text style="font-size:38rpx;">提现账号选择</text>
			</view>
			<view class="card_title" style="text-align: left;">
				<text style="font-size:32rpx;">新增提现账号:</text>
			</view>
			<view class="froms_card" style="border-bottom:1rpx solid #d9d9d9;">
				<text style="color: #9c9c9c;font-size:26rpx;">
					真实姓名{{tabIndex==0?'(支付宝绑定时的姓名)：':'(银行卡绑定时的姓名)：'}}
				</text>
				<input style="margin:10rpx 0;" v-model="counter.sfz_name" />
			</view>
			<view class="froms_card" style="border-bottom:1rpx solid #d9d9d9;margin:20rpx 0;">
				<text style="color: #9c9c9c;font-size:26rpx;">
					{{tabIndex==0?'支付宝账号：':'银行卡账号：'}}
				</text>
				<input style="margin:10rpx 0;" v-model="alipay_numebr" type="number"/>
			</view>
			<view class="buttom_card">
				<view class="buttomStyle" style="flex:1.2;background-color: #ff7979;" @click="addPayNumber">新增账号</view>
			</view>
			<view class="card_title" style="text-align: left;margin-top:20rpx;">
				<text style="font-size:32rpx;">选择提现账号:</text>
			</view>
			<scroll-view scroll-y="true" style="max-height:500rpx;padding:20rpx 0;text-align: center;">
				<uni-swipe-action>
					<uni-swipe-action-item v-for="itme,index in StorageData[selectStr]" 
						:right-options='right_buttom' @click="deleteData(index)">
						<view class="account_card" @click="clickSelect(index)">
							<image src="@/static/img/home/aliPay.png" style="height:80rpx;width:80rpx;" v-show="tabIndex==0"/>
							<image src="@/static/img/home/yh.png" style="height:80rpx;width:80rpx;" v-show="tabIndex==1"/>
							<view style="display: flex;justify-content: space-between;flex:1;align-items: center;">
								<view>
									<text>{{itme.name}}</text><br>
									<text>{{itme.number}}</text>
								</view>
								<view class="select_style">
									<view class="select" v-show="selectPayNumber===index"></view>
								</view>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
				<image src="@/static/img/follow/none.png" style="width:220rpx;height:220rpx;" 
					v-show="StorageData[selectStr].length==0">
				</image>
			</scroll-view>
			<view class="buttom_card">
				<view class="buttomStyle" style="flex:0.8;margin-right:10rpx;" @click="proxy.$refs.payNumber.close()">取消</view>
				<view class="buttomStyle" style="flex:1.2;background-color: #ff7979;"  @click="userSelect(selectPayNumber)">
					确定
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import texts from '@/components/home/yc-HomeTopUp-withdrawDeposit-Text/yc-HomeTopUp-withdrawDeposit-Text.vue'
	import api from '@/common/vmeitime-http/'
	import common from "@/common/common.js"
	import { useCounterStore } from '@/stores/counter'
	import {onBeforeMount,ref,reactive,getCurrentInstance,} from 'vue'
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const alipay_name=ref('')
	const alipay_numebr=ref('')
	//导航栏
	const current=ref(0)//滑动块默认值
	const tabIndex = ref(0)//当前滑动选中的index
	const normalMoney=ref(0)//可提现金额
	const not_withdraw=ref(0)//不可提现金额
	const selectStr=ref('aliPay')
	const right_buttom=ref([
		{
			text:'删除',
			style:{
				backgroundColor:'#ff7979'
			}
		}
	])
	onBeforeMount(()=>{
		
		getNewUserMoney()
		if(uni.getStorageSync('payData')==''){//初始化时检测本地是否有提现账号数据，没有就创建
			var withdrawMoney={
				aliPay:[],
				bankCard:[]
			}
			uni.setStorageSync('payData',withdrawMoney)
		}
		StorageData.value=uni.getStorageSync('payData')
		if(uni.getStorageSync('payData').aliPay.length>0){
			userSelectData.value=uni.getStorageSync('payData').aliPay[0]
			selectPayNumber.value=0
		}
	})
	const StorageData=ref()
	const selectPayNumber=ref(0)//popup选择的账号的index
	
	const userSelectData=ref(null)//当前用户选择的提现账号
	const Errorfc=()=>{//警告提示
		uni.showToast({
			title:'未开放此功能',
			position:'center',
			icon:'error'
		})
	}
	const moneySet=()=>{
		
		if(easyinputVal.value==""){
			easyinputVal.value=Number(easyinputVal.value).toFixed(2)
		}else{
			easyinputVal02.value=Number(easyinputVal.value).toFixed(2)
		}
	}
	const deleteData=(e)=>{//删除之前的账号信息
		if(tabIndex.value==0){
			StorageData.value.aliPay.splice(e,1)
			uni.setStorageSync('payData',StorageData.value)
		}else{
			StorageData.value.bankCard.splice(e,1)
			uni.setStorageSync('payData',StorageData.value)
		}
		
	}
	const addPayNumber=()=>{//新增账号
		if(alipay_numebr.value==''){
			uni.showToast({title:'请输入支付宝账号',position:'center',icon:'none'})
			return
		}
		var newPay={
			name:counter.sfz_name,
			number:alipay_numebr.value,
		}
		if(tabIndex.value==0){
			StorageData.value.aliPay.push(newPay)
			selectPayNumber.value=StorageData.value.aliPay.length-1
			uni.setStorageSync('payData',StorageData.value)
			alipay_numebr.value=''
		}else{
			StorageData.value.bankCard.push(newPay)
			selectPayNumber.value=StorageData.value.bankCard.length-1
			uni.setStorageSync('payData',StorageData.value)
			alipay_numebr.value=''
		}
	}
	const clickSelect=(index)=>{//用户点击账号卡片选择
		if(selectPayNumber.value==index){
			selectPayNumber.value=null
			return
		}
		selectPayNumber.value=index
	}
	const userSelect=(selectNumber)=>{//用户点击确定按钮
		if(selectNumber==null){
			userSelectData.value=null
		}else{
			if(tabIndex.value==0){
				userSelectData.value=StorageData.value.aliPay[selectNumber]
			}else{
				userSelectData.value=StorageData.value.bankCard[selectNumber]
			}
		}
		proxy.$refs.payNumber.close()
	}
	const getNewUserMoney=()=>{//获取用户金额构成
		uni.request({
			url:counter.baseUrl+'/api/bettingend.mine.Transaction/notWithdraw',
			header:{'server':1,'ba-user-token':counter.access_token,},
			success(res){
				normalMoney.value=res.data.data.withdraw//可提现金额
				not_withdraw.value=res.data.data.not_withdraw//不可提现金额
			}
		})
	}
	const easyinputVal = ref('')//金额输入框 值 - 支付宝
	const easyinputVal02 = ref('')//金额输入框 值 - 银行卡
	const tijiao = (e) =>{//提现按钮
		if (counter.userAllData.userinfo.RealName == 0) { //实名认证拦截
			uni.showModal({
				title: '提示',
				content: '检测的未实名认证，请认证后在进行投注',
				confirmText: '去实名',
				confirmColor: '#f04b49',
				success: function(res) {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/home/myData/myData'
						})
					}
				}
			});
			return
		}
		if(normalMoney.value<=0){
			uni.showToast({title:'无提现金额',icon:'error'})
			easyinputVal.value=''
			return
		}
		if((e==1?easyinputVal.value:easyinputVal02.value)<1){
			// console.log('01',easyinputVal.value,'02',easyinputVal02.value);
			uni.showToast({title:'提现金额不得小于1元'+e,icon:'none',position:'center'})
			easyinputVal.value=''
			return
		}
		uni.showLoading({title:'提交中~',mask:true})
		var userNumber=counter.userAllData.userinfo.mobile==''?counter.userAllData.userinfo.email:counter.userAllData.userinfo.mobile
		api.Withdrawal({
			'type':e,
			'contact':userNumber,
			'number':userSelectData.value.number,
			'money':e==1?easyinputVal.value:easyinputVal02.value,
		}).then((res)=>{
			uni.hideLoading()
			if(res.data.code==1){
				uni.showToast({
					title: '提现申请成功',
					duration: 2000,
					icon:'none',
					position:'center',
				});
				setTimeout(()=>{
					uni.showToast({
						title:'等待店主同意~',
						position:'center',
						icon:'none'
					})
				},2000)
			}else{
				uni.showToast({
					title:res.data.data,
					position:'center',
					icon:'error'
				})
			}
			easyinputVal.value=''//清空支付宝输入框值
			easyinputVal02.value=''//清空银行卡输入框值
			getNewUserMoney()
		})
	}
	
	
	const skip = () =>{//提现记录
		uni.navigateTo({
			url: '/pages/home/HomeTopUp/withdrawDeposit/record/record',
			animationType: 'slide-in-right',
			animationDuration: 200
		})
	}
	const tabClick =(e)=>{//点击切换滑动块
		if(tabIndex.value && current.value == e){
			return
		}else{
			tabIndex.value = e
			current.value = e
		}
		//切换清空输入框内容
		easyinputVal.value=''
		easyinputVal02.value=''
	}
	const onChangeTab =(e)=>{//滑动切换
		tabIndex.value = e.detail.current
		current.value = e.detail.current
		easyinputVal.value=''//清空支付宝输入框值
		easyinputVal02.value=''//清空银行卡输入框值
		userSelectData.value=null//清空当前选择账号
		if(tabIndex.value==0){
			selectStr.value='aliPay'
			if(StorageData.value.aliPay.length>0){
				userSelectData.value=StorageData.value.aliPay[0]
			}
		}else{
			selectStr.value='bankCard'
			if(StorageData.value.bankCard.length>0){
				userSelectData.value=StorageData.value.bankCard[0]
			}
		}
	}
	const back = () =>{//返回
		uni.navigateBack()
	}
</script>

<style>
	.select{
		width:20rpx;
		height:20rpx;
		background-color: #fda173;
		border-radius:50%;
	}
	.select_style{
		width:30rpx;
		height:30rpx;
		border-radius:50%;
		border:1rpx solid #c8c8c8;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.buttomStyle{
		height:80rpx;
		background-color: #bababa;
		text-align: center;
		line-height:80rpx;
		border-radius:10rpx;
		color:white;
	}
	.buttom_card{
		display: flex;
		justify-content: space-between;
	}
	.card_title{
		text-align: center;
		font-weight: bold;
		margin-bottom:20rpx;
	}
	.account_card{
		width:100%;
		padding:20rpx;
		background-color:white;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(221, 221, 221, 0.4);
		box-sizing:border-box;
		border-radius:15rpx;
		margin:20rpx 0rpx;
		display: flex;
	}
	.payRecord_card{
		width:680rpx;
		padding:20rpx;
		background-color:white;
		border-radius:15rpx;
	}
	.status_bar {
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
	}
	body{
		background-color: #f8f8f8;
	}
	/* 导航 */
	.navigation{
		width: 100%;
		height: 100rpx;
		z-index: 9999;
		background-color: white;
		box-shadow: 0 5rpx 15rpx -8rpx #ebebeb;
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	/* 滑块栏 */
	.daohang {
		transition: all 0.5s;
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
			transition: all 0.4s;
			position: absolute;
			left: 19.5%;
			top: 88%;
			width: 80rpx;
			height: 6rpx;
			border-radius: 55px; 
			background-color: #fda173;
		}
	
	/* 内容 */
	.bodyc{
		width: 720rpx;
		height: 100%;
		border-radius: 25rpx;
		background-color: white;
		margin: 0 auto;
		}.card{
			width: 680rpx;
			height: 120rpx;
			display: flex;
			align-items: center;
			border-bottom: 3rpx solid #f8f8f8;
		}
		
	/* 充值按钮 */
	.TopUpButton{
		width: 670rpx;
		height: 80rpx;
		margin:0rpx auto;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 25rpx;
		background: linear-gradient(45deg, #ffad92, #ff7979 );
	}
	
	.popupTxte{
		display: flex;
		flex-direction: column;
		width: 480rpx;
		align-items: center;
		justify-content: center;
		margin: 0 auto;color: #717171;
		}.popupTxte text{
			line-height: 45rpx;
		}
</style>
