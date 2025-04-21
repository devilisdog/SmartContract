<template>
	<!-- 导航 -->
	<view class="navigation">
		<view class="status_bar"></view>
		<view style="height: 100rpx;display: flex;align-items: center;justify-content: center;">
			<uni-icons type="back" @click="back()" size="21" style='position: absolute;left: 30rpx;'></uni-icons>
			<text style="color: #484848;font-size: 36rpx;font-weight: bold;">充值</text>
			<text style="position: absolute;right: 30rpx;color: #3b3b3b;font-size: 30rpx;" @click="skip(0)">账单</text>
		</view>
	</view>
	<view style="height: var(--status-bar-height);padding-top: 100rpx"></view>
	<!-- 当前余额 -->
	<view class="balance">
		<view style="flex:1;">
			<text>当前余额：</text>
			<text
				style="font-weight: bold;	background: linear-gradient(45deg, #ffad92, #ff7979);-webkit-background-clip: text;color: transparent;">
				{{counter.user_money}}
			</text>
		</view>
		<view class="balance-button" @click="skip(1)">
			<text>去提现</text>
		</view>
	</view>
	<!-- 金额选择 -->
	<uni-card :border="false" margin='20rpx' shadow='0px 5rpx 15rpx rgba(248, 248, 248, 1)' padding="5rpx">
		<view style="padding: 20rpx 0;"><text style="color: #5e5e5e;font-size: 32rpx;">请选择充值金额</text>
		<!-- 赠送金额提示 -->
		<!-- 充值满100元 赠送6.88元   充值满200元 赠送16.66元  充值满500元 赠送 40.8元  充值1000 赠送88元  充值金额根据easyinputVal的值来判断 -->
		<view class="gift-tip">
			<view v-if="easyinputVal<100" style="color: #ffa3a3; font-weight: bold; font-size: 28rpx;">
				<text>🎁 充值送礼，多冲多送</text>
			</view>

			<view v-if="easyinputVal >= 1000" style="color: #ff4c4c; font-weight: bold; font-size: 28rpx;">
				<text>🎁 充值1000元 豪送88元 </text>
			</view>
			<view v-else-if="easyinputVal >= 500" style="color: #ff6b6b; font-weight: bold; font-size: 28rpx;">
				<text>🎁 充值满500元 赠送40.8元 </text>
			</view>
			<view v-else-if="easyinputVal >= 200" style="color: #ff8787; font-weight: bold; font-size: 28rpx;">
				<text>🎁 充值满200元 赠送16.66元 </text>
			</view>
			<view v-else-if="easyinputVal >= 100" style="color: #ffa3a3; font-weight: bold; font-size: 28rpx;">
				<text>🎁 充值满100元 赠送6.88元 </text>
			</view>
		</view></view>
		<view class="money-button">
			<view v-for="item,index in moneyButton" :key="index" @click="buttonClick(item)"
				:style="easyinputVal == item?'border: 1rpx solid #ff7979;':'border: 1rpx solid #ececec;'">
				<text :style="easyinputVal == item?'color:#ff7979;':'color:#595959;'">￥{{item}}</text>
			</view>
		</view>
		
		<view
			style="border: 3rpx solid #ececec;border-radius: 30rpx;width: 630rpx;margin: 20rpx auto;margin-left: 25rpx;padding: 10rpx 0;">
			<uni-easyinput v-model="easyinputVal" type="digit" maxlength="6" placeholder="请输入充值金额" prefixIcon="wallet"
				:inputBorder="false" placeholderStyle='font-size:28rpx;'>
			</uni-easyinput>
		</view>
	
		 
		 
	</uni-card>

	<uni-card :border="false" margin='20rpx' shadow='0px 5rpx 15rpx rgba(248, 248, 248, 1)' padding="10rpx">
		<view style="padding: 10rpx 0;"><text style="color: #5e5e5e;font-size: 30rpx;">支付方式</text></view>
		<view @click="paymentClick(index,itme.shopReceipt)" class="payCard" v-for="itme,index in payList">
			<view style="display: flex;align-items: center;">
				<image :src="counter.baseUrl+itme.icon" style="width: 75rpx;height: 75rpx;"></image>
				<text>{{itme.name}}</text>
			</view>
			<view style="display: flex;align-items: center;">
				<text :style="authorizationValue?'color: #ffdfa7;':'color: #ff4c4c;'" @click="authorization"
					v-if="itme.auth==1">
					{{authorizationValue?'已授权/点击重新授权':'去授权'}}
				</text>
				<view v-else-if="itme.id==101">
					{{bankCardPayData.data==''?'请选择支付银行卡':bankCardPayData.data.card_id}}
				</view>
				<view class="payment">
					<view style="width: 18rpx;height: 18rpx;border-radius: 55rpx;"
						:style="payment != index ? 'display:none;' : 'background-color:#ffd38b ;'"></view>
				</view>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="TopUpButton" @click="submit" :style="boolePay?'':'opacity:0.4;pointer-events:none;'">
			<text style="color: #fff;">充值</text>
		</view>

		<view style="padding: 15rpx 0;"><text style="color: #9d9d9d;font-size: 28rpx;">充值说明：</text></view>
		<view style="display: flex;flex-direction: column;">
			<text style="color: #ff4c4c;padding: 5rpx 0;">
				1.为防止恶意套现和洗钱，您在本平台的充值金额只能用于消费《充值金额无法直接提现》
			</text>
			<text style="color: #ff4c4c;padding: 5rpx 0;">2.如需要更换了支付宝账户充值，需要重新授权~</text>
			<text style="color: #ff4c4c;padding: 5rpx 0;font-weight:bold;">
				3.生成订单后请尽快支付订单，如没有直接支付可能会影响金额实时到账，电脑端支付后尽量点击已支付(如后续在支付宝内进行支付，可能会导致金额无法实时到账，后续会在24时内到账，如没有到账请即使联系客服处理)
			</text>

			<text style="color: #9d9d9d;padding: 5rpx 0;">
				4.本平台为店主的数字化管理工具，您充值的金额将直接进入店主账户，本平台不对用户资金托管和监管，如出现资金问题请及时联系店主处理与平台无关
			</text>
			<text style="color: #9d9d9d;padding: 5rpx 0;">5.如有联系不上店主需要帮助的，请在首页点击意见反馈并描述具体情况和诉求,平台客服会协助您处理</text>
			<text style="color: #9d9d9d;padding: 5rpx 0;">6.如需使用支付宝充值需点击支付宝授权后才能进行充值</text>
		</view>

		<!-- 18岁 -->
		<view class="clause">
			<view class="clause-choose" @click="checkboxClick()">
				<view style="width: 18rpx;height: 18rpx;border-radius: 55rpx;"
					:style="openCheckbox == false ? 'display:none;' : 'background-color:#ffd38b ;'"></view>
			</view>
			<text style="color: #ff4c4c ;">我已年满18周岁</text>
			<text style="margin: 0 10rpx;">已阅读并同意</text>
			<text style="color: #ff4c4c ;" @click="userAgreement">《用户协议及法律声明》</text>
		</view>
	</uni-card>

	<view style="height: 20rpx;"></view>
	<!-- 网页支付弹窗 -->
	<uni-popup ref="openPay" type="center" :mask-click="false">
		<QRAlipay paytype="zfb" @onClickButton="PcClick" :money="easyinputVal" :src="aliPaySrc"></QRAlipay>
	</uni-popup>
	
	<uni-popup ref="openyunshanPay" type="center" :mask-click="false">
		<QRAlipay paytype="ysf" @onClickButton="PcClick('ysf')" :money="easyinputVal" :src="aliPaySrc"></QRAlipay>
	</uni-popup>
	
	<uni-popup ref="openleshuawxPay" type="center" :mask-click="false">
		<QRAlipay paytype="wx" @onClickButton="PcClick('wx')" :money="easyinputVal" :src="aliPaySrc"></QRAlipay>
	</uni-popup>

	<uni-popup ref="isShowSelectBankCard" type="bottom" :maskClick="false">
		<selectBankCard @close="proxy.$refs.isShowSelectBankCard.close()" @select="affirmSelect"
			:select_value="bankCardPayData.select_index"></selectBankCard>
	</uni-popup>
	<uni-popup ref="payVerification" type="center" :maskClick="false">
		<bankCardPay :payData="bankCardPayData.data" :payMoney="easyinputVal" :payId="bankCardPay_id"
			@closePopup="closePopup"></bankCardPay>
	</uni-popup>
	<fui-dialog :show="PayDialogShow" @click="newAlipay"
		content="支付宝3.0充值跳转后需要自行填写支付金额,注意输入金额必须与收银台提示充值金额一致,否则会导致充值金额无法到账!!!,如有疑问，请联系店主!" title="注意!!!"
		:buttons="dialogButton"></fui-dialog>
		
	<fui-dialog :show="PayDialogShow2" @click="leshuayunshanPay"
		content="主扫支付渠道需要截图到对应app扫码支付,如有疑问，请联系店主!" title="注意!!!"
		:buttons="dialogButton2"></fui-dialog>
		
	<fui-dialog :show="PayDialogShow3" @click="leshuawxPay"
		content="主扫支付渠道需要截图到对应app扫码支付,如有疑问，请联系店主!" title="注意!!!"
		:buttons="dialogButton2"></fui-dialog>
