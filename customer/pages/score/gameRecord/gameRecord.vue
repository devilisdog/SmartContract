<template>
	<view style="background-color: #fff;height:var(--status-bar-height);" />
	<uni-nav-bar title="开奖公告" left-icon="back" @clickLeft="back"></uni-nav-bar>
	<view class="tabber">
		<view v-for="itme,index in tabData" :class="index==tabValue?'content_true':'content'" @click="clickTab(index)">
			<text>{{itme.title}}</text>
		</view>
	</view>
	
	<uni-collapse v-if="screenShow">
		<uni-collapse-item :title="screenData[screenValue].time+' 已结束'+(screenData[screenValue].win+screenData[screenValue].flat+screenData[screenValue].lose)+'场比赛'" >
			<scroll-view :scroll-y="true" style="max-height:380rpx;">
				<view  v-for="itme,index in screenData" :class="index==screenValue?'collapse_option_true':'collapse_option'" :key="index" @click="selectScreen(index)">
					<text>{{itme.time}} {{itme.week}}</text> 
					<text>已结束{{ itme.win+itme.flat+itme.lose}}</text>
					<text>场比赛 主队{{itme.win}}胜{{itme.flat}}平{{itme.lose}}负</text>
				</view>
			</scroll-view>
		</uni-collapse-item>
	</uni-collapse>
	
	<uni-collapse v-if="screenShowbiji">
		<uni-collapse-item :title="screenData[screenValue]+'北京单场'" >
			<scroll-view :scroll-y="true" style="max-height:380rpx;">
				<view  v-for="itme,index in screenData" :class="index==screenValue?'collapse_option_true':'collapse_option'" :key="index" @click="selectScreen(index)">
					<text>{{itme+'北京单场'}}</text> 
				</view>
			</scroll-view>
		</uni-collapse-item>
	</uni-collapse>
	
	<view class="content_title_box" v-if="gameCardShow && tabData[tabValue].title!='北京单场'">
		<view class="title_time">
			<uni-icons type="fire-filled" color="#ff6363"></uni-icons>
			<text> {{screenData[screenValue].time}} </text>
			<uni-icons type="fire-filled" color="#ff6363"></uni-icons>
		</view>
		<view class="title_victoryOrDefeat">
			<text>共</text>
			<text style="color: red;">
				{{screenData[screenValue].win+screenData[screenValue].flat+screenData[screenValue].lose}}
			</text>
			<text>场</text>
			<text>(主队</text>
			<text style="color: red;">{{screenData[screenValue].win}}</text>
			<text>胜</text>
			<text style="color: red;">{{screenData[screenValue].lose}}</text>
			<text>负</text>
			<text style="color: red;">{{screenData[screenValue].flat}}</text>
			<text>平)</text>
		</view>
	</view>
	
	<view class="game_card" v-for="itme,index in gameData.allData" v-if="gameCardShow">
		<view class="card_top">
			<text class="top_left">{{itme.short_comp!=undefined?itme.short_comp:itme.comp}} {{itme.issue_num}}</text>
			<view class="top_right">
				<text>{{itme.short_home!=undefined?itme.short_home:itme.home}}</text>
				<text style="color: red;" v-if="itme.half_home_score!=null || itme.half_home_score!=undefined "> 
					{{" "+itme.home_score+':'+itme.away_score+"("+itme.half_home_score+':'+itme.half_away_score+") "}} 
				</text>
				<text style="color: red;" v-else>
					{{" "+itme.home_score+':'+itme.away_score+' '}} 
				</text>
				<text>{{itme.short_away!=undefined?itme.short_away:itme.away}}</text>
			</view>
		</view>
		<view class="card_content" :style="{'grid-template-columns':gameData.comparison.abbreviation.length<5?'repeat(4,auto)':'repeat(5,auto)'}">
			<view 
				style="text-align: center;color:#4c4c4c;border-right:1rpx solid white;" 
				v-for="itmeX,indexX in gameData.comparison.abbreviation"
				v-if="tabData[tabValue].title!='北京单场'"
				>
				<view style="padding:5rpx 8rpx;background-color:#d0d0d0" >
					<text>{{gameData.comparison.str[indexX]}}</text>
					<text v-show="itme[itmeX].concede!=undefined">({{itme[itmeX].concede}})</text>
				</view>
				<view style="background-color:#ebebeb;height:90rpx;">
					<text style="color:red;">{{itme[itmeX].result==undefined?'-':itme[itmeX].result}}</text><br>
					<text>{{itme[itmeX].lv==undefined?'-':itme[itmeX].lv}}</text>
				</view>
			</view>
			<view
				style="text-align: center;color:#4c4c4c;border-right:1rpx solid white;" 
				v-for="itmeX,indexX in gameData.comparison.abbreviation"
				v-else
				>
				<view style="padding:5rpx 8rpx;background-color:#d0d0d0" >
					<text>{{gameData.comparison.str[indexX]}}</text>
				</view>
				<view style="background-color:#ebebeb;height:90rpx;">
					<text style="color:red;">
						{{itme.newOdds[itmeX].result}}
					</text><br>
					<text>{{itme.newOdds[itmeX].sp}}</text>
				</view>
			</view>
		</view>
	</view>
	
	<view class="sfcCard" v-for="itme,index in gameData" v-else>
		<view class="sfc_top">
			<text class="sfc_title">第{{itme.issue}}期</text>
		</view>
		<view class="sfc_content">
			<view class="sfc_content_left">
				<text class="sfc_numbrt" v-for="itmeX,indexX in itme.result">{{itmeX}}</text>
			</view>
			<view class="sfc_content_right">
				<uni-icons type="right" size="32rpx"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {onPageScroll,onReachBottom} from "@dcloudio/uni-app"
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		getCurrentInstance,
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	import { useCounterStore} from '@/stores/counter';
	const counter = useCounterStore(); //状态管理
	// const tabData=reactive(['竞彩足球','竞彩篮球','北京单场','胜负彩'])
	// onPageScroll((e)=>{
	// 	console.log('123',e);
	// })
	const bottomValue=ref(1)
	onReachBottom(()=>{
		if(tabValue.value==2){
			bottomValue.value++
			getData_beij()
		}else if(tabValue.value==3){
			bottomValue.value++
			GetgameData_tic()
		}
	})
	
	const tabData=reactive([//toptab数据
		{
			title:'竞彩足球',
			value:'1',
			type:'0',
			tabStr:'jczq'
		},
		{
			title:'竞彩篮球',
			value:'2',
			type:'0',
			tabStr:'jclq'
		},
		{
			title:'北京单场',
			value:'3',
			type:'0',
			tabStr:'0'
		},
		{
			title:'胜负彩',
			value:'0',
			type:'sfc',
			tabStr:'0'
		},
		
	])
	const tabValue=ref(1)//toptab默认选择值(index)
	
	const screenData=ref([])//时间筛选数据
	const screenValue=ref(0)//筛选默认值
	
	const screenShow=ref(false)//时间筛选显示控制
	const gameCardShow=ref(false)//比赛卡片显示控制
	const screenShowbiji=ref(false)//
	
	const gameData=ref([])//比赛数据
	const playingComparisonTable=reactive(['spf','rq','bf','jq','bqc','sf','rf','dxf','sfc','sxp'])
	const playingComparisonTableStr=reactive(
		['胜平负','让球','比分','总进球','半全场','胜负','让分','大小分','胜分差','上下单双']
	)
	
	
	const dictionaries=reactive({//赛果字典//比赛中的玩法简称对应index的中文
		'0':'负',
		'1':'平',
		'3':'胜'
	})
	
	onBeforeMount(()=>{
		GetTabData()
	})
	const clickTab=(index)=>{//点击toptab却换
		if(tabValue.value!=index){
			tabValue.value=index
			//却换tab初始化
			gameCardShow.value=false//筛选显示控制
			screenShow.value=false
			screenData.value.length=0
			screenShowbiji.value=false
			bottomValue.value=1
			if(tabValue.value==0 || tabValue.value==1){
				GetTabData()
			}else if(tabValue.value==3){
				GetgameData_tic()
			}else{
				getData_beij()
			}
		}
	}
	const GetTabData=()=>{//获取筛选tab数据(体彩)
		if(tabValue.value==2 || tabValue.value==3){return}
		uni.request({
			url:counter.baseUrl+'/api/bettingend.score.scoreData/getResultCount',
			header:{
				'server':1,
				'ba-user-token':counter.access_token
			},
			data:{
				"type":tabData[tabValue.value].tabStr
			},
			success(res){
				screenData.value=ScreenDataDispose(res.data.data)
				screenShow.value=true
				GetgameData_tic()
			}
		})
	}
	
	const getData_beij=()=>{
		uni.request({//获取筛选tab数据
			url:counter.baseUrl+'/api/bettingend.score.scoreData/getResult',
			header:{
				'server':1,
				'ba-user-token':counter.access_token
			},
			data:{
				"type":'3',
				"zctype":'0',
				"time":'',
				"per_page": bottomValue.value+"0",
				"current_page": "1"
			},
			success(res){
				var initData=Object.entries(res.data.data)
				initData.forEach(function(itme,index){
					screenData.value.push(itme[0])
				})
				screenShowbiji.value=true//北京单场筛选显示
				gameDataDispose(initData[screenValue.value][1]['data'])
				gameCardShow.value=true//筛选显示控制
			}
		})
	}
	
	const GetgameData_tic=()=>{//获取比赛数据
		uni.request({//获取筛选tab数据
			url:counter.baseUrl+'/api/bettingend.score.scoreData/getResult',
			header:{
				'server':1,
				'ba-user-token':counter.access_token
			},
			data:{
				"type":tabData[tabValue.value].value,
				"zctype":tabData[tabValue.value].type,
				"time":screenData.value==''?'':screenData.value[screenValue.value].time,
				"per_page": bottomValue.value+"5",
				"current_page": "1"
			},
			success(res){
				if(tabValue.value!=3){
					var initData=res.data.data
					initData.sort(sortBy('issue_num',1))//数据排序
					gameData.value=initData
					gameDataDispose(initData)
					gameCardShow.value=true//筛选显示控制
				}else{
					var initData=res.data.data.data
					initData.forEach(function(itme,index){
						itme.result=itme.result.split(',')
					})
					gameData.value=initData
					// gameDataDispose(initData)
					
				}
			}
		})
	}
	
	
	const gameDataDispose=(data)=>{//比赛数据处理
		var initData=data
		var newData={
			'comparison':{
				'abbreviation':[],
				'str':[]
			},
			'allData':[]
		}
		playingComparisonTable.forEach(function(itme,index){
			if(tabData[tabValue.value].title=='北京单场'){
				if(JSON.parse(initData[0].odds)[itme]!=null && JSON.parse(initData[0].odds)[itme]!=undefined){
					newData['comparison']['abbreviation'].push(itme)
					newData['comparison']['str'].push(playingComparisonTableStr[index])
				}
			}else{
				if(initData[0][itme]!=null && initData[0][itme]!=undefined){
					newData['comparison']['abbreviation'].push(itme)
					newData['comparison']['str'].push(playingComparisonTableStr[index])
				}
			}
			
		})
		
		if(tabData[tabValue.value].title=='北京单场'){
			initData.forEach(function(itme,index){
				itme.newOdds=JSON.parse(itme.odds)
				//数据合并
				var newBf={
					result:itme.newOdds.bf.rb1,
					sp:itme.newOdds.bf.sp
				}
				itme.newOdds.bf=newBf
				
				var newBqc={
					result:dictionaries[itme.newOdds.bqc.rb1]+'-'+dictionaries[itme.newOdds.bqc.rb2],
					sp:itme.newOdds.bqc.sp
				}
				itme.newOdds.bqc=newBqc
				var newJq={
					result:itme.newOdds.jq.rb1,
					sp:itme.newOdds.jq.sp
				}
				itme.newOdds.jq=newJq
				
				var newSpf={
					result:itme.newOdds.spf.rb1+dictionaries[itme.newOdds.spf.rb2],
					sp:itme.newOdds.spf.sp
				}
				itme.newOdds.spf=newSpf
				
				var SxpValue={
					'4':'上',
					'5':'下',
					'6':'单',
					'7':'双'
				}
				var newSxp={
					result:SxpValue[itme.newOdds.sxp.rb1]+SxpValue[itme.newOdds.sxp.rb2],
					sp:itme.newOdds.sxp.sp
				}
				itme.newOdds.sxp=newSxp
				newData['allData'].push(itme)
			})
			gameData.value=newData
			return
		}
		initData.forEach(function(itme,index){
			var oneData=itme//当前场次完整数据
			newData['comparison']['abbreviation'].forEach((itmeX,indexX)=>{
				//数据拆分
				if(itmeX=='spf'){//胜平负
					if(oneData[itmeX]==''){return}
					var initNumber=String(oneData[itmeX])
					var newSpf={
						'result':dictionaries[initNumber.split(',')[0]],
						'lv':initNumber.split(',')[1]
					}
					
					oneData[itmeX]=newSpf
				}else if(itmeX=='rq'){//让球
					if(oneData[itmeX]==''){return}
					var initNumber=String(oneData[itmeX])
					var newSpf={
						'result':dictionaries[initNumber.split(',')[1]],
						'lv':initNumber.split(',')[2],
						'concede':initNumber.split(',')[0],
					}
					oneData[itmeX]=newSpf
				}else if(itmeX=='bf'){//比分
					if(oneData[itmeX]==''){return}
					var initNumber=String(oneData[itmeX])
					var newSpf={
						'result':initNumber.split(',')[0],
						'lv':initNumber.split(',')[1]
					}
					oneData[itmeX]=newSpf
				}else if(itmeX=='jq'){//总进球
					if(oneData[itmeX]==''){return}
					var initNumber=String(oneData[itmeX])
					var newSpf={
						'result':initNumber.split(',')[0],
						'lv':initNumber.split(',')[1]
					}
					oneData[itmeX]=newSpf
				}else if(itmeX=='bqc'){//半全场
					if(oneData[itmeX]==''){return}
					var initNumber=String(oneData[itmeX])
					var newSpf={
						'result':dictionaries[initNumber.split(',')[0]]+'-'+dictionaries[initNumber.split(',')[1]],
						'lv':initNumber.split(',')[2]
					}
					oneData[itmeX]=newSpf
				}else if(itmeX=='sf'){//胜负
					if(oneData[itmeX]==''){return}
					var initNumber=String(oneData[itmeX])
					var newSpf={
						'result':dictionaries[initNumber.split(',')[0]],
						'lv':initNumber.split(',')[1]
					}
					oneData[itmeX]=newSpf
				}else if(itmeX=='rf'){//让分胜负
					if(oneData[itmeX]==''){return}
					var initNumber=String(oneData[itmeX])
					var newSpf={
						'result':dictionaries[initNumber.split(',')[1]],
						'lv':initNumber.split(',')[2],
						'concede':initNumber.split(',')[0],
					}
					oneData[itmeX]=newSpf
				}else if(itmeX=='dxf'){//大小分
					if(oneData[itmeX]==''){return}
					var initNumber=String(oneData[itmeX])
					var newSpf={
						'result':initNumber.split(',')[1]=='0'?'小':'大',
						'lv':initNumber.split(',')[2],
						'concede':initNumber.split(',')[0],
					}
					oneData[itmeX]=newSpf
				}else if(itmeX=='sfc'){//胜分差
					if(oneData[itmeX]==''){return}
					var initNumber=String(oneData[itmeX])
					var newArr=[
						'主1-5','客1-5',
						'主6-10','客6-10',
						'主11-15','客11-15',
						'主16-20','客16-20',
						'主21-25','客21-25',
						'主26+','客26+'
					]
					var newSpf={
						'result':newArr[initNumber.split(',')[0]],
						'lv':initNumber.split(',')[1],
					}
					oneData[itmeX]=newSpf
				}
			})
			newData['allData'].push(oneData)
		})
		gameData.value=newData
	}
	
	
	
	const selectScreen=(index)=>{//筛选选择切换参数
		if(index!=screenValue.value){
			screenValue.value=index
			bottomValue.value=1
			if(tabValue.value==0 || tabValue.value==1 || tabValue.value==3){
				GetgameData_tic()
			}else{
				getData_beij()
			}
		}
	}
	
	const ScreenDataDispose=(data)=>{//screen数据格式化处理并添加week
		var newData=[]
		var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];//星期对照表
		var initData=Object.entries(data)//将对象转为数组
		initData.forEach(function(itme,index){
			var date= new Date(itme[1].time)//拿到时间时间转为时间戳
			var newDay = date.getDay();// 获取今天是一周中的第几天
			var arr={
				'time':itme[1].time,
				'win':itme[1].win,
				'flat':itme[1].flat,
				'lose':itme[1].lose,
				'week':weekDay[newDay],
				'allNumber':itme[1].win+itme[1].flat+itme[1].lose
				
			}
			newData.push(arr)
		})
		return newData
	}
	
	function sortBy(attr,rev){//二维数组排序
		//attr参照键值
		//rev最小值
	    if( rev==undefined ){ rev=1 }else{ (rev)?1:-1; }
	    return function (a,b){
	        a=a[attr];
	        b=b[attr];
	        if(a<b){ return rev*-1}
	        if(a>b){ return rev* 1 }
	        return 0;
	    }
	}
	const back=()=>{//返回
		uni.navigateBack()
	}
