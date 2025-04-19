<template>
	<view style="background-color: #fff;border-radius:20rpx 20rpx 0 0;">
		<view class="title" style="text-align: center;">
			<view class="boxt" style="flex:1;">
				<text style="font-size: 40rpx; font-weight: 600;">{{props.fixSelectData.HomeTeamAbbName}}</text>
			</view>
			<view class="boxt" style="flex:1;">
				<text style="color: #ff0000; font-size: 40rpx; font-weight: 600;">VS</text>
			</view>
			<view class="boxt" style="flex:1;">
				<text style="font-size: 40rpx; font-weight: 600; ">{{props.fixSelectData.AwayTeamAbbName}}</text>
			</view>
		</view>
		<scroll-view :scroll-top="0" scroll-y="true" class="scroll-Y">
			<view class="title"><!-- 胜平负让球 -->
				<text style="font-size: 35rpx; font-weight: 600;">胜平负让球
					<text :class="props.fixSelectData['HHAD'].GoalLine > 0 ?'red':'green'" style="font-size: 35rpx; font-weight: 600;">
						{{props.fixSelectData['HHAD'].GoalLine}}
					</text>
				</text>
			</view>
			<view class="checkbox ">
				<view class="box"><!-- 胜平负 -->
					<view class="box" v-if="noshowgame('HAD')">
						<view class="check" v-for="item,index in props.styledata.value.spf.res" :key="index"
							:style="props.styledata.value.spf.style[index]==0?'':' background-color: red; color: #fff;'"
							@click="props.fixSelectData['HAD'][styledata.value.spf.keyArr[index]]==0?remindchange():change('spf',index,'HAD')" >
							<view class="huadan">
								<view :class="noshowdan('HAD')?'inner-box1':''">
									<text v-show="noshowdan('HAD')" style="transform: scale(0.8);">单</text>
								</view>
								<text style="font-weight: 700;">{{item}}</text>
								<view style="display: flex;flex-direction: row;">
									<text style="margin-left: 5px;align-self:center;font-size:26rpx;">
												{{props.fixSelectData['HAD'][styledata.value.spf.keyArr[index]]==0?'--':props.fixSelectData['HAD'][styledata.value.spf.keyArr[index]]}}
									</text>
									<text v-if="props.fixSelectData['HAD'][styledata.value.spf.keyArr[index]+'F']!=0" :style="props.fixSelectData['HAD'][styledata.value.spf.keyArr[index]+'F']>0?'color:red;':'color:green;'">
										{{props.fixSelectData['HAD'][styledata.value.spf.keyArr[index]+'F']>0?'↑':'↓'}}
									</text>
								</view>
							</view>
						</view>
					</view>
					<view v-else class="check" style="flex: 1;height: 85rpx;">
						<view style="color: #999999;">未开售</view>
					</view>
				</view>
				
				<!-- 让球胜平负 -->
				<view class="box">
					<view class="box" v-if="noshowgame('HHAD')">
						<view class="check" v-for="item,index in props.styledata.value.rq.res"
							:key="index"
							:style="props.styledata.value.rq.style[index]==0?'':' background-color: red; color: #fff;'"
							@click="props.fixSelectData['HHAD'][styledata.value.spf.keyArr[index]]==0?remindchange():change('rq',index,'HHAD')">
							
							<view class="huadan">
								<text style="font-weight: 700;">{{item}}</text>
								<view style="display: flex;flex-direction: row;">
									<text style="margin-left: 5px; font-weight: 700;">
											{{props.fixSelectData['HHAD'][styledata.value.rq.keyArr[index]]==0?'--':props.fixSelectData['HHAD'][styledata.value.rq.keyArr[index]]}}
									</text>
									<text v-if="props.fixSelectData['HHAD'][styledata.value.spf.keyArr[index]+'F']!=0" :style="props.fixSelectData['HHAD'][styledata.value.spf.keyArr[index]+'F']>0?'color:red;':'color:green;'">
										{{props.fixSelectData['HHAD'][styledata.value.spf.keyArr[index]+'F']>0?'↑':'↓'}}
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
			<!-- 比分 -->
			<view class="title">
				<view style="margin-top: 10rpx;">
					<text v-show="noshowdan('CRS')" class="dan_lable">单</text>
					<text style="font-size: 35rpx; font-weight: 600;">比分</text>
				</view>
			</view>
			<view class="gamebox">
				<view style="display: flex;flex-direction: row;">
					<view class="left" style="flex: 1;display: flex;flex-direction: column;">
						<view :class="index==1?'red':index==2?'blue':'red'" v-for="index in 3" :key="index"
							style="color: #fff;display: flex;">
							<text style="align-self:center;">{{index==1?'胜':index==2?'平':'负'}}</text>
						</view>
					</view>
					<view class="right" style="flex: 19;">
						<view class="box">
							<view class="box" v-if="noshowgame('CRS')" style="flex-wrap: wrap;">
								<view class="check" v-for="item,index in props.styledata.value.bf.res" :key="index" style="height: 75rpx;" :style="(props.styledata.value.bf.style[index]==0?'':' background-color: red; color: #fff;') +''+ (index==12 || index==17 || index==30?'flex:100%;':'flex:25%;')" @click="props.fixSelectData['CRS'][styledata.value.bf.keyArr[index]]==0?remindchange():change('bf',index,'CRS')">
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
							<view v-else class="check" style="flex: 1;height: 750rpx;">
								<view style="color: #999999;">
									未开售
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 总进球 -->
			<view class="title">
				<view style="margin-top: 10rpx;">
					<text v-show="noshowdan('TTG')" class="dan_lable">单</text>
					<text style="font-size: 35rpx; font-weight: 600;">总进球</text>
				</view>
			</view>
			<view class="gamebox">
				<view class="box">
					<view class="box" v-if="noshowgame('TTG')" style="flex-wrap: wrap;">
						<view class="check" v-for="item,index in props.styledata.value.jq.res" :key="index"
							style="height: 75rpx;flex: 25%;"
							:style="props.styledata.value.jq.style[index]==0?'':' background-color: red; color: #fff;'"
							@click="props.fixSelectData['TTG'][styledata.value.bf.keyArr[index]]==0?remindchange():change('jq',index,'TTG')"
							>
							<view class="huadan">
								<text style="font-weight: 700;">{{item}}</text>
								<view style="display: flex;flex-direction: row;">
									<text style="margin-left: 5px; font-weight: 700;">
										{{props.fixSelectData['TTG'][styledata.value.jq.keyArr[index]]==0?'--':props.fixSelectData['TTG'][styledata.value.jq.keyArr[index]]}}
									</text>
									<text v-if="props.fixSelectData['TTG'][styledata.value.jq.keyArr[index]+'F']!=0" :style="props.fixSelectData['TTG'][styledata.value.jq.keyArr[index]+'F']>0?'color:red;':'color:green;'">
										{{props.fixSelectData['TTG'][styledata.value.jq.keyArr[index]+'F']>0?'↑':'↓'}}
									</text>
								</view>
							</view>
						</view>
					</view>
					<view v-else class="check" style="flex: 1;height: 150rpx;">
						<view style="color: #999999;">
							未开售
						</view>
					</view>
				</view>
			</view>
			<!-- 半全场 -->
			<view class="title">
				<view style="margin-top: 10rpx;">
					<text v-show="noshowdan('HAFU')" class="dan_lable">单</text>
					<text style="font-size: 35rpx; font-weight: 600;">半全场</text>
				</view>
			</view>
			<view class="gamebox">
				<view class="box">
					<view class="box" v-if="noshowgame('HAFU')" style="flex-wrap: wrap;">
						<view class="check" v-for="item,index in props.styledata.value.bqc.res" :key="index"
							style="height: 75rpx;flex: 33%;"
							:style="props.styledata.value.bqc.style[index]==0?'':' background-color: red; color: #fff;'"
							@click="props.fixSelectData['HAFU'][styledata.value.bf.keyArr[index]]==0?remindchange():change('bqc',index,'HAFU')"
							>
							<view class="huadan">
								<text style="font-weight: 700;">{{item}}</text>
								<view style="display: flex;flex-direction: row;">
									<text style="margin-left: 5px; font-weight: 700;">
										{{props.fixSelectData['HAFU'][styledata.value.bqc.keyArr[index]]==0?'--':props.fixSelectData['HAFU'][styledata.value.bqc.keyArr[index]]}}
									</text>
									<text v-if="props.fixSelectData['HAFU'][styledata.value.bqc.keyArr[index]+'F']!=0" :style="props.fixSelectData['HAFU'][styledata.value.bqc.keyArr[index]+'F']>0?'color:red;':'color:green;'">
										{{props.fixSelectData['HAFU'][styledata.value.bqc.keyArr[index]+'F']>0?'↑':'↓'}}
									</text>
								</view>
							</view>
						</view>
					</view>
					<view v-else class="check" style="flex: 1;height: 225rpx;">
						<view style="color: #999999;">
							未开售
						</view>
					</view>
				</view>
			</view>
			<view style="width:100%;height:20rpx;"></view>
		</scroll-view>
		<!-- 底部按钮 -->
		<view class="Buttongroup" style="">
			<view class="cancel button" style="flex: 1;background-color: #FFFFFF;color: #999999;" @click="cancel">
				<text>关闭</text>
			</view>
			<view class="confirm button" style="flex: 1; background: #1b273a; color: #ffffff;"
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

	const change = (type,index,gameId) => {
		emits('getfixSelectData',type,index,gameId)
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

<style lang="scss">
	.dan_lable{
		font-size: 35rpx;
		font-weight: 600;
		background: #1b273a;
		color: #FFFFFF;
		padding:10rpx 5rpx;
		border-radius:5rpx;
	}
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
		margin-top:10rpx;
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
	.title{
		width: 100%;
		display: flex;
		align-items: center;
		padding:30rpx 10rpx 10rpx 0;
	}
	.suspensionbox {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.scroll-Y{
		padding-bottom:120rpx; 
		max-height:60vh;
		padding:0rpx 10rpx;
		box-sizing: border-box;
	}

</style>
