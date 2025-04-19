<template>
	<!-- 混合过关 -->
	<view class="yc-data-checkbox" style="height: 225rpx;margin:20rpx;">
		<view class="checkbox">
			<view class="box"><!-- 胜负 -->
				<view style="display:flex;background-color: #dfdfdf;">
					<text style="align-self:center;width: 25rpx;border-bottom:1rpx solid #fff;">胜负</text>
				</view>
				<view v-if="noshowgame(0,'sf')" class="check" :style="styledata.value.sf.style[index]==0?'':' background-color: red; color: #fff;'"
					v-for="item,index in styledata.value.sf.res" @click="change('sf',index,0)">
					<view class="huadan" style="display: flex;">
						<view :class="noshowdan(0)?'inner-box1':''">
							<text v-show="noshowdan(0)"
								style="transform: scale(0.8);">单</text>
						</view>
						<text style="font-weight: 700;font-size:28rpx;">{{item}}</text>
						<text style="margin-left: 5px;align-self:center;font-size:26rpx;">
							{{props.fixSelectData.sf[index]}}
						</text>
					</view>
				</view>
				<view v-else class="check" style="flex: 1;">
					<view style="color: #999999;">
						未开售
					</view>
				</view>
			</view>
			<view class="box"><!-- 让分 -->
				<view style="display:flex;background-color: #dfdfdf;">
					<text :style="props.fixSelectData.rf.goalLine<0?'color:green':'color:red'" style="align-self:center;width: 25rpx;border-bottom:1rpx solid #fff;">让分</text>
				</view>
				<view v-if="noshowgame(1,'rf')" class="check" :style="styledata.value.rf.style[index]==0?'':' background-color: red; color: #fff;'"
					v-for="item,index in styledata.value.rf.res" @click="change('rf',index,1) "
					>
					<view class="huadan" style="display: flex;flex-direction: column;">
						<view :class="noshowdan(1)?'inner-box1':''">
							<text v-show="noshowdan(1)"
								style="transform: scale(0.8);">单</text>
						</view>
						<view style="display: flex;flex-direction: row;">
							<text style="font-weight: 700;font-size:28rpx;">{{item}}
								<text v-if="index==1" :style="styledata.value.rf.style[index]!=0?'color:#ffffff':props.fixSelectData.rf.goalLine<0?'color:green':'color:red'">({{props.fixSelectData.rf.goalLine}})
								</text>
							</text>
						</view>
						<view class="" style="display: flex;flex-direction: row;">
							<text style="margin-left: 5px;font-size:26rpx;">
								{{props.fixSelectData.rf[index]}}
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
			<view class="box"><!-- 大小分 -->
				<view style="display:flex;background-color: #dfdfdf;">
					<text style="align-self:center;width: 25rpx;">总分</text>
				</view>
				<view v-if="noshowgame(2,'dxf')" class="check" :style="styledata.value.dxf.style[index]==0?'':' background-color: red; color: #fff;'"
					v-for="item,index in styledata.value.dxf.res" @click="change('dxf',index,2)">
					<view class="huadan" style="display: flex;flex-direction: column;">
						<view :class="noshowdan(2)?'inner-box1':''">
							<text v-show="noshowdan(2)"
								style="transform: scale(0.8);">单</text>
						</view>
						<text style="font-weight: 700;font-size:28rpx;">
							{{item}}{{(props.fixSelectData.dxf.goalLine)-0}}
						</text>
						<view class="" style="display: flex;flex-direction: row;">
							<view style="display: flex;align-self:center;">
								<text style="margin-left: 5px;font-size:26rpx;">
									{{props.fixSelectData.dxf[index]}}
								</text>
							</view>
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
		<view v-if="popupNumer === 0" class="buttonbox" @click="openpopup" style="flex: 1;">
			<text style="align-self:center;width: 25rpx;color: #999999;">更多玩法</text>
		</view>
		<view v-if="popupNumer > 0" class="buttonbox" @click="openpopup" style="flex: 1;">
			<text style="color: #999999;align-self:center;width: 25rpx">已选择
				<text style="color: #ff0000;">{{popupNumer}}</text>项
			</text>
		</view>
	</view>
	<!-- 混合选项弹出层 -->
	<uni-popup ref="hhggpopup" type="bottom">
		<hhggallcheck :fixSelectData="props.fixSelectData" :styledata="styledata" @closeupup="closeupup" @getfixSelectData="change"></hhggallcheck>
	</uni-popup>
</template>

