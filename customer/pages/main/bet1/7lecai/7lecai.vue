<template>
	<view class="status_bar"></view>
	<view class="navigation"><!-- 导航 -->
		<view class="statusBar"></view>
		<view style="height: 80rpx;display: flex;align-items: center;justify-content: center;">
			<uni-icons color="#fff" type="back" @click="back()" size="19" style='position: absolute;left: 30rpx;'></uni-icons>
			<text style="color: #fff;font-size: 34rpx;">七乐彩</text>
		</view>
	</view>
	<view style="width:700rpx;padding:20rpx 0rpx 0rpx 26rpx;"><!-- 往期数据 -->
		<uni-collapse ref="wqsjss">
			<!-- 因为list默认带一条分隔线，所以使用 titleBorder="none" 取消面板的分隔线 -->
			<uni-collapse-item title-border="none" :border="false" >
				<template v-slot:title>
					<uni-list>
						<view class="boxss">
							<view class="box">
								<text style="font-size:28rpx;color:#999999;">{{wqsj.code}}期</text>
							</view>
							<view class="box" style="display: flex;flex-direction: row;">
								<view class="textshuzhi" v-for="(item,index) in wqsj.red" :key="index">
									<text class="tt">{{item}}</text>
								</view>
							</view>
						</view>
					</uni-list>
				</template>
				<view class="content">
					<view class="boxss" v-for="(item,index) in wqsj.data" :key="index">
						<view class="box">
							<text style="font-size:28rpx;color:#999999;">{{item.code}}期</text>
						</view>
						<view class="box" style="display: flex;flex-direction: row;">
							<view class="textshuzhiw" v-for="(item,index) in item.red" :key="index">
								<text class="tt">{{item}}</text>
							</view>
						</view>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>
	</view>
	<view class="shuiji"><!-- title -->
		<view class="bbooxx">
			<text style="color:#999999;">选号区：选择</text>
			<text style="color: red;">7-15</text>
			<text style="color:#999999;">个号码</text>
			<text style="color: red;">选择号码两次设胆</text>
		</view>
		<view class="bbooxx">
			<uni-collapse>
				<uni-collapse-item titleBorder="show" :open="jixuanOpen">
					<template v-slot:title>
						<text style="font-size: 28rpx;">选择{{xuanx[jixuanValue].velue}}位</text>
					</template>
					<uni-list v-for="item,index in xuanx" :key="item">
						<text class="jixuan" @click="jixuan(index)">{{item.name}}</text>
					</uni-list>
				</uni-collapse-item>
			</uni-collapse>
		</view>
	</view>
	<view class="shuzhi"><!-- 球 -->
		<view :style="boxstlye[item-1].value==0?'color:#ff0000;background-color:#fff0f1':'color:#ffffff;background-color:#ff0000'" v-for="item,index in 30" :key="item" @click="click(item)"
			style="margin:20rpx 30rpx;border-radius:100rpx;">
			<view style="text-align: center;width:80rpx;height:80rpx;font-size:53rpx;"
				v-show="boxstlye[item-1].value!=2">
				<text style="font-size:28rpx;font-weight:700;">{{item<10?'0'+item:item}}</text>
			</view>
			<view style="text-align: center;width: 80rpx;" v-show="boxstlye[item-1].value==2">
				<text style="font-size:30rpx;font-weight:700;">{{item<10?'0'+item:item}}</text>
				<text style="padding-left:28rpx;margin-top:-3rpx;font-size:25rpx; display: flex;">胆</text>
			</view>
		</view>
	</view>
	
	
	<view class="bottomTabs"><!-- 公告 -->
		<view style="margin-top:10rpx;">
			<text style="font-size:28rpx;">{{designatedTime}}期 截至时间为 {{daelDateArr.deyStr}}：{{daelDateArr.daelHours}}</text>
		</view>
	</view>
	<view class="bottomTab">
		<view class="xxx">
			<uni-icons type="trash" size="60rpx" @click="init()"></uni-icons>
		</view>
		<view class="xxx">
			<text class="textqq">已选</text>
			<text class="textqq" style="color:red;">{{data.value.note}}</text>
			<text class="textqq">注,</text>
			<text class="textqq" style="color:red;">{{data.value.money}}</text>
			<text class="textqq">元</text>
		</view>
		<view class="xxx">
			<view style="float: right;" class="buttons" @click="messageToggle('error')">
				<view style="margin:20rpx 0rpx 0rpx 50rpx;">
					<text style="color: white;font-size:35rpx;">提交</text>
				</view>
			</view>
			
			<view class="bottonss">
				<view style="padding:20rpx 0rpx 0rpx 20rpx;">
					<text style="color: white;font-size:35rpx;" @click="addNumber()">加入选号</text>
				</view>
			</view>
			
		</view>
	</view>
	<uni-popup ref="message" type="message">
		<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
	</uni-popup>
