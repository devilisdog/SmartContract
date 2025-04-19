<template>
	<!-- 比分 -->
	<view class="yc-data-checkbox">
		<view class="checkbox ">
			<view class="box">
				<view class="box" v-if="noshowgame(2,'bf')">
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
					@getfixSelectData="change">
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
			bf: {
				style: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0],
				res: ['1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2', '5:0', '5:1', '5:2', '胜其它',
					'0:0', '1:1', '2:2', '3:3', '平其它', '0:1', '0:2', '1:2', '0:3', '1:3', '2:3', '0:4', '1:4',
					'2:4', '0:5', '1:5', '2:5', '负其它'
				],
			}
		}
		styledata.value = arr
	}
	const deleteId = ref(props.fixSelectData.id)
	//*****暴露子组件方法 用以父组件调用
	defineExpose({init,deleteId})
	
	const temporaryArr=ref('')//临时存储数据
	const popupNumer=ref(0)
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
			emits('getSelectList',temporaryArr.value)//最后把处理好的数据发给父页面
			popupNumer.value++
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
			}
			emits('getSelectList',temporaryArr.value)//最后把处理好的数据发给父页面
			popupNumer.value--
		}
	}
	const noshowdan = (id) => {
		id=String(id)
		var res = props.fixSelectData.sell_status[id];
		if(res=='2' || id==2){
			return true
		}else{
			return false
		}
		return true
	}
	const noshowgame = (id,gameType) => {
		var res = props.fixSelectData.sell_status[id];
		if (res=='1'|| res=='2' || props.fixSelectData[gameType].length>1 || props.fixSelectData[gameType]['goalLine']) {
			return true
		} else {
			return true
		}
	}

	const openpopup = () => {
		proxy.$refs.crspopup.open('bottom')
	}
	const closeupup = () => {
		proxy.$refs.crspopup.close('bottom')
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
