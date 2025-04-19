<template>
	<view class="bg">
		<uni-nav-bar title="订单详情"  leftIcon="closeempty"  backgroundColor="rgba(220,38,38,0)" @clickLeft="close"
			:border="false"
			color="white"
		>
		</uni-nav-bar>
		<scroll-view scroll-y="true" class="scroll_viewStyle">
			<view style="display: flex;justify-content: space-around;margin:50rpx 0rpx;">
				<view style="color: #fff;display: flex;flex-flow:column;align-items: center;">
					<text style="font-size: 40rpx;margin-left: 15rpx;padding-bottom:15rpx;" >
						{{counter.allOrderData.AwardMoney>0?counter.allOrderData.AwardMoney:'暂无'}}
					</text>
					<text class="textStyle">中奖金额</text>
				</view>
				<view style="color: #fff;display: flex;flex-flow:column;align-items: center;">
					<text style="font-size: 40rpx;padding-bottom:15rpx;">
						{{viewdata.Statelist[counter.allOrderData.State]}}
					</text>
					<text class="textStyle">订单状态</text>
				</view>
				<view style="color: #fff;display: flex;flex-flow:column;align-items: center;">
					<text style="font-size: 40rpx;padding-bottom:15rpx;">
						{{counter.allOrderData.BetMoney}}
					</text>
					<text class="textStyle">投注金额</text>
				</view>
			</view>
			<view class="tishi" v-show="forecastMoneyShow(counter.allOrderData.Type,counter.allOrderData.State)" >
				<view style="text-align:center;margin-top:8rpx;">
					<text class="textStyle">预测金额:</text>
					<text v-if="maxiMoney != minMoney && minMoney>0" style="color: red;font-size:32rpx;font-weight:600;">
						￥{{minMoney}}~{{maxiMoney}}
					</text>
					<text v-else  style="color: red;font-size:32rpx;font-weight:600;">￥{{maxiMoney}}</text>
				</view>
			</view>
			<view v-if="isOpenCard(counter.allOrderData.Issue,counter.allOrderData.Isopen,counter.allOrderData.State,counter.allOrderData.Deadline)">
				<jczqCard v-if="counter.BettingContent.type==='竞彩足球'" :widths='685'></jczqCard>
				<jclqCard v-else-if="counter.BettingContent.type==='竞彩篮球'" :widths='685'></jclqCard>
				<sfggCard v-else-if="counter.BettingContent.type==='胜负过关'" :widths='685'></sfggCard>
				<bjdcCard v-else-if="counter.BettingContent.type==='北京单场'" :widths='685'></bjdcCard>
				<renxuan9 v-else-if="counter.BettingContent.type==='任选九'" :widths='685'></renxuan9>
				<sfcCard v-else-if="counter.BettingContent.type==='胜负彩'" :widths='685'></sfcCard>
				<qlcCard v-else-if="counter.allOrderData.Type==='七乐彩'" :widths='685'></qlcCard>
				<qxcCard v-else-if="counter.allOrderData.Type==='七星彩'" :widths='685'></qxcCard>
				<arrange5 v-else-if="counter.allOrderData.Type==='排列五'" :widths='685'></arrange5>
				<kl8Card  v-else-if="counter.allOrderData.Type==='快乐八'" :widths='685'></kl8Card>
				<arrange3 v-else-if="counter.allOrderData.Type==='排列三' || counter.allOrderData.Type==='福彩3D'" :widths='685'></arrange3>
				<dltCard v-else :widths='685'></dltCard>
			</view>
			
			<view v-else class="lockCard">
				<image style="width: 100rpx;height: 100rpx;opacity: 0.6;" src="@/static/img/main/lock.png"></image>
				<text style="color: #8d8d8d;font-size: 32rpx;padding: 20rpx 0;">开赛后公开</text>
				<text style="color: #8d8d8d;font-size: 32rpx;">
					截止时间 {{format(counter.allOrderData.Deadline*1000)}}
				</text>
			</view>
			<view class="detailCard" v-if="counter.allOrderData.Issue==2 && counter.allOrderData.AwardMoney!=counter.allOrderData.WinningMoney && (counter.allOrderData.WinningMoney/counter.allOrderData.BetMoney)>1.8">
				<view style="font-weight: bold;color:black;">奖金明细</view>
				<view class="detail">
					<text>票面中奖金额：</text>
					<text>{{counter.allOrderData.WinningMoney}}元</text>
				</view>
				<view class="detail">
					<text>佣金：</text>
					<text>{{(counter.allOrderData.WinningMoney*0.08).toFixed(2)}}元</text>
				</view>
				<view class="detail">
					<text>合计：</text>
					<text style="color: red;font-weight:bold;font-size:32rpx;">
						{{counter.allOrderData.AwardMoney}}元
					</text>
				</view>
			</view>
			<view class="reasonCard" v-show='counter.allOrderData.reason'>
				<view class="title">撤单原因:</view>
				<view style="white-space:normal;word-break: break-all;">
					<text>{{counter.allOrderData.reason}}</text>
				</view>
			</view>
			<orderData></orderData><!-- 订单信息卡片 -->
			<imgCard 
				:imgData='counter.allOrderData.ReturnImages'
				v-if="imgStateValue(counter.allOrderData.State)"
			></imgCard>
			<view style="width:100%;height:100rpx;"></view>
		</scroll-view>
		
		<!--  2023.10.28应客户要求取消
		<view class="bottom_button" @click="cancelOrder" v-show="counter.allOrderData.State==0||counter.allOrderData.State==1 && counter.allOrderData.user_id.id==counter.user_id">
			取消订单
		</view> -->
	</view>