</template>

<script setup>
	import common from "@/common/common.js"
	import api from "@/common/vmeitime-http/sporttery.js"
	import { useCounterStore } from '@/stores/counter'
	import { onBackPress } from '@dcloudio/uni-app'
	import initDate from "@/common/getdatetime.js"
	import {onBeforeMount,ref,reactive,getCurrentInstance,nextTick} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const designatedTime = ref()
	const week = ref()
	onBackPress(()=>{
		if(counter.submitNewData.length > 0){
			back()
			return true
		}
	})
	const jixuanValue=ref(0)
	const counter = useCounterStore() //状态管理
	const xuanx = reactive([
		{
			velue: "7",
			name: "机选7注"
		},
		{
			velue: "8",
			name: "机选8注"
		},
		{
			velue: "9",
			name: "机选9注"
		},
		{
			velue: "10",
			name: "机选10注"
		},
		{
			velue: "11",
			name: "机选11注"
		},
		{
			velue: "12",
			name: "机选12注"
		},
		{
			velue: "13",
			name: "机选13注"
		},
		{
			velue: "14",
			name: "机选14注"
		},
		{
			velue: "15",
			name: "机选15注"
		}
	])
	const jixuanOpen=ref(false)
	const wqsj = reactive({
		code:'',
		red:[],
		data:[],
	})//往期开奖数据
	const boxstlye = reactive([])
	onBeforeMount(() => {
		init()
		api.GetWelfareKJ({
			"name":"qlc",
			"issueCount":"10",
			"issueStart":'',
			"issueEnd":'',
			"dayStart":'',
			"dayEnd":'',
		}).then((res)=>{
			if(res.data.code==1){
				designatedTime.value =res.data.data.issue
				for(var i=0;i<=res.data.data.data.length-1;i++){
					if(i==0){
						wqsj.code = res.data.data.data[i].code
						wqsj.red = res.data.data.data[i].red
						wqsj.SaleEndtime=res.data.data.data[i].SaleEndtime
					}else{
						var arr = {
							code:res.data.data.data[i].code,
							red:res.data.data.data[i].red,
							SaleEndtime:res.data.data.data[i].SaleEndtime
						}
						wqsj.data.push(arr)
					}
				}
				nextTick(() => {
					proxy.$refs.wqsjss.resize()
				})
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
		})
	})
	const data = reactive([])
	
	const init = () => {//初始化、、垃圾桶按钮
		boxstlye.splice(0, boxstlye.length)
		for (var i = 0; i <= 30; i++) {
			var arr = {
				'id': i,
				'value': 0,
			}
			boxstlye.push(arr)
		}
		var arr ={
			note:0,
			money:0,
			beilv:1,
			name:"七乐彩",
			yeimian: 'qlecai',
			data:{
				dan:[],
				value:[],
			},
		}
		data.value = arr
	}

	//手动点击判断
	const click = (e) => {
		if(data.value.data.value.length+data.value.data.dan.length < 15){//判断选中的普通值是否超过15个
			if (data.value.data.dan.length<=5) {//判断选中的胆是否超过6个
				if (boxstlye[e - 1]['value'] === 0) {//判断选中的状态
					boxstlye[e - 1]['value'] = 1
					//增加选择项目
					data.value.data.value.push(e)
					
					
					notejisuan()		
					return
				} //如果等于1，返回2
				if (boxstlye[e - 1]['value'] === 1) {
					boxstlye[e - 1]['value'] = 2
					valueDatasplice(e)
					data.value.data.dan.push(e)
					
					notejisuan()
					return
				} //如果等于2并判断样式
				if (boxstlye[e - 1]['value'] === 2) {
					boxstlye[e - 1]['value'] = 0
					danDatasplice(e)
					notejisuan()
					
					return
				}
			} else if(data.value.data.dan.length >= 5 ){//胆的长度超过6个，就在增加胆
				if (boxstlye[e - 1]['value'] === 0) {
					boxstlye[e - 1]['value'] = 1
					
					data.value.data.value.push(e)
					
					notejisuan()
					
					return	
							
				} //如果等于2并判断样式
				
				if (boxstlye[e - 1]['value'] === 1) {
					boxstlye[e - 1]['value'] = 0
					valueDatasplice(e)
					notejisuan()
					
					return
							
				} //如果等于2并判断样式
				if (boxstlye[e - 1]['value'] === 2) {
					//减
					//然后找到对应的选项
					danDatasplice(e)
					notejisuan()
					boxstlye[e - 1]['value'] = 0
					
					return
				}
		}
		}else{//选号长度超过15个数值就不能在选择数值了
			if(data.value.data.dan.length<=5){
				if (boxstlye[e - 1]['value'] === 1) {
					
					boxstlye[e - 1]['value'] = 2
					data.value.data.dan.push(e)
					valueDatasplice(e)
					notejisuan()
					
					
					return
							
				} //如果等于2并判断样式
				if (boxstlye[e - 1]['value'] === 2) {
					//然后找到对应的选项
					danDatasplice(e)
					
					notejisuan()
					boxstlye[e - 1]['value'] = 0
					
					return
				}
			}else{
				if (boxstlye[e - 1]['value'] === 1) {
					//然后找到对应的选项
					valueDatasplice(e)
					notejisuan()
					boxstlye[e - 1]['value'] = 0
					
					return		
				}
				if (boxstlye[e - 1]['value'] === 2) {
					//然后找到对应的选项
					
					danDatasplice(e)
					notejisuan()
					boxstlye[e - 1]['value'] = 0

					return		
				}
			}
			proxy.msgType = "error"
			proxy.messageText = '最多可选15个号码'
			proxy.$refs.message.open()
		}

	}
	// 点击之后同时删除data内容 公共方法
	const danDatasplice =(e)=>{
		var index = data.value.data.dan.findIndex(item =>
			item == e // 11  11
		)
		data.value.data.dan.splice(index, 1)
	}
	const valueDatasplice =(e)=>{
		var index = data.value.data.value.findIndex(item =>
			item == e // 11  11
		)
		data.value.data.value.splice(index, 1)
	}
	
	// 公共计算注数
	const notejisuan = ()=>{
		data.value.note = common.TakeMN(data.value.data.value.length, 7 - data.value.data.dan.length)
		data.value.money= data.value.note * 2
	}
	const jixuan = (jixuanIndex) => {//判断机选状态
		jixuanValue.value=jixuanIndex
		jixuanOpen.value=true
		nextTick(()=>{
			jixuanOpen.value=false
		})
		init()//初始化
		//数据去重并判断是否为7个值
		function RandomNum(Min, Max) {
			var num = Min + Math.round(Math.random() * (Max - Min));
			return num;
		}
		var arr = [];
		for (var i = 0; i < xuanx[jixuanIndex].velue; i++) {
			arr[i] = RandomNum(1, 30); // 调用上面封装好的方法
			for (var j = 0; j < i; j++) {
				//如果重复则 i-- 重新产生一个
				if (arr[i] == arr[j]) {
					i--;
					break;
				}
			}
		}
		var numlist = arr
		for (var i = 0; i <= numlist.length - 1; i++) {
			boxstlye[numlist[i] - 1]['value'] = 0+1
			data.value.data.value.push(numlist[i])
		}
		//计算注数
		notejisuan()
		return
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
	
	// 提交的事件
	const messageToggle = (type) => {
		if(!bouttmBoole.value){
			uni.showToast({title:'本期已截止、请等待下期开启后在进行投注~',icon:'none',position:'center'})
			return
		}
		if (data.value.data.value.length >= 7) {
			data.value.data.dan = common.quickSort(data.value.data.dan)
			data.value.data.value = common.quickSort(data.value.data.value)
			counter.submitNewData.push(data.value)
			init()
			uni.navigateTo({
				url: '/pages/main/submit/submit_shuzi?nowDeadline='+daelDateArr.daelDate+'&lssue='+designatedTime.value,
				animationType: 'pop-in',
				animationDuration: 200
			});
		}else if(counter.submitNewData.length > 0){
			uni.navigateTo({
				url: '/pages/main/submit/submit_shuzi?nowDeadline='+daelDateArr.daelDate+'&lssue='+designatedTime.value,
				animationType: 'pop-in',
				animationDuration: 200
			});
		}else {
			uni.showToast({
				title: '请先完成选号！',
				position:'center'
			});
		}
	}
	const addNumber =()=>{
		if(!bouttmBoole.value){
			uni.showToast({title:'本期已截止、请等待下期开启后在进行投注~',icon:'none',position:'center'})
			return
		}
		if(data.value.data.value.length >= 7){		
			data.value.data.dan = common.quickSort(data.value.data.dan)
			data.value.data.value = common.quickSort(data.value.data.value)
			counter.submitNewData.push(data.value)
			init()
			uni.showToast({
				title: '加入成功',
				position:'center'
			});
		}else{
			uni.showToast({
				title: '请先完成选号！',
				position:'center'
			});
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
		week.value=new Date().getDay()
		var nowDate=new Date()
		nowDate.setHours('20')
		nowDate.setMinutes('00')
		nowDate.setMinutes(nowDate.getMinutes()-systime.value)
		daelDateArr.daelHours=nowDate.getHours()+':'+nowDate.getMinutes()
		TiemJudge()
	}
	
	const TiemJudge = () =>{// 完整截止时间返回
		var weekArr=['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
		var daelWeek=['星期一','星期三','星期五']
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
			for(var i=0;i<5;i++){
				if(!daelWeek.includes(weekArr[daelDate.getDay()]) || nowDate.getTime()>daelDate.getTime()){
					differenceWeek++
					daelDate.setDate(daelDate.getDate()+1)
				}else{break}
			}
			var oneDate=new Date(wqsj.SaleEndtime.split('(')[0])
			daelDateArr.deyStr=strArr[differenceWeek]
			daelDateArr.daelDate=initDate.getNowFormatDate(0,daelDate.getTime())
			if(nowDate.getFullYear()==daelDate.getFullYear()){//当天时间与截止时间是同一年的话执行
				if(oneDate.getDate()==nowDate.getDate()){return}//如果往期的第一期是用户当天时间开奖就不加1
				designatedTime.value=String(Number(designatedTime.value)+1)
			}else{//不同年份重置期数
				if(oneDate.getDate()==nowDate.getDate()){return}//如果往期的第一期是用户当天时间开奖就不加1
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
		background-color: #202736; 
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.jixuan {
		font-size: 30rpx;
		padding: 20rpx;
	}

	.shuiji {
		display: flex;
		width: 700rpx;
		margin: 20rpx auto;
		background-color: white;
		border-radius: 10rpx;
	}

	.bbooxx:nth-child(1) {
		order: 0;
		width: 50rpx;
		width: 50rpx;
		flex-grow: 1;
		justify-self: center;
	}

	.bbooxx:nth-child(2) {
		order: 1;
		width: 220rpx;
		height: 50rpx;
		border-radius: 10rpx;
		text-align: center;
	}

	.shuzhi {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 700rpx;
		margin-left: 25rpx;
		margin-top: 0rpx;
	}

	.textqq {
		font-size: 30rpx;
	}

	.bottonss {
		background-color: #ffb31a;
		width: 50%;
		height: 90rpx;
		border-top-left-radius: 20rpx;
		border-bottom-left-radius: 20rpx;


	}

	.buttons {
		background-color: black;
		width: 50%;
		height: 90rpx;
		border-top-right-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
		background: linear-gradient(to right, #f5af19, #f12711);


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

	.bottomTab {
		width: 100%;
		height: 120rpx;
		background-color: white;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		/* align-items: center; */

	}

	.bottomTabs {
		position: fixed;
		bottom: 120rpx;
		width: 100%;
		height: 70rpx;
		background-color: #fffcd5;
		text-align: center;


	}

	.box {
		margin: 0rpx 8rpx;

	}

	.tt {
		font-size: 28rpx;
		font-weight: 600;
	}

	.textshuzhi {
		margin: 0rpx 5rpx;
		background-color: red;
		width: 50rpx;
		height: 50rpx;
		color: white;
		text-align: center;
		border-radius: 100rpx;
		line-height:50rpx;
	}
	.textshuzhiw {
		margin: 0rpx 5rpx;
		width: 50rpx;
		height: 50rpx;
		color: white;
		background-color: #999999;
		text-align: center;
		border-radius: 100rpx;
		line-height:50rpx;
		
	}

	.boxss {
		display: flex;
		height: 90rpx;
		align-items: center;
	}

	.box:nth-child(1) {
		order: 0;
	}

	.box:nth-child(2) {
		order: 1;
	}
	.biaoti1 {
		font-size: 120%;
		margin-top: 45rpx;
	}
</style>
