<template>
	<view class="status_bar"></view>
	<uni-nav-bar title="提现" leftIcon="back" @clickLeft="back" rightText="提现记录" @clickRight="record" leftText="返回" />
	<view class="drawMoneyCard">
		<scroll-view scroll-x="true" class="navigation">
			<view style="display: flex;">
				<view v-for="itme,index in tita" :key="index" @click="dianji_qiehuan(index)" style="margin: auto;">
					<view class="box" :style="index==daohang_value?'color:#FDC830;':''">{{itme}}</view>
				</view>
				<view class="xiabiao" :style="daohang_value==1 ? 'left:465rpx;' : false">
				</view>
			</view>
		</scroll-view>
		<!-- 内容 -->
		<swiper @change="onChangeTab" :current="daohang_value" :style="{height:600+'rpx'}" 
				easing-function="linear" duration="300">
			<swiper-item><!-- 内容1 -->
				<view class="addPay" @click="clickAdd">
					<view style="display: flex;align-items: center;" v-if="popupInpuValue==''">
						<uni-icons type="plus-filled" size="90rpx" color="#FDC830" />
						<text style="margin:0rpx 10rpx;">添加支付宝</text>
					</view>
					<view style="display: flex;align-items: center;" v-else>
						<image src="@/static/img/mimeImg/zfb.png" style="width:100rpx;height:100rpx;" />
						<text style="margin:0rpx 10rpx;">{{popupInpuValue}}</text>
					</view>
					<uni-icons type="forward" size="45rpx"/>
				</view>
				<view style="font-size:26rpx;color: red;">
					<uni-icons type="info-filled" color="red"></uni-icons>
					<text>请核对好账号是否正确，输入错误会导致提现无法到账</text>
				</view>
				<view style="margin:40rpx 0rpx;">
					<text style="margin-bottom:10rpx;">提现金额：</text>
					<uni-easyinput 
						prefixIcon="checkmarkempty" 
						:placeholder="'可提现金额: '+maxMoneyValue+'元'" 
						type="Number" 
						@blur="valueSet"
						v-model="inputValue"
					/>
					<uni-icons type="help-filled" color="red"></uni-icons>
					<text style="color: red;font-size:26rpx;">每日只能提现三次</text>
				</view>
				<view class="buttomStyle" @click="confirm">提交</view>
			</swiper-item>
			
			<swiper-item><!-- 内容2 -->
				<view class="addPay" @click="clickAdd">
					<view style="display: flex;align-items: center;" v-if="popupInpuValue==''">
						<uni-icons type="plus-filled" size="90rpx" color="#FDC830" />
						<text style="margin:0rpx 10rpx;">添加银行卡号码</text>
					</view>
					<view style="display: flex;align-items: center;" v-else>
						<image src="@/static/icon/mide/yhk_03.png" style="width:100rpx;height:100rpx;" />
						<text style="margin:0rpx 10rpx;">{{popupInpuValue}}</text>
					</view>
					<uni-icons type="forward" size="45rpx"/>
				</view>
				<view style="font-size:26rpx;color: red;">
					<uni-icons type="info-filled" color="red"></uni-icons>
					<text>请核对好账号是否正确，输入错误会导致提现无法到账</text>
				</view>
				<view style="margin:40rpx 0rpx;">
					<text style="margin-bottom:10rpx;">提现金额：</text>
					<uni-easyinput
						prefixIcon="checkmarkempty" 
						:placeholder="'可提现金额: '+maxMoneyValue+'元'" 
						type="Number" 
						@blur="valueSet"
						v-model="inputValue"
					/>
					<uni-icons type="help-filled" color="red"></uni-icons>
					<text style="color: red;font-size:26rpx;">每日只能提现三次</text>
				</view>
				<view class="buttomStyle" @click="confirm">提交</view>
			</swiper-item>
		</swiper>
	</view>
	<uni-popup ref="addAccount" type="center">
		<uni-popup-dialog 
			mode="input" 
			:title="daohang_value==0?'请输入支付宝账号':'请输入银行卡号码'"
			placeholder="请输入纯数字账号"
			@confirm="confirmAddAccount"
			:value="popupInpuValue"
			>
		</uni-popup-dialog>
	</uni-popup>
</template>