</template>

<script setup>
	import jczqCard from "@/components/common/yc-dingdanxiangqing-card/yc-jingcaizuqiu/yc-jingcaizuqiu"
	import jclqCard from "@/components/common/yc-dingdanxiangqing-card/yc-jingcailanqiu/yc-jingcailanqiu.vue"
	import sfggCard from "@/components/common/yc-dingdanxiangqing-card/yc-shengfuguoguan/yc-shengfuguoguan.vue"
	import bjdcCard from "@/components/common/yc-dingdanxiangqing-card/yc-beijingdanchang/yc-beijingdanchang.vue"
	import renxuan9 from "@/components/common/yc-dingdanxiangqing-card/yc-renxuanjiu/yc-renxuanjiu.vue"
	import sfcCard from "@/components/common/yc-dingdanxiangqing-card/yc-shengfucai/yc-shengfucai.vue"
	import qxcCard from "@/components/common/yc-dingdanxiangqing-card/yc-qixingcai/yc-qixingcai.vue"
	import arrange5 from "@/components/common/yc-dingdanxiangqing-card/yc-pailiewu/yc-pailiewu.vue"
	import kl8Card from "@/components/common/yc-dingdanxiangqing-card/yc-kuaileba-zujian/yc-kuaileba-zujian.vue"
	import qlcCard from "@/components/common/yc-dingdanxiangqing-card/yc-qilicai/yc-qilicai.vue"
	import arrange3 from "@/components/common/yc-dingdanxiangqing-card/yc-pailiesan/yc-pailiesan.vue"
	import fc3dCard from "@/components/common/yc-dingdanxiangqing-card/yc-fucai3D/yc-fucai3D.vue"
	import dltCard from "@/components/common/yc-dingdanxiangqing-card/yc-daletou/yc-daletou.vue"
	import orderData from "@/components/common/yc-common-BettingInfo/yc-Bettinglnfo-orderData/yc-Bettinglnfo-orderData.vue"
	import imgCard from "@/components/common/yc-common-BettingInfo/yc-Bettinglnfo-imgCard/yc-Bettinglnfo-imgCard.vue"
	
	import api from '@/common/vmeitime-http/'
	import {useCounterStore} from '@/stores/counter'
	import common from "@/common/common"
	import {onBeforeMount,ref,reactive,defineProps,defineEmits} from 'vue';

	const Emits = defineEmits(['close']) //调用父组件方法关闭弹窗
	const counter = useCounterStore(); //状态管理
	const viewdata = reactive({
		//0待接单，1待出票，2待开奖，3待中奖，4未中奖，5待派奖，6已派奖
		'Statelist': ['认购中','待接单','待出票','玩家撤销','店主撤销','系统撤销','待开奖','待中奖','未中奖','待派奖','已派奖'],
		'State': 0,
		'money': 0,
		'WinningMoney': 0,
		'bonusmin': 0,
		'bonusmax': 0,
	})

	const maxiMoney=ref(0)
	const minMoney=ref(0)
	onBeforeMount(() => {
		if(counter.BettingContent!=''){
			maxiMoney.value=(counter.BettingContent.remarks.bonusmax*counter.BettingContent.remarks.Multiple).toFixed(2)
			minMoney.value=(counter.BettingContent.remarks.bonusmin*counter.BettingContent.remarks.Multiple).toFixed(2)
		}
	})
	const forecastMoneyShow=(gameTitle,state)=>{//预测中奖金额显示控制
		var arr=['竞彩足球','竞彩篮球','北京单场','胜负过关']
		var index=arr.indexOf(gameTitle)
		if(index != -1 && state!='9' && state!='10' && state!='8'){
			return true
		}
	}
	const isOpenCard=(Issue,isOpen,orderState,endTime)=>{//投注内容显示控制
		if(Issue!=2){return true}
		if(isOpen=='1'){
			return true
		}else{
			var stateArr=['3','4','5','8','9','10']
			var stateindex=stateArr.indexOf(orderState)
			if(stateindex != -1){return true}
			var time=new Date().getTime();
			if(time>(endTime)*1000){return true}
		}
	}
	
	function add0(m){return m<10?'0'+m:m }
	function format(shijianchuo){
		//shijianchuo是整数，否则要parseInt转换
		var time = new Date(shijianchuo);
		var y = time.getFullYear();
		var m = time.getMonth()+1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		var s = time.getSeconds();
		return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
	}
	const cancelOrder=()=>{//取消订单  //2023.10.28  取消
		uni.request({
			url:counter.baseUrl+'/api/bettingend.mine.Order/ClearOrder',
			header:{"server":"1","ba-user-token":counter.access_token},
			data:{"order_id":counter.allOrderData.order_id},
			success(res){
				if(res.data.code===1){
					uni.showToast({
						title:res.data.msg,
						icon:'success'
					})
					close()
				}else{
					uni.showToast({
						title:res.data.data,
						icon:'error'
					})
				}
			}
		})
		
	}
	const imgStateValue=(e)=>{//快速判断是否显示彩票图片Card（通过接收订单State值）
		var arr=['2','6','7','8','9','10']
		var newArr=arr.includes(e)
		return newArr
	}
	
	const close = () => { //发送是否点击关闭弹出层
		Emits('close')
	}

