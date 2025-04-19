<template>
	<!-- #ifdef APP-PLUS -->
	<uni-scroll-view class="content" refresher-enabled @refresh="minList">
	<!-- #endif -->
		<z-paging ref="min" @query='minList' :hide-empty-view='true' :style="'height: '+ windowHeight +'px;'">
			<view class="yellowBack" v-if="counter.shopBasicsData!=''">
				<view class="topCard">
					<!-- 店铺卡片 -->
					<view style="display: flex;padding:30rpx 0rpx 30rpx 30rpx;">
						<view @click="tiaozhuan" style="margin-right:20rpx;" v-if="counter.shopBasicsData.group_id==2">
							<image :src="counter.shopBasicsData.avatar" mode="aspectFill" class="logoStyle" />
						</view>
						<view @click="tiaozhuan" style="margin-right:20rpx;" v-else>
							<image :src="counter.staffLoginInfo.ShopInfo.avatar" mode="aspectFill" class="logoStyle" />
						</view>
						<view style="height:110rpx;display: flex;flex-flow: column;justify-content: space-between;">
							<view style="font-weight: bold;" v-if="counter.shopBasicsData.group_id==2">
								<text>{{counter.shopBasicsData.nickname}}</text>
								<text>(ID.{{counter.shopBasicsData.id}})</text>
							</view>
							<view style="font-weight: bold;" v-else>
								<text>{{counter.staffLoginInfo.ShopInfo.nickname}}</text>
								<text style="font-size:16rpx;font-weight: normal;">
									(ID.{{counter.shopBasicsData.shop_id}})
								</text>
							</view>
							<view style="display: flex;" v-if="counter.shopBasicsData.group_id==2">
								<view
									:class="counter.shopBasicsData.ShopConfig.StoreCertification=='1'?'authenticationTrue':'authenticationFalse'">
									<uni-icons type="medal-filled" color="white"
										v-if="counter.shopBasicsData.ShopConfig.StoreCertification=='1'" />
									<text style="font-size:26rpx;color: white;font-weight: bold;">
										{{counter.shopBasicsData.ShopConfig.StoreCertification=='1'||counter.shopBasicsData.group_id!=2?'已认证':counter.shopBasicsData.ShopConfig.StoreCertification=='2'?'待审核':counter.shopBasicsData.ShopConfig.StoreCertification=='3'?'审核失败':'未认证'}}
									</text>
								</view>
								<view class="vip" v-if="counter.shopBasicsData.ShopConfig.StoreCertification=='1'">
									<uni-icons type="vip-filled" color="white" size="28rpx"></uni-icons>
									<text style="font-size:26rpx;color: white;font-weight:600;">VIP·1</text>
								</view>
							</view>
							<view v-else style="display: flex;">
								<view class="authenticationTrue">
									<uni-icons type="medal-filled" color="white" />
									<text style="font-size:26rpx;color: white;font-weight: bold;">已认证</text>
								</view>
								<view class="vip">
									<uni-icons type="vip-filled" color="white" size="28rpx"></uni-icons>
									<text style="font-size:26rpx;color: white;font-weight:600;">VIP·1</text>
								</view>
							</view>
						</view>
						<view class="tuiguan" @click="shareButtom">
							<uni-icons type="paperplane-filled" size="28rpx" color="white"></uni-icons>
							<text style="font-size:28rpx;padding-left:5rpx;">店铺推广</text>
						</view>
					</view>
					<view style="display: flex;justify-content: space-between;">
						<navigator url="/pages/mimeSupPage/balancePage/balancePage"
							v-if="counter.shopBasicsData.group_id==2" hover-class="none">
							<view style="text-align: center;margin-left:80rpx;">
								<text style="font-size:28rpx;">店铺余额</text><br>
								<text style="color: red;font-weight:bold;">{{counter.shopBasicsData.money}}</text>
							</view>
						</navigator>
						<view style="text-align: center;margin-left:80rpx;" v-else>
							<text style="font-size:28rpx;">今日出票金额</text><br>
							<text style="color: red;font-weight:bold;">
								{{counter.staffLoginInfo.Info.TotalInvoicingAmount}}
							</text>
						</view>
						<view style="width:2rpx; height:40rpx;background-color:#FDC830;align-self:center;"></view>
						<navigator url="/pages/mimeSupPage/escrowAccountPage" v-if="counter.shopBasicsData.group_id==2"
							hover-class="none">
							<view style="text-align: center;margin-right:80rpx;">
								<text style="font-size:28rpx;">托管余额</text><br>
								<text style="color: red;font-weight:bold;">
									{{counter.shopBasicsData.TrusteeshipBalance}}
								</text>
							</view>
						</navigator>
						<view style="text-align: center;margin-right:80rpx;" v-else>
							<text style="font-size:28rpx;">员工账号</text><br>
							<text style="color: red;font-weight:bold;">{{counter.shopBasicsData.username}}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="yika" v-if="counter.shopBasicsData!=''">
				<!-- 第一排 -->
				<view class="tita">
					<text>常用功能</text>
				</view>

				<view :class="counter.shopBasicsData.group_id!=2?'yineirenBox':'yineirenBoxNo'">
					<view v-for="item,index in imgData" :key="index" class="clickBotton"
						@click="clickYi(index,item.navigator)"
						v-if="counter.shopBasicsData.group_id!=2?index==1?counter.staffLoginInfo.Info.award=='1':true:true">
						<uni-badge :text="counter.shopBasicsData.count.waitAward" absolute="rightTop"
							v-show="item.text=='等待派奖' && counter.shopBasicsData.count.waitAward>0" :offset="[-40,-40]"
							style="z-index:2;" v-if="counter.shopBasicsData.group_id==2" />
						<uni-badge :text="counter.shopBasicsData.count.Withdrawal" absolute="rightTop"
							v-show="item.text=='提现申请' && counter.shopBasicsData.count.Withdrawal>0" :offset="[-40,-40]"
							style="z-index:2;" v-if="counter.shopBasicsData.group_id==2" />


						<image
							:src='index==3?counter.shopBasicsData.group_id!=2?"/static/img/mimeImg/close.png":"/static/img/mimeImg/setYellow.png":item.src'
							class="imgSize" v-show="counter.shopBasicsData.group_id!=2?index==2?false:true:true">

						</image><br>
						<text style="font-size:28rpx;"
							v-show="counter.shopBasicsData.group_id!=2?index==2?false:true:true">
							{{index==3?counter.shopBasicsData.group_id!=2?'退出':'店铺设置':item.text}}
						</text>
					</view>
				</view>
			</view>
			<view class="erCard" v-if="counter.shopBasicsData.group_id==2 || counter.staffLoginInfo.Info">
				<view class="tita">
					<text>店铺管理</text>
				</view>
				<view class="erCardNeir">
					<view style="text-align:center;" v-for="item,index in erCardImg" :key="index"
						v-show="counter.shopBasicsData.group_id!=2?index==3?counter.staffLoginInfo.Info.cooperation==1:false:true"
						@click="erClick(item)">


						<uni-badge :text="counter.shopBasicsData.count.CooperationLog" absolute="rightTop"
							v-show="item.text=='合作店铺' && counter.shopBasicsData.count.CooperationLog>0"
							:offset="[-40,-40]" style="z-index:2;" v-if="counter.shopBasicsData.group_id==2" />
						<uni-badge :text="counter.shopBasicsData.count.shopReceipt" absolute="rightTop"
							v-show="item.text=='收款管理' && counter.shopBasicsData.count.shopReceipt>0" :offset="[-40,-40]"
							style="z-index:2;" v-if="counter.shopBasicsData.group_id==2" />

						<image :src="item.src" class="imgSize"></image><br>
						<text style="font-size:26rpx;">{{item.text}}</text>
					</view>
				</view>
			</view>
			<view class="sanCard" v-if="counter.shopBasicsData!='' && counter.shopBasicsData.group_id==2">
				<!-- 第三排 -->
				<view class="tita">
					<text>服务</text>
				</view>
				<view class="sanCardNeir">
					<view v-for="item,index in sanCardImg" :key="item" style="text-align: center;"
						@click="sanClick(index)">
						<image :src="item.src" class="imgSize"></image><br>
						<text style="font-size:26rpx;">{{item.text}}</text>
					</view>
				</view>
			</view>
			<view class="sanCard" v-if="counter.shopBasicsData.group_id==2 && counter.shopBasicsData.id=='70001'">
				<!-- 额外新增店主功能-->
				<view class="tita">
					<text>额外服务</text>
				</view>
				<view class="sanCardNeir">
					<view style="text-align: center;" @click="newLSClick()">
						<image src="/static/img/mimeImg/noteYellow.png" class="imgSize"></image><br>
						<text style="font-size:26rpx;">跟单人气</text>
					</view>
					<view style="text-align: center;" @click="newLSClick2()">
						<image src="/static/img/mimeImg/noteYellow.png" class="imgSize"></image><br>
						<text style="font-size:26rpx;">删除订单</text>
					</view>
				</view>

				<uni-popup ref="newLSpopup1" type="center" :isMaskClick="false">
					<view
						style="width:640rpx;padding:30rpx;background-color: white;border-radius:30rpx;text-align: center;">
						<text style="font-weight: bold;">跟单增加人气</text>
						<view style="text-align: left;">
							<text>订单号：</text>
							<uni-easyinput placeholder="请输入跟单发单订单号" v-model="newLS_order_id"></uni-easyinput>
						</view>
						<view style="text-align: left;margin:20rpx 0rpx;">
							<text>增加人气值：</text>
							<uni-easyinput placeholder="请输入增加人气值(建议少量多次1-50)" v-model="newLS_num"></uni-easyinput>
						</view>
						<view style="display: flex;justify-content: space-between;">
							<view class="citysButtom"
								style="background-color:#afafaf;width:260rpx;height:60rpx;border-radius:10rpx;color:white;text-align: center;line-height:60rpx;"
								@click="proxy.$refs.newLSpopup1.close()">
								<text>取消</text>
							</view>
							<view class="citysButtom"
								style="background-color:#4f93ff;width:260rpx;height:60rpx;border-radius:10rpx;color:white;text-align: center;line-height:60rpx;"
								@click="newLSClickConfirm">
								<text>确定</text>
							</view>
						</view>
					</view>
				</uni-popup>

				<!-- 删除订单 -->
				<uni-popup ref="newLSpopup2" type="center" :isMaskClick="false">
					<view
						style="width:640rpx;padding:30rpx;background-color: white;border-radius:30rpx;text-align: center;">
						<text style="font-weight: bold;">删除指定订单记录</text>
						<view style="text-align: left;">
							<text>订单号：</text>
							<uni-easyinput placeholder="请输入需要删除的订单号" v-model="newLS2_order_id"></uni-easyinput>
						</view>
						<view style="display: flex;justify-content: space-between;margin-top: 25rpx;">
							<view class="citysButtom"
								style="background-color:#afafaf;width:260rpx;height:60rpx;border-radius:10rpx;color:white;text-align: center;line-height:60rpx;"
								@click="proxy.$refs.newLSpopup2.close()">
								<text>取消</text>
							</view>
							<view class="citysButtom"
								style="background-color:#4f93ff;width:260rpx;height:60rpx;border-radius:10rpx;color:white;text-align: center;line-height:60rpx;"
								@click="newLSClickConfirm2">
								<text>确定</text>
							</view>
						</view>
					</view>
				</uni-popup>
			</view>

			<template v-slot:bottom>
				<view class="version-number">
					<text>当前版本：{{currentVersion}}</text><br>
				</view>
			</template>
		</z-paging>

	<!-- #ifdef APP-PLUS -->
	</uni-scroll-view>
	<!-- #endif -->

	<!-- 更新模块 -->
	<qw-updaters ref="updaters"></qw-updaters>

	<!-- 对话框 -->
	<fui-dialog :show="show" @click="clickDialogButton" content="确定需要退出登录吗？"></fui-dialog>
	<uni-popup type="center" ref="imgPupop">
		<view class="imgPupop">
			<QS-image :imageUrl="pupopImg" width="95%" height="95%" @longpress="saveImage(pupopImg)"></QS-image>
			<text class="explain">长按图片保存~</text>
		</view>
	</uni-popup>
	<uni-popup ref="tutorialBookOpen" type="center">
		<tutorial-book @onclickOpen="proxy.$refs.tutorialBookOpen.close();proxy.$refs.imgPupop.open();"></tutorial-book>
	</uni-popup>
