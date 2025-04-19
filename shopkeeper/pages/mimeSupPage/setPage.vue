<template>
	<view class="zhuantai"></view>
	<uni-nav-bar title="编辑资料" leftIcon="back" @clickLeft="fanhui" leftText="返回" />
	<view class="tita">
		<text>基本信息</text>
	</view>
	<view style="width:100%;background-color: white;">
		<view class="dataCard" @click="setLogo">
			<text>店铺头像</text>
			<image :src="counter.shopBasicsData.avatar" style="width:80rpx; height:80rpx;border-radius:10rpx;"
				mode="aspectFill">
			</image>
		</view>
		<view class="dataCard" @click="proxy.$refs.nicknameSet.open()">
			<text>店铺昵称</text>
			<view style="font-size:22rpx;color: #555555;display: flex;">
				<text style="margin-right:10rpx;">{{counter.shopBasicsData.nickname}}</text>
				<uni-icons type="forward"></uni-icons>
			</view>
		</view>
		<view v-for="item,index in dataCard" :key="item" class="dataCard" @click="clickOption(index)">
			<text>{{item.name}}</text>
			<view style="font-size:22rpx;color: #555555;display: flex;">
				<text style="margin-right:10rpx;">{{item.neir}}</text>
				<uni-icons type="forward"></uni-icons>
			</view>
		</view>
		<view class="dataCard" @click="openPush">
			<text>推送绑定</text>
			<view style="font-size:22rpx;color: #555555;display: flex;">
				<text style="max-width:400rpx;overflow: hidden;text-overflow: ellipsis;">
					{{counter.push_key}}
				</text>
				<uni-icons type="forward"></uni-icons>
			</view>
		</view>
	</view>
	<view class="tita">
		<text>店铺信息</text>
	</view>
	<view style="width:100%;background-color: white;">
		<view class="dataCard" v-for="item,index in dianpu" :key="item" @click="dianpuxinxi(index)">
			<text>{{item.name}}</text>
			<view style="font-size:22rpx;color: #555555;display: flex;align-items: center;">
				<text>{{item.neir}}</text>
				<uni-icons type="forward"></uni-icons>
			</view>
		</view>
		<view class="dataCard" @click="gogonggao">
			<text>公告设置</text>
			<view style="font-size:22rpx;color: #555555;display: flex;">
				<uni-icons type="forward"></uni-icons>
			</view>
		</view>
	</view>
	<view class="bottomTab">
		<text @click="show=true">退出登录/切换账号</text>
	</view>
	<uni-popup ref="nicknameSet" type="dialog">
		<uni-popup-dialog title='请输入您要修改的店铺昵称' mode='input' :value="counter.shopBasicsData.nickname"
			placeholder="昵称限制8个字~" @confirm="SetNickName">
		</uni-popup-dialog>
	</uni-popup>

	<uni-popup type="bottom" ref="logo">
		<view style="width:100%;border-radius:20rpx 20rpx 0 0;">
			<view class="logoButton" v-for="itme,index in 3" @click="amendLogo(index)"
				:style="index==2?'margin-top:20rpx;':''">
				<text>{{index==0?'查看头像':index==1?'修改头像':'取消'}}</text>
			</view>
		</view>
	</uni-popup>

	<uni-popup ref="WeChatSet" type="dialog">
		<uni-popup-dialog title='设置微信号' mode='input' @confirm="SetWeChat"
			:value="counter.shopBasicsData.ShopConfig.WeChat">
		</uni-popup-dialog>
	</uni-popup>
	<uni-popup ref="PhoneSet" type="dialog">
		<uni-popup-dialog title='设置联系电话' mode='input' @confirm="SetPhone"
			:value="counter.shopBasicsData.ShopConfig.phone">
		</uni-popup-dialog>
	</uni-popup>

	<uni-popup ref="citys" type="center" :isMaskClick="false">
		<view class="citysPopupCard">
			<text style="font-weight: bold;">设置店铺地址</text>
			<view style="text-align: left;">
				<text style="padding-bottom:20rpx;">选择地区：</text>
				<uni-data-picker :placeholder="counter.shopBasicsData.ShopConfig.address" popupTitle="请选择城市"
					:localdata="citysData.citys" @change="change" />
			</view>
			<view style="margin:20rpx 0rpx;text-align: left;">
				<text>详细地址：</text>
				<uni-easyinput placeholder="请输入详细地址" v-model="detailedAddress" />
			</view>
			<view style="display: flex;justify-content: space-between;">
				<view class="citysButtom" style="background-color:#afafaf;" @click="proxy.$refs.citys.close()">
					<text>取消</text>
				</view>
				<view class="citysButtom" style="background-color:#4f93ff;" @click="confirm">
					<text>确定</text>
				</view>
			</view>
		</view>
	</uni-popup>
	<uni-popup ref="identity" type="center" :isMaskClick="false">
		<view class="citysPopupCard">
			<text style="font-weight: bold;">实名认证</text>
			<view style="text-align: left;">
				<text>身份证号：</text>
				<uni-easyinput placeholder="请输入您身份证号码" v-model="identityAuthentication.id" type="number" maxlength="18"
					v-if="counter.shopBasicsData.RealName!=1" />
				<text v-else>{{counter.shopBasicsData.sfz_id}}</text>
			</view>
			<view style="text-align: left;margin:20rpx 0rpx;">
				<text>真实姓名：</text>
				<uni-easyinput placeholder="请输入您真实姓名" v-model="identityAuthentication.name"
					v-if="counter.shopBasicsData.RealName!=1" />
				<text v-else>{{counter.shopBasicsData.sfz_name}}</text>
			</view>
			<view style="display: flex;justify-content: space-between;">
				<view class="citysButtom" style="background-color:#afafaf;" @click="proxy.$refs.identity.close()">
					<text>取消</text>
				</view>
				<view class="citysButtom" style="background-color:#4f93ff;" @click="identityConfirm">
					<text>确定</text>
				</view>
			</view>
		</view>
	</uni-popup>
	<uni-popup type="dialog" ref="setTelephone">
		<setPhonePopup @closePopup="proxy.$refs.setTelephone.close()"></setPhonePopup>
	</uni-popup>

	<uni-popup type="dialog" ref="addKey">
		<uni-popup-dialog mode="input" title="请输入单点推送接口地址" placeholder="公众号复制的链接" @confirm="setKays">
		</uni-popup-dialog>
	</uni-popup>

	<fui-dialog :show="show" @click="clickDialogButton" content="确定退出登录吗？"></fui-dialog>

	<fui-dialog :show="pushShow" @click="pushDialogButton"
		content="由于该推送为第三方通知，有概率出现不通知或通知延迟，请勿依赖使用，店主使用过程中请养成临期查单的好习惯。感谢您的支持"
		:buttons="[{text:'知道了'+'('+countDown+')'}]">
	</fui-dialog>

