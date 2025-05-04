<template>
	<view class="Card_zuqiu" v-if="props.type == 'lq'"
		@click="Emits('onClick', { matchId: props.cardInfo.matchId, type: props.type, awayId: props.cardInfo.awayId, homeId: props.cardInfo.homeId })">
		<view class="card_top">
			<view class="top_left">
				<text class="minTextSize">{{ props.cardInfo.matchNoCn }}</text>
				<view class="label" :style="'background-color:' + props.cardInfo.leagueColor" style="">
					{{ props.cardInfo.leagueName }}
				</view>
			</view>
			<view class="top_right">
				<text class="minTextSize">
					{{ props.cardInfo.stageName }}
				</text>
				<text class="minTextSize">
					{{ ' ' + props.cardInfo.matchDate + ' ' + props.cardInfo.matchTime }}
				</text>
			</view>
		</view>
		<view class="card_middle">
			<view class="middle_left">
				<image :src="props.cardInfo.awayLogo" mode="aspectFill" />
				<view class="text_box_left">
					<text class="titleTextSize">{{ props.cardInfo?.awayName?.slice(0, 4) }}</text>
				</view>
			</view>
			<view class="middle_middle" style="color:red;" v-if="props.cardInfo?.status !== 1">
				<text style="color:#969696;font-size:26rpx;">
					{{ props.cardInfo?.status == 10 ? "已完场" : "进行中" }}
				</text><br>
				<text
					style="font-size:32rpx;font-weight: bold;background-color:#ffe5e5;padding:2rpx 15rpx;border-radius:10rpx;">
					{{ props.cardInfo?.fullScore }}
				</text><br>
				<text style="color:#969696;font-size:24rpx;">
					分差:{{ props.cardInfo?.diff }}
					总分:{{ props.cardInfo?.totalScore }}
				</text>
			</view>
			<view class="middle_middle" style="flex:0.3;" v-else>VS</view>
			<view class="middle_right">
				<view class="text_box_rigth">
					<text class="titleTextSize">{{ props.cardInfo?.homeName?.slice(0, 4) }}</text>
				</view>
				<image :src="props.cardInfo?.homeLogo" mode="aspectFill" />
			</view>
		</view>
		<view class="card_bottom">
			<view class="bottom_left minTextSize">
				<text>{{ props.cardInfo?.bigsmall }}</text>
			</view>
			<view class="bottom_right minTextSize" v-if="props.cardInfo?.oddsLet">
				<text v-for="itme, index in props.cardInfo?.oddsLet?.split(';')">
					{{ index == 1 ? '主:' + itme + ' ' : itme + ' ' }}
				</text>
			</view>
		</view>
	</view>
	<view class="Card_zuqiu" v-else
		@click="Emits('onClick', { matchId: props.cardInfo.matchId, awayId: props.cardInfo.awayId, homeId: props.cardInfo.homeId })">
		<view class="card_top">
			<view class="top_left">
				<text class="minTextSize">{{ props.cardInfo.matchNoCn }}</text>
				<view class="label" :style="'background-color:' + props.cardInfo.leagueColor" style="">
					{{ props.cardInfo.leagueName }}
				</view>
			</view>
			<view class="top_right">
				<text class="minTextSize">
					{{ props.cardInfo.round }}
				</text>
				<text class="minTextSize" v-if="!props.cardInfo.corner">
					{{ ' ' + props.cardInfo.matchDate + ' ' + props.cardInfo.matchTime }}
				</text>
				<text class="minTextSize" v-else>
					角·{{ props.cardInfo.corner }}
				</text>
			</view>
		</view>
		<view class="card_middle">
			<view class="middle_left">
				<image :src="props.cardInfo.homeLogo" mode="aspectFill" />
				<view class="text_box_left">
					<text class="titleTextSize">{{ props.cardInfo?.homeName?.slice(0, 4) }}</text>
				</view>
			</view>
			<view class="middle_middle" style="color:red;" v-if="props.cardInfo?.status !== 1">
				<text style="color:#969696;font-size:26rpx;" v-if="props.cardInfo?.status == 10"	>
					已完场
				</text>
				<text style="color:#969696;font-size:26rpx;" v-else>
					<view class="live-icon">
						<image src="@/static/img/liveIcon.png" mode="aspectFit" class="tv-icon"></image>
						<text class="live-time">{{ props.cardInfo?.elapsedTime + '`' }}</text>
					</view>
				</text>
				<!-- <text class="label" v-if="props.cardInfo.isVidoLive && props.cardInfo.elapsedTime != '已完场'">直播</text> -->
				<br>

				<text
					style="font-size:32rpx;font-weight: bold;background-color:#ffe5e5;padding:2rpx 15rpx;border-radius:10rpx;">
					{{ props.cardInfo?.score?.current }}
				</text><br>
				<text style="color:#969696;">
					半·{{ props.cardInfo?.score?.half }}
				</text>
			</view>
			<view class="middle_middle" style="flex:0.3;" v-else>VS</view>
			<view class="middle_right">
				<view class="text_box_rigth">
					<text class="titleTextSize">{{ props.cardInfo?.awayName?.slice(0, 4) }}</text>
				</view>
				<image :src="props.cardInfo?.awayLogo" mode="aspectFill" />
			</view>
		</view>
		<view class="card_bottom">
			<view class="bottom_left minTextSize">
				<view v-if="props.cardInfo?.oddsBeidan">
					<text v-if="props.cardInfo?.oddsBeidan?.split(',').length > 1">
						<text v-for="itme, index in props.cardInfo?.oddsBeidan?.split(',')">
							{{ itme == 0 ? '' : index == 3 ? '' : itme + ' ' }}
						</text>
					</text>
				</view>


			</view>

			<view class="bottom_right minTextSize" v-if="props.cardInfo?.oddsEurope">
				<text>
					欧赔
					<text v-for="itme, index in props.cardInfo?.oddsEurope?.split(';')" :key="itme">
						{{ index == 3 ? ':' + itme + ' ' : itme + ' ' }}
					</text>
				</text>


			</view>
			<view class="bottom_right minTextSize" v-else>
				<text>{{ props.cardInfo?.oddsLet }}</text>
			</view>
		</view>
	</view>
