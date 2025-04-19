<template>
	<view class="card" v-for='itme,index in ballArr' @click="skit(itme.title)">
		<view class="card_top">
			<view class="top_left">
				<text class="left_title">{{itme.title}} {{itme.content.code+'期'}} {{itme.time}}</text>		
			</view>
			<view class="top_right" v-if="timeFunction(itme.title)">
				<text class="label">今日开奖</text>
			</view>
		</view>
		<view class="card_content">
			<view class="content_left" v-if="ticChinese[itme.gameIndex]==itme.title">
				<text class="redBall" v-for="itmeX,indexX in itme.content.lotteryDrawResult">{{itmeX}}</text>
				<text class="buleBall" v-for="itmeX,indexX in itme.content.blue" v-if="itme.content.blue!=''">
					{{itmeX}}
				</text>
			</view>
			<view class="content_left" v-else>
				<text class="redBall" v-for="itmeX,indexX in itme.content.red">{{itmeX}}</text>
				<text class="buleBall" v-for="itmeX,indexX in itme.content.blue" v-if="itme.content.blue!=''">
					{{itmeX}}
				</text>
			</view>
			<view class="content_right">
				<uni-icons type="right" size="48rpx"></uni-icons>
			</view>
		</view>
	</view>
</template>
<script setup>
	import {onBeforeMount,ref,reactive} from 'vue';
	 import { useCounterStore } from '@/stores/counter';
	 const counter = useCounterStore(); //状态管理
	 const tic=reactive(['85','35','350133','04'])//接口参数(体彩)
	 const ticChinese=reactive(['大乐透','排列三','排列五','七星彩'])//接口参数对应的玩法(体彩)
	 
	 const fuli=reactive(['ssq','3d','kl8','qlc'])//接口参数(福利)
	 const fuliChinese=reactive(['双色球','福彩3D','快乐8','七乐彩'])//接口参数对应的玩法(福利)
	 
	 const ballArr=reactive({//格式化后的数据
		'大乐透':{
			'title':'大乐透',
			'content':[],
			'gameIndex':0,
			'time':'每周一,三,六,开奖'
			
			
		},
		'排列三':{
			'title':'排列三',
			'content':[],
			'gameIndex':1,
			'time':'每日开奖'
		},
		'排列五':{
			'title':'排列五',
			'content':[],
			'gameIndex':2,
			'time':'每日开奖'
		},
		'七星彩':{
			'title':'七星彩',
			'content':[],
			'gameIndex':3,
			'time':'每周二,四,日,开奖'
		},
		'双色球':{
			'title':'双色球',
			'content':[],
			'gameIndex':4,
			'time':'每日开奖'
		},
		'福彩3D':{
			'title':'福彩3D',
			'content':[],
			'gameIndex':5,
			'time':'每周二,四,日,开奖'
		},
		'七乐彩':{
			'title':'七乐彩',
			'content':[],
			'gameIndex':6,
			'time':'每日开奖'
		},
		'快乐8':{
			'title':'快乐8',
			'content':[],
			'gameIndex':7,
			'time':'每日开奖'
		},
	})
	
	
	const timeFunction=(title)=>{//是否显示今日开奖(获取当天日期后对比每个玩法的开奖时间并放回true/false)
		var l = ["日","一","二","三","四","五","六"];
		var d = new Date().getDay();
		var str = "星期" + l[d];//当天的日期(周)
		
		if(title=='福彩3D' || title=='七星彩'){
			var week=['星期二','星期四','星期日']
			var weekIndex=week.indexOf(str,0)
			if(weekIndex!=-1){
				return true
			}else{
				return false
			}
		}else if(title=='大乐透'){
			var week=['星期一','星期三','星期六']
			var weekIndex=week.indexOf(str,0)
			if(weekIndex!=-1){
				return true
			}else{
				return false
			}
		}else{
			return true
		}
		
	}
	const skit=(title)=>{
		uni.navigateTo({
			url:'/pages/score/score_shuzi/score_shuzi?title='+title
		})
	}
	 onBeforeMount(()=>{
		 timeFunction()
		var number=0
		uni.showLoading({
			title:'加载中~'
		})
		tic.forEach(function(itme,index){//获取体彩期数
			uni.request({//获取期数
				url:counter.baseUrl+'/api/bettingend.bet.Betinfo/getHistory',
				header:{
					'server':1,
					'ba-user-token':counter.access_token,
				},
				data:{				
					"gameNo":itme,
					"pageSize":"1",
					"pageNo": "1"
				},
				success(res){
					number++
					ballArr[ticChinese[index]].content=res.data.data.data[0]
					if(number==8){
						setBlue()
						uni.hideLoading()
					}
				}
			})
		})
		fuli.forEach(function(itme,index){//获取福利彩期数
			uni.request({//获取期数
				url:counter.baseUrl+'/api/bettingend.bet.Betinfo/GetWelfareKJ',
				header:{
					'server':1,
					'ba-user-token':counter.access_token,
				},
				data:{				
					"name":itme,
					"issueCount": "1",
					"issueStart": "",
					"issueEnd": "",
					"dayStart": "",
					"dayEnd": ""
				},
				success(res){
					number++
					ballArr[fuliChinese[index]].content=res.data.data.data[0]
					if(number==8){
						setBlue()
						uni.hideLoading()
					}
				}
			})
		})
		
	 })
	const setBlue=()=>{
		ballArr['大乐透'].content.blue=ballArr['大乐透'].content.lotteryDrawResult.slice(-2)//去除数组中最后两位添加到blue(大乐透)
		ballArr['大乐透'].content.lotteryDrawResult.splice(5,6)//取出后删除
	}
</script>
<style lang="scss">
	.card_content{
		align-items: center;
		display: flex;
		justify-content: space-between;
		margin:20rpx 0;
		.content_left{
			display: flex;
			max-width:620rpx;
			flex-wrap: wrap;
		}
	}
	.redBall{
		width:70rpx;
		height:70rpx;
		color:#fff;
		text-align: center;
		line-height:70rpx;
		background-color: #ff3333;
		font-weight: bold;
		border-radius:50%;
		margin:5rpx;
	}
	.buleBall{
		width:70rpx;
		height:70rpx;
		color: #fff;
		text-align: center;
		line-height:70rpx;
		background-color: #00a0f0;
		font-weight: bold;
		border-radius:50%;
		margin:5rpx;
	}
	.card_top{
		display: flex;
		align-items: center;
		justify-content: space-between;
		.top_left{
			color: #828282;
			.left_title{
				font-size:32rpx;
				font-weight:bold;
				color:black;
			}
		}
		.top_right{
			.label{
				padding:10rpx 20rpx;
				background-color:#f04b49;
				border-radius:10rpx;
				color: white;
				font-weight:bold;
				font-size:28rpx;
			}
		}
	}
	.card{
		width:680rpx;
		padding:20rpx;
		background-color:white;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		border-radius:15rpx;
		margin:20rpx 20rpx;
	}
</style>
