<template>
	<view class="status_bar">
		<!-- <uni-nav-bar title="" left-icon="left" left-text="返回" @clickLeft="back"></uni-nav-bar> -->
		<!-- <view class="login_type_box">
			<image src="@/static/img/login/logo.png" alt="" style="width: 40rpx;height: 40rpx;" />
			<view :class="login_value==0?'type_buttom_true':'type_buttom'"
				@click="login_value=0;valiFormData.password='';valiFormData.captcha=''">
				易下
			</view>
			<view :class="login_value==1?'type_buttom_true':'type_buttom'"
				@click="login_value=1;valiFormData.password='';valiFormData.captcha=''">
				手机登录
			</view>
		</view> -->
		<view class="btn_bgn">
			<image src="@/static/img/main/96-96.jpg" alt="" style="width: 100rpx;height: 100rpx;position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;" />
		</view>
		<view class="example">
			<!-- 基础表单校验 -->
			<uni-forms ref="valiForm" :modelValue="valiFormData" label-position="top">
				<uni-forms-item label="" name="account">
					<view class="login-title">
						<image src="@/static/img/login/icon_account.png" alt="" style="width: 26rpx;height: 26rpx;" />
						<uni-easyinput v-model="valiFormData.account" placeholder="请输入注册时填写的手机/邮箱" />
					</view>
				</uni-forms-item>
				<uni-forms-item label="" name="password" v-if="login_value==0">
					<view class="login-title">
						<image src="@/static/img/login/icon_login_lock.png" style="width: 30rpx;height: 30rpx;" />
						<uni-easyinput v-model="valiFormData.password" type="password" placeholder="请输入密码" />
					</view>
				</uni-forms-item>
				<uni-forms-item label="验证码" required name="mailCode" v-show="login_value==1||login_value==2">
					<view class="codeBox">
						<uni-easyinput :placeholder="login_value==1?'请输入手机验证码':'请输入邮箱验证码'"
							v-model="valiFormData.captcha" trim="all" />
						<view
							:class="typeof(codeNumber)=='string' && checkAll(valiFormData.account)?'codeButton':'codeButtonFalse'"
							@click="gainCode">
							{{codeNumber}}
						</view>
					</view>
				</uni-forms-item>
				<view style="display: flex;margin-bottom:20rpx;align-items: center;justify-content:space-between"
					v-if="login_value==0">
					<view class="formStyle">
						<uni-easyinput placeholder="请输入验证码" v-model="valiFormData.captcha"></uni-easyinput>
					</view>
					<view @click="reload">
						<QS-image :imageUrl="reloadData+keyData" width="200rpx" height="72rpx" @click='reload' />
					</view>
				</view>
			</uni-forms>
			<checkbox-group style="display: flex;margin:20rpx 0rpx 30rpx -15rpx;">
				<label>
					<checkbox @click="saveAccout(1)" value="long" style="color:#909399;transform:scale(0.8)"
						color="#5500ff" :checked="resKeep">
						保持登录
					</checkbox>
					<checkbox @click="saveAccout(0)" value="save" style="color:x#55557f;transform:scale(0.8)"
						color="#ff0000" :checked='saveBoole'>
						保存账号
					</checkbox>
				</label>
			</checkbox-group>
			<view class="buttomStyle" @click="submit">登录</view>
		</view>
		<view class="card_botton" style="">
			<text style="margin:0rpx 30rpx;" @click="acccte(1)">忘记密码</text>
			<text>|</text>
			<text style="margin:0rpx 30rpx;" @click="acccte(2)">注册账号</text>
			<text>|</text>

		</view>
		<!-- <view class="botton_agreement">
			<view style="font-weight:bold;flex:1;">
				<text style="color: #5500ff;">登录即代表您已阅读并同意</text><br>
				<text style="color: #ff0000;">《用户协议》</text>
				<text style="color: #5500ff;">和</text>
				<text style="color: #ff0000;">《隐私权协议》</text>
			</view>
		</view> -->
	</view>
</template>

