<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList" :auto-show-back-to-top='true'>
		<template v-slot:top>
			<view class="status_bar" style="background-color:#c6171e;height: var(--status-bar-height);" />
			<!-- 导航栏 -->
			<view class="navigation">
				<text style="font-size: 36rpx;font-weight: bold;">合买大厅</text>
				<text style="position: absolute;right: 30rpx;font-size: 30rpx;" @click="openScreen">全部彩种</text>
			</view>
			<view style="background-color:#A6A6A6;border-radius:0 0 20rpx 20rpx;color: #fff;">
				<uni-segmented-control :current="current" styleType="text" :values="groupitems" color="#fff"
					activeColor="#c6171e" @clickItem="clickItem">
				</uni-segmented-control>
			</view>
		</template>
		<!-- 进度排序 -->
		<view class="cardStyle" v-for="item,index in dataList" :key="index"
			:style="item.Type !== infoIndexName && infoDefault > 0 ? 'display:none;' : false">
			<view @click="gerenzhongxin(item.together[0].user_id.id)" style="display: flex;">
				<image :src='item.together[0].user_id.avatar'
					style="width: 100rpx; height: 100rpx;margin: 10rpx 5rpx;border-radius:5rpx;" mode="aspectFill">
				</image>
				<view style="display: flex;flex-flow: column;justify-content:space-around;">
					<text>{{item.together[0].user_id.nickname}}</text>
					<view style="display: flex;flex-direction: row;align-items: center;">
						<text style="color: #1B4F88;font-size:32rpx;margin-top: -5rpx;">截止:</text>
						<showTiem :timestamp="item.Deadline" color="#1B4F88" splitorColor="#1B4F88" :font-size="21" />
					</view>
				</view>
				<view v-if="item.together[0].guarantee>0" class="label_hemai">
					<view class="label_box">
						{{item.together[0].guarantee+item.together[0].MyselfShare==item.NumberShare?'全额保底':'保底'+item.together[0].guarantee+'份'}}
					</view>
				</view>
			</view>
			<!-- <下半部分> -->
			<view @click="open(item.order_id,item.Type)"
				style="width:650rpx;border:1rpx #fafafa solid;border-radius:20rpx;margin: 10rpx auto;padding:20rpx;box-shadow:inset 0rpx 0rpx 30rpx #f9f9f9;backdrop-filter: blur(50px);">
				<view style="display: flex;justify-content: space-between;margin:10rpx 0rpx;flex-direction: column;">
					<view style="display: flex;justify-content: space-between;">
						<text style="color: #a6a6a6 ;">宣言:</text>
						<view style="display: flex;align-items: center;">
							<image :src="GameTypein(item.Type)" style="width: 40rpx; height: 40rpx;"></image>
							<text
								style="color: white;line-height:50rpx;color: #3a3a3a;margin: 0 10rpx;">{{item.Type}}</text>
						</view>
					</view>
					<text class="xuanyan">
						{{item.together[0].Declaration == null ? '众人拾柴火焰高！': common.isJson(item.together[0].Declaration)}}
					</text>
				</view>
				<view class="neirCard">
					<view style="text-align: center;">
						<text style="color: #afafaf ;">方案金额</text><br>
						<text style="color: #e05251;">￥{{item.BetMoney}}</text>
					</view>
					<text style="color: #dfdfdf ;">|</text>
					<view style="text-align: center;">
						<text style="color: #afafaf ;">单份金额</text><br>
						<text style="color: #e05251;">￥{{item.BetMoney/item.NumberShare}}</text>
					</view>
					<text style="color: #dfdfdf ;">|</text>
					<view style="text-align: center;">
						<text style="color: #afafaf ;">剩余份量</text><br>
						<text style="color: #555555;font-weight: bold;">
							{{item.NumberShare-item.togetherShare}}
						</text>
					</view>
					<text style="color: #dfdfdf ;">|</text>
					<view class="hemai_Buttom">去合买</view>
				</view>
				<view style="display: flex;margin-top: 20rpx;align-items: center;color: #db3735;">
					<text style="color: #4c4c4c ;">合买进度：</text>
					<view style="width:500rpx;">
						<progress show-info="true" :percent="(item.progress*100).toFixed(2)" active="true"
							activeColor="#db3735" duration="10"></progress>
					</view>
				</view>
			</view>
		</view>
	</z-paging>

	<uni-popup type="right" ref="popupRight" mask-background-color='rgba(104, 104, 104, 0.4)' @change="closePopup">
		<view style="width: 500rpx;background-color: white;height: 100%;border-radius: 50rpx 0 0 50rpx;">
			<view style="padding: 50rpx 40rpx;color: #3a3a3a ;">彩种筛选</view>
			<view style="padding: 0rpx 40rpx;display: flex;flex-wrap: wrap;">
				<view v-for="item,index in infoArr" @click="infoClick(index)" :key="index"
					:style="infoDefault == index ? 'border: 1rpx solid #ffb300;' : 'border: 1rpx solid #a5a5a5;'"
					style="width: 180rpx;height: 60rpx; border-radius: 15rpx;display: flex;align-items: center;justify-content: center;margin: 16rpx 12rpx;">
					<text :style="infoDefault == index ? 'color: #ffb300;':'color:#a5a5a5;'"
						style="">{{item.name}}</text>
				</view>
			</view>
		</view>
	</uni-popup>

	<uni-popup type="bottom" ref="togetherInfo" :maskClick="false">
		<togetherCard @close='close' :Hemaidata="openData"></togetherCard>
	</uni-popup>
	<customtabbar :current="1"></customtabbar>
