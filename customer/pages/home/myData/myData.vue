<template>
	<!-- 导航 -->
	<view class="navigation">
		<view class="status_bar"></view>
		<view style="height: 100rpx;display: flex;align-items: center;justify-content: center;">
			<uni-icons type="back" @click="back()" size="21" style='position: absolute;left: 30rpx;'></uni-icons>
			<text style="color: #484848;font-size: 32rpx;">个人资料</text>
		</view>
	</view>
	<view style="height: var(--status-bar-height);padding-top: 100rpx"></view>
	<view style="background-color: white;">
		<view class="allStyle" style="border-bottom: 1rpx solid #f8f8f8;" @click="imgsClick()">
			<text style="font-size: 32rpx;color: #323232 ;">头像</text>
			<image style="width: 100rpx;height: 100rpx;border-radius: 60rpx;margin-right: 30rpx;"
				:src="counter.user_imgs" mode="aspectFill">
			</image>
			<uni-icons type="right" style='position: absolute;right: 10rpx;' size="24" color="#cacaca "></uni-icons>
		</view>
		<view class="allStyle" style="border-bottom: 1rpx solid #f8f8f8;" @click="proxy.$refs.rename.open('center')">
			<text style="font-size: 32rpx;color: #323232 ;">昵称</text>
			<text style="margin-right: 30rpx;color: #dadada ;">{{counter.nickname}}</text>
			<uni-icons type="right" style='position: absolute;right: 10rpx;' size="24" color="#cacaca "></uni-icons>
		</view>

		<view class="allStyle" style="border-bottom: 1rpx solid #f8f8f8;" @click="proxy.$refs.setWord.open()">
			<text style="font-size: 32rpx;color: #323232 ;">登录密码</text>
			<uni-icons type="right" style='position: absolute;right: 10rpx;' size="24" color="#cacaca "></uni-icons>
		</view>
		<!-- 2023-12-1 应要求取消银行卡管理 -->
		<!-- <view class="allStyle" @click="enterBankSetPage">
			<text style="font-size: 32rpx;color: #323232 ;">银行卡管理</text>
			<uni-icons type="right" style='position: absolute;right: 10rpx;' size="24" color="#cacaca "></uni-icons>
		</view> -->

	</view>

	<view style="background-color: white;margin-top: 30rpx;">
		<view class="allStyle" style="border-bottom: 1rpx solid #f8f8f8;"
			v-show="counter.userAllData.userinfo.RealName==1">
			<text style="font-size: 32rpx;color: #323232 ;">真实姓名</text>
			<text style="color: #dadada ;">{{counter.sfz_name}}</text>
		</view>
		<view class="allStyle" style="border-bottom: 1rpx solid #f8f8f8;"
			v-show="counter.userAllData.userinfo.RealName==1">
			<text style="font-size: 32rpx;color: #323232 ;">身份证号</text>
			<text style="color: #dadada ;">{{counter.sfz_id}}</text>
		</view>
		<view class="allStyle"
			@click="counter.userAllData.userinfo.RealName==0?proxy.$refs.authenticationPopup.open():''">
			<text style="font-size: 32rpx;color: #323232 ;">实名认证</text>
			<text style="margin-right: 30rpx;color: #dadada ;">
				{{counter.userAllData.userinfo.RealName==0?'未实名':'已实名'}}
			</text>
			<uni-icons type="right" style='position: absolute;right: 10rpx;' size="24" color="#cacaca "></uni-icons>
		</view>
		<view class="allStyle" @click="counter.userAllData.userinfo.mobile==''?proxy.$refs.setPhoneNumber.open():''">
			<text style="font-size: 32rpx;color: #323232 ;">手机号码</text>
			<text style="margin-right: 30rpx;color: #dadada ;">
				{{counter.userAllData.userinfo.mobile==''?'未设置':counter.userAllData.userinfo.mobile}}
			</text>
			<uni-icons type="right" style='position: absolute;right: 10rpx;' size="24" color="#cacaca "></uni-icons>
		</view>
	</view>

	<uni-popup ref="rename">
		<view style="width: 550rpx;height: 320rpx;background-color: white;border-radius: 25rpx;">
			<view style="display: flex;align-items: center;justify-content: center;width: 550rpx;height: 100rpx;">
				<text style="font-size: 34rpx;font-weight: bold;color: #3a3a3a ;">修改昵称</text>
			</view>
			<view
				style="display: flex;align-items: center;justify-content: center;width:450rpx;height: 100rpx;margin: auto;margin-top: 20rpx;">
				<uni-easyinput placeholder="昵称最长10个字" :maxlength="10" v-model="blurVal"></uni-easyinput>
			</view>
			<view class="renameqx">
				<view style="border-right: 0.5rpx solid #f5f5f5 ;" @click="proxy.$refs.rename.close('center')">取消</view>
				<view style="border-left: 0.5rpx solid #f5f5f5 ;color: #1d9dff ;" @click="nickClick()">确认</view>
			</view>
		</view>
	</uni-popup>

	<uni-popup ref="authenticationPopup" type="center" :maskClick="false">
		<view class="authenticationCard">
			<view style="text-align: center;font-weight:bold;">
				<text style="font-size:42rpx;">实名认证</text>
			</view>
			<uni-forms border>
				<uni-forms-item label="真实姓名:">
					<uni-easyinput :inputBorder="false" placeholder="请输入真实姓名" type="string"
						v-model="authenticationValue.realNmae" />
				</uni-forms-item>
				<uni-forms-item label="身份证号:">
					<uni-easyinput :inputBorder="false" placeholder="请输入身份证号码" type="string"
						v-model="authenticationValue.user_id" />
				</uni-forms-item>
			</uni-forms>
			<view class="card_bottom">
				<view class="newButton" style="background-color: #aaaaaa;flex:0.7;"
					@click="proxy.$refs.authenticationPopup.close()">
					取消
				</view>
				<view class="newButton" style="background-color: #202736; flex:1;margin-left:20rpx;"
					@click="setAuthenticationPopup">
					确定
				</view>
			</view>
			<view class="note_box">
				<text style="font-size:32rpx;">注意事项：</text><br>
				<text style="color: red;"> 1、请认证填写相关信息，此信息将会直接影响投注,提现，充值等功能</text><br>
				<text>2、此实名认证后将无法修改实名，如填写错误请联系平台处理</text><br>
				<text>3、金额提现只能提现到认证人绑定的收款平台、无法自定义提现人信息</text>
			</view>
		</view>
	</uni-popup>
	<fui-dialog :show="dialogShow" content="确定退出登录吗？" @click="clicklogOut"></fui-dialog>
	<view class="bottonLogOut">
		<text @click="dialogShow=true">退出登录/切换账号</text>
	</view>

	<uni-popup ref="setWord" type="center">
		<view class="setWord_card">
			<view class="card_title">
				<text style="font-size:32rpx;">修改密码</text>
			</view>
			<uni-forms border>
				<uni-forms-item label="旧密码:">
					<uni-easyinput :inputBorder="false" placeholder="请输入旧密码" type="password" v-model="oldPassword" />
				</uni-forms-item>
				<uni-forms-item label="新密码:">
					<uni-easyinput :inputBorder="false" placeholder="请输入新密码" type="password" v-model="newPassword" />
				</uni-forms-item>
			</uni-forms>
			<view class="card_bottom">
				<view class="newButton" style="background-color: #aaaaaa;flex:0.7;"
					@click="proxy.$refs.setWord.close()">
					取消
				</view>
				<view class="newButton" style="background-color: #202736; flex:1;margin-left:20rpx;"
					@click="setPassworde">
					确定
				</view>
			</view>
			<view style="margin-top:20rpx;color: #b8b8b8;">
				<text @click="forget">忘记密码</text>
			</view>
		</view>
	</uni-popup>

	<uni-popup ref="setPhoneNumber" type="center">
		<view class="phoneCard">
			<view class="title_box">手机号码绑定</view>
			<uni-forms-item label="手机号" required label-position="top">
				<uni-easyinput placeholder="请输入手机号" v-model="setPhoneData.phoneNumber" trim="all" type="number" />
			</uni-forms-item>
			<uni-forms-item label="验证码" required label-position="top">
				<view class="codeBox">
					<uni-easyinput placeholder="请输入验证码" v-model="setPhoneData.phoneCode" trim="all" />
					<view
						:class="typeof(codeNumber)=='string' &&  isPhone(setPhoneData.phoneNumber)?'codeButton':'codeButtonFalse'"
						@click="getCode">
						{{codeNumber}}
					</view>
				</view>
			</uni-forms-item>
			<view class="card_bottom">
				<view class="newButton" style="background-color: #aaaaaa;flex:0.7;" @click="setPhoneNumebr('close')">
					取消
				</view>
				<view class="newButton" style="background-color: #202736; flex:1;margin-left:20rpx;"
					@click="setPhoneNumebr('open')">
					确定
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import api from '@/common/vmeitime-http/'
	import {
		useCounterStore
	} from '@/stores/counter'
	import {
		ref,
		reactive,
		getCurrentInstance
	} from 'vue';
	import common from '@/common/common'
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const dialogShow = ref(false) //对话框控制
	const oldPassword = ref('')
	const newPassword = ref('')
	const counter = useCounterStore(); //状态管理
	const imgsClick = () => { //点击头像栏更换头像
		uni.chooseImage({
			count: 1,
			crop: {
				width: 500,
				height: 500,
				quality: 100
			},
			success(res) {
				if (res.tempFiles[0].size > 83886080) {
					uni.showToast({
						icon: 'error',
						title: '图片大小不能超过10M',
						duration: 1500
					});
				} else {
					uni.uploadFile({
						url: counter.baseUrl + '/api/common.Common/upload',
						header: {
							server: 1,
							"ba-user-token": uni.getStorageSync('access_token'),
						},
						filePath: res.tempFilePaths[0],
						name: 'file',
						success(restwo) {
							var imgsUrl = JSON.parse(restwo.data)
							api.EditAvatar({
								'avatar': imgsUrl.data.file.url,
							}).then((res) => {
								if (res.data.code == 1) {
									counter.user_imgs = counter.baseUrl + imgsUrl.data.file.url
								}
								uni.showToast({
									title: res.data.data,
									icon: res.data.msg
								})
							})

						}
					})
				}
			},
		})
	}
	const setPassworde = () => { //设置账号密码
		uni.showLoading({
			title: '修改中'
		})
		if (newPassword.value.length < 6) {
			uni.showToast({
				title: '密码最少6位数喔~',
				icon: 'none',
				position: 'center'
			})
			return
		} else if (newPassword.value.length > 15) {
			uni.showToast({
				title: '密码最多15位数喔~',
				icon: 'none',
				position: 'center'
			})
			return
		}
		api.changePassword({
			"oldPassword": oldPassword.value,
			"newPassword": newPassword.value
		}).then(res => {
			uni.hideLoading()
			proxy.$refs.setWord.close()
			if (res.data.code == 1) {
				uni.showToast({
					title: '修改成功，稍后会跳转至登录请重新登录~',
					icon: 'none',
					position: 'center',
					duration: 3000,
					mask: true
				})
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}, 3500)
			} else {
				uni.showToast({
					title: '修改失败，请稍后再试~',
					position: 'center',
					icon: 'error'
				})
			}

		})
	}
	const setPhoneData = reactive({
		phoneNumber: '',
		phoneCode: ''
	})
	const forget = () => { //忘记密码
		proxy.$refs.setWord.close()
		uni.navigateTo({
			url: '/pages/login/forgetThePassword',
			animationType: 'slide-in-bottom'
		})
	}
	const setPhoneNumebr = (type) => {
		if (type == 'open') {
			uni.showLoading({
				title: '绑定中',
				mask: true
			})
			api.changePhone({
				"phone": setPhoneData.phoneNumber,
				"sms": setPhoneData.phoneCode
			}).then(res => {
				uni.hideLoading()
				uni.showToast({
					title: res.data.data,
					icon: res.data.msg
				})
				proxy.$refs.setPhoneNumber.close()
				if (res.data.code == 1) {
					counter.userAllData.userinfo.mobile = setPhoneData.phoneNumber
				}
			}).catch(err => {
				uni.hideLoading()
				uni.showToast({
					title: '数据处理失败，请反馈平台方',
					icon: 'none',
					position: 'center'
				})
			})
		} else {
			proxy.$refs.setPhoneNumber.close()
		}
	}
	const enterBankSetPage = () => {
		uni.navigateTo({
			url: '/pages/home/bankCardSet/bankCardSet'
		})
	}

	function isPhone(phone) { //手机号码校验
		var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
		if (!myreg.test(phone)) {
			return false;
		} else {
			return true;
		}
	}
	const clicklogOut = (e) => { //退出登录弹窗
		if (e.index == 1) {
			//用户点击确定
			uni.showLoading({
				title: '退出中',
				mask: true
			})
			uni.request({
				url: uni.getStorageSync('api') + '/api/user/logout',
				header: {
					"server": "1",
					"ba-user-token": counter.access_token
				},
				success(res) {
					uni.hideLoading()
					counter.hasLogin = false;
					counter.access_token = null
					counter.refresh_token = null
					uni.setStorageSync('access_token', '')
					uni.setStorageSync('refresh_token', '')
					uni.setStorageSync('shop_id', '')
					uni.setStorageSync('user_id', '')
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}
			})
		}
		dialogShow.value = false
	}

	const blurVal = ref() //设置昵称的输入框值
	const authenticationValue = reactive({
		realNmae: '',
		user_id: ''
	})
	const setTime = ref(null)
	const codeNumber = ref('获取验证码')
	const getCode = () => {
		uni.showLoading({
			title: '发送中',
			mask: true
		})
		api.PhoneSend({
			'phone': setPhoneData.phoneNumber,
			'event': 'user_change_phone'
		}).then(res => {
			uni.hideLoading()
			if (res.data.code == 1) {
				uni.showToast({
					title: '发送成功，请留意查收',
					icon: 'none',
					position: 'center'
				})
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
					title: res.data.msg,
					icon: 'error',
				})
			}
		}).catch(err => {
			uni.hideLoading()
			uni.showToast({
				title: '数据处理失败，请反馈平台方',
				icon: 'none',
				position: 'center'
			})
		})
	}
	const setAuthenticationPopup = () => { //实名认证添加提交
		if (authenticationValue.realNmae == '') {
			uni.showToast({
				title: '请输入您的真实姓名',
				position: 'center',
				icon: 'none'
			})
			return
		}
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		if (reg.test(authenticationValue.user_id) === false) {
			uni.showToast({
				title: '请输入正确的身份证号码',
				position: 'center',
				icon: 'none'
			})
			return
		}
		uni.showLoading({
			title: '提交中',
			mask: true
		})
		api.setUser_authentication({
			'name': authenticationValue.realNmae,
			'number': authenticationValue.user_id,
		}).then(res => {
			uni.hideLoading()
			if (res.data.code == 1) {
				counter.userAllData.userinfo.RealName = 1
				counter.sfz_name = authenticationValue.realNmae
				counter.sfz_id = authenticationValue.user_id
				uni.setStorageSync('RealName', '1')
				proxy.$refs.authenticationPopup.close()
			}
			uni.showToast({
				title: res.data.data,
				icon: res.data.msg
			})
			uni.reLaunch({
				url: '/pages/home/home'
			});
		})
	}
	const nickClick = () => { //修改昵称 点击确定
		//敏感词
		var sensitiveWordsArray = ['加', '加我', '联系', 'wx', '微信', '你妹的', '你大爷', '傻', '微', 'v', 'V'];

		if (common.flition(blurVal.value, sensitiveWordsArray)) {
			uni.showModal({
				title: '注意',
				content: '名称内疑似包含违禁词，请检查后重新发布，违禁内容参考：' + common.replace(blurVal.value, '*',
					sensitiveWordsArray),
				confirmText: '确认',
				confirmColor: '#f04b49',
				success: function(res) {}
			});
			return
		}

		if (blurVal.value.replace(/[^0-9]/g, "").length > 6) {

			uni.showModal({
				title: '注意',
				content: '名称内疑似包含联系方式，请检查后重新发布',
				confirmText: '确认',
				confirmColor: '#f04b49',
				success: function(res) {}
			});
			return
		}
		api.EditNickname({
			'nickname': blurVal.value
		}).then((nickNameRes) => {
			if (nickNameRes.data.code == 1) {
				counter.nickname = blurVal.value
				uni.showToast({
					title: nickNameRes.data.data,
					icon: nickNameRes.data.msg
				})
			} else {
				uni.showToast({
					title: nickNameRes.data.data,
					icon: 'error'
				})
			}
			proxy.$refs.rename.close()
		})
	}

	const back = () => {
		uni.navigateBack()
	}
