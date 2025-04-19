<template>
	<view class="my_navBer">
		<view class="left"><uni-icons type="closeempty" color="#fff" size="44rpx" @click="closeFollowInfo"></uni-icons></view>
		<view class="title">跟单详情</view>
		<view class="rigth">
			<uni-icons type="redo-filled" color="#fff"  size="44rpx" @click="proxy.$refs.Share.open()"></uni-icons>
		</view>
	</view>
	<scroll-view class="popupCard" :scroll-y="true">
		<view class="user_info_box"  v-if="pageShow">
			<view class="info_left" @click="clickUserLogo(followData.user_info.id)">
				<image :src="followData.user_info.avatar" class="user_logo"></image>
				<view class="user_name">
					<text class="name">{{followData.user_info.nickname}}</text>
					<view class="label">
						<view class="label_left">{{followData.user_info.hit}}</view>
						<view class="label_rigth">盈利率：{{Number(followData.user_info.profit*100).toFixed(2)+'%' }}</view>
					</view>
				</view>
			</view>
			<view class="info_rigth_bottom" @click="attention">
				<uni-icons :type="followData.attention?'star-filled':'star'" size="44rpx" color="#ff6a6a"></uni-icons>
				<text style="color:#ff6a6a;">{{followData.attention?'已关注':'关注'}}</text>
			</view>
		</view>
		<view class="content_card"  v-if="pageShow">
			<view class="top_title_box">
				<view class="title_left">
					<image :src="counter.baseUrl+followData.gameImg" class="gameImage"></image>
					<text>{{followData.order_info.Type}}</text>
				</view>
				<view class="title_rigth">
					<text>预计回报：</text>
					<text style="color:red;">
						{{followData.follow_info.ForecastReward<1.8?0:followData.follow_info.ForecastReward}}
					</text>
					<text>倍 佣金</text>
					<text style="color:red;">8%</text>
					<uni-icons type="help-filled" @click="proxy.$refs.commissionExplain.open()"></uni-icons>
				</view>
			</view>
			<view class="manifesto">
				{{common.isJson(followData.follow_info.Declarati)}}
			</view>
			<view class="followState">
				<view style="flex:1;display: flex;flex-flow: column;align-items: center;" v-if="followData.follow_info.Deadline>userNowTime/1000">
					<view>截止时间</view>
					<showTiem :timestamp="followData.follow_info.Deadline" splitorColor="red" color="red" @timeup="followButtonShow=false"/>
				</view>
				<view style="flex:1;display: flex;flex-flow: column;align-items: center;" v-else-if="followData.order_info.AwardMoney">
					<text>已中奖</text>
					<text style="color: red;">{{followData.order_info.AwardMoney}}元</text>
				</view>
				<view style="flex:1;display: flex;flex-flow: column;align-items: center;" v-else>
					<view>{{common.orderState(followData.order_info.State)}}</view>
				</view>
				<view class="dataShow">
					<view>
						<text style="color: #afafaf ;">自购金额</text>
						<text style="color: red;">{{followData.follow_info.OneselftMoney}}</text>
					</view>
						<text style="width: 2rpx; height: 50rpx; background-color: #ebebeb;"></text>
					<view>
						<text style="color: #afafaf ;">跟单金额</text>
						<text style="color: red;">{{followData.follow_info.FollowMoney}}</text>
					</view>
					<text style="width: 2rpx; height: 50rpx; background-color: #ebebeb;"></text>
					<view>
						<text style="color: #afafaf ;">起投金额</text>
						<text style="color: red;">{{followData.follow_info.StartBetMoney}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="follow_info_card"  v-if="pageShow">
			<uni-segmented-control
				:current="controlData.selectIndex" 
				:values="controlData.option" styleType="text" 
				active-color="#f04b49" @clickItem="selectCardChenge"
			/>
			<view v-show="controlData.selectIndex==0" v-if="followIsShow()">
				<view v-if="followData.follow_info.Type==='竞彩足球'">
					<jczqCard :widths='650' />
				</view>
				<view v-else-if="followData.follow_info.Type==='竞彩篮球'">
					<jclqCard :widths='650' />
				</view>
				<view v-else-if="followData.follow_info.Type==='胜负过关'">
					<sfggCard :widths='650' />
				</view>
				<view v-else-if="followData.follow_info.Type==='北京单场'">
					<bjdcCard :widths='650' />
				</view>
				<view v-else-if="followData.follow_info.Type==='任选九'">
					<renxuan9 :widths='650' />
				</view>
				<view v-else-if="followData.follow_info.Type==='福彩3D' || followData.follow_info.Type==='排列三'">
					<arr3 />
				</view>
				<view v-else>
					<dltCard></dltCard>
				</view>
			</view>
			<view class="lockCard" v-show="controlData.selectIndex==0" v-else>
				<image src="../../../static/img/main/lock.png"></image>
				<text>开赛后公开</text>
				<text>预计：{{transitionTime.getNowFormatDate(0,followData.order_info.drawDeadine*1000)}}</text>
			</view>
			<scroll-view style="height:550rpx;text-align: center;" :scroll-y="true" v-show="controlData.selectIndex==1">
				<view class="followNumber_item" v-for="itme,index in followData.follow_people.data">
					<view class="item_left">
						<image :src="itme.user_id.avatar"></image>
						<text>{{itme.user_id.nickname}}</text>
					</view>
					<text style="color:red;">{{itme.money}}元</text>
				</view>
				<text style="color: #afafaf;padding-bottom:20rpx;" v-show="followData.follow_people.data.length==10">
					默认显示前十位用户~
				</text>
				<image src="@/static/img/follow/noData.png" style="height: 170rpx;width: 170rpx;" 
					v-show="!followData.follow_people.data"/>
			</scroll-view>
		</view>
		<view style="width:100%;height:20rpx;"></view>
	</scroll-view>
	
	<view class="purchasing" style="justify-content:flex-end;border:none;box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);position: fixed;bottom:calc(90rpx + env(safe-area-inset-bottom));" v-show="followButtonShow">
		投
		<numberBox :defaultValue="boxNum" @numberChange="numberChange"></numberBox>
		倍
	</view>
	<view class="purchasing" v-show="followButtonShow">
		<view class="content_left">
			<text style="color:red;font-weight: bold;">{{boxNum}}</text>
			<text>倍  合计</text>
			<text style="color:red;font-weight: bold;">{{allfollowMoney}}</text>
			<text>元</text>
		</view>
		<view class="content_rigth" @click="openPay">立即跟单</view>
	</view>
	
	<uni-popup ref="confirmPayment" type="bottom">
		<SubmitPay 
			type="竞彩足球"  :money="allfollowMoney" 
			:balance="counter.user_money-allfollowMoney" @ConfirmPayment="PayFollow">
		</SubmitPay>
	</uni-popup>
	
	<uni-popup ref="commissionExplain" type="center">
		<view class="questions_card">
			<view class="questions_title">
				<text>温馨提示</text>
			</view>
			<view class="questions_content">
				<text>收取规则：发单人6%，出票店主1.5%，发起跟单的店铺1.5%，平台技术服务1%</text>
			</view>
			<view class="questions_button" @click="proxy.$refs.commissionExplain.close()">
				知道了
			</view>
		</view>
	</uni-popup>
	<uni-popup ref="Share" type="center">
		<orderShare :order_info="followData"></orderShare>
	</uni-popup>
</template>
<script setup>
	import jczqCard from "@/components/common/yc-dingdanxiangqing-card/yc-jingcaizuqiu/yc-jingcaizuqiu"
	import jclqCard from "@/components/common/yc-dingdanxiangqing-card/yc-jingcailanqiu/yc-jingcailanqiu.vue"
	import sfggCard from "@/components/common/yc-dingdanxiangqing-card/yc-shengfuguoguan/yc-shengfuguoguan.vue"
	import bjdcCard from "@/components/common/yc-dingdanxiangqing-card/yc-beijingdanchang/yc-beijingdanchang.vue"
	import renxuan9 from "@/components/common/yc-dingdanxiangqing-card/yc-renxuanjiu/yc-renxuanjiu.vue"
	import sfcCard from "@/components/common/yc-dingdanxiangqing-card/yc-shengfucai/yc-shengfucai.vue"
	import arr3 from "@/components/common/yc-dingdanxiangqing-card/yc-pailiesan/yc-pailiesan.vue"
	import dltCard from "@/components/common/yc-dingdanxiangqing-card/yc-daletou/yc-daletou.vue"
	import SubmitPay from "@/components/main/nav/yc-submit-pay.vue"
	import numberBox from "/components/common/yc-newNumber_box/yc-newNumber_box.vue"
	import orderShare from "../../follow/order_share.vue"
	import api from '@/common/vmeitime-http/'
	import transitionTime from "@/common/getdatetime.js"
	import showTiem from '@/components/common/showTiem.vue'
	import common from "@/common/common"
	import { useCounterStore } from '@/stores/counter'
	import {onBeforeMount,ref,reactive, defineProps,defineEmits,getCurrentInstance} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const props = defineProps(['sign','order_id'])
	const Emits = defineEmits(['close','look_follow'])
	const counter = useCounterStore(); //状态管理
	const pageShow=ref(false)
	const boxNum=ref(1)//用户选择的倍率
	const onefollowMoney=ref(2)//起投金额
	const allfollowMoney=ref(2)//起投金额*倍率得到的最终跟单金额
	const followData=ref([])//跟单详情数据
	const followGameId=ref(0)//跟单方案游戏玩法id
	const userNowTime=ref(0)//用户当前时间
	const followButtonShow=ref(false)
	const controlData=reactive({
		selectIndex:0,
		option:['方案详情','跟单次数']
	})
	onBeforeMount(()=>{
		getFollowInfo()
	})
	const numberChange=(e)=>{//投注倍数用户点击执行
		boxNum.value=Number(e)
		allfollowMoney.value=onefollowMoney.value*boxNum.value
	}
	const openPay=()=>{//打开支付卡片
		if(!counter.allGameAstrict[followGameId.value]){
			uni.showToast({
				title:'未获取到店主限制信息，请回到首页重试',
				position:"center",
				icon:'none',
				duration:3000
			})
			return
		}
		
		if(allfollowMoney.value<counter.allGameAstrict[followGameId.value].MinBetAmount){
			uni.showToast({
				title:'店主限制最小投注金额'+counter.allGameAstrict[followGameId.value].MinBetAmount+'元',
				position:"center",
				icon:'none',
				duration:3000
			})
			return
		}
		getUserNewMoney(allfollowMoney.value)
	}
	const PayFollow=()=>{//确认支付跟单
		proxy.$refs.confirmPayment.close()
		uni.showLoading({title:'跟单中~',mask:true})
		api.followFollow({'id':props.order_id,'multiple':boxNum.value}).then( async (res)=>{
			uni.hideLoading()
			uni.showToast({
				icon:res.data.msg,
				title:res.data.data,
				duration:500
			});
			setTimeout(()=>{
				proxy.$refs.confirmPayment.close()
				getFollowInfo()//重新获取跟单详情信息
			},500)
		})
	}
	const closeFollowInfo=()=>{
		setTimeout(()=>{
			counter.submitNewData=[]
			counter.BettingContent=[]
		},300)
		Emits('close')
	}
	const getUserNewMoney=(payMoney)=>{//获取用户余额
		uni.showLoading({title:'获取余额中~',mask:true})
		api.GetUserNewMoney({}).then(res=>{
			uni.hideLoading()
			counter.user_money=Number(res.data.data.not_withdraw+res.data.data.withdraw).toFixed(2)
			proxy.$refs.confirmPayment.open()
			if(payMoney>counter.user_money){//余额不足拦截
				uni.showModal({
					title: '注意',
					content: '余额不足！',
					confirmText:'立即充值',
					confirmColor:'#f04b49',
					success: function (res) {
						proxy.$refs.confirmPayment.close()
						if (res.confirm) {
							uni.navigateTo({
								url:'/pages/home/HomeTopUp/HomeTopUp',
								animationType:'slide-in-bottom'
							})
						}
					}
				});
				return
			}
		})
	}
	
	const getFollowInfo=()=>{//获取跟单详情数据
		uni.showLoading({title:'数据获取中'})
		boxNum.value=1
		api.followOrderInfo({"order_id":props.order_id}).then(res=>{
			uni.hideLoading()
			if(res.data.code==1){
				var arr=['排列三','福彩3D','大乐透']
				if(arr.includes(res.data.data.order_info.Type)){
					var newJs=JSON.parse(res.data.data.order_info.BetContent)
					newJs[0]['lssue']=res.data.data.order_info.issue_code
					counter.submitNewData=newJs
				}else{
					counter.BettingContent=JSON.parse(res.data.data.order_info.BetContent)
				}
				followGameId.value=common.ganmeId(res.data.data.follow_info.Type)//玩法id转换
				followData.value=res.data.data//跟单详情全部信息
				onefollowMoney.value=res.data.data.follow_info.StartBetMoney//起投金额
				allfollowMoney.value=res.data.data.follow_info.StartBetMoney//起投金额
				pageShow.value=true//页面内容显示控制
				userNowTime.value=new Date().getTime()//获取用户当前时间
				controlData.option[1]='跟单次数('+res.data.data.follow_people.total+')'
			}else{
				uni.showToast({
					title:res.data.msg,
					icon:'none',
					position:'center',
					duration:2000,
				})
			}
		}).catch(err=>{
			uni.hideLoading()
			uni.showToast({
				title:'数据处理失败',
				icon:'none',
				position:'center'
			})
		})
	}
	const followIsShow=()=>{//跟单内容显示控制
		if(followData.value.user_info.id==counter.user_id){return true}//判断是否是自己发起的跟单如果是直接显示投注内容
		
		if(followData.value.follow_info.Isopen=='0'){//判断发单用户是否开启订单公开
			if(followData.value.order_info.Deadline<userNowTime.value/1000){
				return true
			}else{
				followButtonShow.value=true//跟单按钮显示控制
			}
		}else{
			if(followData.value.order_info.Deadline>userNowTime.value/1000){
				followButtonShow.value=true//跟单按钮显示控制
			}
			return true
		}
	}
	
	const attention =()=>{//关注点击
		if(followData.value.user_info.id==counter.user_id){
			uni.showToast({
				title:'无法关注自己~',
				position:'center',
				icon:'none'
			})
			return
		}
		if(!followData.value.attention){
			api.atten({'user_id':followData.value.user_info.id,}).then((res)=>{
				uni.showToast({
					title:res.data.data,
					icon:res.data.msg
				})
				if(res.data.code==1){
					followData.value.attention = true
				}
			})
		}else{
			api.cancelAtten({'user_id':followData.value.user_info.id,}).then((res)=>{
				uni.showToast({
					title:res.data.data,
					icon:res.data.msg
				})
				if(res.data.code==1){
					followData.value.attention = false
				}
			})
		}
	}
	const selectCardChenge=(e)=>{
		controlData.selectIndex=e.currentIndex
	}
	const clickUserLogo=(follow_id)=>{
		Emits('look_follow',follow_id)
	}
	
</script>

<style lang="scss">
	.questions_card{
		width:600rpx;
		border-radius:15rpx;
		background-color:white;
		padding:20rpx;
		.questions_button{
			text-align: center;
			font-size:32rpx;
			border-top:1rpx solid #e6e6e6;
			margin-top:20rpx;
			padding-top:20rpx;
			color: #ffb300;
		}
		.questions_content{
			margin-top:20rpx;
		}
		.questions_title{
			text-align:center;
			text{
				font-size:38rpx;
				font-weight: bold;
			}
			
		}
	}
	.pay_Card{
		padding:20rpx;
		background-color: #fff;
		width:100%;
		border-radius:30rpx 30rpx 0 0;
		box-sizing: border-box;
		.payBottom{
			width:100%;
			height:80rpx;
			border-radius:20rpx;
			color:#fff;
			background: #202736;
			margin:20rpx auto;
			font-size:38rpx;
			font-weight: bold;
			text-align: center;
			line-height:80rpx;
		}
		.pay_info_item{
			border-top:1rpx solid #f5f5f5;
			border-bottom:1rpx solid #f5f5f5;
			padding:20rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.close{
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}
		.title{
			text-align: center;
			
		}
		.card_title_box{
			display: flex;
			align-items: center;
			padding-bottom:20rpx;
			width:100%;
			view{
				flex:1;
			}
		}
	}
	.purchasing{
		width:100%;
		padding:0rpx 20rpx;
		box-sizing: border-box;
		background-color:#fff;
		display: flex;
		align-items: center;
		height:100rpx;
		border-top:1rpx solid #ebebeb;
		position: fixed;
		margin-bottom: 180rpx;
		bottom:env(safe-area-inset-bottom);
		.content_rigth{
			flex:1;
			text-align: center;
			background: #202736;
			// background-color: #ff6a6a;
			height:80rpx;
			line-height:80rpx;
			color: #fff;
			border-radius:20rpx;
		}
		.content_left{
			text-align: center;
			text{
				font-size:32rpx;
			}
			flex:1;
		}
	}
	.follow_info_card{
		width:720rpx;
		margin:20rpx auto;
		background-color: #fff;
		border-radius:20rpx;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		transition: all 0.3s;
		.followNumber_item{
			width:100%;
			display: flex;
			align-items: center;
			padding:20rpx;
			box-sizing: border-box;
			justify-content: space-between;
			.item_left{
				display: flex;
				align-items: center;
			}
			image{
				width:60rpx;
				height:60rpx;
				border-radius:10rpx;
				margin-right:10rpx;
			}
		}
		.lockCard{
			width:100%;
			height:550rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-flow: column;
			margin-bottom: 180rpx;
			text{
				font-size:38rpx;
				color: #9f9f9f;
			}
			image{
				width:180rpx;
				height:180rpx;
			}
		}
	}
	.user_info_box{
		width:680rpx;
		padding:20rpx;
		margin:20rpx auto;
		border-radius:20rpx;
		background-color: #fff;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		display: flex;
		align-items: center;
		justify-content: space-between;
		.info_rigth_bottom{
			display: flex;
			align-items: center;
			// background-color: #ff6a6a;
			border:1rpx solid #ff6a6a;
			padding:5rpx 20rpx;
			border-radius:10rpx;
			transition: all 0.3s;
			text{
				font-size:32rpx;
			}
		}
		.info_left{
			display: flex;
			.user_name{
				display: flex;
				flex-flow: column;
				justify-content: space-around;
				.name{
					font-size:34rpx;
					font-weight: bold;
				}
			}
			.user_logo{
				width:120rpx;
				height:120rpx;
				border-radius:10rpx;
				margin-right:10rpx;
			}
		}
	}
	.my_navBer{
		display: flex;
		align-items: center;
		background-color: #202736; 
		border-radius:20rpx 20rpx 0 0;
		padding:20rpx;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		.title{
			text-align: center;
			font-weight: bold;
			color: #fff;
		}
		.rigth{
			display: flex;
			justify-content:flex-end;
		}
		view{
			flex:1;
		}
	}
	.popupCard{
		width:100%;
		height:calc(100vh - 160rpx - var(--status-bar-height) - env(safe-area-inset-bottom));
		background-color:#fbfbfb;
		box-sizing: border-box;
		padding-bottom:180rpx;
	}
	.label{
		display: flex;
		font-size:26rpx;
		border:1rpx solid #ff6a6a;
		border-radius:10rpx;
		.label_rigth{
			padding:10rpx;
			background-color: #ff6a6a;
			color:#fff;
			border-radius:0 10rpx 10rpx 0;
		}
		.label_left{
			padding:10rpx;
			color: #ff6a6a;
		}
	}
	.content_card{
		padding:20rpx;
		background-color:white;
		width:680rpx;
		border-radius:15rpx;
		margin:20rpx auto;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		.followState{
			display: flex;
			flex-direction: row;
			align-items: center;
			// background-color: #ff6a6a;
		}
		.manifesto{
			margin:20rpx 0;
			background-color: #f3f3f3;
			word-wrap: break-word;
			padding:10rpx 0rpx;
			border-radius:10rpx;
			text-indent:4mm;
		}
		.top_title_box{
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.title_left{
			display: flex;
			align-items: center;
			.gameImage{
				width:60rpx;
				height:60rpx;
				border-radius:50%;
				margin-right:10rpx;
			}
		}
	}
	.dataShow{
		border-radius: 25rpx;
		background-color: #fafafa;
		display: flex;
		align-items: center;
		flex-direction: row;
		view{
			width: 140rpx;
			height: 120rpx;
			padding: 0 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
		}
	}
</style>