</template>

<script setup>
	import {
		useCounterStore
	} from '@/stores/counter'
	import api from '@/common/vmeitime-http/mine/mine.js';
	import citysData from "@/common/ChinaCitysData/citys.js"
	import {
		ref,
		onBeforeMount,
		reactive,
		getCurrentInstance
	} from 'vue';
	import setPhonePopup from "@/components/common/setPhone_popup/setPhone_popup.vue"
	import common from '@/common/common'
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const fanhui = () => {
		uni.navigateBack()
	}
	const counter = useCounterStore(); //状态管理
	const show = ref(false) //对话框显示
	const region = ref('') //省市区
	const detailedAddress = ref(null) //详细地址
	const countDown = ref(0) //倒计时
	const pushShow = ref(false)
	const identityAuthentication = reactive({
		id: '',
		name: ''
	}) //身份证数据存储
	const dataCard = reactive([{
			name: '店铺认证',
			neir: counter.shopBasicsData.ShopConfig.StoreCertification == '0' ? '去设置' : counter.shopBasicsData
				.ShopConfig.StoreCertification == '1' ? '已认证' : counter.shopBasicsData.ShopConfig
				.StoreCertification == '3' ? '审核失败(重新提交)' : '待审核',
		},
		{
			name: '实名认证',
			neir: counter.shopBasicsData.RealName == 1 ? '已认证' : '未认证',
		},
		{
			name: '绑定手机',
			neir: counter.shopBasicsData.ShopConfig.Telephone != null ? counter.shopBasicsData.ShopConfig
				.Telephone : '点击设置',
		},
		{
			name: '收款管理',
			neir: ''
		},

	])
	const dianpu = reactive([{
			name: '店铺地址',
			neir: counter.shopBasicsData.ShopConfig.address == null ? '去设置' : counter.shopBasicsData.ShopConfig
				.address
		},
		{
			name: '店铺微信',
			neir: counter.shopBasicsData.ShopConfig.WeChat == null ? '未设置' : counter.shopBasicsData.ShopConfig
				.WeChat
		},
		{
			name: '店铺电话',
			neir: counter.shopBasicsData.ShopConfig.Telephone == null ? '未填写' : counter.shopBasicsData.ShopConfig
				.Telephone
		}
	])
	const clickDialogButton = (e) => { //退出登录
		show.value = false
		if (e.index == 1) {
			uni.showLoading({
				title: '数据清理中~',
				mask: true
			})
			uni.request({
				url: counter.baseUrl + '/api/user/logout',
				header: {
					"server": "1",
					"ba-user-token": counter.access_token
				},
				success(res) {
					uni.hideLoading()
					counter.hasLogin = false
					uni.redirectTo({
						url: '/pages/login/login'
					})
					counter.access_token = null
					counter.refresh_token = null
					uni.setStorageSync('access_shop_token', '')
					uni.setStorageSync('refresh_shop_token', '')
				}
			})
		}
	}
	const change = (e) => {
		region.value = ''
		for (var i = 0; i < e.detail.value.length; i++) {
			region.value += e.detail.value[i].text
		}
	}

	const gogonggao = () => {
		uni.navigateTo({
			url: '/pages/mimeSupPage/announcement_set'
		})
	}
	const confirm = () => { //设置店铺地址
		if (region.value != '' && detailedAddress.value != '') {
			uni.showLoading({
				title: '设置中~'
			})
			api.PostStoreInfo({
				"type": "address",
				"value": region.value + detailedAddress.value
			}).then((res) => {
				if (res.data.code == 1) {
					uni.hideLoading()
					uni.showToast({
						title: '设置成功~'
					})
					counter.shopBasicsData.ShopConfig.address = region.value + detailedAddress.value
					proxy.$refs.citys.close()
				} else {
					uni.hideLoading()
					uni.showToast({
						title: '设置失败~',
						icon: 'error'
					})
					proxy.$refs.citys.close()
				}

			})
		} else {
			uni.showToast({
				title: '地址不能为空~',
				icon: 'error',
			})
		}

	}

	const identityConfirm = () => { //实名认证
		if (counter.shopBasicsData.RealName != 1) {
			uni.showLoading({
				title: '设置中~'
			})
			if (identityAuthentication.id != '' && identityAuthentication.name != '' && identityAuthentication.id
				.length == 18) {
				api.PostRealAut({
					"id": identityAuthentication.id,
					"name": identityAuthentication.name
				}).then((res) => {
					if (res.data.code == 1) {
						uni.hideLoading()
						uni.showToast({
							title: '认证成功~'
						})
						counter.shopBasicsData.sfz_id = identityAuthentication.id
						counter.shopBasicsData.sfz_name = identityAuthentication.name
						counter.shopBasicsData.RealName == 1
						proxy.$refs.identity.close()
					} else {
						uni.hideLoading()
						uni.showToast({
							title: res.data.data,
							icon: 'error'
						})
					}
				})
			} else {
				if (identityAuthentication.id.length < 18) {
					uni.showToast({
						title: '身份证小于18位~',
						icon: 'error'
					})
				} else {
					uni.showToast({
						title: '真实姓名不能为空',
						icon: 'error'
					})
				}
			}
		} else {
			proxy.$refs.identity.close()
		}
	}

	const clickOption = (e) => {
		if (e == 0) {
			uni.navigateTo({
				url: '/pages/mimeSupPage/attestation/shopArresrarion'
			})
		} else if (e === 2) {
			proxy.$refs.setTelephone.open()

		} else if (e == 1) {
			proxy.$refs.identity.open()
		} else if (e == 3) {
			uni.navigateTo({
				url: '/pages/mimeSupPage/receipt'
			})
		}

	}
	const timer = ref(null) //定时器
	const openPush = () => {
		countDown.value = 5
		timer.value = setInterval(() => {
			countDown.value--
			if (countDown.value <= 0) {
				clearInterval(timer.value)
				timer.value = null
				countDown.value = '点击打开'
			}
		}, 1000)
		pushShow.value = true;
	}
	const pushDialogButton = () => {
		if (typeof(countDown.value) == 'string') {
			pushShow.value = !pushShow.value;
			proxy.$refs.addKey.open()
		}
	}
	const SetNickName = (e) => { //修改昵称
		var sensitiveWordsArray = ['加', '加我', '联系', 'wx', '微信', '你妹的', '你大爷', '傻', '微', 'v', 'V']

		if (common.flition(e, sensitiveWordsArray)) {

			uni.showModal({
				title: '注意',
				content: '名称内疑似包含违禁词，请检查后重新发布，违禁内容参考：' + common.replace(e, '*', sensitiveWordsArray),
				confirmText: '确认',
				confirmColor: '#FFD700'
			});
			return
		}


		if (e.replace(/[^0-9]/g, "").length > 6) {

			uni.showModal({
				title: '注意',
				content: '名称内疑似包含联系方式，请检查后重新发布',
				confirmText: '确认',
				confirmColor: '#FFD700'
			});
			return
		}

		if (e != counter.shopBasicsData.nickname && e != '' && e.length <= 8) {
			uni.showLoading({
				title: '修改中~'
			})
			api.GetEditNickname({
				"nickname": e
			}).then((res) => {
				uni.hideLoading()
				uni.showToast({
					title: res.data.data,
					icon: res.data.msg
				})
				counter.shopBasicsData.nickname = e
			})
			proxy.$refs.nicknameSet.close()
			closeSetNickname()
		} else {
			uni.showToast({
				title: '昵称限制8个字哦',
				icon: 'error'
			})
		}
	}
	const setKays = (e) => {
		if (e == '') {
			return uni.showToast({
				title: '请输入推送链接'
			})
		}
		uni.showLoading({
			title: '设置中'
		})
		api.getPushKey({
			'key': e
		}).then(res => {
			uni.hideLoading()
			uni.showToast({
				title: res.data.data,
				icon: res.data.msg
			})
		})
	}
	const setLogo = () => { //点击店铺头像
		proxy.$refs.logo.open()
	}
	const amendLogo = (index) => { //对头像进行操作
		if (index == 0) {
			var arr = counter.shopBasicsData.avatar.split()

			uni.previewImage({
				urls: arr,
			})
		} else if (index == 1) {
			uni.chooseImage({
				count: 1,
				crop: {
					width: 250,
					height: 250,
					quality: 90
				},
				success(Res) {
					uni.showLoading({
						title: '上传中~'
					})
					var imgUrl = Res.tempFilePaths[0]
					uni.uploadFile({
						url: counter.baseUrl + '/api/common.Common/upload',
						header: {
							server: 1,
							"ba-user-token": counter.access_token
						},
						filePath: imgUrl,
						name: 'file',
						success(res) {
							if (JSON.parse(res.data).code == 1) {
								uni.hideLoading()
								var serverImagUrl = JSON.parse(res.data).data.file.url
								api.GetEditAvatar({
									"avatar": serverImagUrl
								}).then((imgRes) => {
									counter.shopBasicsData.avatar = counter.baseUrl +
										serverImagUrl
								})
							} else {
								uni.showToast({
									title: '注意图片最大10MB~',
									icon: 'error'
								})
							}
						},
					})
				}
			})
			proxy.$refs.logo.close()
		} else {
			proxy.$refs.logo.close()
		}
	}

	const SetWeChat = (e) => { //修改店铺微信号
		if (e != '') {
			uni.showLoading({
				title: '设置中~'
			})
			api.PostStoreInfo({
				"type": "WeChat",
				"value": e
			}).then((res) => {
				if (res.data.code == 1) {
					uni.hideLoading()
					uni.showToast({
						title: '设置成功~',
					})
					counter.shopBasicsData.ShopConfig.WeChat = e
				} else {
					uni.showToast({
						title: '设置失败~',
						icon: 'error'
					})
				}
			})
		}
	}

	const SetPhone = (e) => { //修改店铺联系电话
		if (e != '') {
			uni.showLoading({
				title: '设置中~'
			})
			api.PostStoreInfo({
				"type": "Telephone",
				"value": e
			}).then((res) => {
				if (res.data.code == 1) {
					uni.hideLoading()
					uni.showToast({
						title: '设置成功~',
					})
					counter.shopBasicsData.ShopConfig.Telephone = e
				} else {
					uni.showToast({
						title: '设置失败~',
						icon: 'error'
					})
				}
			})
		}
	}

	const dianpuxinxi = (e) => {
		if (e == 0) {
			proxy.$refs.citys.open()
		} else if (e == 1) {
			proxy.$refs.WeChatSet.open()
		} else {
			proxy.$refs.PhoneSet.open()
		}
	}
