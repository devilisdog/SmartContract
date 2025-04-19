<template>
	<view class="statusBar"></view>
	<uni-nav-bar background-color="#202736" color="#fff" title="发起跟单" left-icon="left" left-text="返回" @clickLeft="back" height="100rpx"></uni-nav-bar>
	<view class="mye_card_style"><!-- 投注彩种 -->
		<view class="box1">
			<view style="display: flex;flex-direction: column;width: 100%;">
				<view style="display: flex;flex-direction: row;">
					<view style="display: flex;">
						<text style="font-size: 32rpx;font-weight: 550;">投注彩种:</text>
					</view>
					<view style="display: flex;margin-left: auto;">
						<text style="font-size: 32rpx; color: red;font-weight: bold;">
							{{ClassContent.value[0]?ClassContent.value[0].name:ClassContent.value.type}}
						</text>
					</view>
				</view>
			</view>
			<view style="display: flex;flex-direction: column;width: 100%;margin-top: 25rpx;">
				<view style="display: flex;flex-direction: row;">
					<view style="display: flex;">
						<text style="font-size: 32rpx;font-weight: 550;">订单金额:</text>
					</view>
					<view style="display: flex;margin-left: auto;">
						<text style="font-size: 32rpx; color: red;">{{data.allmoney}}元</text>
					</view>
				</view>
			</view>
		</view>
	</view>
	<view class="mye_card_style"><!-- 合买设置 -->
		<view class="box1">
			<view style="display: flex;flex-direction: column;width: 100%;">
				<view style="display: flex;flex-direction: row;">
					<view class="left">
						<text style="font-weight: 550;">是否公开</text>
					</view>
					<view class="right" style="margin-left: auto;">
						<radio-group name="" style="transform: scale(.85);" @change="getRadio">
							<label class="radio">
								<radio value="r1" />公开
							</label>
							<label class="radio">
								<radio value="r2" checked="true" />开赛后公开
							</label>
						</radio-group>
					</view>
				</view>
				<view style="display: flex;">
					<text style="font-weight: 550;">购买宣言</text>
				</view>
				<view style="display: flex;">
					<uni-easyinput v-model="xyvalue" type="textarea" autoHeight placeholder="众人拾柴火焰高~" @blur="xyblur" />
				</view>
			</view>
		</view>
	</view>
	<view class="mye_card_style"><!-- 合买注意事项 -->
		<text>注意:[发单规则须知]</text><br>
		<text style="margin-left:10rpx;">1、为防止用户刷榜，回报低于1.8倍跟单无佣金</text><br>
		<text style="margin-left:10rpx;">2、收取规则：发单人6%，出票店主1.5%，发起跟单的店铺1.5%，平台技术服务1%</text>
		<!-- 发单规则 -->
		<button @click="toggleRulePopup" style="margin-top: 20px;">【发单规则】</button>
	</view>
	<view class="" style="display: flex;justify-content: center;">
		<div v-if="isRulePopupVisible" class="popup-rule" style=" border:1px solid #ccc; padding:10px;">
			<text>
				发单规则<br /> 1、什么是发单、跟单?<br />
					发单、跟单、合买是目前流行于实体彩票店的投注方式。发单、跟单是指由彩民自发形成，方案发起人(发单人)将投注方案以公开或保密的形式展示出来，其他彩民按照此投注方案来购买的一种购彩形式。
					2、发单、跟单为彩民带来什么利益? <br />方案发起人:可获得投注方案的中奖奖金，以及跟单人总奖金的提成。
					跟单人:不用自己研究，可获得与方案发起人相同的投注方案，但需扣除小部分奖金作为知识付费给方案发起人，此部分简称佣金。
					发单、跟单其投注金均用于购买中国体育彩票，是否获得彩票奖金均由中国体育彩票开奖决定。 <br />3、发单、跟单的佣金比例<br />
					佣金是指方案发起人的智力成果报酬。佣金来源于国家体彩奖金其中一部分，因此是否获得佣金由国家体彩决定。
					佣金比例由方案发起人在发单时自行设置，比例为:0%至10%，佣金金额=总奖金金额x佣金比例。其中发单人收取总奖金5%的佣金，店主收取总奖金的5%的服务费。
					由于赔率变动，跟投订单的赔率与推荐订单相比可能略有变动，以实际出票为准。 当串关奖金小于本金的1.8倍与单关奖金小于本金的1.7倍时，将不会收取任何佣金。<br /> 4、方案发起人如何发单?<br />
					方案发起人选择好投注内容后，在投注时选择“发单”进行保密或公开设置、填写好方案宣言，投注支付成功后即会生成方案。 即会生成方案。<br /> 5、彩民如何跟单?<br />
					在跟单页面选定方案后，设置跟单投注倍数，投注成功后，即该方案跟单成功。
					发起跟投则证明同意此跟投协议，跟投方案中奖后，方案推荐人有权按照已设置好的佣金比例对跟单中奖总奖金进行提成，跟投方案未中奖则不收取任何佣金。
					奖金派发时自动减去方案推荐人提成的金额，并在我的交易明细中显示。 计算公式:方案推荐人的佣金金额=跟单人税后总奖金x佣金比例。
					推荐订单显示的回报倍数为推荐用户实单支付时的赔率，如跟单时赔率有变动，以实际赔率为准。<br /> 6、发单、跟单的特别提示<br /> (1)彩民根据自己意愿进行发单、跟单的投注，均属于个人行为，跟本平台和实体彩票店无关。<br />
					(2)本平台大厅展示的所有发单均为彩民自发真实投注订单，无任何假单或虚拟单。平台所展示的跟单人数与命中率等各项数据均真实有效。<br />
					(3)本平台不会以任何形式诱导彩民发单或者跟单，所有票样在出票后都会即时上传到订单详情页，跟单票样在方案截止后可自行查看。<br />
					(4)中国体育彩票是责任彩票，每一单的投注都是为中国体育公益事业做的一份贡献。还请广大彩民朋友理性购彩，理性跟单。<br />
					此规则在法律允许的情况下最终解释权归本店所有。郑重声明:本店严禁用户通过任何方式建立私下联系并脱离平台进行任何金钱类交易。此类行为本店不予认可，若发现有店主吃票或者欺骗客户的行为，我们将会配合警方进行调查，必要时向警方提供所需的相关资料。
					</text>
					<button @click="closeRulePopup" style="margin-top: 10px;margin-bottom:100rpx;">关闭</button>
		</div>
	</view>
	<view class="footer" @click="Confirm" style="">
		<text style="color: #ffffff;font-size: 38rpx; margin:auto">确定发布</text>
	</view>
	<uni-popup ref="popup">
		<submitPay :adult="counter.adult" type="竞彩足球" :money="data.allmoney" :balance="counter.user_money-data.allmoney"
			@ConfirmPayment="getNewMoney()">
		</submitPay>
	</uni-popup>
	<uni-popup ref="infopopup">
		<gendanCard @close='close' :order_id="follow_id"></gendanCard>
	</uni-popup>
