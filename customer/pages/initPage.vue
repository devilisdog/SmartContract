<template>
	<image src="../static/img/main/lg3.png" class="imageStyle"></image>
	<view class="execute_box">
		<image src="@/static/img/main/custom_Loading.png" class="loadingStyle" v-show="loadingShow"></image>
		<text>{{executeState}}</text>
	</view>
	<view class="versions_box">
		<text>当前版本：{{nowVersions}}</text>
	</view>
	<!-- 更新模块 -->
	<qw-updaters ref="updaters"></qw-updaters>
</template>

<script setup>
	import api from '@/common/vmeitime-http/index.js'
	import {
		useCounterStore
	} from '@/stores/counter'
	import {
		onShow
	} from "@dcloudio/uni-app"
	import {
		onBeforeMount,
		ref,
		reactive,
		getCurrentInstance
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const executeState = ref('')
	const loadingShow = ref(true)
	const nowVersions = ref('web') //当前版本昵称
	const counter = useCounterStore(); //状态管理数据
	const webVersions = ref(2228)
	onBeforeMount(() => {
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, function(inf) { //获取当前昵称
			nowVersions.value = inf.version
			appInit(inf.versionCode)
		})
		// #endif
		// #ifdef H5
		executeState.value = '正在检测是否新版本~'
		api.GatVersion({}).then(res => { //web更新
			// console.log(res)
			var veresion_span = Number(res.data.data.User.latest_version)
			if (veresion_span > webVersions.value) {
				// location.reload()//刷新页面
			}
			getUserInfo()
		}).catch((res) => {
			console.log(res)
		})
		// #endif
	})
	const appInit = (nowVersionCode) => { //版本更新检测
		executeState.value = '正在检测是否新版本~'
		console.log(uni.getStorageSync('api'))
		api.GatVersion({}).then(res => {
			console.log(res)
			var veresion_span = Number(res.data.data.User.latest_version) - Number(nowVersionCode) //版本跨度
			if (veresion_span <= 0) { //无版本跟新拦截
				getUserInfo()
				return
			} else {
				veresion_judge(veresion_span, res.data.data) //执行更新方式判断
			}
		}).catch((res) => {
			console.log(res)
		})
	}

	const veresion_judge = (veresion_span, veresion_info) => { //判断更新方式
		if (veresion_span < 2) { //如与服务器版本相差一个版本直接按照服务器给的更新方式更新，
			if (veresion_info.isHotUpdata == "true") { //是否是热更新
				executeState.value = '正在下载新版本~'
				plus.downloader.createDownload( //创建下载任务
					veresion_info.User.user_hotupdata, {
						filename: '_doc/update/'
					},
					function(d, state) {
						if (state == 200) {
							resourceNew(d.filename)
						} else {
							executeState.value = '安装包下载失败！请关闭APP重试~'
						}
					},
				).start()
			} else {
				loadingShow.value = false
				executeState.value = ''
				if (uni.getSystemInfoSync().platform == 'ios') { //整包ios
					uni.showModal({
						title: '提示',
						content: veresion_info.User.update_text,
						confirmText: '去下载',
						showCancel: false,
						success: function(ress) {
							plus.runtime.openURL(encodeURI(veresion_info.User.latest_download_ios))
						}
					});
				} else { //整包安装
					proxy.$refs.updaters.checkVersion({
						name: '全新版本~', // 标题 非必填
						content: veresion_info.User.update_text, // 更新内容  非必填
						version: veresion_info.User.latest_version_name, // 版本名称  非必填
						version_code: veresion_info.User.version, // 版本号  必填
						device: 'android', // android|ios 暂时非必填
						is_wgt: 0, // 是否资源包更新  非必填
						apple_id: '', // IOS 跳转的需要 非必填
						url: veresion_info.User.latest_download_android, // 最新包地址
						constraintQu: true //是否强制更新
					})
				}
			}
		} else { //如跨度大于等于两个版本直接执行整包更新
			loadingShow.value = false
			executeState.value = ''
			if (uni.getSystemInfoSync().platform == 'ios') {
				uni.showModal({
					title: '提示',
					content: '版本与最新跨度过大，请重新下载App，建议跳转后卸载原有app',
					confirmText: '去下载',
					showCancel: false,
					success: function(ress) {
						plus.runtime.openURL(encodeURI(veresion_info.User.latest_download_ios))
					}
				});
			} else {
				proxy.$refs.updaters.checkVersion({
					name: '版本更新~', // 标题 非必填
					content: '版本与最新版跨度较大，请整包跟新', // 更新内容  非必填
					version: veresion_info.User.latest_version_name, // 版本名称  非必填
					version_code: veresion_info.User.version, // 版本号  必填
					device: 'android', // android|ios 暂时非必填
					is_wgt: 0, // 是否资源包更新  非必填
					apple_id: '', // IOS 跳转的需要 非必填
					url: veresion_info.User.latest_download_android, // 最新包地址
					constraintQu: true //是否强制更新
				})
			}
		}
	}

	const getUserInfo = () => { //获取用户信息
		executeState.value = '正在获取用户信息~'
		api.GetUserInfo().then((res) => {
			if (res.data.code === 1) { //=1是成功
				if (res.data.data.appIsOpen.user.value == 'true') { //维护拦截
					uni.showModal({
						title: '注意',
						content: res.data.data.appIsOpen.shop.content,
						confirmText: '退出',
						showCancel: false,
						success: function(res) {
							uni.hideTabBar()
							switch (uni.getSystemInfoSync().platform) {
								case 'android':
									plus.runtime.quit();
									break;
								case 'ios':
									plus.ios.import('UIApplication').sharedApplication()
										.performSelector('exit');
									break;
							}
						}
					});
					return
				}
				counter.onHide_boole = false
				counter.hasLogin = true; //更改状态管理登录状态
				executeState.value = ''
				uni.setStorageSync('shop_id', res.data.data.userinfo.shop_id);
				uni.setStorageSync('user_id', res.data.data.userinfo.id);
				//数据注释参考登录哪里
				counter.user_id = res.data.data.userinfo.id //账户ID
				counter.user_imgs = res.data.data.userinfo.avatar;
				counter.Betrecord = res.data.data.orderinfo;
				counter.nickname = res.data.data.userinfo.nickname
				counter.shop_id = res.data.data.userinfo.shop_id;
				counter.user_id = res.data.data.userinfo.id;
				counter.sfz_id = res.data.data.userinfo.sfz_id;
				counter.sfz_name = res.data.data.userinfo.sfz_name;
				counter.user_money = res.data.data.userinfo.money;
				counter.Win_money = res.data.data.userinfo.Win_money
				counter.redPacketBoole = res.data.data.redPacket //用户是否有可领红包
				counter.mobile = res.data.data.userinfo.mobile
				counter.shop_id = res.data.data.userinfo.shop_id //用户默认选择的店铺id
				counter.UserConfig = res.data.data.userinfo.Config
				counter.userAllData = res.data.data
				loadingShow.value = false

				if (counter.userAllData.userinfo.RealName == '0') {
					uni.reLaunch({
						url: '/pages/score/score'
					});
				} else {
					uni.reLaunch({
						url: '/pages/main/main'
					});
				}
			} else {
				loadingShow.value = false
				executeState.value = '用户信息获取失败，请联系店主反馈~'
			}
		})
	}
	const resourceNew = (path) => { //wgt安装
		executeState.value = '正在安装新版本~'
		plus.runtime.install(path, {
			force: true
		}, function() {
			plus.nativeUI.alert("新版本已下载完成，请重启App！", function() {
				executeState.value = ''
				loadingShow.value = false
				plus.runtime.restart();
			});
		}, function(e) {
			executeState.value = '热更新失败，请联系店主反馈~'
			loadingShow.value = false
			executeState.value = "安装文件失败[" + e.code + "]：" + e.message;
		})
	}
</script>

<style lang="scss">
	.versions_box {
		width: 100%;
		position: fixed;
		bottom: 20rpx;
		text-align: center;
		color: #a7a7a7;
	}

	.loadingStyle {
		width: 40rpx;
		height: 40rpx;
		animation: rotate 1s linear infinite;
		margin-right: 20rpx;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg)
		}

		to {
			transform: rotate(-360deg)
		}
	}

	.execute_box {
		width: 100%;
		height: 200rpx;
		// background-color: salmon;
		position: fixed;
		top: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #a7a7a7;
	}

	.imageStyle {
		width: 280rpx;
		height: 280rpx;
		position: fixed;
		top: calc(20% - 140rpx);
		left: calc(50% - 140rpx);
	}
</style>