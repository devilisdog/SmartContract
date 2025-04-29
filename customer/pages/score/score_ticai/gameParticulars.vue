<template>
	<view class="status_bar"></view>
	<view class="topBox">
		<view class="toptab">
			<view class="tab_left" @click="balck">
				<uni-icons type="closeempty" size="42rpx" color="white"></uni-icons>
			</view>
			<view class="titleTextSize">{{ pageData.title }}</view>
			<view class="tab_right"></view>
		</view>
		<view class="content_box">
			<view class="box_left">
				<view class="teamLogo">
					<image :src="pageData.homeTeamLogo" mode="aspectFit"></image>
				</view>
				<uni-notice-bar :text="pageData.homeTeamName" color="#fff" :speed="50" backgroundColor="rgba(0,0,0,0.0)"
					:scrollable="true" />
			</view>
			<view class="box_middle" v-if="[2, 3, 4, 5, 7].includes(pageData.matchStatus)">
				<!-- <text>{{ date.getNowFormatDate(7, pageData.matchTime) }}</text>
				<text class="middle_state">{{ pageData.elapsedTime }}</text> -->
				<view class="middle_score">
					{{ pageData.score }}
				</view>
				<view class="live_label" v-if="[2, 3, 4, 5, 7].includes(pageData.matchStatus)">
					<text @click="getVideoLive" class="vido">视频直播</text>
				</view>
			</view>
			<view class="box_middle" style="justify-content: center;" v-else>
				<text>{{ date.getNowFormatDate(7, pageData.matchTime) }}</text>
				<text style="font-size:52rpx;font-weight: bold;">V S</text>
				<text class="middle_state">{{ pageData.elapsedTime }}</text>
			</view>
			<view class="box_right">
				<view class="teamLogo">
					<image :src="pageData.awayTeamLogo" mode="aspectFit"></image>
				</view>
				<uni-notice-bar :text="pageData.awayTeamName" color="#fff" :speed="50" backgroundColor="rgba(0,0,0,0.0)"
					:scrollable="true" />
			</view>
		</view>
	</view>

	<view style="background-color:white;">
		<uni-segmented-control @clickItem="onClickItem" :current="current" :values="items" style-type="text"
			activeColor="#dd3620">
		</uni-segmented-control>
	</view>

	<scroll-view scroll-y="true" v-show="current === 0" class="bottom_content_box">
		<historyCard @getData="getTeamBoutExploits()" :cardInfo="cardData.history" :currentIndex="current"
			:myCurrent="0" :type='Props.gameType'></historyCard>
	</scroll-view>

	<view class="bottom_content_box" v-show="current === 1">
		<z-paging ref="blvRef" v-model="cardData.blvData_list" @query="getOneMatchEuropeOdds" :fixed="false"
			:auto="false">
			<dataCard :cardInfo="cardData.blvData" :dataLsit="cardData.blvData_list" :type='Props.gameType'></dataCard>
		</z-paging>
	</view>

	<scroll-view scroll-y="true" v-show="current === 2" class="bottom_content_box">
		<teamSatetCard @getData="getGameTeamStatus()" :cardInfo="{
			homeNearStatus: cardData.homeRecent, awayNearStatus: cardData.awayRecent
		}" :currentIndex="current" :myCurrent="2" :type='Props.gameType'></teamSatetCard>
	</scroll-view>

	<scroll-view scroll-y="true" v-show="current === 3" class="bottom_content_box">
		<intelligence @getData="getLeagueIntelligence()" :cardInfo="cardData.intelligenceData" :currentIndex="current"
			:myCurrent="3" :type='Props.gameType'></intelligence>
	</scroll-view>

	<scroll-view scroll-y="true" v-show="current === 4" class="bottom_content_box">
		<chatCard :currentIndex="current" :myCurrent="3" :type='Props.gameType' :parentHeight="'63vh'"
			:match_id='Props.info_id'></chatCard>
	</scroll-view>

	<!-- <live :live_url='animation_live_src' v-if="isDom"></live> -->
	<videoLive v-if="video_show" :live_url_arr='video_live_url'></videoLive>

	<uni-transition :show="isDom || video_show" mode-class="fade" class="close_live"
		@click="isDom = false; video_show = false; autoPageData()">
		<uni-icons type="closeempty" color="white"></uni-icons>
	</uni-transition>
</template>

