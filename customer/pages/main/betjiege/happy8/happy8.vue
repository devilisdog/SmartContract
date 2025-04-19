<template>
	<!-- 导航 -->
	<uni-collapse style='position: fixed;'>
		<uni-collapse-item titleBorder='none' :showArrow="false" :open='show_DataList' @click='openlist'>
			<template v-slot:title>
			<view class="navigation">
				<view class="statusBar"></view>
				<view style="height: 100rpx;display: flex;align-items: center;justify-content: center;">
					<uni-icons color="#fff" type="back" @click="back()" size="21" style='position: absolute;left: 30rpx;'></uni-icons>
					<view>
						<text style="color: #fff;font-size: 36rpx;margin-left: 40rpx;">快乐8-{{title}}</text>
						<uni-icons type="bottom" color="#fff" size="15"></uni-icons>
					</view>
				</view>
			</view>
			<view style="height: var(--status-bar-height);padding-top: 100rpx"></view>
			</template>
			<view style="width: 100%; height: 400rpx;display: flex;background-color: #fff; flex-wrap: wrap;  box-shadow: 0px 10rpx  10rpx rgba(239, 239, 239, 0.6); align-items: center;">
				<view v-for="itme,index in xuanx" class="bs" @click="clicktwo(itme.name , itme.velue , itme.money)" :style="index==9?'margin-left:20rpx;':false">
					<text class="xuan-text">{{itme.name}}</text>
				</view>
			</view>
		</uni-collapse-item>
	</uni-collapse>
	<view style="height: var(--status-bar-height);"></view>
	<view v-if="topup" @click="openlist(1)"
		style="width: 100%;position: fixed;margin-top: 500rpx;" :style="{height:common.scrollH()-500+'rpx'}"></view>
	<view style="height: 100rpx;"></view>
	
	<!-- 提示 -->
	<transition name="fade">
	<view class="tishi" v-show="tishi != 0">
		<text style="font-size: 28rpx;">请先完成选号!</text>
	</view>
	</transition>
	<!-- 机选 -->
	<view class="ji">
		<view class="ji-left">
			<view style="display: flex;justify-content: center;align-items: center; " @click="mathbum(1)">
				<uni-icons class="input-uni-icon" type="plusempty" size="21" color="#ff5d5d"
					style="font-weight: bold; margin-right: 5rpx;" />
				<text style="font-size: 26rpx;">机选1注</text>
			</view>
		</view>
		<view class="ji-right">
			<view style="display: flex;justify-content: center;align-items: center;" @click=" mathbum(5)">
				<uni-icons class="input-uni-icon" type="plusempty" size="21" color="#ff5d5d"
					style="font-weight: bold;margin-right: 5rpx;" />
				<text style="font-size: 26rpx;">机选5注</text>
			</view>
		</view>
	</view>

	<!-- 选择号码 -->
	<view class="number-text">
		<view>
			<text style="font-weight: bold;font-size: 35rpx;margin-left: 40rpx; color: #505050 ;">选择号码</text>
			<text style="margin-left: 25rpx;color: #b8b8b8 ;">至少选择{{titles}}个号码</text>
		</view>
		<view class="allButtom" v-show="titles!=1" @click="allBall">
			一键全拖
		</view>
	</view>

	<!-- 球 -->
	<view class="number">
		<view v-for="(itme,init) in 40"
			:style="boxstlye[init]==0?'color: #ff5d5d;background-color:#fff0f0':'color: #fff0f0;background-color:#ff5d5d'"
			@click="click(itme)"
			style="margin: 15rpx 10rpx 5rpx 10rpx; width: 65rpx; height: 65rpx; border-radius: 50rpx; text-align: center; border: 1rpx solid #ff5d5d;">
			<view v-show="boxstlye[init] !=2 ">
				<text
					style="line-height: 70rpx; font-weight: bold;font-size: 34rpx;">{{itme<10?'0'+(itme+""):itme}}</text>
			</view>
			<view v-show="boxstlye[init] ===2 ">
				<text
					style=" font-weight: bold;font-size: 30rpx; margin-top:-20rpx">{{itme<10?'0'+(itme+""):itme}}</text>
				<text style=" font-weight: bold;display: flex; flex-direction:column;margin-top:-15rpx ;">胆</text>
			</view>

		</view>
	</view>

	<view style=" width: 100%; height:85rpx;  display: flex;justify-content: center;align-items: center;">
		<text style="color: #ff5d5d;font-weight: bold;font-size: 28rpx;">· &nbsp;单注最高可中{{moneys}}元&nbsp; ·</text>
	</view>

	<view class="number-two">
		<view v-for="(itme,init) in 40"
			:style="boxstlye[init+40]==0?'color: #ff5d5d;background-color:#fff0f0':'color: #fff0f0;background-color:#ff5d5d'"
			@click="click(itme+40)"
			style="margin: 15rpx 10rpx 5rpx 10rpx; width: 65rpx; height: 65rpx; border-radius: 50rpx; text-align: center; border: 1rpx solid #ff5d5d;">
			<view v-show="boxstlye[init+40] !=2 ">
				<text style="line-height: 70rpx; font-weight: bold;font-size: 34rpx;">{{itme+40}}</text>
			</view>
			<view v-show="boxstlye[init+40] === 2 ">
				<text style=" font-weight: bold;font-size: 30rpx;margin-top:-20rpx">{{itme+40}}</text>
				<text style=" font-weight: bold;display: flex; flex-direction:column;margin-top:-15rpx;">胆</text>
			</view>
		</view>

	</view>

	<view style="width: 100%; height:1rpx; margin-top: 200rpx;"></view>
	<!-- 提交栏 -->
	<view class="submit">
		<view class="submit-top">
			<text style="font-weight: bold;">{{designatedTime}}期</text>
			<text>&nbsp {{daelDateArr.deyStr}}</text>
			<text style="font-weight:bold;">{{daelDateArr.daelHours}}</text>
			<text>分截止</text>
		</view>
		<view class="submit-bottom">
			<view style="margin-left: 25rpx;">
				<uni-icons class="input-uni-icon" type="trash" size="35" color="#c5c5c5" @click="qk()" />
			</view>
			<view style="font-size: 26rpx;">
				<text>已选<text style="color: red;">{{data.value.note}}</text>注 <text
						style="color: red;">{{data.value.money}}</text>元 </text>
			</view>
			<view class="bottom-button" style=" height: 75rpx; width: 350rpx;margin-right: 10rpx;">
				<view class="bottom-button01" style="font-size: 28rpx;" @click="addNumber()">+加入选号</view>
				<view class="bottom-button02" style="font-size: 30rpx;" @click="messageToggle('warn')">提交</view>
			</view>
			<uni-popup ref="message" type="message" style="margin-top: 100rpx;">
				<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
			</uni-popup>
		</view>
	</view>
