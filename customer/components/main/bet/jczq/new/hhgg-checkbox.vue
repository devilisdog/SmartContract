<template>
	<view class="yc-data-checkbox hhgg">
		<view class="checkbox">
			<view class="box"><!-- 胜平负 -->
				<view class="box" v-if="noshowgame('HAD')">
					<view class="check" v-for="item,index in styledata.value.spf.res" :key="index"
					:style="styledata.value.spf.style[index]==0?'':' background-color: red; color: #fff;'" @click="props.fixSelectData['HAD'][styledata.value.spf.keyArr[index]]==0?remindchange():change('spf',index,'HAD')">
						<view class="huadan">
							<view :class="noshowdan('HAD')?'inner-box1':''">
								<text v-show="noshowdan('HAD')" style="transform: scale(0.8);">单</text>
							</view>
							<view style="display: flex;flex-direction: row;align-items: center;">
								<text style="font-weight: bold;align-self:center;font-size:28rpx;">{{item}}</text>
								<text style="margin-left: 5px;align-self:center;font-size:26rpx;">
									{{props.fixSelectData['HAD'][styledata.value.spf.keyArr[index]]==0?'--':props.fixSelectData['HAD'][styledata.value.spf.keyArr[index]]}}
								</text>
								<text v-if="props.fixSelectData['HAD'][styledata.value.spf.keyArr[index]+'F']!=0" :style="props.fixSelectData['HAD'][styledata.value.spf.keyArr[index]+'F']>0?'color:red;':'color:green;'">
									{{props.fixSelectData['HAD'][styledata.value.spf.keyArr[index]+'F']>0?'↑':'↓'}}
								</text>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="check" style="flex: 1;">
					<view style="color: #999999;">未开售</view>
				</view>
			</view>
			<!-- 让球胜平负 -->
			<view class="box">
				<view class="box" v-if="noshowgame('HHAD')">
					<view class="check" v-for="item,index in styledata.value.rq.res" :key="index"
					:style="styledata.value.rq.style[index]==0?'':' background-color: red; color: #fff;'" @click="props.fixSelectData['HHAD'][styledata.value.spf.keyArr[index]]==0?remindchange():change('rq',index,'HHAD')">
						<view class="huadan">
							<view :class="noshowdan('HHAD')?'inner-box1':''">
								<text v-show="noshowdan('HHAD')" style="transform: scale(0.8);">单</text>
							</view>
							<view style="display: flex;flex-direction: row;">
								<text style="font-weight: bold;align-self:center;font-size:28rpx;">{{item}}</text>
								<text style="margin-left: 5px;align-self:center;font-size:26rpx;">
									{{props.fixSelectData['HHAD'][styledata.value.rq.keyArr[index]]==0?'--':props.fixSelectData['HHAD'][styledata.value.rq.keyArr[index]]}}
								</text>
							</view>
							<text v-if="props.fixSelectData['HHAD'][styledata.value.rq.keyArr[index]+'F']!=0" :style="props.fixSelectData['HHAD'][styledata.value.rq.keyArr[index]+'F']>0?'color:red;':'color:green;'">
								{{props.fixSelectData['HHAD'][styledata.value.rq.keyArr[index]+'F']>0?'↑':'↓'}}
							</text>
						</view>
					</view>
				</view>
				<view v-else class="check" style="flex: 1;">
					<view style="color: #999999;">
						未开售
					</view>
				</view>
			</view>
		</view>
		<view v-if="popupNumer==0" class="buttonbox" @click="openpopup">
			<text style="color: #999999;">混合</text>
			<text style="color: #999999;">选项</text>
		</view>
		<view v-if="popupNumer > 0" class="buttonbox" @click="openpopup" style="display: flex; flex-wrap: wrap;">
			<text style="color: #999999;">已选择
				<text style="color: #ff0000;">{{popupNumer}}</text>项
			</text>
		</view>
	</view>
	<!-- 混合选项弹出层 -->
	<uni-popup ref="hhggpopup" type="bottom" >
		<hhggallcheck :fixSelectData="props.fixSelectData" :styledata="styledata" @closeupup="closeupup" @getfixSelectData="change" @remind="remindchange"></hhggallcheck>
	</uni-popup>
</template>

<script setup>
	import hhggallcheck from "@/components/main/bet/jczq/hhgg-checkupup.vue"
	import {useCounterStore} from '@/stores/counter'
	import date from "/common/getdatetime.js"
	const counter = useCounterStore(); //状态管理
	import { ref,onBeforeMount,defineEmits,defineProps,reactive,watch,getCurrentInstance} from "vue"
	const {proxy,ctx} = getCurrentInstance()
	const props =defineProps(['Refresh','fixSelectData'])
	const emits =defineEmits(['getSelectList'])
	onBeforeMount(() => {
		init() //创建初始化
	})
	watch(() => props.Refresh, (oldval, newval) => {
		init()
	})
	const styledata = reactive({})
	const init=()=>{
		temporaryArr.value=''
		popupNumer.value=0
		// 字典
		var arr = {
			spf:{
				style:[0,0,0],
				res:['胜','平','负'],
				keyArr:['H','D','A']
			},
			rq:{
				style:[0,0,0],
				res:['让胜','让平','让负'],
				keyArr:['H','D','A']
			},
			jq:{
				style:[0,0,0,0,0,0,0,0],
				res:['0','1','2','3','4','5','6','7+'],
				keyArr:['S0','S1','S2','S3','S4','S5','S6','S7']
			},
			bqc:{
				style:[0,0,0,0,0,0,0,0,0],
				res:[
					'胜-胜','胜-平','胜-负',
					'平-胜','平-平','平-负',
					'负-胜','负-平','负-负'
				],
				keyArr:[
					'HH','HD','HA',
					'DH','DD','DA',
					'AH','AD','AA'
				]
			},
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
	const temporaryArr=ref('')
	const popupNumer=ref(0)
	const oneGameType=ref('')
	const change=(game,index,gameId)=>{
		if(counter.gameAstrict.AllowComplexPlay=='0'){//是否允许复杂无法拦截
			if(oneGameType.value==''){oneGameType.value=game}else{
				if(oneGameType.value!=game){
					return uni.showToast({title:'店主禁止复杂玩法咯~',icon:'none',position:'center'})
				}
			}
		}
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
				oneGameType.value=''
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
	const openpopup= ()=>{
		proxy.$refs.hhggpopup.open('bottom')
	}
	const closeupup= ()=>{
		proxy.$refs.hhggpopup.close('bottom')
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
	.inner-box1 text {
		position: absolute;
		left: 25%;
		bottom: -2px;
		color: #fff;
		transform: translateX(-50%);
	}
	
	.inner-box1 {
	
		width: 50%;
		height: 50%;
		background-color: red;
		transform: rotate(-45deg);
		position: absolute;
		left: -15%;
		top: -15%;
	}
	
	.huadan {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 100%;
		height: 100%;
		/* background-color: orange;    */
		overflow: hidden;
	}
	
	.check {
		flex:1;
		border-radius:10rpx;
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
	}
	
	.buttonbox {
		flex: 2;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius:10rpx;
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