<script setup>
import timeline from "@/components/chenbin-timeline/timelineItem.vue"
import api from '@/common/vmeitime-http/index.js'
import { onBeforeMount, ref, reactive, defineProps, getCurrentInstance } from 'vue';
import { onHide, onUnload } from "@dcloudio/uni-app"
import chatCard from "@/components/score/chat_card.vue"
import historyCard from "@/components/score/historyInfo_card.vue"
import teamSatetCard from "@/components/score/TeamStatus_card.vue"
import live from "@/components/score/animation_live.nvue"
import videoLive from "@/components/score/video_live.vue"
import dataCard from "@/components/score/dataAnalysis_card.vue"
import intelligence from "@/components/score/intelligence_card.vue"
import date from "@/common/getdatetime.js"
const { proxy, ctx } = getCurrentInstance()
const Props = defineProps(['info_id', 'gameType', 'awayId', 'homeId'])
const current = ref(0)//发段器默认选择
const items = reactive(['比赛分析', '数据趋势', '队伍状态', '比赛情报', '聊天'])
const pageData = reactive({
	title: '起飞',//标题
	awayTeamLogo: '',//客队头像
	homeTeamLogo: '',//主对头像
	elapsedTime: '',//比赛状态
	homeTeamName: '',//主队名字
	awayTeamName: '',//客队名字
	matchNoCn: '',//场次转义
	matchStatus: '',//比赛状态 1：未开赛 2/3/4/5/7：进行中 10：已完场
	matchTime: '',//比赛时间
	score: '',//比分
	// score: {
	// 	homeScore_b: 0,//主队半场进球
	// 	homeScore: 0,//主队进球
	// 	awayScore: 0,//客队进球
	// 	awatScore_b: 0,//客队半场进球
	// 	totalScoer: 0,//总进球
	// 	ScoerGap: 0//分差
	// },
	isProceed: false
})
const cardData = reactive({
	history: {},
	homeRecent: {},
	awayRecent: {},
	blvData: {},
	blvData_list: [],
	intelligenceData: {}
})
const video_live_url = reactive([])
const video_show = ref(false)
onBeforeMount(() => {
	// getGameInfo()
	// getMatchListLiveScore()
	isVideoLive()
	getTeamBoutExploits()
})
const homeIndex = ref(0)
const openInfo = (e) => {
	if (homeIndex.value != e) {
		homeIndex.value = e
	}
}
const animation_live_src = ref('')
const isDom = ref(false)
onHide(() => {
	closePageData()
})
// const getBkGameInfo = () => {//获取基础对局信息(篮球)
// 	var obj = {
// 		apiName: 'getBkMatchDetail',
// 		matchId: String(Props.info_id),
// 		key: 'jmkj',
// 		secret: '500e2f2775ddf6b0b355eac5c4e162cb',
// 	}
// 	getNewInfo(obj).then(res => {
// 		dataUpdating(res.data.matchDetail)
// 	})
// }
// const getGameInfo = () => {//获取基础对局信息(足球)
// 	var obj = {
// 		apiName: 'getMatchInfoById',
// 		leagueMatchId: String(Props.info_id),
// 		key: 'jmkj',
// 		secret: '500e2f2775ddf6b0b355eac5c4e162cb',
// 	}
// 	getNewInfo(obj).then(res => {
// 		dataUpdating(res.data.data.leagueMatchVO)
// 	})
// }

const isVideoLive = () => {//获取视频直播源
	video_live_url.length = 0
	api.GetLiveInfo({
		match_id: String(Props.info_id),
		// match_id: 2389537,
		type: Props.gameType == 'lq' ? 2 : 1
	}).then(res => {
		const data = res.data.data

		pageData.title = ''
		pageData.homeTeamLogo = data.home_team_logo
		pageData.awayTeamLogo = data.away_team_logo
		pageData.homeTeamName = data.home_team_name
		pageData.awayTeamName = data.away_team_name
		pageData.matchStatus = data.status
		pageData.score = data.score

		if (data.video) {
			for (const key in data.video) {
				const valueArray = data.video[key];
				valueArray.forEach((a, idx) => {
					video_live_url.push({
						url: a,
						title: `${key}线路${idx + 1}`
					});
				});
			}
		}
	})

	// uni.request({
	// 	url:'https://play3.honghuohuo.vip/api/common.Api.index/SportLiveV2',
	// 	data:{id:'id'+String(Props.info_id)},
	// 	header:{'Ba-User-Token':uni.getStorageSync('apitoken'),'Server':'1'},
	// 	success(res){
	// 		res.data.data.forEach(function(itme,index){
	// 			video_live_url.push({
	// 				url:itme,
	// 				title:index==0?'中文HD':index==1?'英文HD':'标清SD'
	// 			})
	// 		})
	// 	}
	// })
}
const getVideoLive = () => {//获取视频直播信息
	video_show.value = true
	closePageData()
}

