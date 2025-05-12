<template>
	<view class="top_box">
		<view class="shop_name">
			<view style="display: flex;align-items: center;">
				<view class="box_lg">
					<image src="@/static/img/main/96-96.jpg" style="width:60rpx;height:60rpx;" />
				</view>
				<text @click="topBottom('dianp')"
					style="font-size:30rpx; width: 120rpx; font-weight: 550; color: #444444; margin:0rpx;margin-left: 20rpx;">{{shop_name}}</text>
				<!-- <text class="tag1">启航竞彩体育</text> -->
				<!-- <view style="margin-left:10rpx;" @click="topBottom('dianp')">
					<text class="tag">></text>
				</view> -->
				<view style="margin-left: 360rpx;display: flex;">
					<image @click="topBottom('mobile')" src="@/static/img/main/icon_home_shop_calling.png"
						style="width: 50rpx;height:50rpx;margin-right: 20rpx;" alt="" />
					<image @click="topBottom('yaoq')" src="@/static/img/main/icon_home_shop_share.png"
						style="width: 50rpx;height:50rpx;margin-left: 20rpx;margin-right: 20rpx;" alt="" />
				</view>
			</view>
			<!-- 切换店铺 -->
			<!-- <image src="@/static/img/main/cut.png" style="width:40rpx;height:40rpx;" @click="skip_shop"></image> -->
		</view>
		<!-- <view class="bottom_box">
			<view class="bottm_content_box" @click="topBottom('mobile')">
				<image src="../../static/img/main/dianhua.png" class="bottom_image"></image><br>
				<text>联系店主</text>
			</view>
			<view class="bottm_content_box" @click="topBottom('weix')">
				<image src="../../static/img/main/weix2.png" class="bottom_image"></image><br>
				<text>添加微信</text>
			</view>
			<view class="bottm_content_box" @click="topBottom('yaoq')">
				<image src="../../static/img/main/yaoq.png" class="bottom_image"></image><br>
				<text>邀请好友</text>
			</view>
		</view> -->
	</view>
	<!-- 轮播图 -->
	<view class="banner_t">
		<view style="width: 94%;height: 200rpx;margin: 0 auto;margin-top: -50rpx;">
			<swiper :autoplay="true" interval="3000" circular="true" indicator-dots="true"
				indicator-active-color="#FF0000">
				<swiper-item v-for="(item, index) in images" :key="index">
					<image :src="item" style="width: 100%; height: 200rpx;border-radius: 20rpx;"></image>
				</swiper-item>
			</swiper>
		</view>
	</view>
	<!-- 滚动公告栏 -->
	<view class="announcement" v-show="noticetext!=''">
		<uni-notice-bar show-icon scrollable background-color="white" speed="35" :text="noticetext" color="#ff0000" />
	</view>
	<!-- 体彩 -->
	<view style="margin-left: 12rpx;display: flex;align-items: center;" :class="{'sanyuan': !noticetext}">
		<image src="@/static/img/main/icon_sp_lottery.png" alt="" style="width: 50rpx;height: 50rpx;" />
		<view style="font-size: 28rpx;font-weight: 500;margin-left: 6rpx;">
			体育彩票
		</view>
	</view>
	<view class="game_card"
		:style="view_Show?'height:'+203*Math.ceil(palylist[0].sports.length/4)+'rpx':'height: 160rpx;'"
		v-show="palylist[0].sports.length>0">
		<view class="game_itme_card" v-for="itme,index in palylist[0].sports" @click="sportsaction(index)">
			<image :src="counter.baseUrl+itme.systemsgamelist.image" class="game_image" mode="aspectFit" />
			<text style="font-size:28rpx; font-weight: 400;color: #191a1b;margin-top: 5rpx;">
				{{itme.systemsgamelist.title}}
			</text>
			<text style="color: #808080; margin-top: 5rpx;font-size: 22rpx;">
				{{itme.systemsgamelist.subtitle}}
			</text>
		</view>
	</view>
	<view class="show_card" @click="view_Show=!view_Show" v-show="palylist[0].sports.length>4">
		<uni-icons :type="view_Show?'top':'bottom'" color="#1b4f88"></uni-icons>
		<text
			style="font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #1b4f88;">{{view_Show?'隐藏玩法':'更多玩法'}}</text>
	</view>
	<view style="margin-top:25rpx;" class="content-List" v-show="palylist[0].welfare.length>0"><!-- 福利彩票 -->
		<view style="display: flex;flex-wrap: wrap;justify-content:space-around;">
			<view v-for="(item,index) in palylist[0].welfare" @click="welfareaction(index)" class="content-List-itme">
				<image :src="counter.baseUrl+item.systemsgamelist.image" class="game_image" mode="aspectFit" />
				<text style="font-size:28rpx; font-weight: 400;color: #191a1b;margin-top: 5rpx;">
					{{item.systemsgamelist.title}}
				</text>
				<text style="color: #808080; margin-top: 5rpx;font-size: 22rpx;">
					{{item.systemsgamelist.subtitle}}
				</text>
			</view>
		</view>
	</view>
	<view class="theme"><!-- 首页快速入口 -->
		<view class="theme-itme" @click="navigator_tab(1)">
			<image src="@/static/img/main/hemai.png" class="theme-itme-img"></image>
		</view>
		<view class="theme-itme" style="margin-left: 6rpx;">
			<view class="theme-itme" @click="navigator_tab(2)" style="width: 100%; height: 100rpx;">
				<image src="@/static/img/main/kaijiang.png" class="theme-itme-img"></image>
			</view>
			<view class="theme-itme" @click="navigator_tab(3)" style="width: 100%; height: 100rpx;margin-top: 18rpx;">
				<image src="@/static/img/main/zoushi.png" class="theme-itme-img"></image>
			</view>
		</view>
	</view>
	<view class="reloadGameInfo" v-show="palylist[0].welfare.length==0 && palylist[0].sports.length==0"
		@click="apiFuncion">
		重新加载
	</view>
	<view class="footer"><!-- 底部认证 -->
		<view class="footer-title">
			<image mode="aspectFit" src="@/static/img/main/dpIcon.png" style="width:40rpx;height:80rpx;" />
			<text style="font-size:32rpx; font-weight:bold; color: #ff0844;margin-left:5rpx;">实体店铺</text>
		</view>
		<text style="font-size:22rpx;margin:10rpx; color: #808080;">
			本店承诺：为便捷服务，我是线下实体店铺，购买有保障，每单均有实体出票照片。如看不到实体票请及时与我们联系！
		</text>
	</view>
	<view class="" style="height:180rpx;"></view>
	<gcm-red-bag :rbagmodelshow='redPacketValue' @onClose='redPacketValue=false' :options="redPacketData"><!-- 红包模块 -->
	</gcm-red-bag>

	<announcement :contentShow="announcement_show" @close="announcement_show=!announcement_show" :content="popupContent"
		@confirm="clickAnnouncement" />
	<customtabbar :current="0"></customtabbar>
