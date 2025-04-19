<template>
	<!-- 胜平负 -->
	<view>
		<view class="yc-data-checkbox">
			<view class="checkbox ">
				<view class="box"><!-- 胜平负 -->
					<view class="box" v-if="noshowgame(0,'spf')">
						<view class="check" v-for="item,index in styledata.value.spf.res" :key="index"
						:style="styledata.value.spf.style[index]==0?'':' background-color: red; color: #fff;'" @click="change('spf',index,0)">
							<view class="huadan">
								<view :class="noshowdan(0)?'inner-box1':''">
									<text v-show="noshowdan(0)" style="transform: scale(0.8);">单</text>
								</view>
								<text style="font-weight: 700;font-size:28rpx;">{{item}}</text>
								<text style="margin-left: 5px;font-size:28rpx;">
									{{props.fixSelectData.spf[index]}}
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
				<view class="box"><!-- 让球胜平负 -->
					<view class="box" v-if="noshowgame(1)">
						<view class="check" v-for="item,index in styledata.value.rq.res" :key="index"
						:style="styledata.value.rq.style[index]==0?'':' background-color: red; color: #fff;'" @click="change('rq',index,1)">
							<view class="huadan">
							
								<view :class="noshowdan(1)?'inner-box1':''">
									<text v-show="noshowdan(1)"
										style="transform: scale(0.8);">单</text>
								</view>
								<text style="font-weight: 700;font-size:28rpx;">{{item}}</text>
								<text style="margin-left: 5px;font-size:28rpx;">
									{{props.fixSelectData.rq[index]}}
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
		</view>
	</view>
</template>

<script setup>
	import { 
		ref,
		onBeforeMount,
		defineEmits,
		defineProps,
		reactive,
		watch,
	} from "vue"
	import date from "/common/getdatetime.js"
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
		// 字典
		var arr = {
			spf:{
				style:[0,0,0],
				res:['胜','平','负'],
			},
			rq:{
				style:[0,0,0],
				res:['让胜','让平','让负'],
			}

		}
		styledata.value = arr
	}
	const deleteId = ref(props.fixSelectData.id)
	//*****暴露子组件方法 用以父组件调用
	defineExpose({init,deleteId})
	const temporaryArr=ref('')
	const change=(game,index,gameId)=>{
		var array = {
			'awayTeamAbbName': props.fixSelectData.short_away,
			'homeTeamAbbName': props.fixSelectData.short_home,
			'matchId': props.fixSelectData.id,
			'leagueAbbName': props.fixSelectData.short_comp,
			'matchNumStr': props.fixSelectData.issue_num,
			'gameDeadline' :date.getNowFormatDate(0,props.fixSelectData.match_time*1000),
			'orderDeadline':'',
			'sort' : props.fixSelectData.match_time,
			'data': [{
				'res': styledata.value[game].res[index],
				'rate': props.fixSelectData[game][index],
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
					'rate':props.fixSelectData[game][index],
					'poolEs':Number(noshowdan(gameId)),
					'gameState':game
				}
				temporaryArr.value.gameData.data.push(newOjd)
			}
			if(game=='rq'){temporaryArr.value.gameData['goal']=props.fixSelectData.rq.goalLine}//如果是让球玩法添加让球数值
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
			emits('getSelectList',temporaryArr.value)//最后把处理好的数据发给父页面
		}
	}
	
	const noshowdan =(id)=>{
		id=String(id)
		var res = props.fixSelectData.sell_status[id];
		if(res=='2'){
			return true
		}else{
			return false
		}
	}
	
	const noshowgame = (id,gameType) => {
		var res = props.fixSelectData.sell_status[id];
		if (res=='1'|| res=='2' || props.fixSelectData[gameType].length>1 || props.fixSelectData[gameType]['goalLine']) {
			return true
		} else {
			return false
		}
	}
	const openpopup= ()=>{
		proxy.$refs.hhggpopup.open('bottom')
	}
	const closeupup= ()=>{
		proxy.$refs.hhggpopup.close('bottom')
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