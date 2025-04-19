<template>
	<!-- 比分 -->
	<view class="yc-data-checkbox">
		<view class="checkbox ">
			<view class="box">
				<view class="box" v-if="noshowgame('CRS')">
					<view class="buttonboxx" v-show="popupNumer === 0" @click="openpopup">
						<text class="button" style="color: #ff0000; ">点击选择比分</text>
					</view>
					<view class="buttonboxx" v-show="popupNumer > 0" @click="openpopup">
						<text class="button" style="color: #ff0000; ">已选择{{popupNumer}}项</text>
					</view>
				</view>
				<view v-else class="check" style="flex: 1;">
					<view style="color: #999999;">未开售</view>
				</view>
			</view>
			<uni-popup ref="crspopup" type="bottom" >
				<crscheck 
					:fixSelectData="props.fixSelectData" 
					:styledata="styledata" 
					@closeupup="closeupup" 
					@getfixSelectData="change"
					@remind="remindchange"
					>
				</crscheck>
			</uni-popup>
		</view>
	</view>
</template>

<script setup>
	import date from "/common/getdatetime.js"
	import crscheck from "@/components/main/bet/jczq/crs-checkupup.vue"
	import {
		ref,
		onBeforeMount,
		defineEmits,
		defineProps,
		reactive,
		watch,
		getCurrentInstance,
	} from "vue"
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const props = defineProps(['Refresh', 'fixSelectData'])
	const emits = defineEmits(['getSelectList'])
	onBeforeMount(() => {
		init() //创建初始化
	})

	watch(() => props.Refresh, (oldval, newval) => {
		init()
	})
	const styledata = reactive({})
	const init = () => {
		temporaryArr.value=''
		popupNumer.value=0
		var arr = {// 字典
			bf:{
				style:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				res:[
					'1:0','2:0','2:1','3:0',
					'3:1','3:2','4:0','4:1',
					'4:2','5:0','5:1','5:2',
					'胜其它',
					'0:0','1:1','2:2','3:3',
					'平其它',
					'0:1','0:2','1:2','0:3',
					'1:3','2:3','0:4','1:4',
					'2:4','0:5','1:5','2:5',
					'负其它'
					],
				keyArr:[
					'S01S00','S02S00','S02S01','S03S00',
					'S03S01','S03S02','S04S00','S04S01',
					'S04S02','S05S00','S05S01','S05S02',
					'S1SH',
					'S00S00','S01S01','S02S02','S03S03',
					'S1SD',
					'S00S01','S00S02','S01S02','S00S03',
					'S01S03','S02S03','S00S04','S01S04',
					'S02S04','S00S05','S01S05','S02S05',
					'S1SA'
				]
			}
		}
		styledata.value = arr
	}
	const deleteId = ref(props.fixSelectData.MatchId)
	//*****暴露子组件方法 用以父组件调用
	defineExpose({init,deleteId})
	
	const temporaryArr=ref('')//临时存储数据
	const popupNumer=ref(0)
	const change=(game,index,gameId)=>{
		var array = {
			'awayTeamAbbName': props.fixSelectData.AwayTeamAbbName,
			'homeTeamAbbName': props.fixSelectData.HomeTeamAbbName,
			'matchId': props.fixSelectData.MatchId,
			'leagueAbbName': props.fixSelectData.LeagueAbbName,
			'matchNumStr': props.fixSelectData.MatchNum,
			'gameDeadline' :props.fixSelectData.MatchDate+' '+props.fixSelectData.MatchTime,
			'orderDeadline':'',
			'sort' : props.fixSelectData.shopSetExpiration,
			'data': [{
				'res': styledata.value[game].res[index],
				'rate':props.fixSelectData[gameId][styledata.value[game].keyArr[index]],
				'poolEs':Number(noshowdan(gameId)),
				'gameState':game
			}],
		}
		if(styledata.value[game].style[index]==0){//添加
			styledata.value[game].style[index] = 1
			if(temporaryArr.value==''){//如果是第一次选择直接添加进去
				var ojb={
					gameData:array,
					selectBoole:true,//判断是否取消整场比赛
				}
				temporaryArr.value=ojb
			}else{//否则只添加玩法进去
				temporaryArr.value.selectBoole=true
				var newOjd={
					'res':styledata.value[game].res[index],
					'rate':props.fixSelectData[gameId][styledata.value[game].keyArr[index]],
					'poolEs':Number(noshowdan(gameId)),
					'gameState':game
				}
				temporaryArr.value.gameData.data.push(newOjd)
			}
			if(game=='rq'){temporaryArr.value.gameData['goal']=props.fixSelectData['HHAD'].GoalLine}//如果是让球玩法添加让球数值
			popupNumer.value++
			emits('getSelectList',temporaryArr.value)//最后把处理好的数据发给父页面
		}else{//删除
			styledata.value[game].style[index] = 0
			if(temporaryArr.value.gameData.data.length==1){//当只有一个的情况下直接全部删除
				array.data=[]//清空已选择玩法
				var ojb={
					gameData:array,
					selectBoole:false,
				}
				temporaryArr.value=ojb
			}else{//否则删除取消选择用户点击的玩法
				var Delindex = temporaryArr.value.gameData.data.findIndex(item =>item.res == styledata.value[game].res[index])
				temporaryArr.value.gameData.data.splice(Delindex,1)
				if(game=='rq'){//如果用户取消让球玩法就删除让球数值
					var isGoal=false
					for(var i=0;i<temporaryArr.value.gameData.data.length;i++){//循环判断是否还有让球玩法
						var booleIndex=styledata.value.rq.res.indexOf(temporaryArr.value.gameData.data[i].res)
						if(booleIndex != -1){isGoal=true;break}
					}
					if(!isGoal){
						delete temporaryArr.value.gameData['goal']
					}
				}
			}
			popupNumer.value--
			emits('getSelectList',temporaryArr.value)//最后把处理好的数据发给父页面
		}
	}
	const noshowdan =(id)=>{
		if(props.fixSelectData.PoolList[id] && props.fixSelectData.PoolList[id].BettingSingle==1){
			return true
		}
		return false
	}
	const noshowgame = (gameType) => {
		if(props.fixSelectData.PoolList[gameType]){
			return true
		}
		return false
	}

	const openpopup = () => {
		proxy.$refs.crspopup.open('bottom')
	}
	const closeupup = () => {
		proxy.$refs.crspopup.close('bottom')
	}
	const remindchange=()=>{
		uni.showToast({
			title: '未开售',
			position: 'center',
			icon: 'none'
		})
	}
