<template>
	<!-- 混合过关 -->
	<view class="yc-data-checkbox">
		<!-- 胜与让胜 两行数据 -->
		<view class="checkbox ">
			<!-- 胜平负 -->
			<view class="box">
				<!-- 使用v-for动态渲染胜负比率，以便后续获取选中值信息 -->
				<!-- 使用v-if 判断是否未开售 -->
				<view class="box" v-if="noshowgame()">
					<view class="buttonboxx" v-show="nimber === 0" @click="openpopup">
						<text class="button" style="color: #ff0000; ">点击选择比分</text>
					</view>
					<view class="buttonboxx" v-show="nimber > 0" @click="openpopup">
						<text class="button" style="color: #ff0000; ">已选择{{nimber}}项</text>
					</view>
				</view>

				<view v-else class="check" style="flex: 1;">
					<view style="color: #999999;">未开售</view> 
				</view>
			</view> 
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


</template>

<script setup>
	import common from "@/common/common.js"
	import crscheck from "@/components/main/bet/bjdc/crs-checkupup.vue"
	import {
		onBeforeMount,
		defineEmits,
		defineProps,
		reactive,
		watch,
		getCurrentInstance,
		ref
	} from "vue"
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const props = defineProps(['Refresh', 'fixSelectData','count'])
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
		nimber.value=0
		// 字典
		var arr = {
			style: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			rate: ['s10','s20','s21','s30','s31','s32','s40','s41','s41','sw','s00','s00','s22','s33','sp','s01','s02','s12','s03','s13','s23','s04','s14','s24','sl'],
			res: ['1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2','胜其它','0:0', '1:1', '2:2', '3:3', '平其它', '0:1', '0:2', '1:2', '0:3', '1:3', '2:3', '0:4', '1:4','2:4','负其它'],

		}
		for(var i = 0;i<=24;i++){
			arr.rate.push("sp"+(i+""))
		}
		styledata.value = arr
	}
	const deleteId = ref(props.fixSelectData.issue_num)
	//*****暴露子组件方法 用以父组件调用
	defineExpose({init,deleteId})
	const temporaryArr=ref('')
	const nimber=ref(0)
	const change=(gameIndex)=>{
		var array = {
			'awayTeamAbbName': props.fixSelectData.away,
			'homeTeamAbbName': props.fixSelectData.home,
			'matchId': props.fixSelectData.issue_num,
			'matchNumStr': props.fixSelectData.issue_num,
			'leagueAbbName': props.fixSelectData.comp,
			'gameDeadline' :common.dateFormat(props.fixSelectData.match_time*1000,3),
			'orderDeadline':'',
			'sort' :props.fixSelectData.match_time,
			'data': [{
				'res': styledata.value.res[gameIndex],
				'rate':props.fixSelectData.odds.bf[styledata.value.rate[gameIndex]],
				'poolEs':1//判断是否单关
			}],
		}
		if(styledata.value.style[gameIndex]==0){//添加
			if(temporaryArr.value==''){//如果是第一次选择直接添加进去
				if(props.count>=15){
					uni.showToast({
						title:'不能超过15场比赛~',
						icon:'none',
						position:"center"
					})
					return
				}
				var ojb={
					gameData:array,
					selectBoole:true,//判断是否取消整场比赛
				}
				temporaryArr.value=ojb
			}else{//否则只添加玩法进去
				temporaryArr.value.selectBoole=true
				var newOjd={
					'res': styledata.value.res[gameIndex],
					'rate':props.fixSelectData.odds.bf[styledata.value.rate[gameIndex]],
					'poolEs':1//判断是否单关
				}
				temporaryArr.value.gameData.data.push(newOjd)
			}
			styledata.value.style[gameIndex] = 1
			nimber.value++
			emits('getSelectList',temporaryArr.value)//最后把处理好的数据发给父页面
		}else{//删除
			styledata.value.style[gameIndex] = 0
			if(temporaryArr.value.gameData.data.length==1){//当只有一个的情况下直接全部删除
				array.data=[]//清空已选择玩法
				var ojb={
					gameData:array,
					selectBoole:false,
				}
				temporaryArr.value=ojb
			}else{//否则删除取消选择用户点击的玩法
				var Delindex = temporaryArr.value.gameData.data.findIndex(item =>item.res == styledata.value.res[gameIndex])
				temporaryArr.value.gameData.data.splice(Delindex,1)
			}
			nimber.value--
			emits('getSelectList',temporaryArr.value)//最后把处理好的数据发给父页面
		}
	}
	const openpopup = () => {
		proxy.$refs.crspopup.open('bottom')
	}
	const closeupup = () => {
		proxy.$refs.crspopup.close('bottom')
	}
	
	const noshowgame=()=>{
		var value = props.fixSelectData.sell_status.split(',')
		if(value[4]=='1'){
			return true
		}else{
			return false
		}
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
		width: 520rpx;
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
		margin: -8px;
		height: 150rpx;
		display: flex;
		flex-direction: row;
		text-align: center;
	}
</style>