</script>

<style lang="scss">
	.sfcCard{
		width:100%;
		padding:20rpx;
		border-radius:15rpx;
		background-color:white;
		border-bottom:1rpx solid #ebebeb;
		box-sizing: border-box;
		.sfc_content{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top:20rpx;
			.sfc_content_left{
				max-width:680rpx;
				.sfc_numbrt{
					background-color:red;
					padding:5rpx 10rpx;
					margin:0rpx 5rpx;
					border-radius:5rpx;
					color:white;
				}
			}
		}
		.sfc_top{
			display: flex;
			align-items: center;
			justify-content:space-between;
			.sfc_title{
				font-size:32rpx;
				font-weight: bold;
			}
			.sfc_time{
				font-size:26rpx;
				color: #919191;
			}
		}
	}
	.collapse_option{
		width: 100%;
		padding:20rpx 30rpx;
		box-sizing: border-box;
		text{
			font-size:26rpx;
		}
	}
	.collapse_option_true{
		width: 100%;
		padding:20rpx 30rpx;
		box-sizing: border-box;
		background-color:#519a67;
		border-radius:20rpx;
		color:white;
		text{
			font-size:26rpx;
		}
	}
	.game_card{
		width:100%;
		padding:20rpx;
		box-sizing: border-box;
		border-bottom:1rpx solid #ebebeb;
		.card_content{
			display: grid;
			grid-template-columns: repeat(5,auto);
			grid-template-rows: repeat(auto,142rpx);
		}
		.top_right{
			text{
				font-size:32rpx;
			}
		}
		.top_left{
			color:#919191;
		}
		.card_top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin:10rpx 0rpx;
		}
	}
	.content_title_box{
		width:100%;
		display: flex;
		justify-content: center;
		padding:30rpx 0rpx;
		flex-flow: column;
		align-items: center;
		.title_time{
			text{
				font-size:34rpx;
				font-weight:bold;
			}
		}
		.title_victoryOrDefeat{
			color: #919191;
		}
	}
	.time_box{
		width:100%;
		padding:10rpx;
		box-sizing: border-box;
		border-bottom:1rpx solid #ebebeb;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.tabber{
		background-color: #ebebeb;
		padding:10rpx;
		box-sizing: border-box;
		font-weight: bold;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.content{
			padding:5rpx 30rpx;
			border-radius:10rpx;
			transition: all 0.3s;
			color:#919191;
			text{
				font-size:32rpx;
			}
		}
		.content_true{
			background-color:white;
			padding:5rpx 30rpx;
			border-radius:10rpx;
			transition: all 0.3s;
			text{
				font-size:32rpx;
			}
		}
	}
</style>
