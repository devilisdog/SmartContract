<template>
	<view class="status_bar"></view>
	<uni-nav-bar title="充值" leftIcon="back" @clickLeft="back" leftText="返回"/>
	<view class="topYue" @click="setRefill(0)">
		<view style="display: flex;align-items: center;">
			<text>店铺余额：</text>
			<text style="color: red;font-weight:bold;">
				{{counter.shopBasicsData.money}}
			</text>
			<uni-icons type="refresh-filled" size="42rpx" color="#FDC830" @click="getNewMoney('click')"></uni-icons>
		</view>
		<view style="display: flex;align-items: center;">
			<text style="color:#878787;font-size:26rpx;margin-right:10rpx;">本店铺充值</text>
			<view :class="RechargeMode==0?'clickSelect':'select'">
				<text style="color: white;" v-show='RechargeMode==0'>√</text>
			</view>
		</view>
	</view>
	<view class="topYue" @click="setRefill(1)">
		<view style="display: flex;align-items: center;">
			<text>合作店铺余额：</text>
			<text style="color: red;font-weight:bold;">
				{{clickShopData.length==0?'未选择合作店铺':clickShopData[0].CooperativeStoresMoney}}
			</text>
		</view>
		<view style="display: flex;align-items: center;">
			<text style="color:#878787;font-size:26rpx;margin-right:10rpx;">合作店铺充值</text>
			<view :class="RechargeMode==1?'clickSelect':'select'">
				<text style="color: white;" v-show='RechargeMode==1'>√</text>
			</view>
		</view>
	</view>
	<view class="middleCard">
		<text>快速选择充值金额:</text>
		<view class="buttonBox">
			<view 
				class="middleButton" 
				v-for="itme,index in clickData" 
				@click="clickButton(itme,index)"
				:style="clickButtonMoney==itme?'border:5rpx solid #ffaa00;color:#ffaa00;font-weight: bold;':''">
				￥{{itme}}
			</view>
		</view>
		<text>自定义充值金额:</text>
		<view style="margin-top:20rpx;">
			<uni-easyinput v-model="clickButtonMoney" placeholder="请输入内容" type="number" @blur="legalValue"/>
		</view>
	</view>
	<view class="bottomCard">
		<text>支付方式：</text>
		<view style="margin-top:20rpx;"  class="payButton">
			<view style="display: flex;align-items:center;" @click="selectClick(0)">
				<image src="@/static/img/mimeImg/zfb.png" style="width:70rpx;height:70rpx;"></image>
				<text>支付宝</text>
			</view>
			<view :class="selectValue==0?'clickSelect':'select'">
				<text style="color: white;" v-show='selectValue==0'>√</text>
			</view>
		</view>
		
		<!-- <view style="border-top:1rpx solid #dfdfdf;"></view>
		<view style="margin-top:20rpx;"  class="payButton" @click="selectClick(1)">
			<view style="display: flex;align-items:center;">
				<image src="@/static/img/mimeImg/zfb.png" style="width:70rpx;height:70rpx;"></image>
				<text>支付宝</text>
			</view>
			<view :class="selectValue==1?'clickSelect':'select'">
				<text style="color: white;" v-show='selectValue==1'>√</text>
			</view>
		</view> -->
		
		<!-- <view style="border-top:1rpx solid #dfdfdf;"></view>
		<view style="margin-top:20rpx;" @click="selectClick(1)" class="payButton">
			<view style="display: flex;align-items:center;">
				<image src="@/static/icon/mide/yhk_02.png" style="width:70rpx;height:70rpx;"></image>
				<text>银行卡</text>
			</view>
			<view :class="selectValue==1?'clickSelect':'select'">
				<text style="color: white;" v-show='selectValue==1'>√</text>
			</view>
		</view> -->
	</view>
	<view style="width:700rpx;margin:40rpx auto;">
		<view class="buttomStyle" @click="submit">立即充值</view>
	</view>
	<view class="alipaysubmit" ref="alipay" v-html="formContent"></view><!-- h5支付 -->
	<uni-popup type="bottom" ref="shopList" :maskClick="false">
		<view class="bottomPopupCard">
			<z-paging ref="popupList" v-model="shopData" @query='getShopData' :auto='!shopDataBoole'>
				<template v-slot:top>
					<view class="popupTop">
						<text @click="closePopup">完成</text>
					</view>
				</template>
				<view class="timePupopCard" v-for="itme,index in shopData" @click="clickShop(itme,index)">
					<image style="width:90rpx;height:90rpx;margin-right:20rpx;" :src="itme.mainStore.avatar" />
					<view style="display: flex;justify-content: space-between;flex:1;align-items: center;">
						<view style="display: flex;flex-flow: column;justify-content: space-between;">
							<text>{{itme.mainStore.nickname}}({{'id:'+itme.mainStore.id}})</text>
							<text style="color:red;">余额：{{itme.CooperativeStoresMoney}}元</text>
						</view>
						<view>
							<view :class="shopElect==index?'clickSelect':'select'">
								<text style="color: white;" v-show='shopElect==index'>√</text>
							</view>
						</view>
					</view>
				</view>
			</z-paging>
		</view>
	</uni-popup>
