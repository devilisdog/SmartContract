<template>
	<view class="uni-goods-nav">
		<!-- 底部占位 -->
		<view class="nav" style="height: 100%;width: 100%;">
			<view class="select" v-show="show" style="background-color: #fff;">
				<view>
					<view class="title">
						<view>自由过关</view>
						<view @click="Packup" class="close">收起</view>
					</view>
					<view class="Content">
						<!-- 循环渲染隐藏的内容 -->
						<view v-for="(item,index) in hideList" :key="index"  @click="changeColor(item)" :class="item.isActive?'redColor':''">{{item.text=='1单关1'? '单关' : item.text}}</view>
					</view>
				</view>
				<view v-show="ismnshow===true&&mnhideList.length != 0" v-if="props.Type == '北京单场' ? false : props.Type == '胜负过关' ? false : true">
					<view class="title">
						<view>多串过关</view>
					</view>
					<view class="Content">
						<!-- 循环渲染隐藏的内容 -->
						<view v-for="(item,index) in mnhideList" :key="index"  @click="mnchangeColor(item)" :class="item.isActive?'redColor':''">{{item.text}}</view>
					</view>
				</view>
			</view>
			<view class="check" style="height: 50px; width: 100%; background-color: #fff; display: flex;flex-direction: row;" >
				<view style="margin: 15rpx; width: 100%;">
					<view class="" >
						<uni-row  :gutter="gutter" >
							<uni-col :span="10" :pull="0">
								<view 
									:style="props.Type == '任选九' || props.Type == '胜负彩'?'display: none;':''"
									style="height: 50rpx; width:280rpx ;margin: 5rpx;border: 2rpx solid #ccc;text-align: center;" @click="click"> 
									<uni-row  :gutter="gutter">
										<uni-col :span="20" :push="2">
											<view v-show="hidetext.length===0">
												<text style="font-size: 26rpx; width: 100%;">请选择过关方式</text>
											</view>
											<view class="hidetext" v-show="hidetext.length!==0">
												<text style="font-size: 26rpx; width: 100%;">{{gethidetext()}}</text>
											</view>
										</uni-col>
										<uni-col :span="4" :push="0">
											<img style="height: 50prx; width: 50rpx;" src="@/static/img/main/drop-down.png" alt="">
										</uni-col>
									</uni-row>
								</view>
							</uni-col>
							
							<uni-col :span="8" :push="props.Type == '任选九' || props.Type == '胜负彩'?16:0">
								
								<numberBox @numberChange="numChange" :minValue="0"></numberBox>
								<!-- <uni-number-box v-model="numberValue" background="#bcbcbc" color="#fff" class="numberControl" @change="numChange" :max="100000"/> -->
							</uni-col>
							<uni-cil :span="4" :push='0' style="margin-left: 15rpx;">
								<button size="mini" @click="savePlan" style="font-size: 28rpx;background-color: #ffeec6;color: #3d3d3d;padding: 0rpx 10rpx;">保存方案</button>
							</uni-cil>
						</uni-row>
					</view>
					
				</view>
				
			</view>
			<view class="uni-tab__seat" />
				<view class="uni-tab__cart-box flex" >
					<!-- 垃圾桶 -->
					<view class="flex uni-tab__cart-sub-left" v-if="Show_trash_filled">
						<view class="flex uni-tab__cart-button-left uni-tab__shop-cart" @click="onClick()">
							<view class="uni-tab__icon">
								<uni-icons type="trash-filled" size="20" color="#646566"></uni-icons>
							</view>
							<text class="uni-tab__text">清空</text>
						</view>
					</view>
					<view style="height: 100%; margin:auto; text-align: center; display: flex; flex-direction: column;line-height:45rpx; "
						:style="Show_trash_filled==false ? 'width: 50%;':'width: 60%;'">
						<view >
							<text :style="Show_trash_filled==false ? 'font-size:26rpx;':false">共{{valuesdata['Note']}}注 {{valuesdata['Multiple']}}倍 {{(valuesdata['Amount']).toFixed()}}元</text>
						</view>
						<view v-if="valuesdata['Note'] !== 0">
							<view :style="props.Type == '任选九' || props.Type == '胜负彩' ? 'display:none;':false" style="overflow: hidden; white-space:nowrap;height: 90rpx;">
								<text v-if="valuesdata['bonusmin']===valuesdata['bonusmax']&&(valuesdata['bonusmax']*valuesdata['Multiple']).toFixed(2)<5000000&&Show_trash_filled"
										style="font-size:28rpx;color:#ff6060;">
											预测奖金{{(valuesdata['bonusmax']*valuesdata['Multiple']).toFixed(2)}}元</text>
								<text v-if="valuesdata['bonusmin']!==valuesdata['bonusmax']&&(valuesdata['bonusmax']*valuesdata['Multiple']).toFixed(2)<5000000&&Show_trash_filled"
										style="font-size:28rpx;color:#ff6060;">
											预测奖金{{(valuesdata['bonusmin']*valuesdata['Multiple']).toFixed(2)}}~{{(valuesdata['bonusmax']*valuesdata['Multiple']).toFixed(2)}}元</text>
								<text v-if="(valuesdata['bonusmax']*valuesdata['Multiple']).toFixed(2) > 5000000&&Show_trash_filled"
									style="font-size:28rpx;color:#ff6060;">
									预测奖金5,000,000.00元
								</text>
								
								<!-- 这个是竞彩篮球足球特供 -->
								<view v-if="Show_trash_filled==false" style="overflow: hidden; white-space:nowrap;height: 90rpx;">
									<text v-if="valuesdata['bonusmin']===valuesdata['bonusmax']&&valuesdata['bonusmin']!='0.00'"
											:style="Show_trash_filled==false ? 'font-size:26rpx;color:#ff6060;':false">
												预测中奖：{{(valuesdata['bonusmax']*valuesdata['Multiple']).toFixed(2)}}</text>
									<text v-if="valuesdata['bonusmin']!==valuesdata['bonusmax']&&valuesdata['bonusmin']!='0.00'"
											:style="Show_trash_filled==false ? 'font-size:26rpx;color:#ff6060;':false">
												{{(valuesdata['bonusmin']*valuesdata['Multiple']).toFixed(2)}}~{{(valuesdata['bonusmax']*valuesdata['Multiple']).toFixed(2)}}</text>
									<text v-if="valuesdata['bonusmin']=='0.00'"
											:style="Show_trash_filled==false ? 'font-size:28rpx;color:#ff6060;':false">
												{{(valuesdata['bonusmax']*valuesdata['Multiple']).toFixed(2)}}</text>
								</view>
							</view>
							<view v-show="props.Type == '任选九' || props.Type == '胜负彩'">
								<text style="color: red;">单注最高奖金500万元</text>
							</view>
						</view>
							<text v-if="valuesdata['Note'] == 0" style="font-size:28rpx;color:#ff6060;">预测奖金0.00元</text>
					</view>
					
					<view class="flex uni-tab__cart-sub-right" v-if="Show_trash_filled">


						<view style="background: #202736;" class="flex uni-tab__cart-button-right" @click="buttonClick(0)">
							<text style="color: #ffffff;" class="uni-tab__cart-button-right-text">提交</text>
						</view>
					</view>
					<view v-else 
						style="display: flex;width: 380rpx;height: 90rpx;overflow: hidden;border-radius: 25rpx;margin-right: 10rpx;">
						<view @click="buttonClick(1)" class="button"
							style="height: 90rpx;background-color: #ffeec6;transition: all 0.5s;border-radius: 25rpx 0 0 25rpx;"
							:style="valuesdata['Note'] != 0 && showButton?'width: 50%;':'width: 0%;pointer-events: none;'">
								<text style="font-size: 34rpx;color: #3d3d3d; white-space:nowrap;overflow:hidden;">奖金优化</text>
							</view>
						<view @click="buttonClick(0)"  class="button"
							style="height: 90rpx;background: #202736;transition: all 0.5s;border-radius: 0 25rpx 25rpx 0;"
							:style="valuesdata['Note'] != 0 && showButton?'width: 50%;':'width: 100%;'">
								<text style="font-size: 34rpx;color: #fff;">提交</text>
							</view>
					</view>
					
				</view>
			</view>
			
		</view>
		