</template>

<script setup>
	import CmdProgress from "@/components/together/cmd-progress.vue"
	import showTiem from '@/components/common/showTiem.vue'
	import common from "@/common/common"
	import api from "@/common/vmeitime-http/index.js"
	import {
		useCounterStore
	} from '@/stores/counter'
	import {
		onBeforeMount,
		ref,
		reactive,
		getCurrentInstance,
	} from 'vue';
	import togetherCard from "@/components/common/yc-hemai-card/yc-hemai-card.vue"
	import {
		onShow,
		onBackPress
	} from '@dcloudio/uni-app'
	import customtabbar from "@/components/nav-bottom/nav-bottom.vue"
	const {
		proxy,
		ctx
	} = getCurrentInstance()

	const counter = useCounterStore(); //状态管理
	const typeTabel = reactive(['progress', 'BetMoney', 'PayTime']) //对应tab的index的apiType
	const dataList = ref([]) //数据存储
	const popup_isOpen = ref(false) //是否有弹窗打开中（用于返回时间拦截）
	const queryList = (pageNo, pageSize) => {
		api.GetHemai({
			'type': typeTabel[current.value],
			'per_page': pageSize,
			'current_page': pageNo
		}).then((res) => {
			proxy.$refs.paging.complete(res.data.data.data)
		}).catch(res => {
			proxy.$refs.paging.complete(false)
		})
	}
	onBackPress(() => {
		if (popup_isOpen.value) {
			close();
			return true
		}
	})
	const openScreen = () => {
		proxy.$refs.popupRight.open()
		popup_isOpen.value = false
		uni.hideTabBar()
	}
	const closePopup = () => {
		uni.showTabBar()
	}
	const current = ref(0)
	const groupitems = reactive(['进度排序', '金额排序', '最新合买'])
	const clickItem = (e) => {
		if (current.value != e.currentIndex) {
			current.value = e.currentIndex;
			proxy.$refs.paging.reload()
		}
	}
	//传给弹窗的数据
	const openData = ref([])
	const close = () => {
		uni.showTabBar()
		popup_isOpen.value = false
		proxy.$refs.togetherInfo.close()
		proxy.$refs.paging.refresh()
		setTimeout(() => {
			counter.submitNewData = []
			counter.BettingContent = []
		}, 300)
	}
	const open = (order_id, gameTile) => {
		counter.submitNewData = []
		counter.BettingContent = []
		uni.showLoading({
			title: '获取数据中',
			mask: true
		})
		api.GetTogetherInfo({
			'order_id': order_id
		}).then((res) => {
			uni.hideLoading()
			if (gameTile == '福彩3D' || gameTile == '快乐八' || gameTile == '七乐彩' || gameTile == '双色球' ||
				gameTile == '大乐透' || gameTile == '排列三' || gameTile == '排列五' || gameTile == '七星彩') {
				counter.submitNewData = JSON.parse(res.data.data.Order.BetContent)
			} else {
				counter.BettingContent = JSON.parse(res.data.data.Order.BetContent)
			}
			openData.value = res.data.data.Order
			proxy.$refs.togetherInfo.open()
			popup_isOpen.value = true
			uni.hideTabBar()
		}).catch((err) => {
			uni.hideLoading()
			uni.showToast({
				title: '无法获取到合买信息，请反馈平台方',
				icon: 'none',
				position: 'center'
			})
		})
	}
	const gerenzhongxin = (id, itme) => {
		uni.navigateTo({
			url: '/pages/together/gerenzhongxin?&userId=' + id
		})
	}

	//全部彩种筛选
	const infoDefault = ref(0)
	const infoIndexName = ref()
	const infoClick = (index) => {
		if (infoDefault.value == index) {
			return
		} else {
			infoDefault.value = index
		}
		infoIndexName.value = infoArr[infoDefault.value].name
		proxy.$refs.popupRight.close()
	}
	// 筛选
	const infoArr = reactive([{
			name: "全部彩种",
			value: 0,
		},
		{
			name: "竞彩足球",
			value: 1,
		},
		{
			name: "竞彩篮球",
			value: 2,
		},
		{
			name: "胜负过关",
			value: 3,
		},
		{
			name: "北京单场",
			value: 4,
		},
		{
			name: "双色球",
			value: 5,
		},
		{
			name: "大乐透",
			value: 6,
		},
		{
			name: "排列三",
			value: 7,
		},
		{
			name: "排列五",
			value: 8,
		},
		{
			name: "七星彩",
			value: 9,
		},
		{
			name: "七乐彩",
			value: 10,
		},
		{
			name: "快乐八",
			value: 11,
		},
		{
			name: "福彩3D",
			value: 12,
		},
		{
			name: "任选九",
			value: 13,
		},
		{
			name: "胜负彩",
			value: 14,
		}
	])
	const hourValue = ref(0)
	const minuteValue = ref(0)
	const secondValue = ref(0)
	const NewTiem = (e, a) => {
		const endTime = new Date(e)
		const nowTime = new Date()
		const difftime = (endTime - nowTime) / 1000
		var days = parseInt(difftime / 86400); // 天  24*60*60*1000
		if (a == 0) {
			return hourValue.value = parseInt(difftime / 3600) - 24 * days; // 小时 60*60 总小时数-过去的小时数=现在的小时数 
		} else if (a == 1) {
			return minuteValue.value = parseInt(difftime % 3600 / 60); // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
		} else {
			return secondValue.value = parseInt(difftime % 60); // 以60秒为一整份 取余 剩下秒数
		}
	}

	const GameTypein = (e) => { //订单头像对照表

		if (e == "七星彩") {
			return '/static/img/lottery/204.png'
		} else if (e == '双色球') {
			return '/static/img/lottery/101.png'
		} else if (e == '福彩3D') {
			return '/static/img/lottery/102.png'
		} else if (e == '七乐彩') {
			return '/static/img/lottery/104.png'
		} else if (e == '快乐八') {
			return '/static/img/lottery/105.png'
		} else if (e == '大乐透') {
			return '/static/img/lottery/201.png'
		} else if (e == '排列三') {
			return '/static/img/lottery/202.png'
		} else if (e == '排列五') {
			return '/static/img/lottery/203.png'
		} else if (e == '胜负彩') {
			return '/static/img/lottery/401.png'
		} else if (e == '任选九') {
			return '/static/img/lottery/402.png'
		} else if (e == '胜负过关') {
			return '/static/img/lottery/404.png'
		} else if (e == '北京单场') {
			return '/static/img/lottery/405.png'
		} else if (e == '竞彩篮球') {
			return '/static/img/lottery/406.png'
		} else if (e == '竞彩足球') {
			return '/static/img/lottery/407.png'
		}
	}
