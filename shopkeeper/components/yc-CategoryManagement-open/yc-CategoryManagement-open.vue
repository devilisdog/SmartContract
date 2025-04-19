<template>
	
	<view class="titleStyle">
		<text>{{switchData.data.systemsgamelist.title}}</text>
	</view>
	<!-- 内容 -->
	<scroll-view scroll-y="true">
		<view class="optionStyle" v-for="itme,index in switchList" v-show="itme.systemSwitchData==1">
			<view style="margin-left:15rpx;width:300rpx;">
				<text>{{itme.title}}</text><br>
				<text style="font-size:22rpx;color:#959595;">{{itme.describe}}</text>
			</view>
			<view style="margin-right:10rpx;">
				<zero-switch
					v-if="itme.state==1"
					@change="clickEdit($event,itme.name,index)"
					:stopChange="true"
					:value="itme.switchData==1"
					active-color="#FDC830"
				>
				</zero-switch>
					
				<uni-number-box 
					v-if="itme.state==2" 
					:max="itme.maxValue"
					:min="itme.minValue"
					:value='itme.value'
					@change="clickNumber($event,itme)"
				/>
			</view>
		</view>
	</scroll-view>
	
	<fui-dialog :show="dialogShow" @click="clickSwitch" :content="dialogContent"></fui-dialog>
</template>

