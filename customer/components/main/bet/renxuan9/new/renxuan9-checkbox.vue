<template>
	<!-- 混合过关 -->
	<view class="yc-data-checkbox">
		<view class="check" v-for="item,index in styledata.value.res" :key="index"
		:style="styledata.value.style[index]==0?'':' background-color: red; color: #fff;'" @click="props.fixSelectData[styledata.value.rate[index]]==0?remindchange():change(index)">
			<view class="huadan">
				<text style="font-weight: bold;font-size:28rpx;">{{item}}</text>
				<text style="margin-left: 5px;">
					{{props.fixSelectData[styledata.value.rate[index]]==0?'--':props.fixSelectData[styledata.value.rate[index]]}}
				</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref,onBeforeMount,defineEmits,defineProps,reactive,watch,} from "vue"
	const props =defineProps(['Refresh','fixSelectData','Tiemsort','listIndex','index'])
	const emits =defineEmits(['getSelectList'])
	
	onBeforeMount(() => {
		init() //创建初始化
	})
	watch(() => props.Refresh, (oldval, newval) => {
		init()
	})
	const styledata = reactive({})
	const init=()=>{
		viewdata.countb = 0
		viewdata.selectList = []
		// 字典		
		var arr = {
			style:[0,0,0],
			rate:['H','D','A'],
			res:['胜','平','负'],
		}
		styledata.value = arr
	}
	const deleteId = ref(props.fixSelectData)
	//*****暴露子组件方法 用以父组件调用
	defineExpose({init,deleteId})
	
	const viewdata = reactive({
		countb: 0,
		selectList: [],
	})
	
	const getfixSelectData = (index)=>{
		change(index)
	}
	const change=(index)=>{
		var array = {
			'awayTeamAbbName': props.fixSelectData.GuestTeamName,
			'homeTeamAbbName': props.fixSelectData.MasterTeamName,
			'matchId': props.fixSelectData.MatchNum,
			'leagueAbbName': props.fixSelectData.MatchName,
			'gameDeadline' : props.Tiemsort,
			'orderDeadline':'',
			'matchNumStr':props.fixSelectData.MatchNum,
			'sort' : new Date(props.Tiemsort).getTime(),
			'data': [{
				'res': styledata.value.res[index],
				'rate': props.fixSelectData[styledata.value.rate[index]],
			}, ],
		}
		if(styledata.value.style[index]==0){
			styledata.value.style[index] = 1
			viewdata.selectList.push(array)
			var ojb={
				gameData:array,
				selectBoole:true,
			}
			emits('getSelectList',ojb)
		}else{
			styledata.value.style[index] = 0	
			// 删除数组里面
			var index = viewdata.selectList.findIndex(item =>item.data[0].res == array.data[0].res)
			viewdata.selectList.splice(index, 1)
			var ojb={
				gameData:array,
				selectBoole:false,
			}
			emits('getSelectList',ojb)
		}
		viewdata.countb = viewdata.selectList.length
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
		display: flex;
		justify-content: center;
		align-items: center;
		/* 边框 */
		border: 3rpx solid #edf0f3;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		border-radius:10rpx;
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
		height: 75rpx;
		display: flex;
		flex-direction: row;
		text-align: center;


	}
</style>