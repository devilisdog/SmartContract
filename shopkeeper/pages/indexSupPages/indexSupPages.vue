<template>
	<view class="topBg" >
		<view class="statusBar"></view>
		<uni-nav-bar 
			title="订单详情"
			leftIcon="closeempty"
			backgroundColor="rgba(220,38,38,0)"
			:border="false" color="white" 
			@clickLeft="back"
			>
		</uni-nav-bar>
		<scroll-view 
			scroll-y="true" 
			:style="{height:common.scrollH()-209-statusBarHeight+'rpx'}" 
		>
			<view style="display: flex;justify-content: space-around;margin:50rpx 0rpx;align-items: center;">
				<view style="color: #fff;display: flex;flex-flow:column;align-items: center;">
					<text style="font-size: 40rpx;padding-bottom:15rpx;">
						{{counter.orderData.AwardMoney==null?'暂无':counter.orderData.AwardMoney}}
					</text>
					<text class="textStyle">中奖金额</text>
				</view>
				<view style="color: #fff;display: flex;flex-flow:column;align-items: center;">
					<text style="font-size: 40rpx;padding-bottom:15rpx;">{{viewdata[counter.orderData.State]}}</text>
					<text class="textStyle">订单状态</text>
				</view>
				<view style="color: #fff;display: flex;flex-flow:column;align-items: center;">
					<text style="font-size: 40rpx;padding-bottom:15rpx;">{{counter.orderData.BetMoney}}</text>
					<text class="textStyle">投注金额</text>
				</view>
			</view>
			<view class="tishi"
				v-show="forecastMoneyShow(counter.orderData.bonusmax,counter.orderData.bonusmin,counter.orderData.State)">
				
				<view style="text-align:center;margin-top:8rpx;">
					<text class="textStyle">预测中奖金额:</text>
					<text v-if="maxiMoney != minMoney && minMoney>0" style="color: red;font-size:32rpx;font-weight:600;">
						￥{{minMoney}}~{{maxiMoney}}
					</text>
					<text style="color: red;font-size:32rpx;font-weight:600;" v-else>
						￥{{maxiMoney}}
					</text>
				</view>
			</view>
			
			<view v-if="counter.orderData.State!=1 && counter.orderData.State!=0"><!-- 投注信息卡片 -->
				<bjdcCard :data='counter.orderData' v-if="counter.orderData.Type==='北京单场'"></bjdcCard>
				<jczqCard :data='counter.orderData' v-else-if="counter.orderData.Type==='竞彩足球'"></jczqCard>
				<sfcCard :data='counter.orderData' v-else-if='counter.orderData.Type==="胜负彩"'></sfcCard>
				<sfggCard :data='counter.orderData' v-else-if="counter.orderData.Type==='胜负过关'"></sfggCard>
				<jclqCard :data='counter.orderData' v-else-if="counter.orderData.Type==='竞彩篮球'"></jclqCard>
				<renxuan9 :data='counter.orderData' v-else-if="counter.orderData.Type==='任选九'"></renxuan9>
				<qlcCard :data='counter.orderData' v-else-if="counter.orderData.Type==='七乐彩'"></qlcCard>
				<kl8Card :data='counter.orderData' v-else-if="counter.orderData.Type==='快乐八'"></kl8Card>
				<arrange3 :data='counter.orderData' 
						   v-else-if="counter.orderData.Type==='排列三'||counter.orderData.Type==='福彩3D'">
				</arrange3>
				<dltCard :data='counter.orderData' 
						  v-else-if="counter.orderData.Type==='大乐透'||counter.orderData.Type=='双色球'">
				</dltCard>
				<qxcCard :data='counter.orderData' v-else-if="counter.orderData.Type==='七星彩'"></qxcCard>
				<arrange5 :data='counter.orderData' v-else-if="counter.orderData.Type==='排列五'"></arrange5>
			</view>
			
			<orderConceal :xiaoqin='counter.orderData' v-else></orderConceal><!-- 投注信息锁定卡片 -->
			
			<view class="reasonCard" v-show='counter.orderData.reason!=null'>
				<view class="title">撤单原因:</view>
				<view style="white-space:normal;word-break: break-all;">
					<text>{{counter.orderData.reason}}</text>
				</view>
			</view>
		
			<view class="detailCard" v-show="counter.orderData.Issue=='2' && Number(counter.orderData.AwardMoney)!=Number(counter.orderData.WinningMoney)">
				<view style="font-weight: bold;color:black;">奖金明细</view>
				<view class="detail">
					<text>票面中奖金额：</text>
					<text>{{counter.orderData.WinningMoney}}元</text>
				</view>
				<view class="detail">
					<text>佣金：</text>
					<text>{{(counter.orderData.WinningMoney*0.08).toFixed(2)}}元</text>
				</view>
				<view class="detail">
					<text>合计：</text>
					<text style="color: red;font-weight:bold;font-size:32rpx;">
						{{Number(counter.orderData.WinningMoney-(counter.orderData.WinningMoney*0.08)).toFixed(2)}}元
					</text>
				</view>
			</view>
			<view class="hemaiStyle" v-if="counter.orderData.State==0"><!-- 合买状态卡片 -->
				<view style="display: flex;justify-content: space-between;">
					<text class="fontStyle">合买状态</text>
					<view style="color: #a2a2a2;display: flex">
						<text style="padding-right:10rpx;">截止倒计时</text>
						<uni-countdown 
							:show-day="countDdown(counter.orderData.Deadline,99)>=1?true:false" 
							:day="countDdown(counter.orderData.Deadline,99)"
							:hour="countDdown(counter.orderData.Deadline,0)" 
							:minute="countDdown(counter.orderData.Deadline,1)" 
							:second="countDdown(counter.orderData.Deadline,2)"
							backgroundColor="seagreen"
							color="white">
						</uni-countdown>
					</view>
				</view>
				<view style="width:660rpx;background-color: #ececec;padding:10rpx;display: flex;margin:20rpx 0rpx;">
					<view style="text-align: center;width:165rpx;font-size:26rpx;color: #7e7e7e;" 
						  v-for="itme,index in 4"
						  :style="index!=3?'border-right:1rpx solid black;':''">
						<text>{{index==0?'方案总额':index==1?'单份金额':index==2?'剩余份额':'佣金'}}</text><br>
						<text :style="index<2?'color:red;':''">
							<text v-show="index==0||index==1">￥</text>
							{{
								index==0?counter.orderData.togetherInfo.StartBetMoney
								:index==1?counter.orderData.togetherInfo.StartBetMoney/counter.orderData.togetherInfo.NumberShare
								:index==2?counter.orderData.togetherInfo.NumberShare-counter.orderData.togetherShare:'0'
							}}
							<text v-show="index==3">%</text>
						</text>
					</view>
				</view>
				<view style="display: flex;justify-content: space-between;">
					<view>
						<text>认购列表：{{counter.orderData.togetherShare}}份 共</text>
						<text style="color: red;">
							￥{{(counter.orderData.togetherInfo.StartBetMoney/counter.orderData.togetherInfo.NumberShare)*counter.orderData.togetherShare}}
						</text>
					</view>
					<text style="font-size:32rpx;color:seagreen;font-weight:bold;" 
						  @click="proxy.$refs.together.open()">
						查看详情
						
					</text>
				</view>
			</view>
			
			<orderDataCard /><!-- 订单信息卡片 -->
			
			<view>
				<imgCard v-show="imgStateValue(counter.orderData.State)" />
			</view>
		</scroll-view>
	</view>
	<view class="bottonButtom">
		<bottomButton @writeReport='writeReport' :order_lock='Props.order_lock' :imgValue='imgValue' ></bottomButton>
	</view>
	<uni-popup ref="together" type="bottom" :isMaskClick="false"><!-- 合买订单的查看详情 -->
		<view style="background-color:#f3f3f3;height:95vh;">
			<togetherPopup @close='close' :togetherList='counter.orderData.together'></togetherPopup>
		</view>
	</uni-popup>
	<uni-popup type="center" ref="modification"><!-- 出票确认 -->
		<yc-indexSupPages-modificationPopup 
			:imgValue='imgValue' 
			@closePupop='writeReportClose' 
			:orderData='JSON.parse(counter.orderData.BetContent)'
		/>
	</uni-popup>
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

	import orderDataCard from "@/components/common/yc-common-BettingInfo/yc-Bettinglnfo-orderData/yc-Bettinglnfo-orderData.vue"
	import imgCard from "@/components/common/yc-common-BettingInfo/yc-Bettinglnfo-imgCard/yc-Bettinglnfo-imgCard.vue"
	import togetherPopup from "@/components/common/yc-common-BettingInfo/yc-orderCardSup-togetherPopup/yc-orderCardSup-togetherPopup.vue"
	
	import bottomButton from "@/components/indexSupPagse-module/bottom-button.vue"
	import api from "@/common/vmeitime-http/index/index.js"
	import {useCounterStore} from '@/stores/counter'
	import common from "@/common/common"
	import {onBackPress} from "@dcloudio/uni-app"
	import getdatetime from "/common/getdatetime.js"
	import orderConceal from "/components/common/yc-common-BettingInfo/yc-BettingInfo-orderConceal/yc-BettingInfo-orderConceal.vue"
	
	import {getCurrentInstance,onBeforeMount,ref,reactive,defineProps,defineEmits,} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理

	const viewdata = reactive([
		'认购中','待接单','待出票','玩家撤销','店主撤销','系统撤销','待开奖','待中奖','未中奖','待派奖','已派奖','已流单'
	])
	const Props=defineProps([
		'order_lock'//按钮锁（1=不显示按钮/0=正常判断是否显示默认为0）
	])
	const statusBarHeight=ref(0)//手机状态栏高度
	const imgValue=ref([])//用户上传的图片url数组
	
	const maxiMoney=ref(0)
	const minMoney=ref(0)
	
	
	
	onBackPress((e)=>{//监听用户返回操作
		if(e.from=='backbutton'){
			counter.clickOrderState=false
		}
	})
	const forecastMoneyShow=(bonusmax,bonusmin,State)=>{//预测中奖金额显示控制
		if(bonusmax !== 0 && bonusmin !== 0 && State!=10 && State!=9){
			return true
		}
	}
	onBeforeMount(() => {
		
		if(counter.orderData.BetContent!=''){
			var data = JSON.parse(counter.orderData.BetContent)
			maxiMoney.value=(data.remarks.bonusmax*data.remarks.Multiple).toFixed(2)
			minMoney.value=(data.remarks.bonusmin*data.remarks.Multiple).toFixed(2)
			
		}
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight//获取手机状态栏高度
	})
	const imgStateValue=(e)=>{//快速判断是否显示彩票图片Card（通过接收订单State值）
		var arr=['2','6','7','8','9','10']
		var newArr=arr.includes(e)
		return newArr
	}
	const countDdown=(time,index)=>{//倒计时计算
		const endTime=new Date(getdatetime.getNowFormatDate(0,time))
		const nowTime=new Date()
		const difftime=(endTime - nowTime)/1000
		var days = parseInt(difftime/86400); // 天  24*60*60*1000
		if(index==99){
			return days
		}else if(index==0){
			return parseInt(difftime/3600)-24*days;// 小时 60*60 总小时数-过去的小时数=现在的小时数
			
		}else if(index==1){
			return parseInt(difftime%3600/60); // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
		}else{
			return parseInt(difftime%60);  // 以60秒为一整份 取余 剩下秒数
		}
	}
	const close=()=>{//关闭合买详情popup
		proxy.$refs.together.close()
	}

	const back=()=>{//返回
		counter.clickOrderState=false
		uni.navigateBack({
			animationType:'slide-out-bottom',
			success(){
				setTimeout(()=>{
					counter.orderData=[]
				},500)
			}
		})
	}
	const writeReport=()=>{//点击出票
		proxy.$refs.modification.open()
	}
	const writeReportClose=()=>{//关闭出票弹窗
		proxy.$refs.modification.close()
	}
	

</script>

<style>
	.topBg{
		width: 100%;
		height: 500rpx;
		background-image: linear-gradient(-225deg, #f6d365,#fda085);
		border-radius:0 0 20rpx 10rpx;
	}
	.reasonCard{
		width:680rpx;
		padding:20rpx;
		border:1rpx solid #ffcbcb;
		background-color: #ffe0e0;
		margin:20rpx auto;
		border-radius:10rpx;
	}
	.imagePopupButtom{
		width:500rpx;
		height:80rpx;
		border-radius:10rpx;
		text-align: center;
		line-height:80rpx;
		margin:20rpx auto;
		background-color: #fdc830;
		color: white;
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
	.fontStyle {
		font-size: 32rpx;
		color: black;
		font-weight: bold;
		
	}
	.hemaiStyle{
		width:680rpx;
		padding:20rpx;
		background-color: white;
		border-radius:10rpx;
		margin:20rpx auto;
	}
	.bottonButtom{
		width:100%;
		height:80rpx;
		display:flex;
		position:fixed;
		bottom:0rpx;
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
	.statusBar {
		width: 100%;
		height: var(--status-bar-height);
	}
	body{
		background-color: #f3f3f3;
	}
</style>