<script setup>
	import hhggallcheck from "@/components/main/bet/jclq/hhgg-checkupup.vue"
	import date from "@/common/getdatetime.js"
	import {useCounterStore} from '@/stores/counter'
	import { 
		ref,
		onBeforeMount,
		defineEmits,
		defineProps,
		reactive,
		watch,
		getCurrentInstance
	} from "vue"
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const props =defineProps(['Refresh','fixSelectData'])
	const emits =defineEmits(['getSelectList'])
	onBeforeMount(() => {
		init() //创建初始化
	})
	const oneGameType=ref('')//第一次玩法存储，以便判断复杂玩法
	const change=(game,index,gameid)=>{
		if(counter.gameAstrict.AllowComplexPlay=='0'){//是否允许复杂无法拦截
			if(oneGameType.value==''){oneGameType.value=game}else{
				if(oneGameType.value!=game){
					return uni.showToast({title:'店主禁止复杂玩法咯~',icon:'none',position:'center'})
				}
			}
		}
		var array = {
			'awayTeamAbbName': props.fixSelectData.short_away,
			'homeTeamAbbName': props.fixSelectData.short_home,
			'matchId': props.fixSelectData.id,
			'leagueAbbName': props.fixSelectData.short_comp,
			'matchNumStr': props.fixSelectData.issue_num,
			'gameDeadline' :date.getNowFormatDate(0,props.fixSelectData.match_time*1000),
			'orderDeadline':'',
			'sort' :props.fixSelectData.match_time,
			'complex' :complex.value ,
			'data': [{
				'res': styledata.value[game].res[index],//选择的玩法
				'rate': props.fixSelectData[game][index],//玩法赔率
				'poolEs':Number(noshowdan(gameid)),//判断是否是单关
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
					'res': styledata.value[game].res[index],
					'rate':props.fixSelectData[game][index],
					'poolEs':Number(noshowdan(gameid)),
					'gameState':game
				}
				temporaryArr.value.gameData.data.push(newOjd)
			}
			if(game=='rf'){temporaryArr.value.gameData['goal']=props.fixSelectData.rf['goalLine']}//如果是让球玩法添加让球数值
			if(game=='dxf'){temporaryArr.value.gameData['size']=props.fixSelectData.dxf['goalLine']}//如果是大小分玩法添加让球数值
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
				oneGameType.value=''
			}else{//否则删除取消选择用户点击的玩法
				var Delindex = temporaryArr.value.gameData.data.findIndex(item =>item.res == styledata.value[game].res[index])
				temporaryArr.value.gameData.data.splice(Delindex,1)
				if(game=='rf'){//如果用户取消让球玩法就删除让球数值
					var isGoal=false//删除后是否还有让胜玩法
					var isSize=false//删除后是否还有大小分玩法
					for(var i=0;i<temporaryArr.value.gameData.data.length;i++){//循环判断是否还有让球玩法
						var booleIndex_goal=styledata.value.rf.res.indexOf(temporaryArr.value.gameData.data[i].res)
						if(booleIndex_goal != -1){isGoal=true;break}
					}
					if(!isGoal){delete temporaryArr.value.gameData['goal']}
				}
				if(game=='dxf'){
					var isSize=false//删除后是否还有大小分玩法
					for(var i=0;i<temporaryArr.value.gameData.data.length;i++){//循环判断是否还有让球玩法
						var booleIndex_size=styledata.value.rf.res.indexOf(temporaryArr.value.gameData.data[i].res)
						if(booleIndex_size != -1){isSize=true;break}
					}
					if(!isSize){delete temporaryArr.value.gameData['size']}
				}
			}
			popupNumer.value--
			emits('getSelectList',temporaryArr.value)//最后把处理好的数据发给父页面
		}
	}
	watch(() => props.Refresh, (oldval, newval) => {//监听删除
		init()
	})
	const styledata = reactive({})
	const init=()=>{
		temporaryArr.value=''
		popupNumer.value=0
		var arr = {// 字典
			sf:{
				style:[0,0],
				res:['客胜','主胜'],
			},
			rf:{
				style:[0,0],
				res:['让分客胜','让分主胜'],
			},
			dxf:{
				style:[0,0],
				res:['大','小'],
			},
			sfc:{
				style:[0,0,0,0,0,0,0,0,0,0,0,0],
				res:['客胜1~5','客胜6~10','客胜11~15','客胜16~20','客胜21~25','客胜26+','主胜1~5','主胜6~10','主胜11~15','主胜16~20','主胜21~25','主胜26+'],
			},
			
		}
		styledata.value = arr
	}
	const deleteId = ref(props.fixSelectData.id)
	//*****暴露子组件方法 用以父组件调用
	defineExpose({init,deleteId})
	const complex = ref([
		{
			name:'mnl',
			value:0,
		},
		{
			name:'hdc',
			value:0,
		},
		{
			name:'hilo',
			value:0,
		},
		{
			name:'wnm',
			value:0,
		},
	])


	const temporaryArr=ref('')
	const popupNumer=ref(0)
	const noshowdan =(id)=>{//判断是否是单关
		var res = props.fixSelectData.sell_status[id];
		if(res=='2' || id==3){
			return true
		}else{
			return false
		} 
	}
	const noshowgame = (id,gameType) => {//判断玩法开关
		var res = props.fixSelectData.sell_status[id];
		if (res=='1'|| res=='2' || props.fixSelectData[gameType].length>1 || props.fixSelectData[gameType]['goalLine']) {
			return true
		}else{
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