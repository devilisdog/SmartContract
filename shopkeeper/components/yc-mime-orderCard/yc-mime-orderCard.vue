<template>
	<view class="card">
		<view style='height:270rpx;'>
			<view class="cardNeir" @click="popup">
				<view style="display: flex;align-items: center;">
					<image :src="arr[Props.order_list.Type].url" style="width: 50rpx;height:50rpx;"></image>
					<text style="padding-left:10rpx;">{{Props.order_list.Type}}</text>
					<yc-card-TGA
						:value='Props.order_list.default' 
						:orderState='Props.order_list.Issue' 
						:IsAllowRejection='Props.order_list.IsCooperative'
					/>
				</view>
				<text :style="Props.order_list.State==10?'color:red;':''">
					{{orderStateMethod(Props.order_list.State)}}
				</text>
			</view>
			<view style="font-size:28rpx;margin-top:10rpx;">
				<view>
					<text style="color: #868686;" @click="copy">订单编号：{{Props.order_list.order_id}}</text>
					<uni-icons type="folder-add" @click="copy"></uni-icons>
				</view>
				<view style="display: flex;justify-content: space-between;margin:10rpx 0rpx;" @click="popup">
					<text>注数:{{Props.order_list.Note}}</text>
					<view>
						<text>投注金额：</text>
						<text  style="color: red;">{{Props.order_list.BetMoney}}元</text>
					</view>
				</view>
				<view style="margin:10rpx 0rpx;display: flex;justify-content: space-between;" @click="popup">
					<text>用户：{{Props.order_list.user_id.remarks!=undefined?Props.order_list.user_id.remarks:Props.order_list.user_id.nickname}}</text>
					<text style="color: red;" v-if="Props.order_list.State==10">
						中奖金额：{{Props.order_list.WinningMoney}}元
					</text>
				</view>
				<view style="display: flex;align-items: center;justify-content: space-between;">
					<text>
						{{Props.order_list.State==1?'下单时间'
						 :Props.order_list.State==2?'接单时间'
						 :Props.order_list.State==10?'派奖时间':Props.order_list.Ticketingtime==null?'下单时间':'出票时间'}}:
						{{getDate.getNowFormatDate(0,timeState(Props.order_list.State))}}
					</text>
					<view v-if="!orderStateShow(Props.order_list.State)" style="display: flex;align-items: center;">
						<uni-icons type="image" size="22"></uni-icons>
						<text>{{Props.order_list.ReturnImages.length}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import common from '@/common/common'
	import getDate from "@/common/getdatetime.js"
	import {useCounterStore} from '@/stores/counter'
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		defineEmits,//发送数据
		defineProps,//接收数据
		watch,
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const Props=defineProps(['order_list'])
	const counter = useCounterStore(); //状态管理
	const popup=()=>{//点击打开卡片详情
		counter.orderData=Props.order_list
		uni.navigateTo({
			url:'/pages/indexSupPages/indexSupPages',
			animationType: "slide-in-bottom",
		})
	}
	const title=ref('竞彩足球')
	onBeforeMount(()=>{
		// console.log();
	})
	const timeState=(State)=>{
		if(State==1){
			return Props.order_list.PayTime
		}else if(State==2){
			return Props.order_list.Receivingtime
		}else if(State==10){
			return Props.order_list.Awardtime
		}else{
			if(Props.order_list.Ticketingtime==null){
				return Props.order_list.PayTime
			}else{
				return Props.order_list.Ticketingtime
			}
		}
	}
	
	const orderStateShow=(e)=>{
		var arr = ['0','1','2','3','4','5','11']
		return arr.includes(e)
	}
	
	const orderStateMethod=(e)=>{
		//状态:0=认购中,1=待接单,2=待出票,3=玩家撤销,4=店主撤销,5=系统撤销,6=待开奖,7=待中奖,8=未中奖,9=待派奖,10=已派奖,11=已流单
		var arr=['认购中','待接单','待出票','玩家撤销','店主撤销','系统撤销','待开奖','待中奖','未中奖','待派奖','已派奖','已流单']
		return arr[e]
	}
	const copy=()=>{
		// console.log();
		uni.setClipboardData({
			data:String(Props.order_list.order_id),
			showToast:true,
		})
	}

	const arr=reactive({//接单卡片图片数据（根据获取到的title判断使用哪个url）
		'竞彩足球':{url:'/static/lottery/407.png'},
		'竞彩篮球':{url:'/static/lottery/406.png'},
		'胜负过关':{url:'/static/lottery/404.png'},
		'北京单场':{url:'/static/lottery/405.png'},
		'双色球':{url:'/static/lottery/101.png'},
		'大乐透':{url:'/static/lottery/201.png'},
		'排列三':{url:'/static/lottery/202.png'},
		'排列五':{url:'/static/lottery/203.png'},
		'七星彩':{url:'/static/lottery/204.png'},
		'七乐彩':{url:'/static/lottery/104.png'},
		'快乐八':{url:'/static/lottery/105.png'},
		'福彩3D':{url:'/static/lottery/102.png'},
		'任选九':{url:'/static/lottery/402.png'},
		'胜负彩':{url:'/static/lottery/401.png'},
		
	})

</script>

<style>
	.card{
		width:680rpx;
		background-color: white;
		margin:20rpx auto;
		padding:20rpx 20rpx;
		border-radius:20rpx;
		transition:.2s;
	}
	.card:active{
		transition:.2s;
		transform: scale(0.95);
	}
	.cardNeir{
		display: flex;
		height:60rpx;
		border-bottom:1rpx solid #f3f3f3;
		align-items: center;
		justify-content: space-between;
	}

</style>