</template>

<script setup>
	import api from "@/common/vmeitime-http/mine/mine.js"
	import {onShow,onBackPress} from '@dcloudio/uni-app';
	import {ref,onBeforeMount,reactive,getCurrentInstance,defineProps,nextTick} from 'vue';
	import {useCounterStore} from '@/stores/counter'
	const {proxy,ctx} = getCurrentInstance()
	const Props=defineProps([
		'transferShopData',//是否是店铺充值
	])
	const counter = useCounterStore(); //状态管理
	const clickData=reactive([11.00,52.00,101.00,202.00,501.00,1001.00])
	const clickButtonMoney=ref(11.00)//金额输入框默认值（也是输入后的值）
	const formContent=ref(null)//支付宝网页支付渲染
	const shopData=ref([])//全部店铺数据
	const shopElect=ref(null)//用户店铺的index
	const clickShopData=ref([])//用户选择店铺的数据
	const shopDataBoole=ref(false)//判断是否加载过店铺列表(避免重复访问)
	const payHide=ref(false)//是否是因支付离开页面
	onBeforeMount(()=>{
		if(Props.transferShopData!=undefined){//判断是否是合作店铺页面跳转至此
			clickShopData.value.push(JSON.parse(Props.transferShopData))
			RechargeMode.value=1
		}
	})
	// #ifdef H5
	onShow(()=>{
		if(payHide.value){
			getNewMoney()
		}
	})
	// #endif
	
	onBackPress(()=>{
		getNewMoney()
	})
	const legalValue=()=>{//判断金额输入框值是否合法
		clickButtonMoney.value=Number(clickButtonMoney.value).toFixed(2)
	}
	const submit=()=>{//提交
		uni.showLoading({title:'充值中~'})
		if(RechargeMode.value==0){//本地店铺充值
			if(selectValue.value == 0){
				leshuapay()
				return
			}
			if(selectValue.value == 1){
				var payType=1//1==APP支付/2==web支付
				// #ifdef H5
				payType=2
				// #endif
				api.PostShopRecharge({"type":payType,"money":clickButtonMoney.value}).then((res)=>{
					uni.hideLoading()
					if(res.data.code==1){
						payHide.value=true
						// #ifdef APP-PLUS
						uni.requestPayment({
							provider: 'alipay',//服务提供商 通过uni.getProvider获取
							orderInfo: res.data.data.body, 	//后台返回的订单数据
							success(data) {//调用成功的回调
								msg.value=data
								uni.showToast({
									title:'支付成功',
									icon:"none",
									position:"center"
								})
								counter.shopBasicsData.money+=Number(clickButtonMoney.value)
							},
							//调用失败的回调
							fail(err) {
								uni.showToast({
									title:'支付失败',
									icon:"none",
									position:"center"
								})
								msg.value=err
							},
						})
						// #endif
						
						// #ifdef H5
							formContent.value=res.data.data,
							nextTick(()=>{
								document.forms['alipaysubmit'].submit()
							})
						// #endif
					}else{
						uni.showToast({
							title:'生成失败，请稍后再试~',
							position:'center',
							icon:"error"
						})
					}
				})
			}
			
		}else{//合作店铺充值
			api.PostRecharge({
				"shop_id":clickShopData.value[0].mainStore.id,
				"money":clickButtonMoney.value,
				"type":selectValue.value+1
			}).then((res)=>{
				uni.hideLoading()
				if(res.data.code==1){
					uni.showToast({title:'充值成功~'})
					clickShopData.value[0].CooperativeStoresMoney=Number(clickButtonMoney.value)+Number(clickShopData.value[0].CooperativeStoresMoney)
				}else{
					uni.showToast({
						title:'充值失败~',
						icon:"error"
					})
				}
			})
		}
	}
	const getNewMoney=(type)=>{
		uni.request({
			url:counter.baseUrl+'/api/shopkeeper.mine.Balance/RechargeRefresh',
			header:{'server':'1','ba-user-token':counter.access_token},
			success(res){
				if(res.data.code==1){
					payHide.value=false
					if(type=='click'){
						uni.showToast({
							title:'更新成功',
							icon:"none",
							position:'center'
						})	
					}
					counter.shopBasicsData.money=res.data.data
				}else{
					uni.showToast({
						title:'更新失败~',
						icon:"none",
						position:'center'
					})
				}
			},
			fail(err){
				uni.showToast({
					title:'获取余额失败~',
					position:'center',
					icon:"error"
				})
			}
		})
	}
	const clickButton=(itme,index)=>{//点击快速选择充值金额按钮
		clickButtonMoney.value=Number(itme).toFixed(2)
	}
	const closePopup=()=>{//合作店铺弹窗控制
		proxy.$refs.shopList.close()
		if(clickShopData.value.length!=0){
			RechargeMode.value=1
		}else{
			RechargeMode.value=0
		}
	}
	const clickShop=(data,index)=>{//选择充值店铺
		clickShopData.value.length=0//每次点击清空里面的数据
		if(shopElect.value!=index){
			shopElect.value=index
			clickShopData.value.push(data)
		}else{
			shopElect.value=null
		}
	}
	const getShopData=()=>{//获取合作店铺
		api.GetIssueShop({"search":'',}).then(res=>{
			proxy.$refs.popupList.complete(res.data.data)
			shopDataBoole.value=true
		})
	}

	const RechargeMode=ref(0)//充值模式选择默认值(0本店铺充值/1合作店铺充值)
	const setRefill=(e)=>{
		if(e==1){
			proxy.$refs.shopList.open()
		}else{
			RechargeMode.value=e
		}
	}
	const selectValue=ref(0)//支付方式选择的index默认是0
	const selectClick=(e)=>{
		selectValue.value = e
	}
	
	
	const msg=ref('初始化')
	
	const back=()=>{//返回
		uni.navigateBack()
	}
	
	const leshuapay =()=>{
		api.LshuaShopPay({
			'money': Number(clickButtonMoney.value).toFixed(2)
		}).then(res => {
			uni.hideLoading()
			if (res.data.code == 1) {
				// console.log(res.data.data.return_url[0]);
				
				let openURL = "alipays://platformapi/startapp?appId=20000067&url=" + encodeURIComponent(res.data.data.return_url[0]);
				// #ifdef H5
				// window.location.href =  res.data.data.return_url[0]//浏览器打开链接				
				window.location.href = openURL
				// #endif
				// #ifdef APP-PLUS
				plus.runtime.openURL(openURL)
				// #endif
			} else {
				uni.showToast({
					title: res.data.data,
					icon: 'error'
				})
			}
		}).catch(err => {
			uni.hideLoading()
			uni.showToast({
				title: '数据处理失败，请联系平台客服',
				icon: 'none',
				position: 'center'
			})
		})
	}
	