<script setup>
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
		defineProps, // 接收
		defineEmits, // 发送
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	import api from '@/common/vmeitime-http/mine/mine.js';
	
	const dialogShow=ref(false)//弹窗是否显示
	const dialogContent=ref('')//弹窗提示文字内容
	const clickIndex=ref(0)//用户点击的选项index
	const clickSwitchState=ref(false)//用户点击开关的状态
	
	const clickEdit=(switchState,name,index)=>{
		if(index==5 && switchList[6].switchData==1){
			//用户开启允许重复，但是已开启奖金优化
			dialogContent.value='开启允许重复需要关闭奖金优化，你确定开启允许重复并"关闭奖金优化"吗？'
			clickIndex.value=index
			clickSwitchState.value=switchState
			dialogShow.value=true
		}else if(index== 6&& switchList[5].switchData==1){
			//用户开启奖金优化，但是已开启允许重复
			dialogContent.value='开启奖金优化需要关闭允许重复，你确定开启奖金优化并"关闭允许重复"吗？'
			clickIndex.value=index
			clickSwitchState.value=switchState
			dialogShow.value=true
		}else if(index==5 && switchList[5].switchData==0){
			dialogContent.value='开启后，与体彩助手不一致，彩民投注暂不支持多串，奖金优化，胆拖，涉及到混合过关，金额可能会增加，是否启动开启'
			clickIndex.value=index
			clickSwitchState.value=switchState
			dialogShow.value=true
			
		}else{
			uni.showLoading({
				title:'修改中'
			})
			api.Postedit({
				'game_id':props.switchData.data.game_id,
				"model":name,
				"value":switchState==false?'1':'0',
			}).then((res)=>{
				uni.hideLoading()
				if(res.data.code==1){
					switchList[index].switchData=switchState==false?'1':'0'
				}else{
					uni.showToast({
						title:'修改失败~请稍后再试！',
						position:'bottom',
						icon:'error'
					})
				}
			})
		}
		
	}
	
	const props = defineProps(['switchData'])
	const switchList =reactive([
		/*
		* -- title -- 标题
		* -- describe --开关解释
		* -- state -- 开关类型（1=开关、2=加减按钮的数字输入框）
		* -- switchData -- 开关状态0=关、1=开
		* -- systemSwitchData -- 系统开关状态 1=开启（显示）、0=关闭（不显示）
		* -- value -- 加减按钮的数字输入框的默认值（对应开关解释功能）
		*/
		{	
			name:'gamestate',
			title:'允许投注',
			describe:'开启后，用户将无法购买此彩种',
			state:'1',
			switchData:props.switchData.data.gamestate,
			systemSwitchData:props.switchData.data.systemsgamelist.state,
			
		},
		{	
			name:'Cooperation',
			title:'合作模式开关',
			describe:'开启为合作模式自动甩单，关闭为合作模式手动甩单',
			state:'1',
			switchData:props.switchData.data.Cooperation,
			systemSwitchData:props.switchData.data.systemsgamelist.Cooperation,
		},
		{	
			name:'advance',
			title:'提前截止时间(分钟)',
			describe:'提前停止投注时间',
			state:'2',
			value:props.switchData.data.advance,
			minValue:props.switchData.data.systemsgamelist.advance,
			systemSwitchData:1,
		},
		{
			name:'MinBetAmount',
			title:'最小投注金额(元)',
			describe:'允许的投注最低金额',
			state:'2',
			value:props.switchData.data.MinBetAmount,
			maxValue:props.switchData.data.systemsgamelist.MaxBetAmount,
			minValue:props.switchData.data.systemsgamelist.MinBetAmount,
			systemSwitchData:1,
		},
		{
			name:'AllowComplexPlay',
			title:'复杂玩法',
			describe:'开启后允许多种玩法',
			state:'1',
			switchData:props.switchData.data.AllowComplexPlay,
			systemSwitchData:props.switchData.data.systemsgamelist.AllowComplexPlay,
		},
		{
			name:'Repeat',
			title:'允许重复',
			describe:'开启后投注时不去除重复方案',
			state:'1',
			switchData:props.switchData.data.Repeat,
			systemSwitchData:props.switchData.data.systemsgamelist.Repeat,
		},
		{
			name:'BonusOptimization',
			title:'奖金优化',
			describe:'开启后投注时可选择奖金优化',
			state:'1',
			switchData:props.switchData.data.BonusOptimization,
			systemSwitchData:props.switchData.data.systemsgamelist.BonusOptimization,
		},
		{
			name:'Issuing_switch',
			title:'发单开关',
			describe:'开启后，将允许此彩种发单/跟单功能',
			state:'1',
			switchData:props.switchData.data.Issuing_switch,
			systemSwitchData:props.switchData.data.systemsgamelist.Issuing_switch,
		},
	])
	
	const clickSwitch=(e)=>{
		if(e.index==1){
			//提示弹窗，index==1代码点击了确定
			uni.showLoading({
				title:'修改中'
			})
			if(clickIndex.value==6){
				//用户开启奖金优化但是已经开了允许重复
				api.Postedit({//开启奖金优化
					'game_id':props.switchData.data.game_id,
					"model":switchList[clickIndex.value].name,
					"value":'1',
				}).then((res)=>{
					if(res.data.code==1){
						switchList[clickIndex.value].switchData=clickSwitchState.value==false?'1':'0'
					}else{
						uni.showToast({
							title:'修改失败~请稍后再试！',
							position:'bottom'
						})
						return
					}
				})
				api.Postedit({//关闭允许重复
					'game_id':props.switchData.data.game_id,
					"model":switchList[5].name,
					"value":'0',
				}).then((res)=>{
					uni.hideLoading()
					if(res.data.code==1){
						switchList[5].switchData='0'
					}else{
						uni.showToast({
							title:'修改失败~请稍后再试！',
							position:'bottom'
						})
						return
					}
				})
			}else{
				api.Postedit({//开启允许重复
					'game_id':props.switchData.data.game_id,
					"model":switchList[clickIndex.value].name,
					"value":'1',
				}).then((res)=>{
					if(res.data.code==1){
						switchList[clickIndex.value].switchData=clickSwitchState.value==false?'1':'0'
					}else{
						uni.showToast({
							title:'修改失败~请稍后再试！',
							position:'bottom'
						})
						return
					}
				})
				api.Postedit({//关闭奖金优化
					'game_id':props.switchData.data.game_id,
					"model":switchList[6].name,
					"value":'0',
				}).then((res)=>{
					uni.hideLoading()
					if(res.data.code==1){
						switchList[6].switchData='0'
					}else{
						uni.showToast({
							title:'修改失败~请稍后再试！',
							position:'bottom'
						})
						return
					}
				})
			}
			dialogShow.value=false
		}else{
			dialogShow.value=false
		}
		
	}
	const clickNumber=(value,data)=>{//数字框值发生变化触发
		uni.showLoading({title:'修改中~'})
		api.Postedit({
			'game_id':props.switchData.data.game_id,
			"model":data.name,
			"value":value,
		}).then((res)=>{
			uni.hideLoading()
			if(res.data.code!=1){
				uni.showToast({
					title:'修改失败~请稍后再试！',
					position:'bottom',
					icon:'error'
				})
			}
		})
	}
</script>

<style>
	.titleStyle{
		display: flex;
		width: 100%;
		height: 90rpx;
		justify-content: center;
		align-items: center;
		border-bottom: 1rpx solid #f4f4f4;
	}
	.optionStyle{
		width:100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding:5rpx 0rpx;
		border-bottom:1rpx solid #e6e6e6;
	}
	.nr{
		display: flex;
		width: 700rpx;
		margin: auto;
		border-bottom: 1rpx solid #f4f4f4;
		justify-content: space-between;
		align-items: center;
	}
</style> 