</template>
<script setup>
/*
 * list 列表
 * @description 比赛列表组件
 * 
 */
import getTime from "@/common/getdatetime.js"
import { defineProps, onBeforeMount, ref, reactive, watch, defineEmits } from 'vue'
const props = defineProps(['type', 'cardInfo'])
const Emits = defineEmits(['onClick'])
watch(() => props.cardInfo, (newValue, oldValue) => {
	const [one, two, three, four, five, six] = props.cardInfo?.score || []

	const fscore = six ? six : five
	if (six) {
		const [a, b] = six ? six?.split(':') : five?.split(':')
		props.cardInfo['fullScore'] = `${b}:${a}`
		props.cardInfo['diff'] = Math.abs(Number(a) - Number(b))
		props.cardInfo['totalScore'] = Number(a) + Number(b)
	}
})
onBeforeMount(() => {
	const [one, two, three, four, five, six] = props.cardInfo?.score || []
	const fscore = six ? six : five

	if (fscore) {
		const [a, b] = fscore?.split(':')
		props.cardInfo['fullScore'] = `${b||0}:${a||0}`
		props.cardInfo['diff'] = Math.abs(Number(a) - Number(b))
		props.cardInfo['totalScore'] = Number(a) + Number(b)
	}
})

</script>

<style lang="scss">
.text_box_left {
	max-width: 220rpx;
	word-break: break-all;
}

.text_box_rigth {
	max-width: 220rpx;
	word-break: break-all;
	text-align: right;
}

.card_bottom {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.titleTextSize {
	font-size: 30rpx;
	font-weight: bold;
}

.card_middle {
	display: flex;
	margin: 10rpx 0rpx;
	align-items: center;

	.middle_right {
		image {
			width: 60rpx;
			height: 60rpx;
			padding: 10rpx;
			border: 1rpx solid #dcdcdc;
			border-radius: 50%;
			margin-left: 5rpx;
		}

		display:flex;
		align-items:center;
		justify-content:flex-end;
		flex:1;
	}

	.middle_middle {
		font-size: 42rpx;
		font-weight: bold;
		color: #989898;
		padding: 0rpx 10rpx;
		flex: 1;
		text-align: center;
	}

	.middle_left {
		flex: 1;

		image {
			width: 60rpx;
			height: 60rpx;
			padding: 10rpx;
			border: 1rpx solid #dcdcdc;
			border-radius: 50%;
			margin-right: 5rpx;
		}

		display:flex;
		align-items:center;
	}
}

.label {
	background-color: #519a67;
	color: white;
	font-size: 26rpx;
	padding: 2rpx 15rpx;
	border-radius: 20rpx;
	margin: 0rpx 10rpx;
}

.card_top {
	display: flex;
	justify-content: space-between;
	align-items: center;

	.top_left {
		display: flex;
		align-items: center;
	}
}

.minTextSize {
	font-size: 26rpx;
	color: #989898;
}

.Card_zuqiu {
	width: 690rpx;
	background-color: white;
	border-radius: 15rpx;
	margin: 10rpx auto;
	padding: 20rpx;
	box-shadow: 0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
}

.live-icon {
	display: inline-flex;
	align-items: center;
	margin-left: 10rpx;
}

.tv-icon {
	width: 32rpx;
	height: 32rpx;
	background-color: #4CAF50;
	border-radius: 6rpx;
	padding: 2rpx;
}

.live-time {
	font-size: 24rpx;
	color: #4CAF50;
	margin-left: 6rpx;
}
</style>