</template>

<script setup>
	import {onBeforeMount,ref,reactive,getCurrentInstance,defineProps,defineEmits} from 'vue';
	import {useCounterStore} from '@/stores/counter';
	import numberBox from "../../../components/common/yc-newNumber_box/yc-newNumber_box.vue"
	const counter = useCounterStore() //状态管理
	import common from '@/common/common'
	const numberValue=ref(50)
	const Show_trash_filled = ref(true)
	onBeforeMount(() => {
		if(props.Type == '竞彩足球' || props.Type == '竞彩篮球'){
			Show_trash_filled.value = false
		}
	})
	const props = defineProps(
		[
			'ismnshow',
			'hideList',
			'mnhideList',
			'valuesdata',
			'hidetext',
			'Type',
			'BonusOptimization'//店主是否开启了奖金优化
		]
	)//接收传值
	// console.log(props.valuesdata)
	const emits = defineEmits(['hidelick','mnhidelick','changMultiple','buttonClick','initData','savePlan'])
	const gutter =ref(0)
	const show = ref(false)
	// 数字选择器选择改变
	const numChange = (e) =>{
		emits("changMultiple",e)
	}
	// 过关方式按钮 弹起/收起
	const click = (e) =>{
		if(show.value == false){
			show.value = true
		}else{
			show.value = false
		}		
	}
	
	// 过关方式弹窗弹起-收起
	const Packup =() =>{
		show.value = false
	}
	
	const showButton = ref(true)
	
	// 自由过关选择
	const changeColor =(e)=>{
		showButton.value = true
		emits("hidelick",e)
	}
	// 多串过关选择
	const mnchangeColor =(e)=>{
		showButton.value = false
		emits("mnhidelick",e)
	}
	
	const onClick=()=>{
		emits('initData')
	}
	//复杂玩法限制
	// const fuz_value = ref([])
	// const fuz = () =>{
	// 	for(var i = 0; i < counter.BettingContent.Content.length ; i++){
	// 		fuz_value.value[i] = 0
	// 		for(var j = 0; j < counter.BettingContent.Content[i].complex.length ; j++){
	// 			fuz_value.value[i] += counter.BettingContent.Content[i].complex[j].value;
	// 		}
	// 	}
	// 	var values = 0
	// 	for(var o = 0; o < fuz_value.value.length ; o++){
	// 		values += fuz_value.value[o]
	// 	}
		
	// 	if(values > counter.BettingContent.Content.length+2){
	// 		return true
	// 	}else{
	// 		return false
	// 	}
	// 	// console.log('计算结果',fuz_value.value);
	// }
	
	
	// 提交按钮点击
	const buttonClick = (e) =>{
		if(Show_trash_filled.value==false){
			if(e == 0){
				emits("buttonClick")
			}else {
				if (props.valuesdata.Note>80){
					uni.showToast({
						title:'大于80注禁止奖金优化！',
						position:'center',
						icon:'error'
					})
				}else if(props.BonusOptimization=='0'){
					uni.showToast({
						title:'店主关闭了奖金优化喔~',
						position:'center',
						icon:'none'
					})
				}else if(props.Type=='竞彩篮球'){
					if(counter.BettingContent.Content.length>3){
						uni.showToast({
							title:'三场以上比赛不支持玩法多选',
							position:'center',
							icon:'none'
						})
					}else{
						counter.BettingContent.remarks=[]
						counter.BettingContent.remarks=props.valuesdata
						counter.BettingContent.remarks.reachType=props.hidetext
						uni.navigateTo({
							url: '../submit/optimizing',
							animationType: "slide-in-right",
							animationDuration: 400
						});
					}
				}else{
					counter.BettingContent.remarks=[]
					counter.BettingContent.remarks=props.valuesdata
					counter.BettingContent.remarks.reachType=props.hidetext
					uni.navigateTo({
						url: '../submit/optimizing',
						animationType: "slide-in-right",
						animationDuration: 400
					});
				}
			}
		
		}else{
			emits("buttonClick")
		}
	}
	
	const gethidetext = ()=>{
		var hidenewtext = ''
		var data = common.ArraySort(props.hidetext)
		for(var i=0;i<=data.length-1;i++){
			if(i===0){
				hidenewtext = data[i]
			}else{
				hidenewtext = hidenewtext + ','+ data[i]
			}
		}	
		// 替换1单关1为单关
		return common.formatEllipsis(hidenewtext.replace(/1单关1/,"单关"),15)
	}
	
	const savePlan = ()=>{
		emits("savePlan")
	}
