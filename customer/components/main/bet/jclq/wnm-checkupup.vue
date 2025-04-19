<template>
	<view style="background-color: white;border-radius:20rpx 20rpx 0 0;">
		<view class="title" style="text-align: center;">
			<view class="boxt" style="flex:1;font-size: 40rpx; font-weight: 600;" >
				<text style="color: red;font-size: 40rpx; font-weight: 600;">(客)</text>
				{{props.fixSelectData.AwayTeamAbbName}}
			</view>
			<view class="boxt" style="flex:0.5;">
				<text style="color: #ff0000; font-size: 40rpx; font-weight: 600;">VS</text>
			</view>
			<view class="boxt" style="flex:1;font-size: 40rpx; font-weight: 600;">
				{{props.fixSelectData.HomeTeamAbbName}}
				<text style="color: red;font-size: 40rpx; font-weight: 600;">(主)</text>
			</view>
		</view>
		<!-- 胜分差 -->
		<view  class="centerbox" style="display: flex;flex-direction: row;">
			<text v-show="noshowdan('WNM')" style="font-size: 35rpx; font-weight: 600; background-color: #ff0000; color: #FFFFFF; padding:10rpx 5rpx 10rpx 5rpx;">单</text>
			<text style="font-size: 35rpx; font-weight: 600;margin-right: auto;padding:10rpx 5rpx 10rpx 5rpx">胜分差</text>
		</view>
		<view class="centerbox">
			<view class="left">
				<view class="red"><text>客胜分差</text></view>
				<view class="blue"><text>主胜分差</text></view>
			</view>
			<view style="flex:1;">
				<view class="box_two" v-if="noshowgame('WNM')" >
					<view class="check" :style="styledata.value.sfc.style[index]==0?'':'background-color: red; color: #fff;'" v-for="item,index in styledata.value.sfc.res"
					 @click="props.fixSelectData['WNM'][styledata.value.sfc.keyArr[index]]==0?remindchange():change('sfc',index,'WNM') " style="height:130rpx;">
						<text style="font-weight: 700;">{{item}}</text>
						<text style="margin-left: 5px;align-self:center;font-size:26rpx;">
							{{props.fixSelectData['WNM'][styledata.value.sfc.keyArr[index]]==0?'--':props.fixSelectData['WNM'][styledata.value.sfc.keyArr[index]]}}
						</text>
						<text v-if="props.fixSelectData['WNM'][styledata.value.sfc.keyArr[index]+'F']!=0" :style="props.fixSelectData['WNM'][styledata.value.sfc.keyArr[index]+'F']>0?'color:red;':'color:green;'">
							{{props.fixSelectData['WNM'][styledata.value.sfc.keyArr[index]+'F']>0?'↑':'↓'}}
						</text>
					</view>
				</view>
			</view>
		</view>
		<view style="width:100%;height:20rpx;"></view>
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
	import {onBeforeMount,defineEmits,defineProps,reactive,watch,getCurrentInstance,ref} from "vue"

	const props = defineProps(['styledata', 'fixSelectData'])
	const emits = defineEmits(['closeupup', 'getfixSelectData','remind'])
	const change = (type, index,game) => {
		emits('getfixSelectData',type,index,game)
	}
	const cancel = () => {
		emits('closeupup')
	}
	const confirm = () => {
		emits('closeupup')
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
	const remindchange=()=>{
			emits('remind')
	}
</script>

<style>
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
	margin: 20rpx;
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
.left{
	/*设置为伸缩容器*/
	
	display: -webkit-box;

	display: -moz-box;

	display: -ms-flexbox;

	display: -webkit-flex;

	display: flex;

	/*垂直居中*/

	-webkit-box-align: center;/*旧版本*/

	-moz-box-align: center;/*旧版本*/

	-ms-flex-align: center;/*混合版本*/

	-webkit-align-items: center;/*新版本*/

	align-items: center;/*新版本*/
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
	padding:20rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	
}	

.suspensionbox{
	
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