<script setup>
	import api from '@/common/vmeitime-http/'
	import {
		useCounterStore
	} from '@/stores/counter'
	import {
		ref,
		reactive,
		getCurrentInstance,
		onMounted,
		onBeforeMount,
	} from "vue";
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	onBeforeMount(() => {
		if (uni.getStorageSync('user_access') != '') {
			valiFormData.account = uni.getStorageSync('user_access')
			saveBoole.value = true
		}
	})
	const checkAll = (data) => {
		if (login_value.value == 1) {
			var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
			if (!myreg.test(data)) {
				return false;
			} else {
				return true;
			}
		} else {
			return RegExp(
					/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/)
				.test(data);
		}
	}

	onMounted(() => {
		reload()
	})
	const saveAccout = (e) => { //选择用点击触发
		var typeArr = ["save", "long"]
		if (typeArr[e] == 'save') {
			saveBoole.value = !saveBoole.value
		} else {
			resKeep.value = !resKeep.value
		}
	}
	const login_value = ref(0)
	const valiFormData = reactive({ //表单v-model
		account: "",
		password: "",
		captcha: "",
	})
	const counter = useCounterStore(); //状态管理
	const resKeep = ref(true) // 保持登录
	const saveBoole = ref(false) //保存账号
	const reloadData = ref(uni.getStorageSync('api') + '/api/common/captcha?server=1&id=') //验证码链接

	const reload = () => { //验证码刷新
		reloadData + getRandomString(20)
		valiFormData.captcha = null
	}
	const acccte = (e) => { //注册账号或忘记密码
		if (e == 2) {
			uni.navigateTo({
				url: '/pages/login/register',
				animationType: 'slide-in-bottom',

			})
		} else if (e == 1) {
			uni.navigateTo({
				url: '/pages/login/forgetThePassword',
				animationType: 'slide-in-bottom'
			})
		} else {
			// console.log('1231232')
			// uni.navigateTo({url: '/pages/login/goflychat'})
			// #ifdef H5
			if (uni.getStorageSync('access_token')) {
				let herf = 'https://t.me/qihang9981' +
					'/index/index/home?groupid=1&business_id=1&special=3&avatar=' +
					counter.user_imgs + '&visiter_id=' + counter.user_id + '&visiter_name=' +
					counter.user_id + counter.nickname
				window.open(herf)
			} else {
				let herf = 'https://t.me/qihang9981' +
					'/index/index/home?groupid=1&business_id=1&special=3&avatar=' + '' + '&visiter_id=' + '' +
					'&visiter_name=' + ''
				window.open(herf)
			}
			// #endif
			// #ifdef APP
			if (uni.getStorageSync('access_token')) {
				let herf = 'https://t.me/qihang9981' +
					'/index/index/home?groupid=1&business_id=1&special=3&avatar=' +
					counter.user_imgs + '&visiter_id=' + counter.user_id + '&visiter_name=' +
					counter.user_id + counter.nickname
				plus.runtime.openURL(herf)
			} else {
				let herf = 'https://t.me/qihang9981' +
					'/index/index/home?groupid=1&business_id=1&special=3&avatar=' + '' + '&visiter_id=' + '' +
					'&visiter_name=' + ''
				plus.runtime.openURL(herf)
			}
			// #endif
		}

	}

	const keyData = ref('') //存储验证码的密钥
	/**
	 * 随机生成字符串
	 * @param len 指定生成字符串长度
	 */
	function getRandomString(len) {
		let _charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789',
			min = 0,
			max = _charStr.length - 1,
			_str = ''; //定义随机字符串 变量

		//判断是否指定长度，否则默认长度为15
		len = len || 15;
		//循环生成字符串
		for (var i = 0, index; i < len; i++) {
			index = (function(randomIndexFunc, i) {
				return randomIndexFunc(min, max, i, randomIndexFunc);
			})(function(min, max, i, _self) {
				let indexTemp = Math.floor(Math.random() * (max - min + 1) + min),
					numStart = _charStr.length - 10;
				if (i == 0 && indexTemp >= numStart) {
					indexTemp = _self(min, max, i, _self);
				}
				return indexTemp;
			}, i);
			_str += _charStr[index];
		}
		keyData.value = _str
		return _str;
	}
	const codeNumber = ref('获取验证码') //验证码按钮显示内容
	const setTime = ref(null) //定时器ref
	const gainCode = () => {
		if (login_value.value == 2) {
			api.send({
				'email': valiFormData.account,
				'event': 'phone_captcha'
			}).then(res => {
				if (res.data.code == 1) {
					uni.showToast({
						title: '已发送验证码~',
						position: 'center',
						icon: 'none'
					})
					//验证码按钮点击事件
					codeNumber.value = 60
					setTime.value = setInterval(function() {
						codeNumber.value--
						if (codeNumber.value == 0) {
							clearInterval(setTime.value)
							setTime.value = null
							codeNumber.value = '获取验证码'
						}
					}, 1000)
				} else {
					uni.showToast({
						title: res.data.data,
						icon: 'none',
						position: 'center'
					})
				}
			})
		} else {
			api.PhoneSend({
				'phone': valiFormData.account,
				'event': 'phone_captcha'
			}).then(res => {
				if (res.data.code == 1) {
					uni.showToast({
						title: '已发送验证码~',
						position: 'center',
						icon: 'none'
					})
					//验证码按钮点击事件
					codeNumber.value = 60
					setTime.value = setInterval(function() {
						codeNumber.value--
						if (codeNumber.value == 0) {
							clearInterval(setTime.value)
							setTime.value = null
							codeNumber.value = '获取验证码'
						}
					}, 1000)
				} else {
					uni.showToast({
						title: res.data.data,
						icon: 'none',
						position: 'center'
					})
				}
			})
		}
	}

	function back() { //返回
		if (counter.hasLogin == true) {
			uni.switchTab({
				url: '../nav/main'
			});
		} else {
			uni.showToast({
				title: '未登录不可进入软件~',
				position: 'center',
				icon: "error"
			})
		}
	}


	function submit() {
		if (valiFormData.account == '') {
			uni.showToast({
				title: '账号不能为空',
				position: 'center',
				icon: "none"
			})
			return;
		}
		if (valiFormData.password == '') {
			uni.showToast({
				title: '密码不能为空',
				position: 'center',
				icon: "none"
			})
			return;
		}
		uni.showLoading({
			title: '登录中'
		})
		if (saveBoole.value) { //保存账号操作
			uni.setStorageSync('user_access', valiFormData.account)
		} else {
			uni.setStorageSync('user_access', '')
		}
		api.Login({
			"username": valiFormData.account,
			"password": valiFormData.password,
			"captcha": valiFormData.captcha,
			"captchaId": keyData.value,
			"keep": resKeep.value,
			"machine_type": uni.getSystemInfoSync().platform
		}).then((res) => {
			uni.hideLoading()
			console.log(res, '登录返回值');
			if (res.data.code === 0) {
				uni.showToast({
					title: res.data.msg,
					icon: 'none',
					mask: true
				});
			}
			if (res.data.code === 1) { //=1是成功
				// if(res.data.data.appIsOpen.shop.value=='true'){
				// 	uni.showModal({
				// 		title:'注意',
				// 		content:res.data.data.appIsOpen.shop.content,
				// 		confirmText:'退出',
				// 		success: function(res) {
				// 			uni.hideTabBar()
				// 			if(res.confirm){
				// 				switch (uni.getSystemInfoSync().platform) {
				// 					case 'android':
				// 						plus.runtime.quit();
				// 					break;
				// 					case 'ios':
				// 						plus.ios.import('UIApplication').sharedApplication().performSelector('exit');
				// 					break;
				// 				}
				// 			}
				// 		}
				// 	});
				// }
				if (res.data.data.userinfo.group_id == 1) {
					uni.showToast({
						title: res.data.msg,
						icon: 'success',
						mask: true
					});
					//缓存token
					uni.setStorageSync('access_token', res.data.data.userinfo.token); //token
					uni.setStorageSync('refresh_token', res.data.data.userinfo.refreshToken); //长token
					uni.setStorageSync('shop_id', res.data.data.userinfo.shop_id); //店铺id
					uni.setStorageSync('user_id', res.data.data.userinfo.id); //用户id
					counter.user_id = res.data.data.userinfo.id //账户ID
					counter.sfz_id = res.data.data.userinfo.sfz_id; //身份证号
					counter.sfz_name = res.data.data.userinfo.sfz_name; //真实姓名
					counter.access_token = res.data.data.userinfo.token; //短token
					counter.refresh_token = res.data.data.userinfo.refreshToken; //长token
					counter.nickname = res.data.data.userinfo.nickname //用户昵称
					counter.user_money = res.data.data.userinfo.money; //用户总金额
					counter.user_imgs = res.data.data.userinfo.avatar; //用户头像
					counter.Betrecord = res.data.data.orderinfo; //基本订单信息
					counter.redPacketBoole = res.data.data.redPacket //用户是否有可领红包
					counter.Win_money = res.data.data.userinfo.Win_money //今日中奖金额
					counter.mobile = res.data.data.userinfo.mobile
					counter.hasLogin = true; //是否登录（状态）
					counter.UserConfig = res.data.data.userinfo.Config //支付所需数据
					counter.shop_id = res.data.data.userinfo.shop_id //用户默认选择的店铺id
					counter.userAllData = res.data.data
					uni.setStorageSync('RealName', counter.userAllData.userinfo.RealName);
					if (counter.userAllData.userinfo.RealName == '0') {
						uni.reLaunch({
							url: '/pages/score/score'
						});
					} else {
						uni.reLaunch({
							url: '/pages/main/main'
						});
					}

					if (saveBoole.value) {
						uni.setStorageSync('user_access', valiFormData.account)
					}
				} else {
					uni.showToast({
						title: '该账号为店主账号,请重新注册',
						icon: 'error',
						icon: 'none',
						position: 'center'
					})
				}
				reload()
			} else {
				uni.showToast({
					title: res.data.msg,
					icon: 'none',
					mask: true,
					position: 'center'
				});
				reload()
			}
		})
	}

	const yanClick = ref(true)
	const textStyle = ref('获取验证码')
	const timer = ref(null)
	const noClick = () => {
		textStyle.value = 60
		yanClick.value = 'false'
		proxy.timer = setInterval(() => {
			textStyle.value--
			if (textStyle.value == 0) {
				yanClick.value = true
				textStyle.value = '获取验证码'
			}
		}, 1000)
	}
