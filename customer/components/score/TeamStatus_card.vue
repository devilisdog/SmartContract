<template>
	<view class="card" v-if="type == 'lq'">
		<view class="top_title">
			<text class="title">队伍状态</text>
			<view class="select_box">
				<text :style="selectData == 'homeRecent' ? 'color:#ffc800;' : ''"
					@click="screen('homeRecent')">主队</text>
				<text :style="selectData == 'awayRecent' ? 'color:#ffc800;' : ''"
					@click="screen('awayRecent')">客队</text>
			</view>
		</view>
		<view>
			<text>胜率：&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</text>
			<text style="font-weight:bold;">
				{{ Props.cardInfo[selectData]['resultStat'][0] }}胜{{ Props.cardInfo[selectData]['resultStat'][1] }}负
			</text>
			<progress show-info="true"
				:percent="(Props.cardInfo[selectData]['resultStat'][0] / (Props.cardInfo[selectData]['resultStat'][0] + Props.cardInfo[selectData]['resultStat'][1]) * 100).toFixed(0)"
				active="true" activeColor="#ffc800" duration="10">
			</progress>
		</view>
		<view>
			<text>赢盘率：&nbsp&nbsp&nbsp&nbsp&nbsp</text>
			<text style="font-weight:bold;">
				{{ Props.cardInfo[selectData]['letResultStat'][0] }}胜{{ Props.cardInfo[selectData]['letResultStat'][1]
				}}走{{ Props.cardInfo[selectData]['letResultStat'][2] }}输
			</text>
			<progress show-info="true"
				:percent="(Props.cardInfo[selectData]['letResultStat'][0] / (Props.cardInfo[selectData]['letResultStat'][0] + Props.cardInfo[selectData]['letResultStat'][1] + Props.cardInfo[selectData]['letResultStat'][2]) * 100).toFixed(0)"
				active="true" activeColor="#ffc800" duration="10">
			</progress>
		</view>
		<view style="margin-bottom:20rpx;">
			<text>大球率：&nbsp&nbsp&nbsp&nbsp&nbsp</text>
			<text style="font-weight:bold;">
				{{ Props.cardInfo[selectData]['bigsmallResultStat'][0] }}胜{{
					Props.cardInfo[selectData]['bigsmallResultStat'][1] }}走{{
					Props.cardInfo[selectData]['bigsmallResultStat'][2] }}小
			</text>
			<progress show-info="true"
				:percent="(Props.cardInfo[selectData]['bigsmallResultStat'][0] / (Props.cardInfo[selectData]['bigsmallResultStat'][0] + Props.cardInfo[selectData]['bigsmallResultStat'][1] + Props.cardInfo[selectData]['bigsmallResultStat'][2]) * 100).toFixed(0)"
				active="true" activeColor="#ffc800" duration="10">
			</progress>
		</view>
		<uni-table stripe emptyText="暂无更多数据">
			<uni-tr style="background-color:#ebebeb;">
				<uni-td align="center">日期</uni-td>
				<uni-td align="center">对阵</uni-td>
				<uni-td align="center">让分</uni-td>
				<uni-td align="center">大小</uni-td>
			</uni-tr>
			<uni-tr v-for="itme, index in Props.cardInfo[selectData].matchVos">
				<uni-td align="center">
					<text style="font-size:26rpx;">{{ itme.matchTime }}</text><br>
					<text style="font-size:26rpx;">{{ itme.leagueName }}</text>
				</uni-td>
				<uni-td align="center" style="font-size:26rpx;">
					<text style="font-size:26rpx;">{{ itme.homeName.slice(0, 4) }}</text>
					<text style="font-size:26rpx;">{{ itme.score[5] }}</text>
					<text style="font-size:26rpx;">{{ itme.awayName.slice(0, 4) }}</text>
				</uni-td>
				<uni-td align="center">
					<text style="font-size:26rpx;">{{ itme.oddsLet ? itme.oddsLet.split(';')[1] : '-' }}</text>
					<!-- <text style="font-size:26rpx;">{{itme.asiaResult?itme.oddsLet:''}}</text> -->
				</uni-td>
				<uni-td align="center">
					<text style="font-size:26rpx;">{{ itme.bigsmall ? itme.bigsmall.split(';')[1] : '-' }}</text>
					<!-- <text style="font-size:26rpx;">{{itme.bigSamllResult?itme.bigsmall:''}}</text> -->
				</uni-td>
			</uni-tr>
		</uni-table>
	</view>
	<view class="card" v-if="Props.type != 'lq'">
		<view class="top_title">
			<text class="title">队伍状态</text>
			<view class="select_box">
				<text :style="selectData == 'homeNearStatus' ? 'color:#ffc800;' : ''"
					@click="screen('homeNearStatus')">主队</text>
				<text :style="selectData == 'awayNearStatus' ? 'color:#ffc800;' : ''"
					@click="screen('awayNearStatus')">客队</text>


			</view>
		</view>
		<view>
			<text>胜率：&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</text>
			<text style="font-weight:bold;">
				{{ Props.cardInfo[selectData].res.win }}胜{{ Props.cardInfo[selectData].res.draw }}平{{
					Props.cardInfo[selectData].res.lose }}负
			</text>
			<progress show-info="true" :percent="((Props.cardInfo[selectData].res.winRate) * 100).toFixed(0)"
				active="true" activeColor="#ffc800" duration="10">
			</progress>
		</view>
		<view>
			<text>赢盘率：&nbsp&nbsp&nbsp&nbsp&nbsp</text>
			<text style="font-weight:bold;">
				{{ Props.cardInfo[selectData].resPan.win }}胜{{ Props.cardInfo[selectData].resPan.draw }}走{{
					Props.cardInfo[selectData].resPan.lose }}输
			</text>
			<progress show-info="true" :percent="((Props.cardInfo[selectData].resPan.winRate) * 100).toFixed(0)"
				active="true" activeColor="#ffc800" duration="10">
			</progress>
		</view>
		<view style="margin-bottom:20rpx;">
			<text>大球率：&nbsp&nbsp&nbsp&nbsp&nbsp</text>
			<text style="font-weight:bold;">
				{{ Props.cardInfo[selectData].resDxf.big }}胜{{ Props.cardInfo[selectData].resDxf.walk }}走{{
					Props.cardInfo[selectData].resDxf.small }}小
			</text>
			<progress show-info="true" :percent="((Props.cardInfo[selectData].resDxf.winRate) * 100).toFixed(0)"
				active="true" activeColor="#ffc800" duration="10">
			</progress>
		</view>
		<uni-table stripe emptyText="暂无更多数据">
			<uni-tr style="background-color:#ebebeb;">
				<uni-td align="center">日期</uni-td>
				<uni-td align="center">对阵</uni-td>
				<uni-td align="center">让球</uni-td>
				<uni-td align="center">进球</uni-td>
			</uni-tr>
			<uni-tr v-for="itme, index in Props.cardInfo[selectData].list">
				<uni-td align="center">
					<text style="font-size:26rpx;">{{ itme.matchTime }}</text><br>
					<text style="font-size:26rpx;">{{ itme.leagueName }}</text>
				</uni-td>
				<uni-td align="center" style="font-size:26rpx;">
					<text style="font-size:26rpx;">{{ itme.homeName.slice(0, 4) }}</text>
					<text style="font-size:26rpx;">{{ itme.fullResult }}</text>
					<text style="font-size:26rpx;">{{ itme.awayName.slice(0, 4) }}</text>
				</uni-td>
				<uni-td align="center">
					<text style="font-size:26rpx;">{{ itme.asiaHanciap ? itme.asiaHanciap : '-' }}</text><br>
					<text style="font-size:26rpx;">{{ itme.asiaResult ? itme.asiaResult : '' }}</text>
				</uni-td>
				<uni-td align="center">
					<text style="font-size:26rpx;">{{ itme.bigSmallHanciap ? itme.bigSmallHanciap : '-' }}</text><br>
					<text style="font-size:26rpx;">{{ itme.bigSamllResult ? itme.bigSamllResult : '' }}</text>
				</uni-td>
			</uni-tr>
		</uni-table>
	</view>
