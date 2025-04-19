<template>
	<!-- 混合过关 -->
	<view class="yc-data-checkbox">
		<!-- 胜与让胜 两行数据 -->
		<view class="checkbox ">
			<!-- 胜平负 -->
			<view class="box">
				<view class="box">
					<view class="check" v-for="item,index in styledata.value.res" :key="index"
					:style="styledata.value.style[index]==0?'':' background-color: red; color: #fff;'" @click="props.fixSelectData[styledata.value.keyArr[index]]==0?remindchange():change(index)">
						<view class="huadan">
							<text style="font-weight: 700;font-size:28rpx;">{{item}}</text>
							<text style="margin-left: 5px;font-size:26rpx;">
								{{props.fixSelectData[styledata.value.keyArr[index]]==0?'--':props.fixSelectData[styledata.value.keyArr[index]]}}
							</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import common from "@/common/common.js"
	import { ref,onBeforeMount,defineEmits,defineProps,reactive,watch} from "vue"
	const props =defineProps(['Refresh','fixSelectData','count'])
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
		var arr = {// 字典
			style:[0,0],
			res:['主胜','客胜'],
			keyArr:['S','F'],
		}
		styledata.value = arr
	}
	const deleteId = ref(props.fixSelectData.MatchNo)
	//*****暴露子组件方法 用以父组件调用
	defineExpose({init,deleteId})
	const temporaryArr=ref('')
	const change=(index)=>{
		var array = {
			'awayTeamAbbName': props.fixSelectData.GuestFull,
			'homeTeamAbbName': props.fixSelectData.HostFull,
			'matchId': props.fixSelectData.MatchNo,
			'matchNumStr': props.fixSelectData.MatchNo,
			'leagueAbbName': props.fixSelectData.LeagueName,
			'gameDeadline' :props.fixSelectData.EndTime,
			'orderDeadline':'',
			'sort' :new Date(props.fixSelectData.EndTime).getTime(),
			'data': [{
				'res': styledata.value.res[index],
				'rate':props.fixSelectData[styledata.value.keyArr[index]],
			}],
		}
		if(styledata.value.style[index]==0){//添加
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
					'res': styledata.value.res[index],
					'rate':props.fixSelectData[styledata.value.keyArr[index]],
				}
				temporaryArr.value.gameData.data.push(newOjd)
			}
			if(props.fixSelectData['Handicap']!='0'){//如果有让球玩法添加让球数值
				temporaryArr.value.gameData['goal']=props.fixSelectData['Handicap']
			}
			styledata.value.style[index] = 1
			emits('getSelectList',temporaryArr.value)//最后把处理好的数据发给父页面
		}else{//删除
			styledata.value.style[index] = 0
			if(temporaryArr.value.gameData.data.length==1){//当只有一个的情况下直接全部删除
				array.data=[]//清空已选择玩法
				var ojb={
					gameData:array,
					selectBoole:false,
				}
				temporaryArr.value=ojb
			}else{//否则删除取消选择用户点击的玩法
				var Delindex = temporaryArr.value.gameData.data.findIndex(item =>item.res == styledata.value.res[index])
				temporaryArr.value.gameData.data.splice(Delindex,1)
			}
			emits('getSelectList',temporaryArr.value)//最后把处理好的数据发给父页面
		}
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
		height: 75rpx;
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
		height: 75rpx;
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
		margin: 10px;
		height: 75rpx;
		display: flex;
		flex-direction: row;
		text-align: center;
	}
</style>