</script>

<style>
	/* 顶部背景 */
	.btn_bgn {
		width: 100%;
		height: 360rpx;
		background-image: url('../../static/img/main/bg21.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		position: relative;
	}

	/* 登录标题 */
	.login-title {
		display: flex;
		align-items: center;
	}

	/* 选择类型按钮 */
	.type_buttom {
		width: 230rpx;
		height: 75rpx;
		border-radius: 20rpx;
		background-color: #dfdfdf;
		text-align: center;
		line-height: 75rpx;
		color: #565656;
		transition: all 0.3s ease-in-out;
	}

	/* 选中的类型按钮 */
	.type_buttom_true {
		width: 100rpx;
		height: 75rpx;
		border-radius: 20rpx;
		text-align: center;
		line-height: 75rpx;
		color: #000;
		font-weight: 500;
		transition: all 0.3s ease-in-out;
	}

	/* 登录方式选择框 */
	.login_type_box {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
		width: 100%;
		padding: 20rpx 0;
		box-sizing: border-box;
	}

	/* 页面状态栏 */
	.status_bar {
		background: #fff;
		background-size: cover;
		height: 100vh;
		width: 100%;
	}

	/* 主要按钮 */
	.buttomStyle {
		width: 90%;
		height: 100rpx;
		margin: 0 auto;
		margin-top: 60rpx;
		background-color: #f04b49;
		border-radius: 15rpx;
		text-align: center;
		line-height: 100rpx;
		color: white;
		transition: all 0.3s;
	}

	/* 卡片按钮 */
	.card_botton {
		color: #f04b49;
		font-size: 32rpx;
		text-align: end;
		width: 680rpx;
		padding: 0rpx 20rpx;
		margin: auto;
	}

	/* 文字样式 */
	text {
		font-size: 24rpx;
	}

	/* 示例容器 */
	.example {
		padding: 20rpx;
		border-radius: 30px 30px 0 0;
		margin-top: -25px;
		position: relative;
		background-color: #fff;
	}

	/* 输入框容器 */
	.formStyle {
		height: 70rpx;
		display: flex;
		flex: 1;
	}

	/* 输入框底部边框 */
	.is-input-border {
		border-top: none !important;
		border-left: none !important;
		border-right: none !important;
		border-bottom: 1px solid #DCDFE6;
	}

	/* 底部协议按钮 */
	.botton_agreement {
		display: flex;
		text-align: center;
		position: fixed;
		bottom: 80rpx;
		width: 100%;
		transition: transform 0.3s ease-in-out;
		z-index: 900;
		/* 低于 Toast，确保不遮挡 */
	}

	/* 避免 Toast 被覆盖 */
	.uni-toast {
		z-index: 9999 !important;
	}

	/* Toast 显示时隐藏底部协议 */
	.toast-active .botton_agreement {
		transform: translateY(100%);
	}

	/* 避免页面滚动穿透 */
	body.toast-active {
		overflow: hidden;
	}
</style>
<style lang="scss">
	.codeBox {
		display: flex;
		align-items: center;

		.codeButton {
			background-color: #ff0000;
			color: white;
			width: 200rpx;
			margin-left: 10rpx;
			height: 70rpx;
			text-align: center;
			line-height: 70rpx;
			border-radius: 10rpx;
			transition: .3s;
		}

		.codeButtonFalse {
			background-color: #cccccc;
			color: #efefef;
			width: 200rpx;
			margin-left: 10rpx;
			height: 70rpx;
			text-align: center;
			line-height: 70rpx;
			border-radius: 10rpx;
			transition: .3s;
			pointer-events: none;
		}
	}
</style>