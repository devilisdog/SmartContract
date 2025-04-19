<template>
	<view style="border-radius:20rpx 20rpx 0 0;background-color:#fff;">
		<!-- 标题 -->
		<view class="suspensionbox" style="">
			<view class="boxt" style="flex:1.5;">
				<text style="font-size: 40rpx; font-weight: 600;">{{props.fixSelectData.home}}</text>
			</view>
			<view class="boxt" style="flex:0.3;">
				<text style="color: #ff0000; font-size: 40rpx; font-weight: 600;">VS</text>
			</view>
			<view class="boxt" style="flex:1.5;">
				<text style="font-size: 40rpx; font-weight: 600; ">{{props.fixSelectData.away}}</text>
			</view>
		</view>
		<view class="gamebox" style="margin: 15rpx;">
			<view class="box" v-if="noshowgame()"
				style="flex-wrap: wrap;">
				<view class="check" v-for="item,index in props.styledata.value.res"
					:key="index" style="height: 75rpx;flex: 20%;"
					:style="(props.styledata.value.style[index]==0?'':'background-color: red; color: #fff;')  + (styleadd(index)?'margin-top: 10px;':'')"
					@click="change(index)">
					<view class="huadan">
						<text style="font-weight: 700;">{{item}}</text>
						<view style="display: flex;flex-direction: row;">
							<text style="margin-left: 5px; font-weight: 700;">
								{{props.fixSelectData.odds.bf[props.styledata.value.rate[index]]}}
							</text>
						</view>
					</view>
				</view>
			</view>
			<view style="height:550rpx;text-align: center;line-height:550rpx;font-size:58rpx;" v-else>
				<view style="color: #999999;">
					未开售
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
	import {
		onBeforeMount,
		defineEmits,
		defineProps,
		reactive,
		watch,
		getCurrentInstance,
		ref
	} from "vue"

	const props = defineProps(['styledata', 'fixSelectData','count'])
	const emits = defineEmits(['closeupup', 'getfixSelectData','getfixSelectDataS'])

	const scrollTop = ref(0)
	const change = (index) => {
		emits('getfixSelectData',index,1)
	}
	
	const change02 = (index) => {
		emits('getfixSelectDataS',index)
	}

	const cancel = () => {
		emits('closeupup')
		// console.log(props.styledata);
	}

	const confirm = () => {
		emits('closeupup')
	}

	const styleadd=(index)=>{
		if(index>9 && index <=19)
		{return true}else{return false}
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
		width: 600rpx;
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
		font-size: 32rpx;
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
		margin-top:40rpx;

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
		border-radius:10rpx;
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
		justify-content: center;
		align-items: center;
		text-align:center;
		padding:20rpx;
	}
</style>
