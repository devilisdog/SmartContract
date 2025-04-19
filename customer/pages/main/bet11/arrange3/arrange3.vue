<template>
	<view>
		<!-- 导航 -->
		<view class="navigation">
			<view class="statusBar"></view>
			<view style="height: 80rpx;display: flex;align-items: center;justify-content: center;">
				<uni-icons color="#fff" type="back" @click="back()" size="19" style='position: absolute;left: 30rpx;'></uni-icons>
				<text style="color: #fff;font-size: 34rpx;">排列三</text>
			</view>
		</view>
		<view style="height: var(--status-bar-height);padding-top: 85rpx"></view>
		<!-- 提示 -->
		<transition name="fade">
		<view class="tishi" v-show="tishi != 0">
			<text style="font-size: 28rpx;">请先完成选号!</text>
		</view>
		</transition>

		<!-- 历史栏 -->
		<view style="width: 750rpx;margin-top: 10rpx;">
			<!-- 历史中奖号码部分 -->
			<uni-collapse ref="wqsjss">
				<!-- 因为list默认带一条分隔线，所以使用 titleBorder="none" 取消面板的分隔线 -->
				<uni-collapse-item title-border='auto' :border="false">
					<template v-slot:title>
						<uni-list :border="false">
							<view
								style="display: flex;height: 70rpx;align-items: center;color: #7a7a7a;padding-left: 20rpx;">
								<text>{{wqsj.code}}</text>
								<text style="margin-right: 50rpx;">期</text>
								<!-- 球 -->
								<view v-for="itme in wqsj.lotteryDrawResult"
									style="width: 50rpx; height: 50rpx;background-color: #ff6f6f;border-radius: 50rpx;line-height: 50rpx;display: flex;margin-left: 10rpx;">
									<text style="display: block; margin: auto;color: #fff;">{{itme}}</text>
								</view>
							</view>
						</uni-list>
					</template>
					<!-- // 历史栏下拉内容组件 -->
					<lszj :list="wqsj.list"></lszj>

				</uni-collapse-item>
			</uni-collapse>
		</view>

		<view>
			<uni-segmented-control :current="current" :values="items.data" @clickItem="onClickItem" styleType="text"
				activeColor="#ff8800"></uni-segmented-control>
			<view class="content">
				<!-- 直选 -->
				<view v-show="current == 0">
					<view class="blgbox">
						<view :class="xuanzh===index?'boxtt':'boxtt11'" v-for="item,index in items.list[current].name" :key="index"
							@click="diandian(index)">
							<text>{{item}}</text>
						</view>
					</view>
					<!-- 定位复式 -->
					<view style="width: 100%; height:900rpx;" v-show="xuanzh === 0">
						
						<zhixuandingwei :dele="dele" @datachange="datachange"></zhixuandingwei>
					</view>
					<!-- 直选复式 -->
					<view style="width: 100%; height:700rpx;" v-show="xuanzh === 1">
						<zhixuanfushi :dele="dele" @datachange="datachange"></zhixuanfushi>
					</view>
					<!-- 直选和值 -->
					<view style="width: 100%; height:700rpx;" v-show="xuanzh === 2">
						<zhixuanhezhi :dele="dele" @datachange="datachange"></zhixuanhezhi>
					</view>
					<!-- 组合拖胆-->
					<view style="width: 100%; height:700rpx;" v-show="xuanzh === 3">
						<zhixuanzutuodan :dele="dele" @datachange="datachange"></zhixuanzutuodan>
					</view>
					<!-- 跨度复式-->
					<view style="width: 100%; height:700rpx;" v-show="xuanzh === 4">
						<zhixuankuadufushi :dele="dele" @datachange="datachange"></zhixuankuadufushi>
					</view>
				</view>
			
				<!-- 组三 -->
				<view v-show="current == 1">
					<view class="blgbox">
						<view :class="xuanzh===index?'boxtt':'boxtt11'" v-for="item,index in items.list[current].name" :key="index"
							@click="diandian(index)">
							<text>{{item}}</text>
						</view>
					</view>
					<view v-show="xuanzh == 0">
						<zu3danshi :dele="dele" @datachange="datachange"></zu3danshi>
					</view>
					<view v-show="xuanzh == 1">
						<zu3fushi :dele="dele" @datachange="datachange"></zu3fushi>
					</view>
					<view v-show="xuanzh == 2">
						<zu3tuodan :dele="dele" @datachange="datachange"></zu3tuodan>
					</view>
					<view v-show="xuanzh == 3">
						<zu3kuadufushi :dele="dele" @datachange="datachange"></zu3kuadufushi>
					</view>
				</view>
				<!-- 组六-->
				<view v-show="current==2">
					<view class="blgbox">
						<view :class="xuanzh===index?'boxtt':'boxtt11'" v-for="item,index in items.list[current].name" :key="index"
							@click="diandian(index)">
							<text>{{item}}</text>
						</view>
					</view>
					<view v-show="xuanzh == 0">
						<zu6fushi :dele="dele" @datachange="datachange"></zu6fushi>
					</view>
					<view v-show="xuanzh == 1">
						<zu6tuodan :dele="dele" @datachange="datachange"></zu6tuodan>
					</view>
					<view v-show="xuanzh == 2">
						<zu6kuadu :dele="dele" @datachange="datachange"></zu6kuadu>
					</view>
				</view>
				
				<!-- 组选 -->
				<view v-show="current==3">
					<view class="blgbox">
						<view :class="xuanzh===index?'boxtt':'boxtt11'" v-for="item,index in items.list[current].name" :key="index"
							@click="diandian(index)">
							<text>{{item}}</text>
						</view>
					</view>
					<view v-show="xuanzh == 0">
						<zuxuanhezhi :dele="dele" @datachange="datachange"></zuxuanhezhi>
					</view>
					<view v-show="xuanzh == 1">
						<zuxuanquanbao :dele="dele" @datachange="datachange"></zuxuanquanbao>
					</view>
				</view>
			</view>
		</view>
	</view>
	<!-- 提交栏 -->
	<view class="submit">
		<view class="submit-top">
			<text><text style="font-weight: bold;">{{designatedTime}}</text>期&nbsp {{daelDateArr.deyStr}}<text
					style="font-weight:bold;">{{daelDateArr.daelHours}}</text>分截止</text>
		</view>
		<view class="submit-bottom">
			<view style="margin-left: 25rpx;">
				<uni-icons class="input-uni-icon" type="trash" size="35" color="#c5c5c5" @click="dele_a()" />
			</view>
			<view style="font-size: 26rpx;">
				<text>已选<text style="color: red;">{{data.value.note}}</text>注 <text
						style="color: red;">{{data.value.note*2}}</text>元</text>
			</view>
			<view class="bottom-button" style=" height: 75rpx; width: 350rpx;margin-right: 10rpx;">
				<view class="bottom-button01" style="font-size: 28rpx;" @click="addNumber()">+加入选号</view>
				<view class="bottom-button02" style="font-size: 30rpx;" @click="messageToggle()">提交</view>
			</view>
		</view>
	</view>