</template>
<script setup>
	import common from '@/common/common'
	import {
		useCounterStore
	} from '@/stores/counter'
	import api from "@/common/vmeitime-http/index/index.js"
	import mineApi from "@/common/vmeitime-http/mine/mine.js"
	import index from '@/common/vmeitime-http/index/index.js';
	import {
		ref,
		reactive,
		getCurrentInstance
	} from 'vue';
	import {
		onShow
	} from "@dcloudio/uni-app"
	import tutorialBook from "@/components/common/tutorialBook-popup/tutorialBook-popup.vue"
	const currentVersion = ref('web') //当前版本号
	onShow(() => {
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			// console.log(inf)
			currentVersion.value = inf.version
		})
		// #endif
		// if (counter.shopBasicsData.group_id == 2 && counter.shopBasicsData.ShopConfig.StoreCertification == '0') {
		// 	//判断店铺是否已认证
		// 	uni.showModal({
		// 		title: '注意',
		// 		content: '检测到此店铺未进行认证，未认证功能无法使用！',
		// 		confirmText: '去认证',
		// 		success: function(res) {
		// 			uni.hideTabBar()
		// 			if(res.confirm){
		// 				uni.navigateTo({
		// 					url: '/pages/mimeSupPage/attestation/shopArresrarion',
		// 					animationType: "slide-in-bottom"
		// 				})
		// 			}else{
		// 				uni.showTabBar()
		// 			}
		// 		}
		// 	});
		// }
		let statusBarHeight = uni.getSystemInfoSync().statusBarHeight //获取手机状态栏高度
		windowHeight.value = uni.getSystemInfoSync().windowHeight - statusBarHeight - 30
	})
	const windowHeight = ref(0)
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const pupopImg = ref('')
	const sanCardImg = reactive([ //第三排循环数据
		{
			src: '/static/img/mimeImg/honbao.png',
			text: '发布红包'
		},
		{
			src: '/static/img/mimeImg/tuisong.png',
			text: '推送设置'
		},
		// {
		// 	src: '/static/img/mimeImg/kefu.png',
		// 	text: '客服微信'
		// },
		{
			src: '/static/img/mimeImg/kefu.png',
			text: '在线客服'
		},
		{
			src: '/static/img/mimeImg/yaoqingdianzhu.png',
			text: '邀请店主'
		},
		{
			src: '/static/img/mimeImg/jiqiren.png',
			text: '机器人'
		},
		/* {
			src: '/static/img/mimeImg/jishu.png',
			text: '技术支持'
		}, */

		// {src:'/static/img/mimeImg/lianjie.png',text:'电脑端'},
		// {src:'/static/img/mimeImg/banzhu.png',text:'帮助'}
	])
	const erCardImg = reactive([ //第二排循环数据
		{
			src: '/static/img/mimeImg/jine.png',
			text: '收款管理',
			navigator: '/pages/mimeSupPage/receipt'
		},
		{
			src: '/static/img/mimeImg/caipiao.png',
			text: '彩种管理',
			navigator: '/pages/mimeSupPage/CategoryManagement'
		},
		{
			src: '/static/img/mimeImg/yuangong.png',
			text: '员工管理',
			navigator: '/pages/mimeSupPage/yuangongguanli'
		},
		{
			src: '/static/img/mimeImg/dianpu.png',
			text: '合作店铺',
			navigator: '/pages/mimeSupPage/dianpu'
		}
	])
	const imgData = reactive([ //第一排循环数据
		{
			src: '/static/img/mimeImg/dindanyellow.png',
			text: '订单查询',
			navigator: '/pages/mimeSupPage/orderInquiry'
		},
		{
			src: '/static/img/mimeImg/noteYellow.png',
			text: '等待派奖',
			navigator: '/pages/mimeSupPage/daiPaiJianPage'
		},
		{
			src: '/static/img/mimeImg/moneyYellow.png',
			text: '提现申请',
			navigator: '/pages/mimeSupPage/tixianshenqin'
		},
		{
			src: '/static/img/mimeImg/setYellow.png',
			text: '店铺设置',
			navigator: '/pages/mimeSupPage/setPage'
		}
	])
	const pageShow = ref(false) //页面显示控制
	const minList = async () => { //店主信息跟新
		// #ifdef APP-PLUS
		// clickSc()
		// #endif
		await common.getUserInfo()
		if (counter.shopBasicsData.count) { //角标设置
			uni.setTabBarBadge({
				index: 4,
				text: String(counter.shopBasicsData.count.waitAward + counter.shopBasicsData.count
					.Withdrawal)
			})
			if (counter.shopBasicsData.count.waitAward <= 0 && counter.shopBasicsData.count.Withdrawal <= 0) {
				uni.removeTabBarBadge({
					index: 4
				})
			}
			uni.setTabBarBadge({
				index: 0,
				text: String(counter.shopBasicsData.count.OrderCount)
			})
			if (counter.shopBasicsData.count.OrderCount <= 0) {
				uni.removeTabBarBadge({
					index: 0
				})
			}
		}
		proxy.$refs.min.complete(true)
	}
	const saveImage = (imagSrc) => { //保存图片
		uni.downloadFile({
			url: imagSrc,
			success(res) {
				if (res.statusCode == 200) {
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: function() {
							uni.showToast({
								title: '图片已保存到系统相册~',
								position: 'bottom'
							})
						},
						fail: function() {
							uni.showToast({
								title: '保存失败，请稍后重试~',
								position: 'bottom',
								icon: 'error'
							})
						}
					});
				} else {
					uni.showToast({
						title: '图片下载失败，请稍后重试~',
						position: 'bottom',
						icon: 'error'
					})
				}
			}
		})
	}
	const clickDialogButton = (e) => { //退出登录
		show.value = false
		if (e.index == 1) {
			uni.showToast({
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
					uni.reLaunch({
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
	const sanClick = (index) => {
		if (index == 0) {
			uni.navigateTo({
				url: '/pages/mimeSupPage/redPacket'
			})
		} else if (index == 1) {
			mineApi.setImg({
				'type': index
			}).then((res) => {
				pupopImg.value = counter.baseUrl + res.data.data.url
				proxy.$refs.tutorialBookOpen.open()
			})
		} else if (index == 2) {
			// // #ifdef H5
			// if(uni.getStorageSync('access_shop_token')){
			// 	let herf = 'https://kf.zbqjc.com' + '/index/index/home?groupid=1&business_id=1&special=3&avatar=' + counter.shopBasicsData.avatar + '&visiter_id=' + counter.shopBasicsData.id + '&visiter_name=' +
			// 		counter.shopBasicsData.id + counter.shopBasicsData.nickname
			// 		window.open(herf)
			// }else{
			// 	let herf = 'https://kf.zbqjc.com' + '/index/index/home?groupid=1&business_id=1&special=3&avatar=' + '' + '&visiter_id=' + ''+ '&visiter_name=' +''
			// 	window.open(herf)
			// }
			// // #endif

			// // #ifdef APP
			// if(uni.getStorageSync('access_shop_token')){
			// 	let herf = 'https://kf.zbqjc.com' + '/index/index/home?groupid=1&business_id=1&special=3&avatar=' + counter.shopBasicsData.avatar + '&visiter_id=' + counter.shopBasicsData.id + '&visiter_name=' +
			// 		counter.shopBasicsData.id + counter.shopBasicsData.nickname
			// 		plus.runtime.openURL(herf)
			// }else{
			// 	let herf = 'https://kf.zbqjc.com' + '/index/index/home?groupid=1&business_id=1&special=3&avatar=' + '' + '&visiter_id=' + ''+ '&visiter_name=' +''
			// 	plus.runtime.openURL(herf)
			// }
			// // #endif
			uni.navigateTo({
				url: '/pages/mimeSupPage/goflychat'
			})
		} else if (index == 3) {
			uni.navigateTo({
				url: '/pages/userUupPage/InviteShopkeeper'
			})
		} else if (index == 4) {
			uni.navigateTo({
				url: '/pages/robotpage/robotpage'
			})
		} else {
			mineApi.setImg({
				'type': index
			}).then((res) => {
				pupopImg.value = counter.baseUrl + res.data.data.url
				proxy.$refs.imgPupop.open()
			})
		}
	}
	const tiaozhuan = () => { //头像点击
		if (counter.hasLogin == false) {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		} else {
			if (counter.shopBasicsData.group_id != 2) {
				uni.previewImage({
					urls: counter.staffLoginInfo.ShopInfo.avatar.split(),
				})
			} else {
				uni.navigateTo({
					url: '/pages/mimeSupPage/setPage',
				})
			}
		}
	}
	const show = ref(false)
	const shareButtom = () => {
		if (counter.shopBasicsData.group_id != 3) {
			if (counter.shopBasicsData.ShopConfig.StoreCertification == '1') {
				//点击店铺推广
				uni.navigateTo({
					url: '/pages/shareCanvas/shareCanvas',
					animationType: 'slide-in-bottom'
				})
			} else {
				var arr = ['未审核', '已认证', '待审核', '驳回拒绝']
				uni.showToast({
					title: '当前店铺处于' + arr[counter.shopBasicsData.ShopConfig.StoreCertification] + '状态中，请稍后再试',
					icon: 'none',
					position: 'center'
				})
			}
		} else {
			//点击店铺推广
			uni.navigateTo({
				url: '/pages/shareCanvas/shareCanvas',
				animationType: 'slide-in-bottom'
			})
		}
	}
	const erClick = (e) => {
		if (counter.shopBasicsData.group_id != 3) {
			if (counter.shopBasicsData.ShopConfig.StoreCertification == '1') {
				uni.navigateTo({
					url: e.navigator
				})
			} else {
				var arr = ['未审核', '已认证', '待审核', '驳回拒绝']
				uni.showToast({
					title: '当前店铺处于' + arr[counter.shopBasicsData.ShopConfig.StoreCertification] + '状态中，请稍后再试',
					icon: 'none',
					position: 'center'
				})
			}
		} else {
			uni.navigateTo({
				url: e.navigator
			})
		}
	}
	const clickYi = (index, navigator) => {
		if (counter.shopBasicsData.group_id != 3) {
			if (counter.shopBasicsData.ShopConfig.StoreCertification == '1') {
				if (index == 3) {
					if (counter.shopBasicsData.group_id == 2) {
						uni.navigateTo({
							url: navigator
						})
					} else {
						show.value = true
					}
				} else {
					uni.navigateTo({
						url: navigator
					})
				}
			} else {
				var arr = ['未审核', '已认证', '待审核', '驳回拒绝']
				uni.showToast({
					title: '当前店铺处于' + arr[counter.shopBasicsData.ShopConfig.StoreCertification] + '状态中，请稍后再试',
					icon: 'none',
					position: 'center'
				})
			}
		} else {
			if (index == 3) {
				if (counter.shopBasicsData.group_id == 2) {
					uni.navigateTo({
						url: navigator
					})
				} else {
					show.value = true
				}
			} else {
				uni.navigateTo({
					url: navigator
				})
			}
		}
	}

	const newLSClick = () => {
		proxy.$refs.newLSpopup1.open()
	}
	const newLSClick2 = () => {
		proxy.$refs.newLSpopup2.open()
	}
	const newLS_order_id = ref(null) //订单号
	const newLS2_order_id = ref(null) //订单号
	const newLS_num = ref(null) //人气
	const newLSClickConfirm = () => {
		uni.showLoading({
			title: '处理中~'
		})
		uni.request({
			url: counter.baseUrl + '/api/common.LsServise/addRQ',
			header: {
				"server": "1",
				"ba-user-token": counter.access_token
			},
			data: {
				"order_id": newLS_order_id.value,
				"num": newLS_num.value,
			},
			success(res) {
				if (res.data.code == 1) {
					uni.showToast({
						title: res.data.data,
						icon: 'none',
						position: 'center'
					})
					uni.hideLoading()
				} else {
					uni.showToast({
						title: res.data.data,
						icon: 'none',
						position: 'center'
					})
				}
			}
		})
		proxy.$refs.newLSpopup1.close()



	}

	const newLSClickConfirm2 = () => {
		uni.showLoading({
			title: '处理中~'
		})
		uni.request({
			url: counter.baseUrl + '/api/common.LsServise/delOrder',
			header: {
				"server": "1",
				"ba-user-token": counter.access_token
			},
			data: {
				"order_id": newLS2_order_id.value,
			},
			success(res) {
				if (res.data.code == 1) {
					uni.showToast({
						title: res.data.data,
						icon: 'none',
						position: 'center'
					})
					uni.hideLoading()
				} else {
					uni.showToast({
						title: res.data.data,
						icon: 'none',
						position: 'center'
					})
				}
			}
		})
		proxy.$refs.newLSpopup2.close()



	}
</script>

<style>
	.imgPupop {
		width: 680rpx;
		height: 680rpx;
		border-radius: 15rpx;
		background-color: white;
		display: flex;
		flex-flow: column;
		align-items: center;
		justify-content: center;
	}

	.explain {
		color: #d0d0d0;
		position: absolute;
		bottom: 20rpx;
	}

	.update {
		padding: 2rpx 10rpx;
		border-top-left-radius: 15rpx;
		border-bottom-right-radius: 15rpx;
		background-color: red;
		color: white;
		font-size: 24rpx;
		font-weight: bold;
		margin: 0rpx 10rpx;
	}

	.version-number {
		/* 	position:absolute;
		bottom:20rpx; */
		text-align: center;
		font-size: 26rpx;
		color: #aaaaaa;
		width: 100%;
	}

	.yineirenBox {
		display: flex;
		text-align: center;
		justify-content: space-between;
	}

	.yineirenBoxNo {
		display: flex;
		justify-content: space-between;
		text-align: center;
	}

	.logoStyle {
		/* border-radius:120rpx; */
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
	}

	.clickBotton:active {
		transition: .2s;
		transform: scale(0.9);
	}

	.clickBotton {
		margin: 0rpx 20rpx;
	}

	.vip {
		padding: 0rpx 20rpx;
		height: 45rpx;
		background-color: #feb856;
		/* background: linear-gradient(to bottom right, #ff9966, #ff5e62); */
		/* background-color:#ff0000; */
		border-radius: 10rpx;
		text-align: center;
		margin-left: 20rpx;
		line-height: 45rpx;
	}

	.authenticationTrue {
		padding: 0rpx 20rpx;
		height: 45rpx;
		background-color: #feb856;
		border-radius: 10rpx;
		text-align: center;
		line-height: 45rpx;
	}

	.authenticationFalse {
		padding: 0rpx 20rpx;
		height: 45rpx;
		background: linear-gradient(to bottom right, #d4d4d4, #4c4c4c);
		border-radius: 10rpx;
		text-align: center;
		line-height: 45rpx;
	}

	.sanCardNeir {
		display: grid;
		grid-template-columns: repeat(4, 120rpx);
		grid-template-rows: repeat(1, 120rpx);
		grid-row-gap: 40rpx;
		justify-content: space-between;
	}

	.sanCard {
		width: 680rpx;
		background-color: white;
		padding: 20rpx;
		border-radius: 15rpx;
		margin: 10rpx auto;
	}

	.erCardNeir {
		display: flex;
		justify-content: space-between;
	}

	.tita {
		padding: 0rpx 0rpx 10rpx 0rpx;
		font-weight: 700;
		font-size: 30rpx;
	}

	.erCard {
		width: 680rpx;
		background-color: white;
		padding: 20rpx;
		border-radius: 15rpx;
		margin: 15rpx auto;
	}

	.imgSize {
		width: 70rpx;
		height: 70rpx;
		align-self: center;
	}

	.yika {
		width: 680rpx;
		background-color: white;
		padding: 20rpx;
		border-radius: 15rpx;
		margin: 15rpx auto;
	}

	body {
		background-color: #f3f3f3;
	}

	.tuiguan {
		height: 70rpx;
		text-align: center;
		margin-left: auto;
		margin-top: 20rpx;
		/* background-color: #feb856;*/
		background: linear-gradient(to bottom right, #ffcbbb, #ffcd58);
		/* background: linear-gradient(to bottom right, #f7b733, #fc4a1a); */
		color: #ffffff;
		font-weight: bold;
		border-top-left-radius: 10rpx;
		border-bottom-left-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.topCard {
		height: 290rpx;
		background-color: white;
		border-radius: 20rpx;
		margin: var(--status-bar-height) auto;
	}

	.yellowBack {
		width: 100%;
		background: linear-gradient(to bottom right, #ffcbbb, #ffcd58);
		border-radius: 0 0 20rpx 20rpx;
		padding: 10rpx;
		box-sizing: border-box;
	}
</style>