</template>
<script setup>
	import api from '@/common/vmeitime-http/'
	import {
		useCounterStore
	} from '@/stores/counter'
	import {
		onShow
	} from "@dcloudio/uni-app"
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		watch
	} from 'vue';
	import announcement from "@/components/common/announcement_popup.vue"
	import common from '../../common/common';
	import customtabbar from "@/components/nav-bottom/nav-bottom.vue"

	const counter = useCounterStore(); //状态管理
	const redPacketValue = ref(false) //控制红包是否显示
	const view_Show = ref(false)
	const announcement_show = ref(false)
	const popupContent = ref('')
	const redPacketData = reactive({ //红包封面数据
		userImg: null, //头像
		userName: null, //名字
		coverTitle: null, //红包标题
	})
	const shopInfo = ref(null) //店主电话和微信信息
	const images = ref([
		'/static/img/main/1.png',
		'/static/img/main/2.png'
	])
	const banner = ref([])
	onShow(() => {
		uni.setStorageSync("bgColor", '#F41515')
		uni.setStorageSync("fontColor", 'rgb(232, 11, 11)')
		// getip()
		apiFuncion()
		getAvailableApiUrls()
		// getShareApiUrls()
		if (counter.redPacketBoole != undefined && counter.redPacketBoole.redPacket) { //判断是否有可领红包
			redPacketData.userImg = counter.redPacketBoole.shop_data.dataList.avatar
			redPacketData.userName = counter.redPacketBoole.shop_data.dataList.nickname
			redPacketData.coverTitle = counter.redPacketBoole.shop_data.title
			redPacketValue.value = true
		}
		setTimeout(function() {
			//每次回到首页情况所有状态管理的投注信息
			counter.submitData = []
			counter.submitNewData = []
			counter.submitNewData = []
			counter.BettingContent = []
			counter.allOrderData = []
			counter.gameAstrict = null
		}, 200)
	})
	const skip_shop = () => { //跳转至店铺选择
		uni.reLaunch({
			url: '/pages/shop_select/select_page',
			animationType: 'slide-in-bottom'
		})
	}


	const topBottom = (type) => { //top店主快捷信息按钮
		if (type === 'yaoq') {
			uni.navigateTo({
				url: '../home/sharePage/sharePage',
				animationType: 'slide-in-bottom'
			})
			return
		}
		if (type === 'dianp') {
			uni.navigateTo({
				url: '/pages/home/StoreInformation/StoreInformation',
				animationType: 'slide-in-bottom'
			})
			return
		}
		if (shopInfo.value) {
			if (type === 'mobile') { //用户点击联系店主
				if (!shopInfo.value.shop_Mobile) {
					uni.showToast({
						title: '店主未添加联系电话',
						icon: 'none'
					})
					return
				}
				uni.makePhoneCall({
					phoneNumber: shopInfo.value.shop_Mobile,
					fail() {
						uni.showToast({
							title: '调用拨号失败，已复制店主号码',
							icon: 'none',
							position: 'center'
						})
					},

				})
			} else { //点击添加微信
				if (!shopInfo.value.shop_WeChat) {
					uni.showToast({
						title: '店主未设置微信号',
						icon: 'none'
					})
					return
				}
				uni.setClipboardData({
					data: String(shopInfo.value.shop_WeChat),
					showToast: false,
					fail() {
						uni.showToast({
							title: '复制失败，店主微信:' + shopInfo.value.shop_WeChat + '请截图保存',
							icon: 'none'
						})
					},
					success() {
						uni.showToast({
							title: '复制店主微信成功',
							icon: 'none'
						})
					}

				})
			}
		} else { //如未获取过店主信息
			uni.showLoading({
				title: '正在获取中'
			})
			api.shopData().then((res) => {
				uni.hideLoading()
				shopInfo.value = res.data.data //数据存储
				if (type == 'mobile') { //用户点击联系店主
					if (!shopInfo.value.shop_Mobile) {
						uni.showToast({
							title: '店主未添加联系电话',
							icon: 'none'
						})
						return
					}
					uni.makePhoneCall({
						phoneNumber: shopInfo.value.shop_Mobile,
						fail() {
							uni.showToast({
								title: '调用拨号失败，已复制店主号码',
								icon: 'none',
								position: 'center'
							})
						},

					})
				} else { //点击添加微信
					if (!shopInfo.value.shop_WeChat) {
						uni.showToast({
							title: '店主未设置微信号',
							icon: 'none'
						})
						return
					}
					uni.setClipboardData({
						data: String(shopInfo.value.shop_WeChat),
						showToast: false,
						fail() {
							uni.showToast({
								title: '复制失败，店主微信:' + shopInfo.value.shop_WeChat + '请截图保存',
								icon: 'none'
							})
						},
						success() {
							uni.showToast({
								title: '复制店主微信成功',
								icon: 'none'
							})
						}

					})
				}
			}).catch(err => {
				uni.hideLoading()
				uni.showToast({
					title: '获取店主信息失败，请稍后再试~',
					icon: 'none',
					position: 'center'
				})
			})

		}
	}
	const navigator_tab = (index) => { //快捷按钮跳转
		if (index == 1) {
			uni.navigateTo({
				url: '/pages/together/together'
			})
		} else if (index == 2) {
			uni.navigateTo({
				url: '/pages/kaijiang/kaijiang'
			})
		} else {
			uni.navigateTo({
				url: '/pages/trend/trend'
			})
		}
	}

	const apiFuncion = async () => { //获取玩法信息
		await api.GetMainInfo({
			"shop_id": counter.shop_id
		}).then((res) => { //获取首页信息
			uni.hideLoading()
			if (res.data.code === 1) {
				banner.value = res.data.data.banner? JSON.parse(res.data.data.banner) : []
				shop_name.value = res.data.data.shop_name
				palylist[0].sports = res.data.data.play_list.sports
				palylist[0].welfare = res.data.data.play_list.welfare
				//储存所有玩法的限制
				counter.allGameAstrict = res.data.data.play_list.sports.concat(res.data.data.play_list
					.welfare)
				//如果没有福利彩票玩法，体彩就默认全部显示
				if (palylist[0].welfare.length == 0) {
					view_Show.value = true
				}
			}
			announcement_fuc()
		})
	}

	const currentTry = ref(0)
	const dataurl = ref([])
	const getAvailableApiUrls = () => {
		uni.request({
			url: uni.getStorageSync('api') + '/api/common/domainList?server=1', // 后端返回多个域名的接口
			method: 'GET',
			timeout: 2000,
			success: (res) => {
				dataurl.value = res.data.data.dataHostList
				dataurlsfunction()
				shareurl.value = res.data.data.shareHostList
				shareurlsfunction()
			},
			fail: (err) => {
				console.log(err)
			}
		});
	}

	const dataurlsfunction = () => {
		// console.log('执行次数' + currentTry.value)
		uni.request({ //获取比赛数据
			url: dataurl.value[currentTry.value] +
				`/api.SportDataV1/odds?type=jclq&key=qhkj&secret=a4f71eaa25a00144c35eb0a457e636c`,
			timeout: 2000,
			method: 'GET',
			success(res) {
				uni.setStorageSync('dataapi', dataurl.value[currentTry.value])
			},
			fail(err) {
				if (currentTry.value >= dataurl.value.length) {
					return
				} else {
					currentTry.value++
					dataurlsfunction()
				}
			}
		})
	}

	const clickAnnouncement = () => { //弹窗公告显示不在显示
		uni.setStorage({ //聊天记录变化后保存至本地
			key: 'isPopup',
			data: counter.userAllData.noticeboard.pop_up.id,
			success() {
				announcement_show.value = false
			}
		})
	}

	const announcement_pt_fuc = () => { //获取公告内容，判断是否需要显示
		if (counter.userAllData && counter.userAllData.noticeboard) {
			uni.getStorage({
				key: 'isPopup',
				success(res) {
					if (counter.userAllData.noticeboard.pop_up && res.data != counter.userAllData.noticeboard
						.pop_up.id) {
						popupContent.value = counter.userAllData.noticeboard.pop_up
						announcement_show.value = true
					}
				},
				fail() {
					if (counter.userAllData.noticeboard.pop_up) {
						popupContent.value = counter.userAllData.noticeboard.pop_up
						announcement_show.value = true
					}
				}
			})
			//滚动公告赋值
			noticetext.value = counter.userAllData.noticeboard.roll ? counter.userAllData.noticeboard.roll.content : ''
		}
	}

	const announcement_fuc = () => { //获取公告内容，判断是否需要显示
		if (counter.userAllData && counter.userAllData.noticeboard) {
			uni.getStorage({
				key: 'isPopup',
				success(res) {
					if (counter.userAllData.noticeboard.pop_up && res.data != counter.userAllData.noticeboard
						.pop_up.id) {
						popupContent.value = counter.userAllData.noticeboard.pop_up
						announcement_show.value = true
					}
				},
				fail() {
					if (counter.userAllData.noticeboard.pop_up) {
						popupContent.value = counter.userAllData.noticeboard.pop_up
						announcement_show.value = true
					}
				}
			})
			//滚动公告赋值
			noticetext.value = counter.userAllData.noticeboard.roll ? counter.userAllData.noticeboard.roll.content : ''
		}
	}
	const shareurl = ref([])
	const currentsTry = ref(0)
	const shareurlapi = ref(0)
	// const getShareApiUrls = () => {
	// 	uni.request({
	// 		url: uni.getStorageSync('api') + '/api/common/domainList?server=1', // 后端返回多个域名的接口
	// 		timeout: 2000,
	// 		method: 'GET',
	// 		success: (res) => {
	// 			shareurl.value = res.data.data.shareHostList
	// 			shareurlsfunction()
	// 		},
	// 		fail: (err) => {
	// 			console.log(err)
	// 		}
	// 	});
	// }
	const shareurlsfunction = () => {
		uni.request({
			url: shareurl.value[currentsTry.value] + `/api/common/domainList?server=1`,
			timeout: 2000,
			method: 'GET',
			success(res) {
				shareurlapi.value = shareurl.value[currentsTry.value]
				uni.setStorageSync('shareapi', shareurl.value[currentsTry.value])
				uni.hideLoading()
			},
			fail(err) {
				if (currentsTry.value >= shareurl.value.length) {
					return
				} else {
					currentsTry.value++
					shareurlsfunction()
				}
			}
		})
	}

	//滑动窗口
	const mode = ref('round')
	// 获取首页信息
	const shop_name = ref()
	const noticetext = ref()
	const palylist = reactive([ //全部的玩法限制
		{
			'sports': [],
			'welfare': []
		}
	])
	async function sportsaction(e) { //体育彩票点击
		var urls = palylist[0].sports[e]
		if (palylist[0].sports[e].gamestate == '1') {
			counter.gameAstrict = palylist[0].sports[e]
			uni.navigateTo({
				url: urls.systemsgamelist.url,
				animationType: 'slide-in-right',
			})
		} else {
			uni.showToast({
				title: '店主关闭了此玩法的投注~',
				position: 'center',
				icon: "none"
			})
		}
	}

	function welfareaction(e, index) { //福利彩票点击
		var index = e
		var urls = palylist[0].welfare[index]
		counter.gameAstrict = palylist[0].welfare[index]
		uni.navigateTo({
			url: urls.systemsgamelist.url,
			animationType: 'slide-in-right',
		});
	}
	const getip = () => {
		uni.request({
			url: 'http://t.me993km7.com/time',
			method: 'GET',
			success: (res) => {
				uni.setStorageSync("x-access-ip", res.data.ip);
			}
		})
	}
	const getUserInfo = async () => { //获取用户信息
		if (counter.onHide_boole) {
			return
		} //用户后台进入app，拦截执行，因为在全局已执行一次
		await common.getUserInfo()
	}