</template>

<script setup>
	import common from "@/common/common.js"
	import { useCounterStore } from '@/stores/counter'
	import { onBackPress } from '@dcloudio/uni-app'
	import api from "@/common/vmeitime-http/sporttery.js"
	import {onBeforeMount,ref,reactive,getCurrentInstance,nextTick,} from 'vue';
	import initDate from "@/common/getdatetime.js"
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore() //状态管理
	const designatedTime = ref() //暂时使用期数
	onBackPress(()=>{ //这个监听各种返回事件
		if(counter.submitNewData.length > 0){
			back()
			return true
		}
	})

	// 顶部选择器内容data
	const xuanx = reactive([{
			velue: 1,
			name: '选一',
			money: 4.6
		},
		{
			velue: 2,
			name: '选二',
			money: 19
		},
		{
			velue: 3,
			name: '选三',
			money: 53
		},
		{
			velue: 4,
			name: '选四',
			money: 100
		},
		{
			velue: 5,
			name: '选五',
			money: 1000
		},
		{
			velue: 6,
			name: '选六',
			money: 3000
		},
		{
			velue: 7,
			name: '选七',
			money: 10000
		},
		{
			velue: 8,
			name: '选八',
			money: 50000
		},
		{
			velue: 9,
			name: '选九',
			money: 300000
		},
		{
			velue: 10,
			name: '选十',
			money: 500 + "万"
		}
	])

	// 顶部选择器弹窗显示内容
	// 弹出层
	const moneys = ref(4.6)
	const title = ref('选一')
	const titles = ref(1)
	const show_DataList =ref(false)
	
	//折叠栏蒙版控制
	const topup = ref(false)
	const openlist = (e) =>{
		if(e==1){
			if(topup.value){
				topup.value = false
			}else{
				topup.value = true
			}
			show_DataList.value = true
			nextTick(() => {
				show_DataList.value = false
			})
		}else{
			if(topup.value){
				topup.value = false
			}else{
				topup.value = true
			}
		}
	}
	
	const clicktwo = (name, velue, money) => {//提示值 变更
		init()
		topup.value = false
		title.value = name
		titles.value = velue
		moneys.value = money
		data.value.happy8Type = velue
		show_DataList.value = true
		nextTick(() => {
			show_DataList.value = false
		})
	}
	const allBall=()=>{
		if(data.value.data.dan.length>=1){
			for(var i=0;i<80;i++){
				if (boxstlye[i] == 0) {
					boxstlye[i] = 1
					//增加选择项目
					data.value.data.value.push(i+1)
				}
				isnote()//注数计算
			}
		}else{
			uni.showToast({
				title:'至少选中一个胆号',
				position:'center',
				icon:'error'
			})
		}
	}

	const boxstlye = reactive([])
	const oneCodeData=ref()//最近一期往期数据
	// 渲染前（生命周期）
	onBeforeMount(() => {
		var arr = {
			note: 0,
			money: 0,
			beilv:1,
			name:"快乐八",
			yeimian:'happy8',
			happy8Type:1,
			data: {
				dan:[],
				value:[],
			}
		}
		data.value = arr
		init()
		api.GetWelfareKJ({//获取本期号码
			"name":"kl8",
			"issueCount":"2",
			"issueStart":'',
			"issueEnd":'',
			"dayStart":'',
			"dayEnd":'',
		}).then((res)=>{
			if(res.data.code==1){
				designatedTime.value=res.data.data.issue
				oneCodeData.value=res.data.data.data[0]
				getjiezhitime()
			}else{
				bouttmBoole.value=false
				uni.showToast({
					title:'往期中奖数据获取失败~',
					position:"center",
					icon:"error",
					duration:2500
				})
			}
		});
	})


	const data = reactive([])
	const init = () => {
		var arr = {
			note: 0,
			money: 0,
			beilv:1,
			name:"快乐八",
			yeimian:'happy8',
			happy8Type:1,
			data: {
				dan:[],
				value:[],
			}
		}
		data.value = arr
		boxstlye.splice(0, boxstlye.length)
		for (var i = 1; i <= 80; i++) {
			boxstlye.push(0)
		}
	}

	//点击判断变更颜色+加胆
	const click = (e) => {
		// 先判断里面有没有数据 没有就新增
		if (boxstlye[e - 1] == 0) {
			boxstlye[e - 1] = 1
			//增加选择项目
			data.value.data.value.push(e)
			isnote()
			return
		}
		if (boxstlye[e - 1] == 1) {
			if (titles.value == 1) {
				boxstlye[e - 1] = 0
				//减
				//然后找到对应的选项
				var index = data.value.data.value.findIndex(item =>
					//console.log(item),
					item == e // 11  11
				)

				// 删除掉里面的投注内容
				data.value.data.value.splice(index, 1)
				// 'value':i

				isnote()
				return
			} else if (data.value.data.dan.length < titles.value - 1) {
				boxstlye[e - 1] = 2
				data.value.data.dan.push(e)
				
				var index = data.value.data.value.findIndex(item =>
					//console.log(item),
					item == e // 11  11
				)
				
				// 删除掉里面的投注内容
				data.value.data.value.splice(index, 1)
				
				isnote()
				return
			} else {
				boxstlye[e - 1] = 0
				//减
				//然后找到对应的选项
				var index = data.value.data.value.findIndex(item =>
					//console.log(item),
					item == e // 11  11
				)

				// 删除掉里面的投注内容
				data.value.data.value.splice(index, 1)
				isnote()
				return
			}

		}
		if (boxstlye[e - 1] == 2) {
			boxstlye[e - 1] = 0

			var index2 = data.value.data.dan.findIndex(item =>
				//console.log(item),
				item == e // 11  11
			)
			data.value.data.dan.splice(index2, 1)
			isnote()
			return
		}
	}

	//计算注数
	const isnote = () => {
		data.value.note = common.TakeMN(data.value.data.value.length, titles.value - data.value.data.dan.length)
		data.value.money = data.value.note * 2
		if(data.value.money>20000){
			uni.showToast({
				title:'投注金额不得大于两万',
				position:'center'
			})
		}
	}

	//随机一or五注
	const mathbumIndex = ref(0)
	const mathbum = (a) => {
		if(!bouttmBoole.value){
			uni.showToast({title:'本期已截止、请等待下期开启后在进行投注~',icon:'none',position:'center'})
			return
		}
		init()
		data.value.data.value.push()
		if (a == 1) {
			var arrone = common.GetRandomArray(1, 80, titles.value)
			for (var i = 0; i <= arrone.length - 1; i++) {
				boxstlye[arrone[i] - 1] = 1
				data.value.data.value.push(arrone[i])
			}
			
			data.value.happy8Type = titles.value
			data.value.note = 1
			data.value.money = data.value.note * 2
		}
		if (a == 5) {
			for (var o = 0; o <= a - 1; o++) {
				var arrone = common.quickSort(common.GetRandomArray(1, 80, titles.value)) 
				// console.log(arrone.length-1);
				for (var i = 0; i <= arrone.length - 1; i++) {
					data.value.data.value.push(arrone[i])
				}
				data.value.note = 1
				data.value.money = data.value.note * 2
				data.value.happy8Type = titles.value	
				counter.submitNewData.push(data.value)
				counter.submitData = data.value
				init()
			}
			uni.navigateTo({
				url: '/pages/main/submit/submit_shuzi?nowDeadline='+daelDateArr.daelDate+'&lssue='+designatedTime.value,
				animationType: 'pop-in',
				animationDuration: 200
			});
		}
	}



	// 垃圾桶清空
	const qk = () => {
		init()
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
	const messageToggle = (type) => {//提交
		if(!bouttmBoole.value){
			uni.showToast({title:'本期已截止、请等待下期开启后在进行投注~',icon:'none',position:'center'})
			return
		}
		if(data.value.data.value.length > 0 || counter.submitNewData.length > 0){
			if(data.value.money<20000){
				if(data.value.data.value.length+data.value.data.dan.length >= titles.value){
					data.value.happy8Type = titles.value
					data.value.data.value = common.quickSort(data.value.data.value)
					data.value.data.dan = common.quickSort(data.value.data.dan)
					counter.submitNewData.push(data.value)
					init()
					uni.navigateTo({
						url: '/pages/main/submit/submit_shuzi?nowDeadline='+daelDateArr.daelDate+'&lssue='+designatedTime.value,
						animationType: 'pop-in',
						animationDuration: 200
					});
				}else{
					uni.navigateTo({
						url: '/pages/main/submit/submit_shuzi?nowDeadline='+daelDateArr.daelDate+'&lssue='+designatedTime.value,
						animationType: 'pop-in',
						animationDuration: 200
					});
				}
			}else{
				uni.showToast({
					title:'投注金额不得大于两万',
					position:'center'
				})
			}
		}else{
			tishi.value = 1
			if(tishi.value != 0){
				time()
			}
			
		}
	}
	const addNumber =()=>{//加入选号
		if(!bouttmBoole.value){
			uni.showToast({title:'本期已截止、请等待下期开启后在进行投注~',icon:'none',position:'center'})
			return
		}
		if(data.value.data.value.length+data.value.data.dan.length >= titles.value){
			data.value.happy8Type = titles.value
			if(data.value.data.value.length > 0){
				data.value.data.value = common.quickSort(data.value.data.value)
				data.value.data.dan = common.quickSort(data.value.data.dan)
				counter.submitNewData.push(data.value)
			}
			uni.showToast({
				icon:'none',
				title: '加入成功',
				position:'center'
			});
			init()
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
	const systime = ref(counter.gameAstrict.advance)
	const getjiezhitime = () => {// systime后续接入店铺自定义时间
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
			var oneDate=new Date(oneCodeData.value.SaleEndtime.split('(')[0])
			daelDateArr.deyStr='明天'
			daelDate.setDate(daelDate.getDate()+1)
			daelDateArr.daelDate=initDate.getNowFormatDate(0,daelDate.getTime())
			if(nowDate.getFullYear()==daelDate.getFullYear()){//当天时间与截止时间是同一年的话执行
				if(oneDate.getDate()==nowDate.getDate()){return}//如果往期的第一期是用户当天时间开奖就不加1
				designatedTime.value=String(Number(designatedTime.value)+1)
			}else{//不同年份重置期数
				if(oneDate.getDate()==nowDate.getDate()){return}//如果往期的第一期是用户当天时间开奖就不加1
				designatedTime.value=daelDate.getFullYear()+'001'
			}
		}
	}

	// 返回到上一个页面
	const back = () => {
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
	.number-text{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.allButtom{
		border:1rpx solid #646464;
		padding:5rpx;
		font-size:22rpx;
		margin-right:40rpx;
		border-radius:10rpx;
		color:#646464;
	}
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

	.bs {
		width: 210rpx;
		height: 55rpx;
		background-color: #fff;
		text-align: center;
		border: 2rpx solid #a2a2a2;
		border-radius: 10rpx;
		margin: auto;
	}

	.ji {
		width: 100%;
		height: 120rpx;
		display: flex;
	}

	.ji-left {
		width: 50%;
		height: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.ji-right {
		display: flex;
		width: 50%;
		height: 120rpx;
		justify-content: center;
		align-items: center;
	}

	.ji-left view {
		margin: auto;
		width: 300rpx;
		height: 60rpx;
		border-radius: 15rpx;
		border: 1rpx solid #ff4c4c;
		background-color: #fff;
		color: #ff5d5d;
	}

	.ji-right view {
		margin: auto;
		width: 300rpx;
		height: 60rpx;
		border-radius: 10rpx;
		border: 1rpx solid #ff4c4c;
		background-color: #fff;
		color: #ff5d5d;
	}

	.number {
		width: 700rpx;
		margin: auto;
		display: flex;
		flex-wrap: wrap;
		margin-top: 15rpx;
	}

	.number-two {
		width: 700rpx;
		margin: auto;
		display: flex;
		flex-wrap: wrap;
	}

	.submit {
		width: 100%;
		height: 170rpx;
		bottom: 0;
		position: fixed;
	}

	.submit-top {
		width: 100%;
		padding:10rpx 0;
		display: flex;
		justify-content: center;
		padding-top: 10rpx;
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
		background: #202736;
		border-radius: 0 20rpx 20rpx 0;
		justify-content: center;
		align-items: center;
		color: #fff;
	}

	.xuan-text {
		line-height: 55rpx;
		color: #a2a2a2;
		font-size: 26rpx;
		display: block;
		width: 100%;
		height: 55rpx;
	}

	.bs:hover {
		border: 2rpx solid #ff4c4c;
		background-color: #ff4c4c;
	}

	.xuan-text:hover {
		font-size: 28rpx;
		color: #ffffff;
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