</template>
<script setup>
	import bankCardPay from "@/components/home/bankCard_payVerification/bankCard_payVerification.vue"
	import QRAlipay from "@/components/home/HomeTopUP/openAlipay_QR/openAlipay_QR.vue"
	import api, { Login } from '@/common/vmeitime-http/'
	import common from "@/common/common.js"
	import {
		useCounterStore
	} from '@/stores/counter'
	import {
		onHide,
		onShow
	} from "@dcloudio/uni-app"
	import {
		onBeforeMount,
		ref,
		reactive,
		getCurrentInstance,
	} from 'vue'
	import selectBankCard from "@/components/home/select_bnakCard/select_bnakCard.vue"
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const moneyButton = reactive([11.00, 52.00, 101.00, 202.00, 501.00, 1001.00]) //快速选择充值金额按钮的value
	const dialogButton = reactive([{
		text: '取消'
	}, {
		text: '确认并复制金额',
		color: '#f04b49'
	}])
	const dialogButton2 = reactive([{
		text: '取消'
	}, {
		text: '我已知晓',
		color: '#f04b49'
	}])
	onBeforeMount(() => {
		getNewUserMoney()
		getAlipayMode()
		
		
	})
	const closePopup = () => { //银联快捷支付确认弹窗关闭
		proxy.$refs.payVerification.close()
		setTimeout(() => {
			getNewUserMoney()
		}, 2000)
	}
	const PayDialogShow = ref(false) //支付宝3.0充值提醒弹窗控制
	const PayDialogShow2 = ref(false) //截图主扫提醒弹窗控制
	const PayDialogShow3 = ref(false) //截图主扫提醒弹窗控制
	
	onShow(() => {

		if (clickAuthorizationBoole.value) {
			getUserAuthorization() //获取授权状态
		} else if (payShowValue.value) {
			getNewUserMoney() //获取支付状态
		}
		
	})
	const payList = ref([]) //支付方式arr
	const boolePay = ref(false) //充值按钮状态
	const bankCardPayData = reactive({ //用户选择银行卡后存储的信息
		'data': '',
		'select_index': null
	})
	const payment = ref(0) //获取选择的支付index
	const easyinputVal = ref(11.00) //金额输入框 值v-model
	const openCheckbox = ref(uni.getStorageSync('isAdult')) // 18岁
	const clickAuthorizationBoole = ref(false) //判断是否是点击授权所隐藏的页面
	const authorizationValue = ref(false) //是否已授权
	const aliPaySrc = ref('') //支付宝跳转链接初始值
	const payShowValue = ref(false) //是否支付页面隐藏页面
	const bankCardPay_id = ref('')
	const getAlipayMode = () => { //获取支付渠道列表
		api.payList({}).then(res => {
			if (res.data.code == 1) {
				if (res.data.data.data.length > 0) {
					payList.value = res.data.data.data
					// console.log(res.data.data);
					getUserAuthorization() //获取用户是否授权
					if (payList.value[0].id == 101) {
						payment.value == null
						boolePay.value = false //充值按钮是否可以点击控制器
					} else {
						boolePay.value = true //充值按钮是否可以点击控制器
					}
				} else {
					uni.showToast({
						title: '店主未开通充值渠道喔~',
						icon: 'none',
						position: 'center',
						duration: 2000
					})
				}
			} else {
				uni.showToast({
					title: res.data.data,
					icon: 'error',
				})
			}
		}).catch(err => {
			uni.showToast({
				title: '数据处理异常，请联系平台客服',
				icon: 'none',
				position: 'center'
			})
		})
	}
	const buttonClick = (value) => { //快速选择充值金额按钮点击事件
		if (easyinputVal.value != value) {
			easyinputVal.value = Number(value).toFixed(2)
		}
	}
	const checkboxClick = () => { //用户协议勾选
		openCheckbox.value = !openCheckbox.value
		uni.setStorageSync('isAdult', openCheckbox.value);
	}

	const affirmSelect = (bankCardData, listIndex) => { //银行卡确认选择
		proxy.$refs.isShowSelectBankCard.close()
		if (listIndex == null) {
			bankCardPayData.select_index = listIndex
			bankCardPayData.data = ''
			boolePay.value = false //禁止充值按钮点击
		} else {
			bankCardPayData.select_index = listIndex
			bankCardPayData.data = bankCardData
			boolePay.value = true //禁止充值按钮点击
		}
	}
	const newAlipay = (e) => { //支付宝3.0支付
		if (e.index == 0 || PayDialogShow.value == false) {
			return
		}
		PayDialogShow.value = false
		payShowValue.value = true
		uni.showLoading({
			title: '生成订单中~',
			mask: true
		})
		var payType = payList.value[payment.value].id == 3 ? 'alipay' : payList.value[payment.value].id == 201 ?
			'wxpay' : 'newpay'
		api.newAlipay({
			'money': Number(easyinputVal.value).toFixed(2),
			'type': payType
		}).then(res => {
			uni.hideLoading()
			if (res.data.code == 1) {
				// #ifdef H5
				window.location.href = encodeURI(res.data.data.url) //浏览器打开链接
				// #endif
				// #ifdef APP-PLUS
				plus.runtime.openURL(encodeURI(res.data.data.url), res => {
					uni.showModal({
						content: '无法打开浏览器~',
						confirmText: '复制链接',
						success: function(res) {
							if (res.confirm) {
								uni.setClipboardData({ //赋值链接
									data: String(encodeURI(res.data.data.url)),
									showToast: true
								})
							}
						}
					});
				})
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
	const paymentClick = (e) => { //支付方式选择
	console.log(e)
		if (payList.value[e].id == 101) {
			if (payment.value == e) {
				proxy.$refs.isShowSelectBankCard.open() //打开银行卡选择弹窗
			} else if (bankCardPayData.data == '') {
				boolePay.value = false //禁止充值按钮点击
				proxy.$refs.isShowSelectBankCard.open() //打开银行卡选择弹窗
			}
			payment.value = e //支付方式选择清空
			return //拦截
		}
		if (payment.value != e) {
			payment.value = e
			
			boolePay.value = payList.value[payment.value].auth == '1' ? authorization ? true : false : true
		}
	}
	const userAgreement = () => { //点击法律声明跳转
		uni.navigateTo({
			url: '/pages/else/userAgreement/userAgreement',
			animationType: 'slide-in-right',
			animationDuration: 200
		})
	}
	
	const authorization = () => { //点击支付宝授权
		let redirect_uri = "http://118.178.137.218:2025/api/common.AliPay/callback?server=1"
		let alipayUrl =
			"https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021004123611578&scope=auth_user&state="+ counter.user_id + "&redirect_uri="
		let openURL = "alipays://platformapi/startapp?appId=20000067&url=" + encodeURIComponent(alipayUrl +
			redirect_uri);
		clickAuthorizationBoole.value = true
		// #ifdef H5
		if (navigator.userAgent.indexOf('Mobile') > -1) {
			window.location.href = openURL
		} else {
			openURL = alipayUrl + encodeURIComponent(redirect_uri);
			window.ap.getAuthCode({
				appId: '2021004123611578',
				urls: window.open(openURL),
				scopes: ['auth_user'],
				success: (res) => {
					window.ap.alert('res2:' + res.authCode)
				},
			});
		}
		// #endif
		// #ifdef APP-PLUS
		if (plus.os.name == 'iOS') {
			let openURL_ios = "alipay://platformapi/startapp?appId=20000067&url=" + encodeURIComponent(alipayUrl +
				redirect_uri);
			plus.runtime.openURL(openURL_ios, res => {
				uni.showModal({
					content: '本机未检测到对应客户端，是否下载应用？',
					success: function(res) {
						if (res.confirm) {
							plus.runtime.openURL('https://ds.alipay.com/') //未检出到支付宝跳转支付宝下载官网
						}
					}
				});
			})
		} else {
			plus.runtime.openURL(openURL, res => {
				uni.showModal({
					content: '本机未检测到对应客户端，是否下载应用？',
					success: function(res) {
						if (res.confirm) {
							plus.runtime.openURL('https://ds.alipay.com/') //未检出到支付宝跳转支付宝下载官网
						}
					}
				});
			})
		}
		// #endif
	}
	const submit = () => { // 提交充值
		
		
		if(payList.value[payment.value].id == 999){
			uni.showModal({
				title:'提示',
				content:"该充值为店主线下收款渠道，支付金额不会直接到账，需支付后通过截图联系店主加帐！！",
				confirmText:'我已知晓！',
				confirmColor:'#fb0d33',
				success: function (res) {
					if (res.confirm){
						api.YulanShoukuangImg({}).then(res=>{
							var arr=(counter.baseUrl+res.data.data).split()
							uni.previewImage({urls:arr,})
						})
						
					}
				}
			});
			return
		}
		
		var Payenvironment = 'app'
		// #ifdef H5
		if (navigator.userAgent.indexOf('Mobile') > -1) {
			Payenvironment = 'app-web'
		} else {
			Payenvironment = 'pc'
		}
		// #endif
		// #ifdef APP-PLUS
		Payenvironment = 'app'
		// #endif
		if (easyinputVal.value == '' || easyinputVal.value < 1) {
			uni.showToast({
				title: '金额不能小于1元~',
				icon: "none",
				position: "center"
			})
			// return
		} else if (openCheckbox.value == false) {
			uni.showToast({
				title: '请勾选用户协议~',
				icon: "none",
				position: "center"
			})
			return
		}
		uni.showLoading({
			title: '生成订单中~',
			mask: true
		})
		var callbackUrl = counter.baseUrl + "api/common.JDduolabaopay/callback"
		aliPaySrc.value = '' //清空
		aliPaySrc.value = 'alipays://platformapi/startapp?appId=20000076&url=http://202.189.9.196?' //赋值
		var appindex = payList.value[payment.value].name.indexOf('银联') //判断是银联支付还是支付宝支付
		if (payList.value[payment.value].id == 3 || payList.value[payment.value].id == 201) {
			uni.hideLoading()
			PayDialogShow.value = true
			return
		}else if(payList.value[payment.value].id == 5){
			uni.hideLoading()
			leshuaPay()
			return
		}else if(payList.value[payment.value].id == 51) {
			uni.hideLoading()
			PayDialogShow2.value = true
			return
		}else if (payList.value[payment.value].id == 52) {
			uni.hideLoading()
			PayDialogShow3.value = true
			return
		}else if (payList.value[payment.value].id == 7) {
			uni.hideLoading()
			suixingPay()//随行付
			return
		}else if (payList.value[payment.value].id == 801) {
			uni.hideLoading()
			hmCeshiPay()
			return
		}else if (payList.value[payment.value].id == 2) {
			uni.hideLoading()
			qtCeshiPay()
			return
		}else if (payList.value[payment.value].id == 8) {
			uni.hideLoading()
			dangCeshiPay()
			return
		}else if (payList.value[payment.value].id == 4) {
			uni.hideLoading()
			zhifuCeshiPay()
			return
		}
		
		api.Recharge({
			"body": {
				"agentNum": "10001015903617647421560",
				"customerNum": payList.value[payment.value].shopReceipt.merchant_code,
				"shopNum": payList.value[payment.value].shopReceipt.shopNum,
				"amount": Number(easyinputVal.value).toFixed(2),
				"bankType": "ALIPAY",
				"authId": counter.UserConfig.Alipay_userId,
				"callbackUrl": callbackUrl,
				"subOrderType": "NORMAL",
				'Device_info': Payenvironment,
				'app': appindex == -1 ? 'alipay' : 'fast_pay',
				'token_no': payList.value[payment.value].id == 101 ? bankCardPayData.data.token_no : '',
				'test': true
			},
			"source": payList.value[payment.value].id,
			"type": 1,
			"api": "/v3/order/pay/create",
		}).then((res) => {
			uni.hideLoading()
			if (payList.value[payment.value].id == 1) { //京东支付宝支付
				if (res.data.code != 1 || res.data.data.error_msg) { //错误拦截
					if (res.data.data.error_msg) {
						uni.showToast({
							title: res.data.data.error_msg,
							icon: 'error'
						})
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'error'
						})
					}
					return
				}
				var pageData = {
					payNumber: res.data.data.data.bankRequest.TRADENO
				} //交易号
				aliPaySrc.value = aliPaySrc.value + 'pageData=' + JSON.stringify(pageData)
				// #ifdef H5
				if (navigator.userAgent.indexOf('Mobile') > -1) { //app-web
					window.location.href = encodeURI(aliPaySrc.value)
					payShowValue.value = true
				} else { //pc
					proxy.$refs.openPay.open()
				}
				// #endif
				// #ifdef APP-PLUS
				payShowValue.value = true
				if (plus.os.name == 'iOS') {
					var iosUrl = ''
					iosUrl =
						'alipay://platformapi/startapp?appId=20000067&url=http://118.178.137.218:2025/user/pay_auxiliary?pageData=' +
						encodeURIComponent(JSON.stringify(pageData))
					plus.runtime.openURL(iosUrl, res => {
						uni.showModal({
							content: '本机未检测到对应客户端，是否下载应用？',
							success: function(res) {
								if (res.confirm) {
									plus.runtime.openURL('https://ds.alipay.com/')
								}
							}
						});
					})
				} else {
					plus.runtime.openURL(encodeURI(aliPaySrc.value), res => {
						uni.showModal({
							content: '本机未检测到对应客户端，是否下载应用？',
							success: function(res) {
								if (res.confirm) {
									plus.runtime.openURL('https://ds.alipay.com/')
								}
							}
						});
					})
				}
				// #endif
			}
			if (payList.value[payment.value].id == 2 || payList.value[payment.value].id ==
				4) { //ad支付宝2.0/4.0支付
				if (res.data.code != 1 || res.data.data.error_msg) { //错误拦截
					if (res.data.data.error_msg) {
						uni.showToast({
							title: res.data.data.error_msg,
							icon: 'error'
						})
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'error'
						})
					}
					return
				}
				if (Payenvironment == 'app') {
					plus.runtime.openURL(res.data.data.expend.pay_info, res => {
						payShowValue.value = true
						uni.showModal({
							content: '本机未检测到对应客户端，是否下载应用？',
							success: function(res) {
								if (res.confirm) {
									plus.runtime.openURL('https://ds.alipay.com/')
								}
							}
						});
					})
				} else if (Payenvironment == 'app-web') {
					payShowValue.value = true
					window.location.href = res.data.data.expend.pay_info
				} else {
					aliPaySrc.value = res.data.data.expend.pay_info
					proxy.$refs.openPay.open()
				}
			}
			if (payList.value[payment.value].id == 101) { //哆啦宝银联支付
				if (res.data.code != 1 || res.data.data.error_msg) { //错误拦截
					if (res.data.data.error_msg) {
						uni.showToast({
							title: res.data.data.error_msg,
							icon: 'error'
						})
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'error'
						})
					}
					return
				}
				bankCardPay_id.value = ''
				bankCardPay_id.value = res.data.data.id
				proxy.$refs.payVerification.open()
			}
		}).catch(err => {
			uni.showToast({
				title: '数据处理失败，请联系平台客服',
				icon: 'none',
				position: 'center'
			})
		})
	}
	const dangCeshiPay=()=>{
		api.qitapay({
			'money': Number(easyinputVal.value).toFixed(2),
			'from': payList.value[payment.value].shopReceipt.id,
			'type':3
		}).then(res=>{
			if(res.data.code==1){
				uni.setStorageSync('qrCode',res.data.data.qrCode)
				uni.setStorageSync('qrhttp',"alipays://platformapi/startapp?saId=10000007&qrcode="+res.data.data.qrCode)
				uni.navigateTo({
					url:'/pages/home/HomeTopUp/dangpay?id='+res.data.data.outTradeNo
				})
				
				// let url="alipays://platformapi/startapp?saId=10000007&qrcode="+res.data.data.qrCode
				// plus.runtime.openURL(url, res => {
				// 	uni.showModal({
				// 		content: '本机未检测到对应客户端，是否下载应用？',
				// 		success: function(res) {
				// 			if (res.confirm) {
				// 				plus.runtime.openURL('https://ds.alipay.com/')
				// 			}
				// 		}
				// 	});
				// })

			}else{
				uni.showToast({
					title: res.data.msg,
					icon: 'error'
				})
			}
			
		})
	}
	const zhifuCeshiPay=()=>{
		api.zhifupay({
			'money': Number(easyinputVal.value).toFixed(2),
			'from': payList.value[payment.value].shopReceipt.id
		}).then(res=>{
			console.log(res)
			if(res.data.code==1){
				// #ifdef H5
				window.location.href = res.data.data.payUrl
				// #endif
				// #ifdef APP
				plus.runtime.openURL(res.data.data.payUrl, res => {
					uni.showModal({
						content: '本机未检测到对应客户端，是否下载应用？',
						success: function(res) {
							if (res.confirm) {
								plus.runtime.openURL('https://ds.alipay.com/')
							}
						}
					});
				})
				// #endif
			}
			
		})
	}
	const qtCeshiPay= ()=>{
		api.qitapay({
			'money': Number(easyinputVal.value).toFixed(2),
			'from': payList.value[payment.value].shopReceipt.id,
			// #ifdef H5
			'type':2
			// #endif
			// #ifdef APP
			'type':1
			// #endif
		}).then(res=>{
			if(res.data.code==1){
				// #ifdef H5
				uni.setStorageSync('from',res.data.data)
				uni.navigateTo({
					url:'/pages/home/qitapay'
				})
				// #endif
				// #ifdef APP
				// console.log(res.data.data)
				let url="alipays://platformapi/startapp?appId=20000067&url=" + encodeURIComponent(JSON.stringify(res.data.data.body))
				// console.log(url)
				uni.requestPayment({
				    provider: 'alipay',
				    orderInfo: res.data.data.body,
				    success: function (res) {
				        console.log('success:' + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log('fail:' + JSON.stringify(err));
				    }
				});
				plus.runtime.openURL(url, res => {
					uni.showModal({
						content: '本机未检测到对应客户端，是否下载应用？',
						success: function(res) {
							if (res.confirm) {
								plus.runtime.openURL('https://ds.alipay.com/')
							}
						}
					});
				})
				// #endif
			}else{
				uni.showToast({
					title: res.data.msg,
					icon: 'error'
				})
			}
		})
	}
	const getUserAuthorization = () => { //获取支付授权
		api.GetUserInfo({}).then(res => { //我的页面数据跟新
			uni.hideLoading()
			if (res.data.data.userinfo.Config.Alipay_userId != null) {
				counter.UserConfig = res.data.data.userinfo.Config //支付所需数据
				authorizationValue.value = true
				if (clickAuthorizationBoole.value) {
					uni.showToast({
						title: '授权成功',
						position: 'center',
						icon: 'none'
					})
				}
			} else {
				if (clickAuthorizationBoole.value) {
					uni.showToast({
						title: '未获取到授权信息，请重新授权~',
						icon: "error",
						position: 'bottom'
					})
				}
			}
			clickAuthorizationBoole.value = false //隐藏hide显示弹窗
		})
	}

	const getNewUserMoney = () => { //获取用户最新金额
		uni.request({
			url: counter.baseUrl + '/api/bettingend.mine.Transaction/notWithdraw',
			header: {
				'server': 1,
				'ba-user-token': counter.access_token,
			},
			success(resX) {
				counter.user_money = (Number(resX.data.data.withdraw) + Number(resX.data.data.not_withdraw))
					.toFixed(2)
			},
			fail(err) {
				uni.showToast({
					title: '更新金额失败，请刷新页面~',
					icon: "error",
					position: "center"
				})
			}
		})
	}
	const back = () => {
		uni.navigateBack()
	} //返回

	const PcClick = (e) => { //pc web支付宝卡片点击按钮
		getNewUserMoney()
		if(e=='ysf'){
			proxy.$refs.openyunshanPay.close()
		}
		if(e=='zfb'){
			proxy.$refs.openPay.close()
		}
		if(e=='wx'){
			proxy.$refs.openleshuawxPay.close()
		}
		
	}
	const skip = (e) => { //点击去提现和账单触发
		if (e == 0) {
			uni.navigateTo({
				url: '/pages/home/HomeTopUp/bill/bill',
				animationType: 'slide-in-right',
				animationDuration: 200
			})
		} else {
			uni.navigateTo({
				url: '/pages/home/HomeTopUp/withdrawDeposit/withdrawDeposit',
				animationType: 'slide-in-right',
				animationDuration: 200
			})
		}

	}


    const hmCeshiPay = () => { //河马测试支付（测试）
		api.HmPay({
			'money': Number(easyinputVal.value).toFixed(2)
		}).then(res => {
			uni.hideLoading()
			if (res.data.code == 1) {
				// #ifdef H5
				window.location.href = res.data.data.url //浏览器打开链接
				// #endif
				// #ifdef APP-PLUS
				plus.runtime.openURL(res.data.data.url, res => {
					uni.showModal({
						content: '无法打开浏览器~',
						confirmText: '复制链接',
						success: function(res) {
							if (res.confirm) {
								uni.setClipboardData({ //赋值链接
									data: String(res.data.data.url),
									showToast: true
								})
							}
						}
					});
				})
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
	
	const leshuaPay = () => { //河马测试支付（测试）
		api.LshuaPay({
			'money': Number(easyinputVal.value).toFixed(2),
			'id': payList.value[payment.value].shopReceipt.id

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
	
	const leshuawxPay = (e) => { //乐刷微信测试支付（测试）
		if (e.index == 0 || PayDialogShow3.value == false) {
			PayDialogShow3.value = false
			return
		}
		PayDialogShow3.value = false
		
		uni.showLoading({
			title: '生成订单中~',
			mask: true
		})
		api.LshuaPay({
			'money': Number(easyinputVal.value).toFixed(2),
			'id': payList.value[payment.value].shopReceipt.id
			
		}).then(res => {
			uni.hideLoading()
			if (res.data.code == 1) {
				aliPaySrc.value=res.data.data.return_url[0]
				proxy.$refs.openleshuawxPay.open()
				return
				
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
	
	const leshuayunshanPay = (e) => { //乐刷云闪付主扫
		
		if (e.index == 0 || PayDialogShow2.value == false) {
			PayDialogShow2.value = false
			return
		}
		PayDialogShow2.value = false
		
		uni.showLoading({
			title: '生成订单中~',
			mask: true
		})
		
		
		api.LshuayunshanPay({
			'money': Number(easyinputVal.value).toFixed(2),
			'id': payList.value[payment.value].shopReceipt.id
		}).then(res => {
			uni.hideLoading()
			
			if (res.data.data.code[0] == 0) {
				// console.log(res.data.data.td_code[0])
				aliPaySrc.value=res.data.data.return_url[0]
				
				proxy.$refs.openyunshanPay.open()
				return
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
	
	const suixingPay = () => { //随行付
		api.suixingPay({
			'money': Number(easyinputVal.value).toFixed(2),
			'id': payList.value[payment.value].shopReceipt.id
		}).then(res => {
			uni.hideLoading()
			if (res.data.code != 1 || res.data.data.error_msg) { //错误拦截
				if (res.data.data.error_msg) {
					uni.showToast({
						title: res.data.data.error_msg,
						icon: 'error'
					})
				} else {
					uni.showToast({
						title: res.data.msg,
						icon: 'error'
					})
				}
				return
			}
			aliPaySrc.value = '' //清空
			aliPaySrc.value = 'alipays://platformapi/startapp?appId=20000067&url=http://118.178.137.218:2025/user/pay_auxiliary?' //赋值
			
			aliPaySrc.value = aliPaySrc.value + 'payNumber=' + res.data.data.respData.source
			// console.log(aliPaySrc.value);
			// #ifdef H5
			if (navigator.userAgent.indexOf('Mobile') > -1) { //app-web
				window.location.href = encodeURI(aliPaySrc.value)
				payShowValue.value = true
			} else { //pc
				proxy.$refs.openPay.open()
			}
			// #endif
			// #ifdef APP-PLUS
			payShowValue.value = true
			if (plus.os.name == 'iOS') {
				var iosUrl = ''
				iosUrl =
					'alipay://platformapi/startapp?appId=20000067&url=http://118.178.137.218:2025/user/pay_auxiliary?payNumber=' +
					res.data.data.respData.source
				plus.runtime.openURL(iosUrl, res => {
					uni.showModal({
						content: '本机未检测到对应客户端，是否下载应用？',
						success: function(res) {
							if (res.confirm) {
								plus.runtime.openURL('https://ds.alipay.com/')
							}
						}
					});
				})
			} else {
				plus.runtime.openURL(encodeURI(aliPaySrc.value), res => {
					uni.showModal({
						content: '本机未检测到对应客户端，是否下载应用？',
						success: function(res) {
							if (res.confirm) {
								plus.runtime.openURL('https://ds.alipay.com/')
							}
						}
					});
				})
			}
			// #endif
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
	.payCard {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		width: 100%;
		justify-content: space-between;
	}

	.status_bar {
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
	}

	body {
		background-color: #f8f8f8;
	}

	/* 导航 */
	.navigation {
		width: 100%;
		background-color: white;
		position: fixed;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 1;
		box-shadow: 0 5rpx 15rpx -8rpx #ebebeb;
	}

	/* 当前余额 */
	.balance {
		width: 100%;
		background-color: white;
		display: flex;
		align-items: center;
		padding: 30rpx 40rpx;
		box-sizing: border-box;
	}

	.balance text {
		font-size: 34rpx;
		color: #5e5e5e;
		/* 当前余额按钮 */
	}

	.balance-button {
		height: 65rpx;
		border-radius: 55rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(45deg, #ffad92, #ff7979);
	}

	.balance-button text {
		color: #fff;
		padding: 0 40rpx;
	}

	.gift-tip {
		margin: 20rpx auto;
		width: 630rpx;
	}
	

	/* 充值金额按钮 */
	.money-button {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

	.money-button view {
		width: 180rpx;
		height: 90rpx;
		border-radius: 25rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 18rpx;

	}

	.money-button text {
		font-size: 36rpx;
		font-weight: bold;
	}

	/* 充值按钮 */
	.TopUpButton {
		width: 640rpx;
		height: 75rpx;
		margin: 5rpx auto;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 25rpx;
		background: linear-gradient(45deg, #ffad92, #ff7979);
		transition: all 0.5s;
	}

	/* 18岁 */
	.clause {
		width: 700rpx;
		display: flex;
		align-items: center;
		margin: 20rpx auto;
	}

	.clause-choose {
		width: 30rpx;
		height: 30rpx;
		margin: 0 10px;
		border-radius: 55px;
		border: 1px solid #8d8d8d;
		color: #393939;
		font-size: 24rpx;
		display: flex;
		transition: all 1s;
		align-items: center;
		justify-content: center;
	}

	.clause text {
		color: #3d3d3d;
		font-size: 24rpx;
	}

	/* 支付方式 */
	.payment {
		width: 30rpx;
		height: 30rpx;
		margin: 0 10px;
		border-radius: 55px;
		border: 1px solid #e5e5e5;
		color: #393939;
		font-size: 24rpx;
		display: flex;
		transition: all 1s;
		align-items: center;
		justify-content: center;
	}
</style>