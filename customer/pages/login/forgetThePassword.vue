<template>
	<view class="status_bar"></view>
	<!-- 更新左箭头返回按钮 -->
	<uni-nav-bar title="重置密码" leftIcon="arrowleft" @clickLeft="back"></uni-nav-bar>
	<view class="btn_bgn">
		<image src="@/static/img/main/96-96.jpg" alt="" style="width: 100rpx;height: 100rpx;position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;" />
	</view>
	<view class="card">
		<uni-forms label-position="top" :modelValue="fromsData" :rules="fromsRules" ref="forms">
			<uni-forms-item :label="registerType_value==1?'邮箱':'手机'" required name="mail">
				<view style="display: flex;align-items: center;">
					<uni-easyinput :placeholder="registerType_value==1?'请输入注册时使用的邮箱号':'请输入注册时使用的手机号'"
						v-model="fromsData.mail" />
					<view class="registerType_box">
						<view class="Type_box_buttom_true" v-show="registerType_value==1" @click="cut(0)">
							手机找回
						</view>
					</view>
				</view>
			</uni-forms-item>
			<uni-forms-item label="验证码" required name="mailCode">
				<view class="codeBox" v-show="registerType_value==1">
					<uni-easyinput placeholder="请输入邮箱验证码" v-model="fromsData.mailCode" />
					<view
						:class="typeof(codeNumber)=='string' &&  checkEmail(fromsData.mail)?'codeButton':'codeButtonFalse'"
						@click="gainCode">
						{{codeNumber}}
					</view>
				</view>
				<view class="codeBox" v-show="registerType_value==0">
					<uni-easyinput placeholder="请输入手机验证码" v-model="fromsData.mailCode" />
					<view
						:class="typeof(codeNumber)=='string' && isPhone(fromsData.mail)?'codeButton':'codeButtonFalse'"
						@click="gainCode">
						{{codeNumber}}
					</view>
				</view>
			</uni-forms-item>

			<uni-forms-item label="新密码" required name="password">
				<uni-easyinput placeholder="请输入新登录密码" v-model="fromsData.password" type="password" />
			</uni-forms-item>
			<uni-forms-item label="确认密码" required name="confirmPassword">
				<uni-easyinput placeholder="请重新输入新密码" v-model="fromsData.confirmPassword" type="password" />
			</uni-forms-item>
		</uni-forms>
		<view class="buttomStyle" @click="submit">
			提交
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onBeforeMount,
		reactive,
		getCurrentInstance
	} from 'vue';
	import api from "@/common/vmeitime-http/index.js";
	const {
		proxy,
		ctx
	} = getCurrentInstance();
	const registerType_value = ref(0);

	const back = () => {
		uni.navigateBack();
	};

	const cut = (e) => {
		registerType_value.value = e;
		fromsData.mail = '';
		fromsData.confirmPassword = '';
		fromsData.mailCode = '';
		fromsData.password = '';
	};

	const submit = () => {
		proxy.$refs.forms.validate().then(res => {
			uni.showLoading({
				title: '修改中',
				mask: true
			});
			api.forgetPassword({
				"account": fromsData.mail,
				"captcha": fromsData.mailCode,
				"password": fromsData.password,
				'type': registerType_value.value
			}).then(resData => {
				uni.hideLoading();
				if (resData.data.code == 1) {
					uni.showModal({
						title: '提示',
						content: '您的账号：' + resData.data.data.list.username + '修改密码成功！',
						confirmText: '立即登录',
						confirmColor: '#f04b49',
						success(logi) {
							if (logi.confirm) {
								uni.redirectTo({
									url: '/pages/login/login'
								});
							}
						}
					});
				} else {
					console.log(resData.data, 'csdsads');
					uni.showToast({
						title: resData.data.msg,
						icon: 'error'
					});
				}
			});
		});
	};

	const pageType = ref(1);
	const fromsRules = reactive({
		mail: {
			rules: [{
				required: true,
				errorMessage: '邮箱不能为空'
			}]
		},
		mailCode: {
			rules: [{
				required: true,
				errorMessage: '验证码不能为空'
			}]
		},
		password: {
			rules: [{
					required: true,
					errorMessage: '密码不能为空'
				},
				{
					validateFunction: function(rule, value, data, callback) {
						var res = /[\W]/g;
						if (res.test(value)) {
							callback('密码不能有中文~');
						}
						return true;
					}
				},
				{
					validateFunction: function(rule, value, data, callback) {
						var res = /[\W]/g;
						if (value.length < 6) {
							callback('密码长度必须大于6位~');
						}
						return true;
					}
				}
			]
		},
		confirmPassword: {
			rules: [{
					required: true,
					errorMessage: '密码不能为空'
				},
				{
					validateFunction: function(rule, value, data, callback) {
						var res = /[\W]/g;
						if (value != fromsData.password) {
							callback('密码不一致~');
						}
						return true;
					}
				}
			]
		}
	});
	const fromsData = reactive({
		'mail': null,
		'mailCode': null,
		'password': null,
		'confirmPassword': null
	});
	const codeNumber = ref('获取验证码');
	const setTime = ref(null);
	const gainCode = () => {
		if (registerType_value.value == 0) {
			api.PhoneSend({
				'phone': fromsData.mail,
				'event': 'phone_captcha'
			}).then(res => {
				if (res.data.code == 1) {
					uni.showToast({
						title: '已发送验证码~',
						position: 'center',
						icon: 'none'
					});
					codeNumber.value = 60;
					setTime.value = setInterval(function() {
						codeNumber.value--;
						if (codeNumber.value == 0) {
							clearInterval(setTime.value);
							setTime.value = null;
							codeNumber.value = '获取验证码';
						}
					}, 1000);
				} else {
					uni.showToast({
						title: res.data.data,
						icon: 'error'
					});
				}
			});
		} else {
			api.send({
				'email': fromsData.mail,
				'event': 'user_retrieve_pwd',
			}).then(res => {
				if (res.data.code == 1) {
					uni.showToast({
						title: '已发送验证码~',
						position: 'center',
						icon: 'none'
					});
					codeNumber.value = 60;
					setTime.value = setInterval(function() {
						codeNumber.value--;
						if (codeNumber.value == 0) {
							clearInterval(setTime.value);
							setTime.value = null;
							codeNumber.value = '获取验证码';
						}
					}, 1000);
				} else {
					uni.showToast({
						title: res.data.data,
						icon: 'error'
					});
				}
			});
		}
	};

	function checkEmail(email) {
		return RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(
			email);
	}

	function isPhone(phone) {
		var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
		if (!myreg.test(phone)) {
			return false;
		} else {
			return true;
		}
	}