</script>
<style lang="scss" scoped>
.close{
	border:1rpx #ccc solid;
	text-align:center;
	padding:5rpx 10rpx;
	border-radius:5rpx;
}
	
.redColor{
	background-color: red;
	color: #fff;
}


.nav .select .Content{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: row;
	flex-wrap: wrap;
	view {
		text-align: center;
		width: 23.8%;
		margin: 10rpx 20rpx;
		padding: 5rpx 10rpx;
		border: 2rpx solid #ccc;
	}
	
}
	
.nav .select .title{
	display:flex;
	width:700rpx;
	margin:20rpx auto;
	align-items:center;
	justify-content: space-between;
	color: #aaaaaa;
}
	
.nav .select{

	font-size: 25rpx;
}

.flex {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
}

.uni-goods-nav {
	/* 边框 */
	border-top: 1rpx solid #aaaaaa;
	  -webkit-box-sizing: border-box; 
	  box-sizing: border-box;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex: 1;
	flex-direction: row;
	background-color: white;
}

.uni-tab__cart-box {
	flex: 1;
	height: 50px;
	background-color: #fff;
	z-index: 900;
}

.uni-tab__cart-sub-left {
	padding: 0 5px;
}

	.uni-tab__cart-sub-right {
		flex: 1;
	}.uni-tab__cart-sub-right-button{
		color: #fff;
		font-size: 34rpx;
	}

