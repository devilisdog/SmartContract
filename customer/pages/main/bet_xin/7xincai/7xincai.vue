<template>
	<!-- 导航 -->
	<view class="navigation">
		<view class="statusBar"></view>
		<view style="height: 80rpx;display: flex;align-items: center;justify-content: center;">
			<uni-icons color="#fff" type="back" @click="back()" size="19" style='position: absolute;left: 30rpx;'></uni-icons>
			<text style="color: #fff;font-size: 34rpx;">七星彩</text>
		</view>
	</view>
	<view style="height: var(--status-bar-height);padding-top: 85rpx"></view>
	<!-- 提示 -->
	<transition name="fade">
	<view class="tishi" v-show="tishi != 0">
		<text style="font-size: 28rpx;">请先完成选号!</text>
	</view>
	</transition>
	
	<view style="width: 750rpx;margin-top: 10rpx;"><!-- 历史中奖号码部分 -->
		<uni-collapse ref="wqsjss">
			<!-- 因为list默认带一条分隔线，所以使用 titleBorder="none" 取消面板的分隔线 -->
			<uni-collapse-item title-border='auto' :border="false" :show-animation="true">
				<template v-slot:title >
					<uni-list  :border="false">
						<view style="display: flex;height: 70rpx;align-items: center;color: #7a7a7a;margin-left:12rpx;">
							<text style="font-size:26rpx;">{{wqsj.code}}期</text>
							<!-- 球 -->
							<view v-for="itme,index in wqsj.lotteryDrawResult"  :key="index"
								style="width: 50rpx; height: 50rpx;background-color: #ff6f6f;border-radius: 50rpx;line-height: 50rpx;display: flex;margin-left:5rpx;">
								<text style="display: block; margin: auto;color: #fff;">{{itme}}</text>
							</view>
							<view style="line-height: 70rpx;font-size:26rpx;margin-left:10rpx;">
								<text>奖池:</text>
								<text style="color: red;">{{common.unitConvert(wqsj.poolmoney.replace(/,/g,'')-0).num}}{{common.unitConvert(wqsj.poolmoney.replace(/,/g,'')-0).unit}}</text>
							</view>
						</view>
					</uni-list>
				</template>
				<!-- // 历史栏下拉内容组件 --> 
				<qxcwqsj :list="wqsj.list" ></qxcwqsj>
			</uni-collapse-item>
		</uni-collapse>
	</view> 
	
	<view style="width: 700rpx;margin:auto;display:flex;justify-content: space-between;margin-top: 10rpx;">
		<view style="color: #9c9c9c;margin-top: -6rpx;">
			<text>每位至少选择<text style="color: red;">1</text>个号码</text>
		</view>
		<view style="width:90rpx; height: 40rpx;text-align: center;" class="borderuu">
			<view style="font-size:18rpx;margin-top:5rpx; color: #4d4d4d ;" @click="jianting_click()">机选</view>
		</view>
	</view>
	<view v-for="itme,index in wei">
		<text style="font-size: 30rpx;position: relative;top: 35rpx;left: 30rpx;color: #4a4a4a;">{{itme}} :</text>
		<view style="margin-left: 20rpx;">
		<qixincaiboo @change='jieshou' :Index='index' :dele="dele" :isjixuan='isjixuan'></qixincaiboo>
	</view>
	<!-- 下划线 -->
		<view style="width: 720rpx;height: 2rpx;background-color: #f7f7f7;margin: auto;margin-top: -5rpx;"></view>
	</view>

	
	<!-- 这个用来顶内容不然会被提交栏遮住 -->
	<view style="width: 100%;height: 1rpx;margin-top: 23%;"></view>

	<!-- 提交栏 -->
	<view class="submit">
		<view class="submit-top">
			<text style="font-weight: bold;">{{designatedTime}}</text>
			<text>期&nbsp {{daelDateArr.deyStr}}</text>
			<text style="font-weight:bold;">{{daelDateArr.daelHours}}</text>
			<text>分截止</text>
		</view>
		<view class="submit-bottom">
			<view style="margin-left: 25rpx;">
				<uni-icons class="input-uni-icon" type="trash" size="35" color="#c5c5c5" @click="dele_a()" />
			</view>
			<view style="font-size: 26rpx;">
				<text>已选</text>
				<text style="color: red;">{{data.value.note}}</text>
				<text>注</text>
				<text  style="color: red;">{{data.value.money}}</text>
				<text>元 </text>
			</view>
			<view class="bottom-button" style=" height: 75rpx; width: 350rpx;">
				<view class="bottom-button01">
					<text style="font-size: 28rpx;" @click="addNumber()">+加入选号</text>
				</view>
				<view class="bottom-button02">
					<text style="font-size: 30rpx;" @click="messageToggle()">提交</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import qxcwqsj from "@/components/main/bet/qixincai/wqsj.vue"
	import qixincaiboo from "@/components/main/bet/qixincai/qixincaiboo.vue"
	import api from "@/common/vmeitime-http/sporttery.js"
	import common from "@/common/common.js"
	import { useCounterStore } from '@/stores/counter'
	import { onBackPress } from '@dcloudio/uni-app'
	import initDate from "@/common/getdatetime.js"
	import {onBeforeMount,ref,reactive,getCurrentInstance,nextTick,} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore() //状态管理
	
	// 往期数据
	const wqsj = reactive({
		code: '',
		poolmoney:'',
		lotteryDrawResult: [],
		list: []
	})
	onBackPress(()=>{
		if(counter.submitNewData.length > 0){
			back()
			return true
		}
	})
	const designatedTime = ref()
	const week = ref()
	onBeforeMount(() => {
		week.value = new Date().getDay()
		api.GetHistory({"gameNo": "04","pageSize": "10","pageNo": '1'}).then((res) => {
			designatedTime.value =res.data.data.issue
			if (res.data.code === 1) {
				for (var i = 0; i <= res.data.data.data.length - 1; i++) {
					if (i == 0) {
						wqsj.code = res.data.data.data[i].code
						wqsj.poolmoney = res.data.data.data[i].poolmoney
						wqsj.lotteryDrawResult = res.data.data.data[i].lotteryDrawResult
						wqsj.SaleEndtime=res.data.data.data[i].SaleEndtime
					} else {
						var arr = {
							code: res.data.data.data[i].code,
							poolmoney:res.data.data.data[i].poolmoney,
							lotteryDrawResult: res.data.data.data[i].lotteryDrawResult,
							SaleEndtime:res.data.data.data[i].SaleEndtime
						}
						wqsj.list.push(arr)
					}
				}
				nextTick(() => {
					proxy.$refs.wqsjss.resize()
				})
				getjiezhitime()
			} else {
				bouttmBoole.value=false
				uni.showToast({
					title:'往期中奖数据获取失败~',
					position:"center",
					icon:"error",
					duration:2500
				})
			}
		})
		init()
	})
	
	const init =()=>{
		var arr = {
			note: 0,
			beilv:1,
			money: 0,
			name:"七星彩",
			yeimian:"qxincai",
			data:{
				0:[],
				1:[],
				2:[],
				3:[],
				4:[],
				5:[],
				6:[]
			},
		}
		
		data.value=arr
	}
	
	const dele = ref(true)
	
	const dele_a = () =>{
		dele.value = !dele.value
		init()
	}
	
	const wei = reactive(['第一位','第二位','第三位','第四位','第五位','第六位','第七位'])
	
	
	const data = reactive({})
	
	

	
	
	// 机选按钮
	const isjixuan = ref(false)
	const jianting_click = ()=>{
		init()
		isjixuan.value = !isjixuan.value
		
	}
	
	const jieshou=(index,e,isadd)=>{
		if(isadd==true){
			data.value.data[index].push(e)
		}else{
			var xb = data.value.data[index].findIndex(item =>item == e)
			data.value.data[index].splice(xb, 1)
		}
		
		var bool =true
		var arr =[]
		for(var i=0;i<=6;i++){
			arr.push(data.value.data[i].length)
			if(data.value.data[i].length==0){bool=false;break}
			
		}
		if(bool==true){
			data.value.note=common.NoteCompute(arr,7)
			data.value.money = data.value.note*2
		}else{
			data.value.note=0
			data.value.money = data.value.note*2
		}

		
	}
	
	const back =()=>{
		counter.submitNewData = []
		counter.submitData = []
		uni.navigateBack({
			delta:1,
			animationType: 'pop-out',
			animationDuration: 200
		})
	}
	
	
	// 提示显示值
	let tishi = ref(0)
	// 定时器
	const time = () =>{
		let timer = setTimeout(() => {
			tishi.value = 0
			clearTimeout(timer)
		  }, 2000)
		  
	}
	
	const messageToggle = () => {
		if(!bouttmBoole.value){
			uni.showToast({title:'本期已截止、请等待下期开启后在进行投注~',icon:'none',position:'center'})
			return
		}
		for(var i = 0 ; i < data.value.data.length ; i++){
				return i
			}
			if(data.value.data[i].length > 0 || counter.submitNewData.length > 0){
				if(data.value.data[0].length > 0 && data.value.data[1].length > 0 && data.value.data[2].length > 0 
					&& data.value.data[3].length > 0 && data.value.data[4].length && data.value.data[5].length && data.value.data[6].length){
						for(var j = 0 ; j < 7 ; j++){
							data.value.data[j] = common.quickSort(data.value.data[j])
						}
					counter.submitNewData.push(data.value)
				}else{
					uni.navigateTo({
						url: '/pages/main/submit/submit_shuzi?nowDeadline='+daelDateArr.daelDate+'&lssue='+designatedTime.value,
						animationType: 'pop-in',
						animationDuration: 200
					});
				}
				dele_a()
				uni.navigateTo({
					url: '/pages/main/submit/submit_shuzi?nowDeadline='+daelDateArr.daelDate+'&lssue='+designatedTime.value,
					animationType: 'pop-in',
					animationDuration: 200
				});
			}else{
				tishi.value = 1
				if(tishi.value != 0){
					time()
				}
			}
	}
	
	
	const addNumber =()=>{
		if(!bouttmBoole.value){
			uni.showToast({title:'本期已截止、请等待下期开启后在进行投注~',icon:'none',position:'center'})
			return
		}
		for(var i = 0 ; i < data.value.data.length ; i++){
				return i
			}
			if(data.value.data[i].length > 0 ){
				if(data.value.data[0].length > 0 && data.value.data[1].length > 0 && data.value.data[2].length > 0 
					&& data.value.data[3].length > 0 && data.value.data[4].length && data.value.data[5].length && data.value.data[6].length){		
						for(var j = 0 ; j < 7 ; j++){
							data.value.data[j] = common.quickSort(data.value.data[j])
						}
					counter.submitNewData.push(data.value)
					dele_a()
					uni.showToast({
						icon:'none',
						title: '加入成功',
						duration: 2000
					});
				}
			}else{
				tishi.value = 1
				if(tishi.value != 0){
					time()
				}
			}
	}
	
	const daelDateArr=reactive({//截止事件处理后保存在此
		deyStr:'',//今天、明天、后天
		daelDate:'',//完整的投注截止时间
		daelHours:''
	})
	const bouttmBoole=ref(true)//提交按钮禁用
	const systime = ref(counter.gameAstrict.advance)// systime后续接入店铺自定义时间
	const getjiezhitime=()=>{//截止时间计算
		var nowDate=new Date()
		nowDate.setHours('21')
		nowDate.setMinutes('00')
		nowDate.setMinutes(nowDate.getMinutes()-systime.value)
		daelDateArr.daelHours=nowDate.getHours()+':'+nowDate.getMinutes()
		TiemJudge()
	}
	
	const TiemJudge = () =>{// 完整截止时间返回
		var weekArr=['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
		var daelWeek=['星期二','星期五','星期日']
			var strArr=['今天','明天','后天','大后天~']
		var differenceWeek=0//距离下个开奖时间相隔多少天
		var daelDate=new Date()//最终截止时间
		var nowDate=new Date//用户当前时间
		daelDate.setHours(daelDateArr.daelHours.split(':')[0])
		daelDate.setMinutes(daelDateArr.daelHours.split(':')[1])
		daelDate.setSeconds('00')
		for(var i=0;i<5;i++){
			if(!daelWeek.includes(weekArr[daelDate.getDay()])){//如果当天不等于开奖周
				differenceWeek++
				daelDate.setDate(daelDate.getDate()+1)
			}else{break}
		}
		if(nowDate.getTime()<daelDate.getTime()){
			daelDateArr.deyStr=strArr[differenceWeek]
			daelDateArr.daelDate=initDate.getNowFormatDate(0,daelDate.getTime())
		}else{
			var oneData=new Date(wqsj.SaleEndtime)//上一期开奖时间
			for(var i=0;i<5;i++){
				if(!daelWeek.includes(weekArr[daelDate.getDay()]) || nowDate.getTime()>daelDate.getTime()){
					differenceWeek++
					daelDate.setDate(daelDate.getDate()+1)
				}else{break}
			}
			daelDateArr.deyStr=strArr[differenceWeek]
			daelDateArr.daelDate=initDate.getNowFormatDate(0,daelDate.getTime())
			if(nowDate.getFullYear()==daelDate.getFullYear()){//当天时间与截止时间是同一年的话执行
				if(oneData.getDate()==nowDate.getDate()){return}//如果往期的第一期是用户当天时间开奖就不加1
				designatedTime.value=String(Number(designatedTime.value)+1)
			}else{//不同年份重置期数
				if(oneData.getDate()==nowDate.getDate()){return}//如果往期的第一期是用户当天时间开奖就不加1
				designatedTime.value=String(daelDate.getFullYear()).substring(2,4)+'001'
			}
		}
	}
	
</script>

<style>
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
	}
	
	/* 导航 */
	.navigation{
		width: 100%;
		background-color: #f04b49;
		position: fixed;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 1;
		box-shadow: 0 5rpx 15rpx -8rpx #ebebeb;
	}
	
	.borderuu {
		border-radius: 10rpx;
		border: 1rpx solid #a2a2a2;
	}
	.submit {
		width: 100%;
		height: 170rpx;
		bottom: -10rpx;
		position: fixed;
	}
	
	.submit-top {
		width: 100%;
		height: 55rpx;
		display: flex;
		justify-content: center;
		background-color: beige;
		align-items: center;
	}
	
	.submit-top text {
		color: #4a4a4a;
		font-size: 28rpx;
	}
	
	.submit-bottom {
		width: 100%;
		height: 105rpx;
		display: flex;
		background-color: #fff;
		align-items: center;
		justify-content: space-between;
	}
	
	.submit-bottom view text {
		font-size: 30rpx;
	}
	.bottom-button {
		border-radius: 20rpx;
		display: flex;
	}
	
	.bottom-button01 {
		width: 50%;
		display: flex;
		background-color: #ffe999;
		border-radius: 20rpx 0 0 20rpx;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
	}
	
	.bottom-button02 {
		width: 50%;
		display: flex;
		background: #f04b49;
		border-radius: 0 20rpx 20rpx 0;
		justify-content: center;
		align-items: center;
		color: #fff;
	}
	
	
	
	/* 提示样式 */
	.tishi{
		position: fixed;
		width: 240rpx;
		height: 70rpx;
		border-radius: 15rpx;
		background-color:rgba(18, 18, 18, 0.8);
		margin: 65% 35%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #eaeaea;
		letter-spacing: 2rpx;
	}
	
	/* 提示淡出淡入 */
	.fade-enter-from{
		opacity: 0;
	}
	.fade-enter-active{
		transition: all 1s;
	}
	.fade-enter-to{
		opacity: 1;
	}
	.fade-leave-from{
		opacity: 1;
	}
	.fade-leave-active{
		transition: all 1s;
	}
	.fade-leave-to{
		opacity: 0;
	}
</style>