</script>

<style lang="scss">
	/* 确保 body 没有限制 Toast 和 Modal 的显示 */
	body {
		background-color: #ffff !important;
		overflow: visible !important;
		position: relative !important;
		z-index: 0;
		/* 确保 body 的 z-index 不会阻挡弹出层 */
	}

	/* 按钮背景 */
	.btn_bgn {
		width: 100%;
		height: 360rpx;
		background-image: url('../../static/img/main/bg21.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		position: relative;
		z-index: 1;
		/* 确保不会遮挡 Toast */
	}

	/* 状态栏 */
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
		position: relative;
		z-index: 2;
	}

	/* 选择框 */
	.registerType_box {
		display: flex;
		justify-content: flex-end;
		z-index: 3;
	}

	/* 验证码按钮 */
	.codeBox {
		display: flex;
		align-items: center;

		.codeButton {
			background-color: #f04b49;
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

	/* 卡片 */
	.card {
		padding: 20rpx;
		border-radius: 30px 30px 0 0;
		margin-top: -25px;
		position: relative;
		background-color: #fff;
		z-index: 4;
	}

	.buttomStyle {
		width: 90%;
		height: 100rpx;
		margin: 0 auto;
		background-color: #f04b49;
		border-radius: .46875rem;
		text-align: center;
		line-height: 100rpx;
		color: white;
	}

	/* 确保 Toast 和 Modal 能够正常显示 */
	.uni-toast,
	.uni-modal {
		z-index: 99999 !important;
		position: fixed !important;
		top: 50% !important;
		left: 50% !important;
		transform: translate(-50%, -50%) !important;
		display: block !important;
	}

	/* Toast 遮罩层 */
	.uni-toast-mask {
		position: fixed !important;
		top: 0 !important;
		left: 0 !important;
		width: 100% !important;
		height: 100% !important;
		background-color: rgba(0, 0, 0, 0.4) !important;
		z-index: 99998 !important;
	}

	/* Modal 遮罩层 */
	.uni-modal-mask {
		position: fixed !important;
		top: 0 !important;
		left: 0 !important;
		width: 100% !important;
		height: 100% !important;
		background-color: rgba(0, 0, 0, 0.4) !important;
		z-index: 99998 !important;
	}
</style>