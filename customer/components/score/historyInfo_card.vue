<template>
	<view class="card" v-if="show && Props.type == 'lq'">
		<!-- <view class="top_title">历史交锋</view>
		<view class="number_box">
			<view class="number_item">
				<text class="bigText">
					{{ Number(Props.cardInfo.resultStat[0] / (Props.cardInfo.resultStat[0] +
						Props.cardInfo.resultStat[1]) * 100).toFixed(0) }}%
				</text><br>
				<text>胜率</text><br>
				<text class="minText">
					{{ Props.cardInfo.resultStat[0] }}胜{{ Props.cardInfo.resultStat[1] }}负
				</text>
			</view>
			<view class="number_item">
				<text class="bigText">
					{{ Number(Props.cardInfo.letResultStat[0] / (Props.cardInfo.letResultStat[0] +
						Props.cardInfo.letResultStat[1] + Props.cardInfo.letResultStat[2]) * 100).toFixed(0) }}%
				</text><br>
				<text>赢盘率</text><br>
				<text class="minText">
					{{ Props.cardInfo.letResultStat[0] }}胜{{ Props.cardInfo.letResultStat[1] }}走{{
						Props.cardInfo.letResultStat[2] }}输
				</text>
			</view>
			<view class="number_item">
				<text class="bigText">
					{{ Number(Props.cardInfo.bigsmallResultStat[0] / (Props.cardInfo.bigsmallResultStat[0] +
						Props.cardInfo.bigsmallResultStat[1] + Props.cardInfo.bigsmallResultStat[2]) * 100).toFixed(0) }}%
				</text><br>
				<text>大球率</text><br>
				<text class="minText">
					{{ Props.cardInfo.bigsmallResultStat[0] }}大{{ Props.cardInfo.bigsmallResultStat[1] }}走{{
						Props.cardInfo.bigsmallResultStat[2] }}小
				</text>
			</view>
		</view> -->
		<uni-table stripe emptyText="暂无更多数据">
			<uni-tr style="background-color:#ebebeb;">
				<uni-td align="center">日期</uni-td>
				<uni-td align="center">对阵</uni-td>
				<uni-td align="center">让分</uni-td>
				<uni-td align="center">大小</uni-td>
			</uni-tr>
			<uni-tr v-for="itme, index in Props.cardInfo.list">
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
	<view class="card" v-if="show && Props.type != 'lq'">
		<!-- <view class="top_title">历史交锋</view>
		<view class="number_box">
			<view class="number_item">
				<text class="bigText">
					{{(Props.cardInfo.winNumber/(Props.cardInfo.winNumber+Props.cardInfo.drawNumber+Props.cardInfo.loseNumber)*100).toFixed(0)}}%
				</text><br>
				<text>胜率</text><br>
				<text class="minText">
					{{Props.cardInfo.winNumber}}胜{{Props.cardInfo.drawNumber}}平{{Props.cardInfo.loseNumber}}负
				</text>
			</view>
			<view class="number_item">
				<text class="bigText">
					{{(Props.cardInfo.winPlateNum/(Props.cardInfo.winPlateNum+Props.cardInfo.goPlateNum+Props.cardInfo.losePlateNum)*100).toFixed(0)}}%
				</text><br>
				<text>赢盘率</text><br>
				<text class="minText">
					{{Props.cardInfo.winPlateNum}}胜{{Props.cardInfo.goPlateNum}}走{{Props.cardInfo.losePlateNum}}输
				</text>
			</view>
			<view class="number_item">
				<text class="bigText">
					{{(Props.cardInfo.bigBallNum/(Props.cardInfo.bigBallNum+Props.cardInfo.goBigSmallNum+Props.cardInfo.smallBallNum)*100).toFixed(0)}}%
				</text><br>
				<text>大球率</text><br>
				<text class="minText">
					{{Props.cardInfo.bigBallNum}}大{{Props.cardInfo.goBigSmallNum}}走{{Props.cardInfo.smallBallNum}}小
				</text>
			</view>
		</view> -->
		<uni-table stripe emptyText="暂无更多数据">
			<uni-tr style="background-color:#ebebeb;">
				<uni-td align="center">日期</uni-td>
				<uni-td align="center">对阵</uni-td>
				<uni-td align="center">让球</uni-td>
				<uni-td align="center">进球</uni-td>
			</uni-tr>
			<uni-tr v-for="itme, index in Props.cardInfo.list">
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
	<image src="@/static/img/follow/none.png" class="empty" v-show="!show"></image>
</template>

<script setup>
import { onBeforeMount, ref, reactive, defineProps, defineEmits, watch } from 'vue';
import { onShow } from "@dcloudio/uni-app"
const Emits = defineEmits(['getData'])
const Props = defineProps(['cardInfo', 'currentIndex', 'myCurrent', 'type'])
const show = ref(false)
const jiaozai = ref(false)
watch(() => Props.cardInfo, (newValue, oldValue) => {
	if (!show.value) {
		show.value = true
	}
})

watch(() => Props.currentIndex, (newValue, oldValue) => {
	if (newValue == Props.myCurrent && !jiaozai.value && !show.value) {
		jiaozai.value = !jiaozai.value
		Emits('getData')
	}
})
</script>

<style lang="scss">
.empty {
	width: 500rpx;
	height: 500rpx;
	position: fixed;
	top: calc(50% - 30vh + 250rpx + 80rpx + var(--status-bar-height));
	left: calc(50% - 250rpx);
}

.number_box {
	display: flex;
	align-items: center;
	margin: 20rpx 0;

	.number_item {
		flex: 1;
		text-align: center;

		.minText {
			font-size: 26rpx;
			color: #8f8f8f;
		}

		.bigText {
			font-size: 38rpx;
			color: red;
			font-weight: bold;
		}
	}
}

.card {
	width: 680rpx;
	padding: 20rpx;
	background-color: #fff;
	border-radius: 15rpx;
	margin: 20rpx auto;
	box-shadow: 0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);

	.top_title {
		font-weight: bold;
	}
}
</style>