</script>


<style>
	.buttonboxx {
		display: flex;
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
		/* 边框 */
		/* border: 1rpx solid #edf0f3;
	  -webkit-box-sizing: border-box; 
	  box-sizing: border-box; */
	}



	.check {
		flex: 1;

		display: flex;
		justify-content: center;
		align-items: center;



		/* 边框 */
		border: 3rpx solid #edf0f3;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}

	.box {

		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		text-align: center;


	}

	text {
		margin: 1px;
		font-size: 20rpx;

		text-align: center;
	}

	.button {
		height: 80rpx;
		width: 100%;
		color: #ff0000;
		font-size: 26rpx;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;

		/* 边框 */
		
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		border-radius:10rpx;
	}

	.buttonbox {
		flex: 2;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		/* 边框 */
		border: 1rpx solid #edf0f3;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}

	.buttonboxx {
		display: flex;
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
		/* 边框 */
		/* border: 1rpx solid #edf0f3;
	  -webkit-box-sizing: border-box; 
	  box-sizing: border-box; */
	}

	.checkbox {
		flex: 8;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		/* 边框 */
		/* border: 1rpx solid #edf0f3;
	  -webkit-box-sizing: border-box; 
	  box-sizing: border-box; */
	}

	.yc-data-checkbox {
		margin: 5px;
		height: 150rpx;
		display: flex;
		flex-direction: row;
		text-align: center;
	}
</style>