</template>

<script setup>
	import api from '@/common/vmeitime-http/beting.js'
	import submitPay from '@/components/main/nav/yc-submit-pay.vue'
	import {
		useCounterStore
	} from '@/stores/counter';
	import gendanCard from "@/components/common/yc-gendan-card/yc-gendan-card.vue"
	import common from '@/common/common'
	import {
		onBeforeMount,
		ref,
		reactive,
		defineProps,
		getCurrentInstance,
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()

	const props = defineProps(['Amount', 'Note', 'bonusmax', 'bonusmin', 'lssue', 'nowDeadline']) //接收传值
	const follow_id = ref(0)
	const counter = useCounterStore(); //状态管理
	const ClassContent = reactive([])
	// 定义是否显示弹出框的状态
	const isRulePopupVisible = ref(false);
	// 切换弹出框显示状态的方法
	const toggleRulePopup = () => {
		isRulePopupVisible.value = !isRulePopupVisible.value;
	};
	// 关闭弹出框的方法
	const closeRulePopup = () => {
		isRulePopupVisible.value = false;
	};
	onBeforeMount(() => {
		init()
		if (counter.BettingContent.length == 0) {
			ClassContent.value = counter.submitNewData
			ClassContent.value[0]['lssue'] = props.lssue
		} else {
			ClassContent.value = counter.BettingContent
		}

	})
	//获取屏幕高度
	const scrollH = () => {
		let sys = uni.getSystemInfoSync();
		let winWidth = sys.windowWidth;
		let winrate = 750 / winWidth;
		let winHeight = parseInt(sys.windowHeight * winrate)
		return winHeight

	}
	const CardData = ref([])

	const orderid = ref(0)
	const xyvalue = ref('') //宣言内容
	const data = reactive({
		allmoney: 0, //金额
		StartBetMoney: 0, //一倍的金额
		Isopen: 0, //是否公开
		declaration: '众人拾柴火焰高~', //宣言
	})
	//初始化
	const init = () => {
		data.allmoney = props.Amount - 0
		data.StartBetMoney = props.Note * 2

	}
	const radio = ref(0)
	// 是否公开 or 认购后可见
	const getRadio = (e) => {
		if (e.detail.value == 'r1') {
			data.Isopen = 1
		}
		if (e.detail.value == 'r2') {
			data.Isopen = 0
		}
	}

	const back = () => {
		uni.navigateBack()
	}

	//确认发布
	const Confirm = () => {
		proxy.$refs.popup.open("bottom")
	}
	const getNewMoney = () => {
		proxy.$refs.popup.close("bottom")

		uni.showLoading({
			title: '发布中~',
			mask: true
		})
		uni.request({
			url: counter.baseUrl + '/api/bettingend.mine.Transaction/notWithdraw',
			header: {
				'server': 1,
				'ba-user-token': counter.access_token,
			},
			success(res) {
				counter.user_money = Number(res.data.data.withdraw) + Number(res.data.data.not_withdraw)
				ConfirmPayment()
			},
			fail(err) {
				uni.showToast({
					title: '获取金额失败',
					icon: 'error',
					position: 'center'
				})
				ConfirmPayment()
			}
		})
	}

	//确认支付
	const ConfirmPayment = () => {

		if (common.flition(data.declaration)) {
			uni.hideLoading()
			uni.showModal({
				title: '注意',
				content: '跟单宣言内包含违禁词，请检查后重新发布，违禁内容参考：' + common.replace(data.declaration, '*'),
				confirmText: '确认',
				confirmColor: '#f04b49',
				success: function(res) {}
			});
			return
		}
		if (data.declaration.replace(/[^0-9]/g, "").length > 5) {

			uni.hideLoading()
			uni.showModal({
				title: '注意',
				content: '跟单宣言内疑似包含联系方式，请检查后重新发布',
				confirmText: '确认',
				confirmColor: '#f04b49',
				success: function(res) {}
			});
			return
		}


		if (data.allmoney > counter.user_money) {
			uni.hideLoading()
			uni.showModal({
				title: '注意',
				content: '余额不足！',
				confirmText: '立即充值',
				confirmColor: '#f04b49',
				success: function(res) {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/home/HomeTopUp/HomeTopUp',
							animationType: 'slide-in-bottom'
						})
					}
				}
			});
			return
		}
		var arr = []
		arr.push(data)
		if (counter.BettingContent != '') {
			var delIndex = counter.BettingContent.remarks.reachType.indexOf('1单关1')
			if (delIndex != -1) {
				counter.BettingContent.remarks.reachType[delIndex] = '单关'
			}
		}
		api.Betjczq({
			"default": 1,
			"Type": common.playType(counter.BettingContent.length == 0 ? ClassContent.value[0].name :
				ClassContent.value.type),
			"BetMoney": data.allmoney,
			"bonusmin": props.bonusmin,
			"bonusmax": props.bonusmax,
			"BetContent": ClassContent.value,
			'Deadline': counter.BettingContent.length == 0 ? common.addTime(props.nowDeadline) : common
				.minTiem(counter.BettingContent.Content),
			"drawDeadine": counter.BettingContent.length == 0 ? common.addTime(props.nowDeadline) : common
				.maxTiem(counter.BettingContent.Content),
			'lssue': JSON.parse(props.lssue),
			'Note': props.Note,
			"FollowContent": arr,
		}).then((res) => {
			uni.hideLoading()
			if (res.data.code === 1) {
				follow_id.value = res.data.data.follow_id
				uni.showToast({
					icon: "success",
					title: '发布成功',
					duration: 2000
				})
				proxy.$refs.infopopup.open("bottom")
			} else {
				uni.showToast({
					icon: "error",
					title: res.data.msg,
					duration: 500
				})
			}
		})
	}

	const close = () => {
		proxy.$refs.infopopup.close("bottom")
		setTimeout(() => {
			uni.navigateBack({
				delta: 2
			})
		}, 300)
	}

	//编辑框输入完之后
	const xyblur = () => {
		data.declaration = xyvalue.value
	}
</script>

<style>
	.mye_card_style {
		width: 680rpx;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 15rpx;
		margin: 20rpx auto;
		box-shadow: 0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
	}

	.statusBar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}

	body {
		background-color: #f3f3f3;
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-image: linear-gradient(-225deg, #202736, #202736);
		height: 100rpx;
		width: 100%;
		display: flex;
		border-radius: 20rpx 20rpx 0 0;
	}

	.box1 {
		margin-top: 15rpx;
		margin-bottom: 15rpx;
	}

	.main text {
		font-size: 25rpx;
		margin-top: 5rpx;
	}

	.rule-button {
		margin-top: 20px;
		padding: 10px 20px;
		font-size: 16px;
		cursor: pointer;
	}

	.popup-rule {
		margin-top: 10px;
		border: 1px solid #ccc;
		padding: 15px;
		background-color: #f9f9f9;
		width: 600rpx;
		/* 设置宽度以适应不同屏幕 */
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.close-button {
		margin-top: 10px;
		padding: 5px 10px;
		font-size: 14px;
		cursor: pointer;
		float: right;
	}
</style>