</template>

<script setup>
	import lszj from '@/components/main/bet/arrange3/lssj.vue'
	import zhixuandingwei from '@/components/main/bet/arrange3/zhixuan_dingwei.vue'
	import zhixuanfushi from "@/components/main/bet/arrange3/zhixuan_fushi.vue"
	import zhixuanhezhi from "@/components/main/bet/arrange3/zhixuan_hezhi.vue"
	import zhixuanzutuodan from "@/components/main/bet/arrange3/zhixuan_zutuodan.vue"
	import zhixuankuadufushi from "@/components/main/bet/arrange3/zhixuan_kuadufushi.vue"
	
	import zu3danshi from "@/components/main/bet/arrange3/zu3_danshi.vue"
	import zu3fushi from "@/components/main/bet/arrange3/zu3_fushi.vue"
	import zu3tuodan from "@/components/main/bet/arrange3/zu3_tuodan.vue"
	import zu3kuadufushi from "@/components/main/bet/arrange3/zu3_kuadufushi.vue"
	
	import zu6fushi from "@/components/main/bet/arrange3/zu6_fushi.vue"
	import zu6tuodan from "@/components/main/bet/arrange3/zu6_tuodan.vue"
	import zu6kuadu from "@/components/main/bet/arrange3/zu6_kuadufushi.vue"
	
	import zuxuanhezhi from "@/components/main/bet/arrange3/zuxuan_hezhi.vue"
	import zuxuanquanbao from "@/components/main/bet/arrange3/zuxuan_quanbao.vue"

	import common from "@/common/common.js"
	import api from "@/common/vmeitime-http/sporttery.js"
	import initDate from "@/common/getdatetime.js"
	import { onBackPress } from '@dcloudio/uni-app'
	import {onBeforeMount,ref,reactive,getCurrentInstance,nextTick} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	import {useCounterStore} from '@/stores/counter';
	const counter = useCounterStore() //状态管理
	onBackPress(()=>{ //这个监听各种返回事件
		if(counter.submitNewData.length > 0){
			back()
			return true
		}
	})
	
	const wqsj = reactive({// 往期数据
		code: '',
		lotteryDrawResult: [],
		list: []
	})
	const init=()=>{
		var arr = {
			note: 0,
			money: 0,
			beilv:1,
			name:"排列三",
			yeimian:'arrange3',
			yeimianIndex:current.value,
			xuanze:xuanzh.value,
			type:'',
			data:[]
		}
		data.value = arr
	}
	const designatedTime = ref() //暂时使用期数
	onBeforeMount(() => {
		api.GetHistory({"gameNo": "35","pageSize": "10","pageNo": '1'}).then((res) => {
			if (res.data.code === 1) {
				designatedTime.value = res.data.data.issue
				for (var i = 0; i <= res.data.data.data.length - 1; i++) {
					if (i == 0) {
						wqsj.code = res.data.data.data[i].code
						wqsj.lotteryDrawResult = res.data.data.data[i].lotteryDrawResult
						wqsj.SaleEndtime=res.data.data.data[i].SaleEndtime
					}else{
						var arr = {
							code: res.data.data.data[i].code,
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

	//内外层选择分段
	const current = ref(0) //外层分段器选中值
	const xuanzh = ref(0) //内层分段器选中的值
	const items = reactive({//分段器数据
		data:['直选','组三','组六','组选'],
		list:[{
			value:"直选",
			name:['定位复式','组合复式','和值','组合拖胆','跨度复式']
		},
		{
			value:"组三",
			name:['单式','复式','拖胆','跨度复式']
		},
		{
			value:"组六",
			name:['复式','拖胆','跨度复式']
		},
		{
			value:"组选",
			name:['组选和值','组选2码全包']
		}]
	}) 
	const onClickItem = (e) => { //外层分段器判断
		if (current.value != e.currentIndex) {
			current.value = e.currentIndex;
			xuanzh.value =0
			data.value.yeimianIndex = current.value
			init()
		}
	}
	const diandian = (index) => { //内部分段器的判断
		if (xuanzh != index) {
			xuanzh.value = index
			data.value.xuanze = index
			init()
		}
	}


	// 通过监听变化刷新
	const dele = ref(true)
	const dele_a = () => {
		dele.value = !dele.value
		init()
	}
	
	const data = reactive({})
	// 数据
	const datachange = (item, type) => {
		data.value.note = item.note
		data.value.money = item.money
		if(type == "zhixuan_hezhi" || type == "zuxuan_hezhi"){
			data.value.data = item.value.list
		}else{
			data.value.data = item.data 
		}
		data.value.type = type
	}
	
	// 提示显示值
	let tishi = ref(0)
	// 定时器
	const time = () =>{
		let timer = setTimeout(() => {
			tishi.value = 0
			clearTimeout(timer)
		}, 2500)
	}
	//提交
	const messageToggle = () => {
		if(!bouttmBoole.value){
			uni.showToast({title:'本期已截止、请等待下期开启后在进行投注~',icon:'none',position:'center'})
			return
		}
		if(data.value.note > 0 || counter.submitNewData.length > 0){
			if(counter.submitNewData.length > 0 && data.value.note == 0){
				uni.navigateTo({
					url: '/pages/main/submit/submit_shuzi?nowDeadline='+daelDateArr.daelDate+'&lssue='+designatedTime.value,
					animationType: 'pop-in',
					animationDuration: 200
				});
			}else{
				counter.submitNewData.push(data.value)
				dele_a()
				uni.navigateTo({
					url: '/pages/main/submit/submit_shuzi?nowDeadline='+daelDateArr.daelDate+'&lssue='+designatedTime.value,
					animationType: 'pop-in',
					animationDuration: 200
				});
			}
		}else{
			tishi.value = 1
			if(tishi.value != 0){
				time()
			}
		}	
	}
	const addNumber =()=>{	//加入选号
		if(!bouttmBoole.value){
			uni.showToast({title:'本期已截止、请等待下期开启后在进行投注~',icon:'none',position:'center'})
			return
		}
		if(data.value.note > 0){
			if(counter.submitNewData.length > 0 && data.value.note == 0){
			}else{
				counter.submitNewData.push(data.value)
				uni.showToast({
					title: '加入成功',
					position:'center'
				});
				dele_a()
			}
		}else{
			tishi.value = 1
			if(tishi.value != 0){
				time()
			}
		}
	}
	
	const daelDateArr=reactive({//截止时间处理后保存在此
		deyStr:'',//今天、明天、后天
		daelDate:'',//完整的投注截止时间
		daelHours:''
	})
	
	const bouttmBoole=ref(true)//提交按钮禁用
	
	const systime = ref(counter.gameAstrict.advance)// systime后续接入店铺自定义时间
	const getjiezhitime = () => {
		var nowDate=new Date()
		nowDate.setHours('21')
		nowDate.setMinutes('00')
		nowDate.setMinutes(nowDate.getMinutes()-systime.value)
		daelDateArr.daelHours=nowDate.getHours()+':'+nowDate.getMinutes()
		format()
	}
	function format(){
		var daelDate=new Date()//最终截止时间
		var nowDate=new Date//用户当前时间
		daelDate.setHours(daelDateArr.daelHours.split(':')[0])
		daelDate.setMinutes(daelDateArr.daelHours.split(':')[1])
		daelDate.setSeconds('00')
		if(nowDate.getTime()<daelDate.getTime()){//当前时间时间大于截止时间
			daelDateArr.deyStr='今天'
			daelDateArr.daelDate=initDate.getNowFormatDate(0,daelDate.getTime())
		}else{//超过投注时间
			var oneData=new Date(wqsj.SaleEndtime)//上一期开奖时间
			daelDateArr.deyStr='明天'
			daelDate.setDate(daelDate.getDate()+1)
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

	// 返回按钮
	const back =()=>{
		counter.submitNewData = []
		counter.submitData = []
		uni.navigateBack({
			delta:1,
			animationType: 'pop-out',
			animationDuration: 200
		})
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
		background-color: #202736; 
		position: fixed;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 1;
		box-shadow: 0 5rpx 15rpx -8rpx #ebebeb;
	}
	
	.baiwei-text {
		font-size: 34rpx;
		line-height: 60rpx;
		margin: auto;
	}

	.hezhi {
		display: flex;
		width: 65rpx;
		height: 65rpx;
		border-radius: 50rpx;
		margin-left: 30rpx;
		margin-top: 25rpx;
	}

	.borderuu {
		border-radius: 10rpx;
		border: 1rpx solid #e1e1e1;
	}

	.blgbox {
		display: flex;
		justify-content: center;
		background-color: #f3f3f3;
		width: 100%;
		height: 80rpx;
		margin-top: 10rpx;
		margin-bottom: 50rpx;
	}

	.boxtt {
		width: 160rpx;
		height: 50rpx;
		margin: auto;
		border-radius: 100rpx;
		text-align: center;
		color: white;
		background-color: #ff6f6f;
		transition: 0.18s;
	}

	.boxtt11 {
		width: 160rpx;
		height: 50rpx;
		margin: auto;
		border-radius: 100rpx;
		text-align: center;
		color: #5e5e5e;
		position: 1.5s;
	}

	.xxx:nth-child(1) {
		order: 0;
		padding-left: 20rpx;
		align-self: center;
	}

	.xxx:nth-child(2) {
		order: 1;
		align-self: center;
	}

	.xxx:nth-child(3) {
		order: 2;
		width: 350rpx;
		height: 90rpx;
		margin: 15rpx 20rpx 0rpx 0rpx;
		border-radius: 20rpx;
	}

	.submit {
		width: 100%;
		height: 170rpx;
		bottom: 0;
		position: fixed;
	}

	.submit-top {
		width: 100%;
		height: 55rpx;
		display: flex;
		justify-content: center;
		padding-top: 10rpx;
		background-color: beige;
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
		background: #202736;
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
		transition:all 1s;
	}
	/* 提示淡出淡入 */
	.fade-enter-from{
		opacity: 0;
	}
	.fade-enter-active{
		transition: all 0.7s;
	}
	.fade-enter-to{
		opacity: 1;
	}
	.fade-leave-from{
		opacity: 1;
	}
	.fade-leave-active{
		transition: all 0.8s;
	}
	.fade-leave-to{
		opacity: 0;
	}
	
</style>
