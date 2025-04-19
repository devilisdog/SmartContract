<template>
	<view style="background-color:white;border-radius:20rpx 20rpx 0 0;">
		<view class="suspensionbox" style=""><!-- 大标题  谁对战谁 -->
			<view class="title" style="text-align: center; margin: 40rpx;">
				<view class="boxt" style="flex:1;">
					<text style="font-size: 40rpx; font-weight:bolder;">{{props.fixSelectData.HomeTeamAbbName}}</text>
				</view>
				<view class="boxt" style="flex:1;">
					<text style="color: #ff0000; font-size: 40rpx; font-weight:bolder;">VS</text>
				</view>
				<view class="boxt" style="flex:1;">
					<text style="font-size: 40rpx; font-weight:bolder; ">{{props.fixSelectData.AwayTeamAbbName}}</text>
				</view>
			</view>
		</view>
		<view style="display: flex;flex-direction: row;padding:0rpx 20rpx 20rpx 20rpx;">
			<view class="left" style="flex: 1;display: flex;flex-direction: column;">
				<view :class="index==1?'red':index==2?'blue':'red'" v-for="index in 3" :key="index"
					style="color: #fff;display: flex;">
					<text style="align-self:center;">{{index==1?'胜':index==2?'平':'负'}}</text>
				</view>
			</view>
			<view class="right" style="flex: 19;">
				<view class="box" v-if="noshowgame('CRS')" style="flex-wrap: wrap;">
					<view class="check" v-for="item,index in props.styledata.value.bf.res"
						:key="index" style="height: 75rpx;"
						:style="(props.styledata.value.bf.style[index]==0?'':' background-color: red; color: #fff;') +''+ (index==12 || index==17 || index==30?'flex:100%;':'flex:25%;')"
						@click="props.fixSelectData['CRS'][styledata.value.bf.keyArr[index]]==0?remindchange():change('bf',index,'CRS')">
						<view class="huadan">
							<text style="font-weight: 700;">{{item}}</text>
							<view style="display: flex;flex-direction: row;">
								<text style="margin-left: 5px; font-weight: 700;">
									{{props.fixSelectData['CRS'][styledata.value.bf.keyArr[index]]==0?'--':props.fixSelectData['CRS'][styledata.value.bf.keyArr[index]]}}
								</text>
								<text v-if="props.fixSelectData['CRS'][styledata.value.bf.keyArr[index]+'F']!=0" :style="props.fixSelectData['CRS'][styledata.value.bf.keyArr[index]+'F']>0?'color:red;':'color:green;'">
									{{props.fixSelectData['CRS'][styledata.value.bf.keyArr[index]+'F']>0?'↑':'↓'}}
								</text>
							</view>
						</view>
					</view>
				</view>
				<view  class="check" style="flex: 1;height: 750rpx;" v-else>
					<view style="color: #999999;">
						未开售
					</view>
				</view>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="Buttongroup" style="">
			<view class="cancel button" style="flex: 1;background-color: #FFFFFF;" @click="cancel">
				<text>关闭</text>
			</view>
			<view class="confirm button" style="flex: 1; background-color: #202736; color: #ffffff;"
				@click="confirm">
				<text style="">确认</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {onBeforeMount,defineEmits,defineProps,reactive,watch,getCurrentInstance,ref} from "vue"
	const props = defineProps(['styledata', 'fixSelectData'])
	const emits = defineEmits(['closeupup', 'getfixSelectData','remind'])
	const change = (type, index) => {
		emits('getfixSelectData', type,index,'CRS')
	}
	const cancel = () => {
		emits('closeupup')
	}
	const confirm = () => {
		emits('closeupup')
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
	.left .red {
		background-color: red;
		height: 300rpx;
	}

	.left .blue {
		background-color: #2979FF;
		height: 150rpx;
	}


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
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 100%;
		height: 100%;
		/* background-color: orange;   */
		overflow: hidden;
	}


	.title .red {
		font-size: 35rpx;
		font-weight: 600;
		color: red;
	}

	.title .green {
		font-size: 35rpx;
		font-weight: 600;
		color: green;
	}

	.Buttongroup .button {
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

	.Buttongroup text {
		font-size: 35rpx;
		font-weight: 600;



	}

	.Buttongroup {
		width: 100%;
		height: 120rpx;
		display: flex;
		flex-direction: row;

	}

	.left {
		/*设置为伸缩容器*/

		display: -webkit-box;

		display: -moz-box;

		display: -ms-flexbox;

		display: -webkit-flex;

		display: flex;

		/*垂直居中*/

		-webkit-box-align: center;
		/*旧版本*/

		-moz-box-align: center;
		/*旧版本*/

		-ms-flex-align: center;
		/*混合版本*/

		-webkit-align-items: center;
		/*新版本*/

		align-items: center;
		/*新版本*/
	}

	.check {
		flex: 1;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;


		/* 边框 */
		border: 3rpx solid #edf0f3;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}

	.box {

		width: 100%;
		display: flex;
		flex-direction: row;
		text-align: center;


	}

	text {
		margin: 1px;
		font-size: 26rpx;

		text-align: center;
	}


	.gamebox {
		margin-top: 30rpx;
		display: flex;
		flex-direction: column;
	}

	.yc-data-checkbox {
		display: flex;
		flex-direction: column;
	}

	.title .box {
		text-align: center;
		background-color: #2979FF;
		margin: 20rpx;

		height: 100%;

	}

	.title {
		width: 100%;
		margin: 10px;


		display: flex;
		flex-direction: row;

	}

	.suspensionbox {

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
