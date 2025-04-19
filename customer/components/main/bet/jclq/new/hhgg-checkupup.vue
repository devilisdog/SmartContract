<template>
	<view style="background-color: #fff;border-radius:20rpx 20rpx 0 0;">
			<!-- 大标题  谁对战谁 -->
		<view class="title" style="text-align: center;">
			<view class="boxt" style="flex:1;font-size: 40rpx; font-weight: 600;" >
				<text style="color: red;font-size: 40rpx; font-weight: 600;">(客)</text>
				{{props.fixSelectData.short_away}}
			</view>
			<view class="boxt" style="flex:0.5;">
				<text style="color: #ff0000; font-size: 40rpx; font-weight: 600;">VS</text>
			</view>
			<view class="boxt" style="flex:1;font-size: 40rpx; font-weight: 600;">
				{{props.fixSelectData.short_home}}
				<text style="color: red;font-size: 40rpx; font-weight: 600;">(主)</text>
			</view>
		</view>
		<scroll-view scroll-y="true" class="scroll-Y" >
			<view class="centerbox"><!-- 胜负 -->
				<view class="box">
					<view style="display:flex;background-color:#2979FF;">
						<text style="align-self:center;width: 35rpx;color: #edf0f3;">胜负</text>
					</view>
					<view v-if="noshowgame(0,'sf')" class="check" :style="styledata.value.sf.style[index]==0?'':' background-color: red; color: #fff;'"
						v-for="item,index in styledata.value.sf.res" @click="change('sf',index,0) "
						style="height: 100%;flex: 50%;">
						<view class="huadan" style="display: flex;flex-direction: column;">
							<view :class="noshowdan(0)?'inner-box1':''">
								<text v-show="noshowdan(0)"
									style="transform: scale(0.8);">单</text>
							</view>
							
							<text style="font-weight: 700;">{{item}}</text>
							<view class="" style="display: flex;flex-direction: row;">
								<text style="margin-left: 5px; font-weight: 700;align-self:center; ">
									{{props.fixSelectData.sf[index]}}
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
			
			<view class="centerbox"><!-- 让分 -->
				<view class="box">
					<view style="display:flex;background-color: #2979FF;">
						<text style="align-self:center;width: 35rpx;color: #edf0f3;">让分</text>
					</view>
					<view v-if="noshowgame(1,'rf')" class="check" :style="styledata.value.rf.style[index]==0?'':' background-color: red; color: #fff;'"
						v-for="item,index in styledata.value.rf.res" @click="change('rf',index,1) "
						style="height: 100%;flex: 50%;">
						<view class="huadan" style="display: flex;flex-direction: column;">
							<view :class="noshowdan(1)?'inner-box1':''">
								<text v-show="noshowdan(1)"
									style="transform: scale(0.8);">单</text>
							</view>
							<view style="display: flex;flex-direction: row;">
								<text style="font-weight: 700;">{{item}}
									<text v-show="index==1"
										style="font-weight: 700;" :style="styledata.value.rf.style[index]!=0?'color:#ffffff':props.fixSelectData.rf.goalLine<0?'color:green':'color:red'">({{props.fixSelectData.rf.goalLine}})
									</text>
										
								</text>
									
							</view>
							<view class="" style="display: flex;flex-direction: row;">
								<text style="margin-left: 5px; font-weight: 700; ">
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
			</view>
			<view class="centerbox"><!-- 大小分 -->
				<view class="box" style="height: 125rpx;">
					<view style="display:flex;background-color: #2979FF;">
						<text style="align-self:center;width: 35rpx;color: #edf0f3;">大小分</text>
					</view>
					<view v-if="noshowgame(2,'dxf')" class="check" :style="styledata.value.dxf.style[index]==0?'':' background-color: red; color: #fff;'"
						v-for="item,index in styledata.value.dxf.res" @click="change('dxf',index,2) "
						style="height: 100%;flex: 50%;">
						<view class="huadan" style="display: flex;flex-direction: column;">
							<view :class="noshowdan(2)?'inner-box1':''">
								<text v-show="noshowdan(2)"
									style="transform: scale(0.8);">单</text>
							</view>
							<text style="font-weight: 700;">{{item}}{{(props.fixSelectData.dxf.goalLine)-0}}</text>
							<view class="" style="display: flex;flex-direction: row;">
								<view v-show="styledata.value.dxf.style[index]==0" style="display: flex;align-self:center;">
									<text style="margin-left: 5px; font-weight: 700; ">
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
			<!-- 胜分差 -->
			<view  class="centerbox" style="display: flex;flex-direction: row;">
				<text v-show="noshowdan(3)" style="font-size: 35rpx; font-weight: 600; background-color: #ff0000; color: #FFFFFF; padding:10rpx 5rpx 10rpx 5rpx;">单</text>
				<text style="font-size: 35rpx; font-weight: 600;margin-right: auto;padding:10rpx 5rpx 10rpx 5rpx">
					胜分差
				</text>
			</view>
			<view class="centerbox">
				<view class="left">
					<view class="red"><text>客胜分差</text></view>
					<view class="blue"><text>主胜分差</text></view>
				</view>
				<view style="flex:1;">
					<view class="box_two" v-if="noshowgame(3,'sfc')" >
						<view class="check" :style="styledata.value.sfc.style[index]==0?'':'background-color: red; color: #fff;'" v-for="item,index in styledata.value.sfc.res" @click="change('sfc',index,3) " style="height:130rpx;">
							<text style="font-weight: 700;">{{item}}</text>
							<text style="margin-left: 5px;font-weight: 700;">{{props.fixSelectData.sfc[index]}}</text>
						</view>
					</view>
					<view v-else class="check" style="flex:1;height:520rpx;">
						<view style="color: #999999;">未开售</view>
					</view>
				</view>
			</view>
			<view style="width:100%;height:20rpx;"></view>
		</scroll-view>	
		<!-- 底部按钮 -->
		<view class="Buttongroup" style="">
			<view class="cancel button" style="flex: 1;background-color: #FFFFFF;" @click="cancel">
				<text>关闭</text>
			</view>
			<view class="confirm button" style="flex: 1; background-color: #202736; color: #ffffff;" @click="confirm">
				<text style="">确认</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {defineEmits,defineProps,reactive,getCurrentInstance,ref} from "vue"
	const props = defineProps(['styledata', 'fixSelectData'])
	const emits = defineEmits(['closeupup', 'getfixSelectData'])
	

	const change = (type, index,gameId) => {
		emits('getfixSelectData',type,index,gameId)
	}
	const cancel = () => {
		emits('closeupup')
	}
	const confirm = () => {
		emits('closeupup')
	}
	const noshowdan =(id)=>{
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
		}else {
			return false
		}
	}