</script>

<style>
	.timePupopCard{
		width:680rpx;
		padding:20rpx;
		border-radius:15rpx;
		background-color:white;
		margin:20rpx auto;
		display: flex;
	}
	.popupTop{
		border-bottom:1rpx solid #f3f3f3;
		padding:20rpx;
		background-color:white;
		border-radius:30rpx 30rpx 0 0;
		color: #FDC830;
	}
	.bottomPopupCard{
		width:100%;
		height:90vh;
		background-color:#f3f3f3;
		border-radius:30rpx 30rpx 0 0;
		box-sizing: border-box;
	}
	.buttomStyle{
		width:100%;
		height:80rpx;
		background-color:#FDC830;
		border-radius:15rpx;
		text-align: center;
		line-height:80rpx;
		color: white;
		margin:20rpx 0rpx;
		transition: show 0.5s;
	}
	.status_bar{
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
	.payButton{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.clickSelect{
		width:45rpx;
		height:45rpx;
		border-radius:50%;
		background-color:#ffaa00;
		transition: 0.2s;
		text-align: center;
		font-weight: bold;
		line-height:45rpx;
	}
	.select{
		width:40rpx;
		height:40rpx;
		border-radius:50%;
		border: #c3c3c3 1rpx solid;
	}
	.bottomCard{
		width:680rpx;
		padding:20rpx;
		margin:10rpx auto;
		background-color:white;
		border-radius:20rpx;
	}
	.buttonBox{
		display: grid;
		grid-template-columns:repeat(3,auto) ;
		grid-template-rows:repeat(auto,auto);
		justify-content:space-around;
		grid-gap:30rpx;
		margin:20rpx 0rpx;
	}
	.middleButton{
		transition: 0.2s;
		width:180rpx;
		height:80rpx;
		border:1rpx solid #c3c3c3;
		border-radius:20rpx;
		text-align: center;
		line-height:80rpx;
		
	}
	.middleCard{
		width:680rpx;
		padding:20rpx;
		margin:10rpx auto;
		background-color:white;
		border-radius:20rpx;
	}
	.topYue{
		background-color: white;
		width:680rpx;
		height:80rpx;
		font-size:32rpx;
		padding:20rpx;
		line-height:80rpx;
		border-radius:20rpx;
		margin:10rpx auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	body {
		background-color: #f3f3f3;
	}
</style>
