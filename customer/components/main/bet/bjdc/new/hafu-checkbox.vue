<template>
	<!-- 混合过关 -->
	<view class="yc-data-checkbox">
		<view class="box" v-if="noshowgame()" style="display: flex;flex-wrap: wrap;">
			<view class="check" v-for="item,index in styledata.value.res" :key="index"
			:style="styledata.value.style[index]==0?'':' background-color: red; color: #fff;'" 
			@click="change(index)"
			style="margin-top: 5rpx; flex:33%">
				<view class="huadan" style="flex-direction: column;">
					<text 
					:style="props.fixSelectData.odds.bqc[styledata.value.rate[index]]==null ? 'padding:15rpx 0;' :false"
					style="font-weight: 700;font-size:28rpx;">
					
						{{item}}
					</text>
					<text style="margin-left: 5px;font-size:26rpx;">
						{{props.fixSelectData.odds.bqc[styledata.value.rate[index]]}}
					</text>
				</view>
			</view>
		</view>
		<view v-else class="check" style="flex: 1;">
			<view style="color: #999999;">未开售</view>
		</view>
	</view>

</template>

<script setup>
	import common from "@/common/common.js"
	import { 
		onBeforeMount,
		defineEmits,
		defineProps,
		reactive,
		watch,
		ref

	} from "vue"
	
	const props = defineProps(['Refresh', 'fixSelectData','count'])
	const emits = defineEmits(['getSelectList'])
	
	onBeforeMount(() => {
		init() //创建初始化
	})
	
	watch(() => props.Refresh, (oldval, newval) => {
		init()
	})
	const styledata = reactive({})
	
	const init=()=>{
		temporaryArr.value=''
		var arr = {// 字典
			style:[0,0,0,0,0,0,0,0,0],
			rate:['l33','l31','l30','l13','l11','l10','l10','l10','l00'],
			res:['胜-胜','胜-平','胜-负','平-胜','平-平','平-负','负-胜','负-平','负-负'],
		}
		styledata.value = arr
	}
	const deleteId = ref(props.fixSelectData.issue_num)
	//*****暴露子组件方法 用以父组件调用
	defineExpose({init,deleteId})
	const temporaryArr=ref('')
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
				'rate':props.fixSelectData.odds.bqc[styledata.value.rate[gameIndex]],
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
					'rate':props.fixSelectData.odds.bqc[styledata.value.rate[gameIndex]],
					'poolEs':1//判断是否单关
				}
				temporaryArr.value.gameData.data.push(newOjd)
			}
			styledata.value.style[gameIndex] = 1
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
			emits('getSelectList',temporaryArr.value)//最后把处理好的数据发给父页面
		}
	}
	const noshowgame=()=>{
		var value = props.fixSelectData.sell_status.split(',')
		if(value[2]=='1'){
			return true
		}else{
			return false
		}
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

		width: 520rpx;
		height: 260rpx;
		display: flex;
		flex-direction: row;
		text-align: center;


	}

	text {
		margin: 1px;
		font-size: 26rpx;

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
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: center;
		margin:10rpx 0 20rpx 0;
	}
</style>