.uni-tab__right {
	margin: 5px 0;
	margin-right: 10px;
	border-radius: 100px;
	overflow: hidden;
}

.uni-tab__cart-button-left {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	// flex: 1;
	position: relative;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	margin: 0 10px;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.uni-tab__icon {
	width: 18px;
	height: 18px;
}

.image {
	width: 18px;
	height: 18px;
}

.uni-tab__text {
	margin-top: 3px;
	font-size: 12px;
	color: #646566;
}

.uni-tab__cart-button-right {
	border-radius:20rpx 0 0 20rpx;
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	flex: 1;
	justify-content: center;
	align-items: center;
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.uni-tab__cart-button-right-text {
	font-size: 14px;
	color: #fff;
}

.uni-tab__cart-button-right:active {
	opacity: 0.7;
}

.uni-tab__dot-box {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	position: absolute;
	right: -2px;
	top: 2px;
	justify-content: center;
	align-items: center;
	// width: 0;
	// height: 0;
}

.uni-tab__dot {
	// width: 30rpx;
	// height: 30rpx;
	padding: 0 4px;
	line-height: 15px;
	color: #ffffff;
	text-align: center;
	font-size: 12px;
	background-color: #ff0000;
	border-radius: 15px;
}

.uni-tab__dots {
	padding: 0 4px;
	// width: auto;
	border-radius: 15px;
}
	.button{
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>