</script>

<style lang="scss">
.box_two{
	display: grid;
	grid-template-columns: repeat(3,auto);
}
.left .red {
	background-color: red;
	height:260rpx;
	writing-mode: vertical-rl;
	text-align: center;
	color:white;
	letter-spacing:10px;
}
.left .blue {
	background-color: #2979FF;
	height:260rpx;
	writing-mode: vertical-rl;
	text-align: center;
	color:white;
	letter-spacing:10px;
}
.left{
	display: flex;
	flex-flow: column;
	width:60rpx;
	align-items: center;
	justify-content: center;
}
.centerbox{
	margin:20rpx;
	display: flex;
}
.inner-box1 text{
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
	
.huadan{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;    
	width: 100%;
	height: 100%;
	/* background-color: orange;   */
	overflow: hidden;    
}

	
.title .red{
	color: red;
}

.title .green{
	color: green;
}
	
.Buttongroup .button{
	height: 100%;
	width: 100%;
	font-size: 30rpx;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	
	/* 边框 */
	border-top: 1rpx solid #edf0f3;
	  -webkit-box-sizing: border-box; 
	  box-sizing: border-box;
}
.Buttongroup text{
	font-size: 35rpx;
	font-weight: 600;

	
	
}
.Buttongroup{
	width: 100%;
	height: 120rpx;
	display: flex; 
	flex-direction: row;

}

.check{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	
	
	/* 边框 */
	border: 3rpx solid #edf0f3;
	  -webkit-box-sizing: border-box; 
	  box-sizing: border-box;
}
.box{
	
	width: 100%;
	display: flex;
	flex-direction: row;
	text-align: center;
	
	
}
text{
	margin: 1px;
	font-size: 30rpx;
	
	text-align: center;
}

	
.gamebox{
	margin-top: 30rpx;
	display: flex;
	flex-direction: column;
}
.yc-data-checkbox{
	display: flex;
	flex-direction: column;
}
	
.title .box{
	text-align: center;
	background-color: #2979FF;
	margin: 20rpx;

	height: 100%;

}
.title{
	width: 100%;
	display: flex;
	flex-direction: row;
	padding-top:20rpx;
}	

.suspensionbox{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.scroll-Y{
	height:60vh;
	
}

</style>
