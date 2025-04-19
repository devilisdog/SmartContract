<template>
	<view style="width: 100%;height: 500rpx;background:linear-gradient(45deg,#fdc830 , #f37335);">
		<uni-nav-bar title="订单详情" leftIcon="closeempty" backgroundColor="rgba(220,38,38,0)" :border="false"
			color="white" @clickLeft="close">
		</uni-nav-bar>
		<scroll-view scroll-y="true" :style="{height:common.scrollH()-100+'rpx'}">
			<view style="display: flex;justify-content: space-around;margin:50rpx 0rpx;">
				<view style="color: #fff;display: flex;flex-flow:column;align-items: center;">
					<text style="font-size: 40rpx;padding-bottom:15rpx;">
						{{props.orderData.data.State==0?'暂无':props.orderData.data.WinningMoney}}
					</text>
					<text class="textStyle">中奖金额</text>
				</view>
				<view style="color: #fff;display: flex;flex-flow:column;align-items: center;">
					<text style="font-size: 40rpx;padding-bottom:15rpx;">{{viewdata[props.orderData.data.State]}}</text>
					<text class="textStyle">订单状态</text>
				</view>
				<view style="color: #fff;display: flex;flex-flow:column;align-items: center;">
					<text style="font-size: 40rpx;padding-bottom:15rpx;">{{props.orderData.data.BetMoney+'.00'}}</text>
					<text class="textStyle">投注金额</text>
				</view>
			</view>
			<view class="tishi" v-show="props.orderData.data.bonusmax !== 0 || props.orderData.data.bonusmin !== 0" >
				<view style="text-align:center;margin-top:8rpx;">
					<text class="textStyle">预测中奖金额:</text>
					<text style="color: red;font-size:32rpx;font-weight:600;">
						￥{{props.orderData.data.bonusmax==props.orderData.data.bonusmin?props.orderData.data.bonusmax:props.orderData.data.bonusmin+'~'+props.orderData.data.bonusmax}}
					</text>
				</view>
			</view>
			<view v-if="props.orderData.data.State==='1'">
				<bjdcCard :data='xiaoqin.data' v-if="xiaoqin.data.type==='北京单场'"></bjdcCard>
				<jczqCard :data='xiaoqin.data' v-if="xiaoqin.data.type=='竞彩足球'"></jczqCard>
				<sfcCard :data='xiaoqin.data' v-if='xiaoqin.data.type=="胜负彩"'></sfcCard>
				<sfggCard :data='xiaoqin.data' v-if="xiaoqin.data.type=='胜负过关'"></sfggCard>
				<jclqCard :data='xiaoqin.data' v-if="xiaoqin.data.type=='竞彩篮球'"></jclqCard>
				<renxuan9 :data='xiaoqin.data' v-if="xiaoqin.data.type=='任选9'"></renxuan9>
				<qlcCard :data='props.orderData' v-if="props.orderData.data.Type=='七乐彩'"></qlcCard>
				<kl8Card :data='props.orderData' v-if="props.orderData.data.Type=='快乐八'"></kl8Card>
				<arrange3 :data='props.orderData' v-if="props.orderData.data.Type=='排列三'"></arrange3>
				<dltCard :data='props.orderData' v-if="props.orderData.data.Type=='大乐透'||props.orderData.data.Type=='双色球'"></dltCard>
				<qxcCard :data='props.orderData' v-if="props.orderData.data.Type=='七星彩'"></qxcCard>
				<arrange5 :data='props.orderData' v-if="props.orderData.data.Type=='排列五'"></arrange5>
				<fc3dCard :data='props.orderData' v-if="props.orderData.data.Type=='福彩3D'"></fc3dCard>
			</view>
			<order-conceal :xiaoqin='xiaoqin.data' v-else></order-conceal><!-- 未接单显示锁定 -->
			
			<orderData :orderpaymentTime='props.orderData.data.PayTime'
					   :orderDeadline='props.orderData.data.Deadline' 
					   :orderShopId='props.orderData.data.user_id'	
					   :orderId='props.orderData.data.id'>	 
			</orderData><!-- 订单信息卡片 -->
			
			
			
			<imgCard v-show="props.orderData.data.State==='1'"></imgCard>
		</scroll-view>
	</view>
	