const getLeagueIntelligence = () => {//足球比赛情报（篮球没有）
	api.getFootballLeagueIntelligence({
		match_id: Number(Props.info_id)
	}).then(res => {
		console.log(res, '执行情报');
		const data = res.data.data
		cardData.intelligenceData = {
			homeInjuryList: data.intelligence.homeInjuryList,
			awayInjuryList: data.intelligence.awayInjuryList,
			injuryAnalysisList: data.intelligence.injuryAnalysisList,
			homeNews: data.missing.homeNews,
			awayNews: data.missing.awayNews
		}
	}).catch(err => {
		reject('数据处理失败~')
	})

	// uni.request({
	// 	url: 'https://play3.honghuohuo.vip/api/common.Api.index/intelligenceV2',
	// 	timeout: 10000,
	// 	header: { 'Ba-User-Token': uni.getStorageSync('apitoken'), 'Server': '1' },
	// 	method: 'POST',
	// 	data: {
	// 		matchId: Number(Props.info_id),
	// 		key: 'jmkj',
	// 		secret: '500e2f2775ddf6b0b355eac5c4e162cb',
	// 		type: Props.gameType == 'lq' ? '2' : '1'
	// 	},
	// }).then(res => {
	// 	console.log('执行情报');
	// 	cardData.intelligenceData = res.data.data.info
	// }).catch(err => {
	// 	reject('数据处理失败~')
	// })

}
const getGameVideo = () => {//获取比赛动画直播
	var obj = {
		apiName: Props.gameType == 'lq' ? 'getBkLeisuMatchVideo' : 'getFtLeisuMatchVideo',
		newCartoon: true,
		matchIds: [Number(Props.info_id)],
		key: 'jmkj',
		secret: '500e2f2775ddf6b0b355eac5c4e162cb',
	}
	getNewInfo(obj).then(res => {
		if (res.data.data.length > 0 || res.data.data != '') {
			animation_live_src.value = res.data.data[Props.info_id].cartoonNewUrl
			isDom.value = true
			closePageData()
		} else {
			uni.showToast({
				title: '没有动画直播喔~',
				icon: 'none'
			})
		}
	})
}

const getGameTeamStatus = () => {//获取队伍状态（近期比赛结果）
	const fetchData = Props.gameType == 'lq' ? api.getBasketballTeamStatus : api.getFootballTeamStatus

	fetchData({
		team_id: Props.awayId,
	}).then(res => {
		cardData.awayRecent = res.data.data
	})

	fetchData({
		team_id: Props.homeId,
	}).then(res => {
		cardData.homeRecent = res.data.data
	})

	// var newObj = {
	// 	apiName: Props.gameType == 'lq' ? 'getBkTeamRecentMatch' : 'getTeamNearStatus',
	// 	matchId: Props.info_id,
	// 	number: 0,
	// 	key: 'jmkj',
	// 	secret: '500e2f2775ddf6b0b355eac5c4e162cb',
	// }
	// getNewInfo(newObj).then(res => {
	// 	cardData.teamState = res.data.data
	// })
}

const getTeamBoutExploits = () => {//比赛分析
	const fetchData = Props.gameType == 'lq' ? api.getBasketballMatchAnalysis : api.getFootballMatchAnalysis

	fetchData({
		match_id: Number(Props.info_id),
	}).then(res => {
		cardData.history = res.data.data
	})


	// fetchData({
	// 	team_id: Props.awayId,
	// }).then(res => {
	// 	cardData.awayRecent = res.data.data
	// })

	// fetchData({
	// 	team_id: Props.homeId,
	// }).then(res => {
	// 	cardData.homeRecent = res.data.data
	// })


	// var obj = {
	// 	apiName: Props.gameType == 'lq' ? 'getBkTeamBoutMatch' : 'getTeamBoutExploits',
	// 	matchId: Props.info_id,
	// 	number: 1,
	// 	key: 'jmkj',
	// 	secret: '500e2f2775ddf6b0b355eac5c4e162cb',
	// }
	// getNewInfo(obj).then(res => {
	// 	cardData.history = res.data.data
	// })
}
const autoTimer = ref(null)
const autoPageData = () => {//开启定时获取数据
	if (!autoTimer.value) {
		console.log('开启');
		autoTimer.value = setInterval(() => {
			getMatchListLiveScore()
		}, 500000)
	}
}
const closePageData = () => {//关闭定时器
	console.log('关闭');
	clearInterval(autoTimer.value)
	autoTimer.value = null
}
const getOneMatchEuropeOdds = (pageNo, pageSize) => {//篮球足球数据趋势
	api.getFootballDataTrend({
		match_id: Number(Props.info_id),
		type: Props.gameType == 'lq' ? 2 : 1
	}).then(res => {
		proxy.$refs.blvRef.complete(res.data.data)
		cardData.blvData = res.data.data
	}).catch(err => {
		proxy.$refs.blvRef.complete(false)
	})

	// var obj = {
	// 	apiName: Props.gameType == 'lq' ? 'getBkLetMatchOddds' : 'getOneMatchEuropeOdds',
	// 	matchId: Props.info_id,
	// 	pageNo: pageNo,
	// 	pageSize: 20,
	// 	key: 'jmkj',
	// 	secret: '500e2f2775ddf6b0b355eac5c4e162cb',
	// }
	// getNewInfo(obj).then(res => {
	// 	proxy.$refs.blvRef.complete(res.data.data.list)
	// 	cardData.blvData = res.data.data
	// }).catch(err => {
	// 	proxy.$refs.blvRef.complete(false)
	// })
}