</script>

<style>
	.citysButtom {
		width: 260rpx;
		height: 60rpx;
		border-radius: 10rpx;
		color: white;
		text-align: center;
		line-height: 60rpx;
	}

	.citysPopupCard {
		width: 640rpx;
		padding: 30rpx;
		background-color: white;
		border-radius: 30rpx;
		text-align: center;
	}

	.logoButton {
		width: 100%;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		border-bottom: 1rpx #eeeeee solid;
		background-color: white;
	}

	.popupStyle {
		width: 700rpx;
		height: 400rpx;
		background-color: white;
		display: flex;
		align-items: center;
		flex-flow: column;
		border-radius: 20rpx;
	}

	.bottomTab {
		width: 100%;
		height: 90rpx;
		background-color: white;
		position: fixed;
		bottom: 0rpx;
		color: #FDC830;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 20rpx 20rpx 0 0;
	}

	.tita {
		height: 65rpx;
		display: flex;
		align-items: center;
		margin-left: 20rpx;

	}

	.tita text {
		font-size: 32rpx;
		font-weight: bold;
	}

	.dataCard {
		width: 710rpx;
		height: 95rpx;
		margin: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #f3f3f3;
	}

	.zhuantai {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}

	body {
		background-color: #f3f3f3;
	}
</style>