</script>

<style>
	.codeBox {
		display: flex;
		align-items: center;
	}

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

	.title_box {
		font-size: 38rpx;
		font-weight: bold;
		text-align: center;
		padding-bottom: 20rpx;
	}

	.phoneCard {
		width: 680rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		background-color: #fff;
	}

	.note_box {
		margin-top: 20rpx;
		line-height: 50rpx;
	}

	.authenticationCard {
		width: 680rpx;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 15rpx;
	}

	.newButton {
		height: 80rpx;
		text-align: center;
		font-size: 32rpx;
		color: white;
		line-height: 80rpx;
		border-radius: 15rpx;
	}

	.card_bottom {
		display: flex;
		align-items: center;
		margin-top: 20rpx;

	}

	.card_title {
		font-weight: bold;
		text-align: center;
	}

	.setWord_card {
		width: 680rpx;
		padding: 20rpx;
		border-radius: 15rpx;
		background-color: white;
	}

	.bottonLogOut {
		width: 100%;
		background-color: white;
		position: fixed;
		bottom: 0rpx;
		padding: 20rpx;
		box-sizing: border-box;
		text-align: center;
		color: #f04b49;
		font-weight: bold;
		font-size: 32rpx;
	}

	body {
		background-color: #f9f9f9;
	}

	.status_bar {
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
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

	.allStyle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 660rpx;
		padding: 30rpx;
		margin: auto;
	}

	.renameqx {
		border-top: 1rpx solid #f5f5f5;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 550rpx;
		height: 80rpx;
		margin-top: 20rpx;
	}

	.renameqx view {
		height: 75rpx;
		width: 274rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>