const dataUpdating = (newData) => {//页面数据覆盖
	if (Props.gameType != 'lq') {//不是篮球
		pageData.title = newData.matchNoCn + ' ' + newData.leagueName
		pageData.homeTeamLogo = newData.homeTeamLogo
		pageData.awayTeamLogo = newData.awayTeamLogo
		pageData.elapsedTime = newData.elapsedTime
		pageData.homeTeamName = newData.homeTeamName
		pageData.awayTeamName = newData.awayTeamName
		pageData.matchNoCn = newData.matchNoCn
		pageData.matchStatus = newData.matchStatus
		pageData.matchTime = newData.matchTime
		if (newData.score[1] != null) {
			pageData.isProceed = true
			autoPageData()
			var b_split = newData.score[0].split(':')//上半场拆分
			var allScore = newData.score[1].split(':')//全场
			pageData.score.homeScore_b = b_split[0]
			pageData.score.homeScore = allScore[0]
			pageData.score.awatScore_b = b_split[1]
			pageData.score.awayScore = allScore[1]
		} else {
			pageData.isProceed = false
		}
	} else {
		pageData.homeTeamLogo = newData.awayLogo
		pageData.awayTeamLogo = newData.homeLogo
		pageData.elapsedTime = newData.status == -1 ? '已完场' : newData.status == 0 ? '未开赛' : '第' + newData.status + '节' + ' ' + newData.remainTime
		pageData.homeTeamName = newData.awayName
		pageData.awayTeamName = newData.homeName
		pageData.matchNoCn = newData.matchNoCn
		pageData.matchStatus = newData.status
		var newTime = (newData.matchDate + ' ' + newData.matchTime).replace(/-/g, '/')
		pageData.matchTime = new Date(newTime).getTime()
		pageData.title = newData.leagueName
		if (newData.status != 0 && newData.score[5] != null) {
			autoPageData()
			pageData.isProceed = true
			var splitData = newData.score[5].split(':')
			pageData.score['totalScoer'] = Number(splitData[0]) + Number(splitData[1])
			var size = Number(splitData[0]) - Number(splitData[1])
			pageData.score['ScoerGap'] = size >= 0 ? size : Math.abs(size)
			pageData.score.homeScore = splitData[0]
			pageData.score.awayScore = splitData[1]
		} else {
			pageData.isProceed = false
		}
	}
}

const getMatchListLiveScore = () => {//获取实时比分
	var obj = {
		apiName: Props.gameType == 'lq' ? 'getBkMatchListLiveScore' : 'getMatchListLiveScore',
		matchIdList: [Props.info_id],
		key: 'jmkj',
		secret: '500e2f2775ddf6b0b355eac5c4e162cb',
	}
	// getNewInfo(obj).then(res => {
	// 	if (Props.gameType != 'lq') {//不是篮球
	// 		if (res.data.data.matchIdLiveMap[Props.info_id].score[1] != null) {
	// 			var b_split = res.data.data.matchIdLiveMap[Props.info_id].score[0].split(':')//上半场拆分
	// 			var allScore = res.data.data.matchIdLiveMap[Props.info_id].score[1].split(':')//全场
	// 			pageData.score.homeScore_b = b_split[0]
	// 			pageData.score.homeScore = allScore[0]
	// 			pageData.score.awatScore_b = b_split[1]
	// 			pageData.score.awayScore = allScore[1]
	// 			pageData.elapsedTime = res.data.data.matchIdLiveMap[Props.info_id].elapsedTime
	// 			pageData.matchStatus = res.data.data.matchIdLiveMap[Props.info_id].status
	// 		} else { closePageData() }
	// 		if (res.data.data.matchIdLiveMap[Props.info_id].status == 2) { closePageData() }
	// 	} else {
	// 		if (res.data.data.matchIdLiveMap[Props.info_id].status != 0 || res.data.data.matchIdLiveMap[Props.info_id].status != -1) {
	// 			pageData.elapsedTime = res.data.data.matchIdLiveMap[Props.info_id].status == -1 ? '已完场' : res.data.data.matchIdLiveMap[Props.info_id].status == 0 ? '未开赛' : '第' + res.data.data.matchIdLiveMap[Props.info_id].status + '节' + ' ' + res.data.data.matchIdLiveMap[Props.info_id].remainTime
	// 			var splitData = res.data.data.matchIdLiveMap[Props.info_id].score[5].split(':')
	// 			pageData.score['totalScoer'] = Number(splitData[0]) + Number(splitData[1])
	// 			var size = Number(splitData[0]) - Number(splitData[1])
	// 			pageData.score['ScoerGap'] = size >= 0 ? size : Math.abs(size)
	// 			pageData.score.homeScore = splitData[0]
	// 			pageData.score.awayScore = splitData[1]
	// 		} else {
	// 			closePageData()
	// 		}
	// 	}
	// 	console.log('更新完成');
	// })
}