<script setup>
	import {useCounterStore} from '@/stores/counter'
	import common from "@/common/common.js"
	import api from "@/common/vmeitime-http/mine/mine.js"
	import {ref,onBeforeMount,reactive,getCurrentInstance,defineProps} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const daohang_value = ref(0)//swiper页面默认值
	const maxMoneyValue=ref()//最大提现金额
	const inputValue=ref('')//提现金额输入框的值
	const popupInpuValue=ref('')//用户输入收款账号的值
	const Props=defineProps(['shop_id','shop_money'])
	const dianji_qiehuan = (index) => { //点击切换导航
		if (daohang_value != index) {daohang_value.value = index}
	}
	onBeforeMount(()=>{
		maxMoneyValue.value=counter.shopBasicsData.money
		if(Props.shop_id!=undefined){//判断是否为合作店铺提现
			maxMoneyValue.value=Number(Props.shop_money)
		}
	})
	const back=()=>{//返回
		uni.navigateBack()
	}
	const onChangeTab = (e) => { //滑动导航栏跟随
		//由于两个输入框公用一个来存储所以选择切换时清空
		inputValue.value=''
		popupInpuValue.value=''
		dianji_qiehuan(e.detail.current)
	}
	const record=()=>{//跳转至提现历史记录页面
		uni.navigateTo({
			url:'/pages/mimeSupPage/balancePage/drawMoney/drawMoneyRecord'
		})
	}
	const clickAdd=()=>{//点击添加账号按钮
		proxy.$refs.addAccount.open()
	}
	const valueSet=()=>{//判断输入框的值是否大于可提现金额
		inputValue.value=Number(inputValue.value)
		if(inputValue.value>maxMoneyValue.value){inputValue.value=maxMoneyValue.value}
	}
	const confirmAddAccount=(value)=>{//添加账号后确定
		if(!isNaN(Number(value))){//判断用户输入的是否为数字
			popupInpuValue.value=value
		}else{
			uni.showToast({title:'仅支持数字！',icon:'error'})
		}
		
	}
	const confirm=()=>{//提交
		if(popupInpuValue.value==''){
			uni.showToast({title:'请输入提现账号',icon:'error'})	
			return
		}
		if(inputValue.value==''|| inputValue.value<1){
			uni.showToast({title:'提现金额不能为空，且金额必须大于1元',icon:'none'})
			return
		}
		uni.showLoading({title:'申请中~',mask:true})
		if(inputValue.value<=maxMoneyValue.value){//判断输入值是否合法
			if(Props.shop_id!=undefined){//判断是否为合作店铺提现
				api.PostWithdrawal({
					"shop_id":Props.shop_id,
					"type":daohang_value.value+1,
					"contact":counter.shopBasicsData.mobile?counter.shopBasicsData.mobile:counter.shopBasicsData.email,
					"number":popupInpuValue.value,
					"money":inputValue.value
				}).then((res)=>{
					uni.hideLoading()
					uni.showToast({
						title:res.data.data,
						icon:res.data.msg
					})
				})
			}else{
				api.PostShopWithdrawal({
					"type":daohang_value.value+1,
					"contact":counter.shopBasicsData.mobile?counter.shopBasicsData.mobile:counter.shopBasicsData.email,
					"number":popupInpuValue.value,
					"money":inputValue.value
				}).then((res)=>{
					uni.hideLoading()
					uni.showToast({
						title:res.data.data,
						icon:res.data.msg
					})
				})
			}
		}
	}
	
	const tita = reactive(['支付宝提现', '银行卡提现']) //分段器title数据
</script>

<style>
	.buttomStyle{
		width:100%;
		height:80rpx;
		background-color:#FDC830;
		border-radius:15rpx;
		text-align: center;
		line-height:80rpx;
		color: white;
	}
	.addPay{
		width:100%;
		height:90rpx;
		margin:20rpx auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom:1rpx solid #f1f1f1;
		border-top:1rpx solid #f1f1f1;
	}
	.xiabiao {
		position: absolute;
		width: 90rpx;
		height: 7rpx;
		background-color: #FDC830;
		/* z-index: -1; */
		border-radius: 50rpx;
		top: 73rpx;
		left: 125rpx;
		transition: .3s;
	}
	.box {
		width: 186rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		transition: .3s;
	}
	.navigation {
		width: 100%;
		height: 80rpx;
		background-color: #fff;
	}
	.drawMoneyCard{
		width:680rpx;
		padding:20rpx;
		border-radius: 15rpx;
		background-color:white;
		margin:20rpx auto;
	}
	body {
		background-color: #f3f3f3;
	}
	.status_bar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}
</style>