</template>

<script setup>
	import jczqCard from "@/components/common/BetContentCard/yc-jingcaizuqiu/yc-jingcaizuqiu.vue"
	import jclqCard from "@/components/common/BetContentCard/yc-jingcailanqiu/yc-jingcailanqiu.vue"
	import sfggCard from "@/components/common/BetContentCard/yc-shengfuguoguan/yc-shengfuguoguan.vue"
	import bjdcCard from "@/components/common/BetContentCard/yc-beijingdanchang/yc-beijingdanchang.vue"
	import renxuan9 from "@/components/common/BetContentCard/yc-renxuanjiu/yc-renxuanjiu.vue"
	import sfcCard from "@/components/common/BetContentCard/yc-shengfucai/yc-shengfucai.vue"
	import qxcCard from "@/components/common/BetContentCard/yc-qixingcai/yc-qixingcai.vue"
	import arrange5 from "@/components/common/BetContentCard/yc-pailiewu/yc-pailiewu.vue"
	import kl8Card from "@/components/common/BetContentCard/yc-kuaileba-zujian/yc-kuaileba-zujian.vue"
	import qlcCard from "@/components/common/BetContentCard/yc-qilicai/yc-qilicai.vue"
	import arrange3 from "@/components/common/BetContentCard/yc-pailiesan/yc-pailiesan.vue"
	import fc3dCard from "@/components/common/BetContentCard/yc-fucai3D/yc-fucai3D.vue"
	import dltCard from "@/components/common/BetContentCard/yc-daletou/yc-daletou.vue"
	
	import orderData from "@/components/common/yc-common-BettingInfo/yc-Bettinglnfo-orderData/yc-Bettinglnfo-orderData.vue"
	import imgCard from "@/components/common/yc-common-BettingInfo/yc-Bettinglnfo-imgCard/yc-Bettinglnfo-imgCard.vue"
	
	//import orderConceal from "@/components/common/yc-common-BettingInfo/yc-BettingInfo-orderConceal/yc-BettingInfo-orderConceal.vue"
	
	import {useCounterStore} from '@/stores/counter'
	import common from "@/common/common"
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		defineProps,
		defineEmits,//发送数据
	} from 'vue';

	const props = defineProps(['orderData']) //接收传值
	const Emits = defineEmits(['close']) //调用父组件方法关闭弹窗
	const counter = useCounterStore(); //状态管理
	const viewdata = reactive(['待接单', '待出票', '待开奖', '待中奖', '未中奖', '待派奖', '已派奖'])
	const xiaoqin=reactive([])
	onBeforeMount(() => {
		xiaoqin.data=JSON.parse(props.orderData.data.BetContent)
		
	})

	onMounted(() => {
	})
	const close = () => { //发送是否点击关闭弹出层
		Emits('close')
	}


</script>

<style>
	.touguog {
		max-width:200rpx;
		padding: 8rpx 10rpx;
		height: 25rpx;
		font-size: 28rpx;
		line-height: 25rpx;
		text-align: center;
		border-radius: 5rpx;
		color: white;
		font-weight: bold;
		margin: 5rpx 5rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: keep-all;
	}
	.tou {
		width: fit-content;
		padding: 8rpx 10rpx;
		height: 25rpx;
		font-size: 28rpx;
		line-height: 25rpx;
		text-align: center;
		border-radius: 5rpx;
		color: white;
		font-weight: bold;
		margin: 5rpx 5rpx;
	}
	.Card{
		width:680rpx;
		height:400rpx;
		background-color: white;
		border-radius:10rpx;
		margin: auto;
		padding: 20rpx;
	}
	.tishi {
		width: 720rpx;
		height: 60rpx;
		border-radius:10rpx;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		margin:20rpx auto;
	}
	.textStyle {
		font-size: 30rpx;
	}
</style>