const getNewInfo = (requestData) => {//封装请求
	return new Promise((resolve, reject) => {
		uni.request({
			url: 'https://play3.honghuohuo.vip/api/common.Api.index/MatchData',
			timeout: 10000,
			method: 'GET',
			header: { 'Ba-User-Token': uni.getStorageSync('apitoken'), 'Server': '1' },
			data: requestData,
		}).then(res => {
			if (res.data.code == '1') {
				resolve(res)
			} else {
				resolve(res)
			}
		}).catch(err => {
			reject('数据处理失败~')
		})
	})
}

const onClickItem = (e) => {
	if (current.value != e.currentIndex) {
		current.value = e.currentIndex;
		if (current.value == 1) {
			proxy.$refs.blvRef.reload()
		}
	}
}
const balck = () => {
	uni.navigateBack()
	closePageData()
}
</script>

<style lang="scss">
.live_label {
	background-color: #dd3620;
	padding: 10rpx 15rpx;
	display: flex;
	align-items: center;
	border-radius: 30rpx;

	// .vido{
	// 	border-left:3px solid #fff;
	// }
	text {
		flex: 1;
		text-align: center;
		font-size: 18rpx;
		padding: 0rpx 5rpx;
	}
}

.close_live {
	width: 75rpx;
	text-align: center;
	line-height: 70rpx;
	height: 70rpx;
	background-color: #dd3620;
	position: fixed;
	left: calc(50% - 35rpx);
	top: calc(30vh + 80rpx + var(--status-bar-height));
	z-index: 999;
	border-radius: 50%;
}

.bottom_content_box {
	width: 100%;
	height: 63vh;
	background-color: #fbfbfb;
}

.box_middle {
	display: flex;
	flex-flow: column;
	align-items: center;
	justify-content: space-around;

	.middle_score {
		.score_card {
			padding: 5rpx 10rpx;
			background-color: white;
			color: black;
			border-radius: 10rpx;
			font-size: 48rpx;
			display: flex;
			align-items: center;
			background: linear-gradient(to bottom, #ebebeb 50%, white 50%);
		}

		display: flex;
		align-items: center
	}

	.middle_state {
		padding: 2rpx 20rpx;
		background-color: #dd3620;
		border-radius: 50rpx;
		font-size: 24rpx;
	}
}

.titleTextSize {
	font-size: 32rpx;
}

.teamLogo {
	width: 160rpx;
	height: 160rpx;
	margin: 10rpx auto;

	image {
		width: 100%;
		height: 100%;
	}
}

.content_box {
	display: flex;
	margin: 20rpx auto;
	justify-content: space-around;
	color: white;

	.box_left {
		text-align: center;
	}

	.box_right {
		text-align: center;
	}
}

.topBox {
	// margin-top:var(--status-bar-height);
	background-color: deepskyblue;
	background-size: 110%;
	background-position: center center;
	background-image: url('/static/img/score/footballField.jpg');
	height: 30vh;
	background-color: black;
}

.tab_right {
	flex: 1;
	display: flex;
	justify-content: flex-end;
}

.tab_left {
	display: flex;
	align-items: center;
	flex: 1;
}

.toptab {
	display: flex;
	width: 100%;
	height: 80rpx;
	align-items: center;
	padding: 0rpx 10rpx;
	box-sizing: border-box;
	color: white;
}

.status_bar {
	background-color: black;
	height: var(--status-bar-height);
	width: 100%;
}
</style>