</script>

<style lang="scss">
	.scroll_viewStyle{
		height:calc(100vh - 160rpx - var(--status-bar-height) - env(safe-area-inset-bottom));
		width:100%;
	}
	.detailCard{
		width:680rpx;
		border-radius:15rpx;
		padding:20rpx;
		background-color: white;
		margin:20rpx auto;
	}
	.detail{
		font-size:26rpx;
		display:flex;
		justify-content: space-between;
		align-items:center;
		margin-top:20rpx;
	}
	.lockCard{
		width:720rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 400rpx;
		background-color:white;
		margin: auto;
		border-radius:15rpx;
	}
	
	.bottom_button{
		width:100%;
		height:80rpx;
		background-color: #f37335;
		position: fixed;
		bottom:env(safe-area-inset-bottom);
		color:white;
		line-height:80rpx;
		font-weight: bold;
		box-sizing: border-box;
		text-align:center;
		border-radius:20rpx 20rpx 0 0;
	}
	.title{
		font-size: 32rpx;
		color: black;
		font-weight: 600;
		
	}
	.reasonCard{
		width:680rpx;
		padding:20rpx;
		border:1rpx solid #ffcbcb;
		background-color: #ffe0e0;
		margin:20rpx auto;
		border-radius:10rpx;
	}
	.bg{
		width: 100%;
		background:linear-gradient(0deg,#fdfdfd , #222735);
		/* background-color: #dddddd; */
		border-radius:30rpx 30rpx 0 0;
		background-repeat: no-repeat;
		background-size: cover;
		-webkit-background-size: cover;
		-o-background-size: cover;
		background-position: center 0;
	}
	
	.quanju {
		width: 100%;
		height: 100rpx;
		text-align: center;
		background-color: white;
		float: left;
		position: fixed;
		bottom: 0;
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
	.xb {
		width: 100%;
		height: 2000rpx;
		background-color: #f5f5f5;
	}
</style>