</script>

<style>
	.label_box {
		/* width: 220rpx;
		height: 80rpx;
		border-radius: 10rpx; */
		text-align: center;
		line-height: 80rpx;
		color: #1b273a;
		font-weight: bold;
		/* background-color: #1b273a; */
	}

	.label_hemai {
		display: flex;
		justify-content: flex-end;
		flex: 1;
	}

	/* 导航 */
	.navigation {
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		background:#A6A6A6;
		/* background-size: 1440px 88px;
		background-position: 0 100%;
		box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.2); */
	}

	.neirCard {
		width: 600rpx;
		padding: 20rpx;
		background-color: #f7f7f7;
		border-radius: 20rpx;
		margin: 10rpx auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.hemai_Buttom {
		width: 140rpx;
		height: 80rpx;
		background: #db3735;
		border-radius: 20rpx;
		text-align: center;
		line-height: 80rpx;
		color: white;
		font-weight: bold;
	}

	.cardStyle {
		width: 690rpx;
		border-radius: 10rpx;
		padding: 20rpx;
		margin: 30rpx auto;
		background-color: white;
		box-shadow: 0rpx 3rpx 15rpx #ebebeb;
	}

	body {
		background-color: #fbfbfb;
	}

	.box1 {
		border-radius: 10px;
		margin-top: 2%;
		display: flex;
		flex-direction: row;
		margin-bottom: 3%;

	}

	.box2 {

		margin-left: 2%;
		margin-right: 4%;

	}

	.box .bottom {
		display: flex;
		flex-direction: row;
	}

	.active {
		width: 160rpx;
		border: 0px solid #e05251;
		color: #e05251;

	}


	.baodi {
		width: 150rpx;
		height: 50rpx;
		margin-top: 30rpx;
		border-radius: 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
	}

	.xuanyan {
		color: #555555;
		margin-bottom: 5rpx;
		overflow: hidden;
		display: -webkit-box;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
</style>