</template>

<script setup>
import { onBeforeMount, ref, reactive, defineProps, watch } from 'vue';
const selectData = ref('homeNearStatus')

import { onShow } from "@dcloudio/uni-app"
const Emits = defineEmits(['getData'])
const Props = defineProps(['cardInfo', 'currentIndex', 'myCurrent', 'type'])
const show = ref(false)
const jiaozai = ref(false)
const screen = (e) => {
	selectData.value = e
}
onShow(() => {
	if (Props.type == 'lq') { selectData.value = 'homeRecent' }
})
watch(() => Props.cardInfo, (newValue, oldValue) => {
	// if (!show.value) { show.value = true }
})
watch(() => Props.currentIndex, (newValue, oldValue) => {
	if (newValue == Props.myCurrent && !jiaozai.value) {
		jiaozai.value = !jiaozai.value
		Emits('getData')
	}
})
</script>

<style lang="scss">
.card {
	width: 680rpx;
	padding: 20rpx;
	background-color: #fff;
	border-radius: 15rpx;
	margin: 20rpx auto;
	box-shadow: 0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);

	.top_title {
		.select_box {
			text {
				font-size: 34rpx;
				font-weight: bold;
				margin-left: 40rpx;
				color: #9e9e9e;
				transition: all 0.3s;
			}
		}

		.title {
			font-size: 32rpx;
			font-weight: bold;
		}

		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom:20rpx;
	}
}
</style>