</script>

<style>
	/deep/.uni-swiper-dots-horizontal {
		display: none;
	}

	.reloadGameInfo {
		width: 680rpx;
		padding: 20rpx;
		background-color: #ae9eff;
		text-align: center;
		border-radius: 20rpx;
		margin: 20rpx auto;
		color: white;
		font-weight: bold;
	}

	.banner_t {
		width: 100%;
		height: 120rpx;
		background-image: url('../../static/img/home/bg.png');
		background-repeat: no-repeat;
		background-size: 100% 486rpx;
		background-position: 0 100%;
		/* padding: 0 10px; */
		position: relative;
		padding-top: 25px;
		/* margin-top: 0px; */
		/* background-size: 100% 200px; */
		/* background-size: 100% 87px;
		background-position: 0 100%; */
		/* padding: 0 10px;
		position: relative;
		padding-top: 25px; */
		/* margin-top: -25px; */
	}

	.bottm_content_box {
		text-align: center;
		color: white;
	}

	.bottom_image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.bottom_box {
		width: 710rpx;
		height: 110rpx;
		padding: 20rpx 0;
		margin: 0 auto -20rpx auto;
		background: rgba(255, 255, 255, 0.2);
		-webkit-backdrop-filter: blur(50rpx);
		backdrop-filter: blur(50rpx);
		border-radius: 15rpx 15rpx 0 0;
		box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.2);
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.top_box {
		width: 100%;
		/* //#8e94ff, #6670ff */
		/* background-image: linear-gradient(-225deg, #97aaff, #7982ff); */
		/* border-radius:0 0 20rpx 20rpx; */
		/* 	padding: 20rpx;
		box-sizing: border-box; */
		/* margin-bottom: 20rpx; */
	}

	.game_image {
		width: 90rpx;
		height: 90rpx;
	}

	.show_card {
		width: 680rpx;
		border-radius: 0rpx 0rpx 20rpx 20rpx;
		padding: 10rpx 20rpx;
		background-color: white;
		box-shadow: 0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		margin: auto;
		font-size: 26rpx;
		color: #7e7e7e;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.game_card {
		width: 680rpx;
		background-color: white;
		box-shadow: 0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		border-radius: 20rpx 20rpx 0 0;
		margin: 20rpx auto 0 auto;
		padding: 20rpx;
		transition: all .3s;
		display: grid;
		grid-template-columns: repeat(4, auto);
		grid-template-rows: repeat(auto, auto);
		overflow: hidden;
		grid-row-gap: 20rpx;
		justify-content: space-around;
	}

	.game_itme_card {
		width: 170rpx;
		height: 200rpx;
		display: flex;
		flex-flow: column;
		align-items: center;
	}

	.announcement {
		width: 710rpx;
		margin: auto;
		margin-top: 45rpx;
		border-radius: 15rpx;
		box-shadow: 0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
	}

	.sanyuan {
		margin-top: 36rpx;
	}

	.shop_name {
		/* width: 670rpx; */
		padding: 20rpx;
		/* margin-bottom: 40rpx; */
		margin-top: var(--status-bar-height);
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-image: url('../../static/img/home/bg.png');
		background-size: 700rpx 288px;
		background-position: 0 100%;
		/* box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.2); */
	}

	.box_lg {
		width: 70rpx;
		height: 70rpx;
		/* border-radius: 50%; */
		/* background: #fff; */
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.tag {
		padding: 5rpx 10rpx;
		/* background-color: #202736;  */
		border-radius: 10rpx;
		color: white;
		font-size: 38rpx;
		/* font-weight: bold; */
	}

	.tag1 {
		padding: 15rpx 20rpx;
		background-color: #55aa00;
		border-radius: 10rpx;
		color: white;
		font-size: 24rpx;
		font-weight: bold;
	}

	.banner {
		background-color: #18BC37;
		height: 260rpx;
		width: 700rpx;
		margin: 15rpx auto;
		border-radius: 10px;
	}

	.footer-title {
		margin: auto;
		display: flex;
		align-items: center;
	}

	.theme-itme-img {
		height: 100%;
		width: 100%;
		border-radius: 10rpx;
	}

	.theme-itme {
		height: 220rpx;
		width: 50%;
		/* margin: 10rpx; */
	}

	.theme {
		display: flex;
		align-items: center;
		margin: 20rpx 10rpx;
		/* background-color:#fff; */
		border-radius: 15rpx;
		/* box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.5); */
	}

	.content-List-itme {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 120rpx;
	}

	.oneCard_identifying {
		width: 95%;
		height: 60rpx;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		transition: all .3s;
		border-radius: 20rpx;
	}

	body {
		background-color: #fff;
	}

	/* /deep/.uni-app, uni-page, uni-page-wrapper, uni-page-body {
		max-height: 2010rpx !important;
	} */

	.footer {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		/* align-items: flex-start; */
		margin-top: 20rpx;
		/* 	margin-bottom: 40rpx; */
	}

	.box {
		margin: auto;
	}

	.content-List {
		width: 95%;
		background-color: white;
		box-shadow: 0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		margin: auto;
		display: flex;
		padding: 20rpx 0;
		flex-direction: column;
		overflow: hidden;
		border-radius: 20rpx;
		transition: all .3s;
	}

	.header {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		width: 100%;
		height: 390rpx;
		background-image: url("../../static/img/main/bg.png");
		background-repeat: no-repeat;
		background-size: cover;
		-webkit-background-size: cover;
		-o-background-size: cover;
		background-position: center 0;
	}

	/deep/.uni-app,
	uni-page,
	uni-page-wrapper,
	uni-page-body {
		background: #f3f5f8 !important;
	}

	/* /deep/.swiper-container {
		width: 100%;
		height: 400px;
	} */
</style>