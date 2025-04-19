<template>
	<view class="navigation">
		<!-- 导航 -->
		<view class="statusBar"></view>
		<view style="height: 80rpx;display: flex;align-items: center;justify-content: center;">
			<uni-icons color="#fff" type="back" @click="back()" size="19" style='position: absolute;left: 30rpx;'></uni-icons>
			<text style="color: #fff;font-size: 34rpx;">大乐透</text>
		</view>
	</view>
	<uni-collapse ref="wqsjss" :border='false'><!-- 奖金池 -->
		<uni-collapse-item title-border="none" :border="false">
			<template v-slot:title>
				<uni-list :border="false">
					<view class="boxss" style="display: flex;flex-direction: row;">
						<view class="box" style="margin-right: 7rpx;">
							<text style="color:#999999;">{{wqsj.code}}期</text>
						</view>
						<view class="box" style="display: flex;flex-direction: row;">
							<view class="topshuzhi"
								:style="index>4? 'background:radial-gradient(#6ea3ff,#1e8bff)':'background:radial-gradient(#ff7373,#ff4f4f)'"
								style="align-items: center;justify-content: center;display: flex;"
								v-for="(item,index) in wqsj.lotteryDrawResult" :key="index">
								<text class="tt2"
			style="align-items: center;justify-content: center;display: flex;">{{item}}</text>
							</view>
						</view>
						<view
							style="width: 140rpx;margin-left: 10rpx;center;justify-content: center;display: flex;align-items: center;">
							<text style="font-size: 22rpx;">奖池:</text>
							<text style="color: red;font-size: 22rpx;">
								{{common.unitConvert(wqsj.poolmoney.replace(/,/g,'')-0).num}}{{common.unitConvert(wqsj.poolmoney.replace(/,/g,'')-0).unit}}
							</text>
						</view>
					</view>
				</uni-list>
			</template>
			
			<view class="content" style="display: flex;flex-direction: column;">
				<view class="boxss" v-for="(list,index) in wqsj.list" :key="index" :style="index%2==0?'background-color: #d6f0ff;':'background-color: #ffffff;'"
					style="width: 100%;margin-left: -10rpx;">
					<view class="box" style="margin-right: 5rpx;margin-left 10rpx;">
						<text style="color:#999999; ">{{list.code}}期</text>
					</view>
					<view class="box" style="display: flex;flex-direction: row;">
						<view class="textshuzhi2"
							:style="index==6 || index==5? 'color: #1e8bff;':'color: #ff4f4f'"
							style="align-items: center;justify-content: center;display: flex;"
							v-for="(item,index) in list.lotteryDrawResult" :key="index">
							<text class="tt">{{item}}</text>
						</view>
					</view>
					<view style="width: 140rpx;margin-left: 10rpx;center;justify-content: center;display: flex;">
						<text style="font-size: 22rpx;">奖池:</text>
						<text style="color: red;font-size: 22rpx;">
							{{common.unitConvert(list.poolmoney.replace(/,/g,'')-0).num}}{{common.unitConvert(list.poolmoney.replace(/,/g,'')-0).unit}}
						</text>
					</view>
				</view>
	
			</view>
		</uni-collapse-item>
	</uni-collapse>
	
	<view style="background-color: white;"><!-- 分段器 -->
		<uni-segmented-control 
			:current="current" 
			:values="groupitems" 
			style-type="text" 
			activeColor="#f04b49" 
			@clickItem="clickItem" 
		/>
	</view>
	
	<view v-show="current == 0" class="card"><!-- 机选 -->
		<view class="left" style="margin-left: auto; display: flex;margin-bottom: 25rpx;">
			<view style="display: flex;;margin-top: 10rpx;">
				<text style="font-size:20px;font-weight: bold;">机选定胆：</text>
			</view>
			<view v-if="data_jixuan.value.data.dan.red.length==0 && data_jixuan.value.data.dan.blue.length==0?true:false"
				@click="tanchu" class="right"
				style="margin-left: auto; margin-top: 10rpx;">
				<text style="font-size:34rpx;color: #8b8b8b ;">请选择</text>
				<uni-icons type="right" size="17" color="#8b8b8b"></uni-icons>
			</view>
			
			<view v-else @click="tanchu" class="right"
				style="margin-left: auto; margin-right: 20rpx; margin-top: 20rpx; display:flex; flex-direction:row">
				<view style="margin-right: auto;display:flex;" v-for="(item2,index) in data_jixuan.value.data.dan.red">
					<text class="dingdanwenzi" style="color: #ff4f4f; font-size:30rpx">
						{{ssqff(item2)}}
					</text>
				</view>
				<view style="margin-left: auto;display:flex;" v-for="(item2,index) in data_jixuan.value.data.dan.blue">
					<text class="dingdanwenzi" style="color: #1e8bff; font-size:30rpx">
						{{ssqff(item2)}}
					</text>
				</view>
			</view>
		</view>
		<view style="margin: auto;width: 710rpx;height: 1rpx;background-color: #f7f7f7;"></view>
		<view class="left" style="display: flex;flex-direction: row;margin-top: 30rpx;">
			<text style="font-size:21px;font-weight: bold;">机选号码</text>
			<view class="right" style="margin-left: auto;display: flex;flex-direction: row;">
				<view class="claer" type="black" @click="clear">
					<text style="font-size: 30rpx;">清空</text>
				</view>
				<view class="claer" type="black" @click="initjixuan(1)">
					<text style="font-size: 30rpx;">重置</text>
				</view>
				<view class="claer" @click="jixuanNote_click()">
					<text>{{num==1?'1注':num==3?'3注':num==5?'5注':false}}</text>
				</view>
			</view>
		</view>
		
		<!-- 机选号码球 -->
		<view v-if="forceRefresh" v-for="(list,i) in data_jixuan.value.data.list" :key="i" class="dataJixian-list">
			<view class="textshuzhi"
				style="background:radial-gradient(#ff7373,#ff4f4f);"
				v-for="(text,index) in list.red" :key="text">
				<text class="tt" style="">{{ssqff(text)}}</text>
			</view>
			<view class="textshuzhi"
				style="background:radial-gradient(#6ea3ff,#1e8bff);"
				v-for="(text,index) in list.blue" :key="text">
				<text class="tt" style="">{{ssqff(text)}}</text>
			</view>
		</view>
		
	</view>
	
	<view v-show="current == 1" class="card" style="margin-bottom:160rpx;"><!-- 自选 -->
		<view class="left" style="display: flex;align-items: center;justify-content: space-between;margin: 20rpx 0;">
			<view style="display: flex;">
				<text style="font-size:20px;font-weight: bold; margin-left: 10rpx">选中号码两次设胆</text>
			</view>
			<view class="claer" type="black" @click="clear">
				<text style="font-size: 30rpx;">清空</text>
			</view>
		</view>
		<view class="shuzhi">
			<!-- 红球 -->
			<view v-for="item,index in 35" :key="item" 
				:class="boxstlye_red[index]==0?'redBall':'pitchRedBall'"
				@click="click(item,'red')">
				
				<view v-if="boxstlye_red[index]!=2" >
					<text class="lanqiuwenzi">{{item<10?'0'+item:item}}</text>
				</view>
				<view style="text-align: center;display: flex; flex-direction: column;" v-else>
					<text style="font-size:30rpx;font-weight:700;">{{item<10?'0'+item:item}}</text>
					<text style="font-size: 20rpx; font-weight: 700; margin-top: -5rpx;">胆</text>
				</view>
			</view>
		</view>
		<view class="shuzhi">
			<!-- 蓝球 -->
			<view  v-for="item,index in 12" :key="item" 
				   :class="boxstlye_blue[index]==0?'blueBall':'pitchBlueBall'"
				   @click="click(item,'blue')"
			>
				<view v-if="boxstlye_blue[index]!=2">
					<text>{{item<10?'0'+item:item}}</text>
				</view>
				<view style="text-align:center;display: flex; flex-direction: column;" v-else>
					<text style="font-size: 30rpx;font-weight:700;">{{item<10?'0'+item:item}}</text>
					<text style="font-size: 20rpx; font-weight: 700; margin-top: -5rpx;">胆</text>
				</view>
			</view>
		</view>
	</view>
	<!-- 弹出层 -->
	<uni-popup ref="tcpopup" :maskClick="false">
		<view style="background-color:#fff;border-radius:20rpx 20rpx 0 0;">
			<daletoouqingxuanze @close="tcpopupclose" :ballquantity="{'red':35,'blue':12}"></daletoouqingxuanze>
		</view>
	</uni-popup>
	
	<!-- 机选注数弹出层 -->
	<view :style="jixuanNote_select == 0 ? 'transform: scale(0.6,0.6);transform-origin:right top;opacity: 0;pointer-events:none;' : 'transform: scale(1,1);transform-origin:right top;opacity: 1;'"
		style="transition: all 0.25s;position: fixed;background-color: white;width: 280rpx;height: 250rpx;display: flex;align-items: center;justify-content: center;flex-direction: column;border-radius: 20rpx;box-shadow: 0 5rpx 15rpx #eeeeee;right: 20rpx;top: 520rpx;">
		<view v-for="item,index in localdata" :key="index" @click="change(item.number)" class="clickNote"
			:style="index == 1 ? 'border: 1rpx solid #fafafa;border-left:none;border-right:none;':false"
			style="width: 220rpx;height:80rpx;background-color:white;display: flex;align-items: center;justify-content: center;">
			<text>{{item.value}}</text>
		</view>
	</view>
	<view style="width:100%;height:170rpx;"></view>
	<view class="submit"><!-- 底部 -->
		<view class="submit-top">
			<text style="font-weight: bold;">{{designatedTime}}期&nbsp</text>
			<text>{{daelDateArr.deyStr}}</text>
			<text style="font-weight:bold;">{{daelDateArr.daelHours}}分截止</text>
		</view>   
		<view class="submit-bottom">
			<view style="margin-left: 25rpx;">
				<uni-icons class="input-uni-icon" type="trash" size="35" color="#c5c5c5" @click="clear" />
			</view>
			<view style="font-size: 26rpx;" v-show="current == 0">
				<text>已选<text style="color: red;">{{data_jixuan.value.note}}</text>注 <text style="color: red;">{{data_jixuan.value.money}}</text>元</text>
			</view>
			<view style="font-size: 26rpx;" v-show="current == 1">
				<text>已选<text style="color: red;">{{data_zixuan.value.note}}</text>注 <text style="color: red;">{{data_zixuan.value.money}}</text>元 </text>
			</view>
			<view class="bottom-button" style=" height: 75rpx; width: 350rpx;margin-right: 10rpx;">
				<view class="bottom-button01" style="font-size: 28rpx;" @click="addNumber()">+加入选号</view>
				<view class="bottom-button02" style="font-size: 30rpx;" @click="messageToggle()">提交</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import common from "@/common/common.js"
	import initDate from "@/common/getdatetime.js"
	import api from "@/common/vmeitime-http/sporttery.js"
	import xialakuang from "@/components/main/bet/daletou/xialakuang.vue"
	import daletoouqingxuanze from "@/components/main/bet/daletou/daletoouqingxuanze.vue"
	import { useCounterStore } from '@/stores/counter'
	import { onBackPress } from '@dcloudio/uni-app'
	import {onBeforeMount,onMounted,ref,reactive,getCurrentInstance,nextTick} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore() //状态管理
	
	const forceRefresh =ref(true)
	const wqsj = reactive({
		code:'',
		poolmoney:'',
		lotteryDrawResult:[],
		list:[],
	})
	
	onBackPress(()=>{ //这个监听各种返回事件
		if(counter.submitNewData.length > 0){
			back()
			return true
		}
	})
	const designatedTime = ref('')//期数
	const week = ref('')//星期几number
	
	onBeforeMount(() => {
		week.value = new Date().getDay()//当前周几复制
		getNewIssue()//获取最新期数
		initjixuan(1)//机选初始化
		initzixuan()//自选初始化
		init()//为自选样式初始化
		
	})
	
	const getNewIssue=()=>{
		api.GetHistory({"gameNo":"85","pageSize":"10","pageNo":'1'}).then((res)=>{
			designatedTime.value =res.data.data.issue
		    if (res.data.code === 1) {
				for(var i=0;i<=res.data.data.data.length-1;i++){
					if(i==0){
						wqsj.code = res.data.data.data[i].code
						wqsj.poolmoney = res.data.data.data[i].poolmoney
						wqsj.lotteryDrawResult = res.data.data.data[i].lotteryDrawResult
						wqsj.SaleEndtime=res.data.data.data[i].SaleEndtime
					}else{
						var arr = {
							code : res.data.data.data[i].code,
							poolmoney : res.data.data.data[i].poolmoney,
							lotteryDrawResult : res.data.data.data[i].lotteryDrawResult,
							SaleEndtime:res.data.data.data[i].SaleEndtime
							
						}
						wqsj.list.push(arr)
					}
				}
				nextTick(() => {
					proxy.$refs.wqsjss.resize()
				})
				getjiezhitime()//获取扣除店主设置的提前截止时间后的截止时间
		    }else{
				bouttmBoole.value=false
				uni.showToast({
					title:'往期数据获取失败~',
					position:'center',
					icon:'error',
					duration:2500
				})
			}
		})
	}
	
	const data_jixuan =reactive({})
	const data_zixuan =reactive({})

	
	
	const initjixuan=(e,data)=>{
		var jixuan = {
			note:0,
			money:0,
			name:"大乐透",
			yeimian:'daletou',
			Type:'jixuan',
			data:{
				dan:{
					red:[],
					blue:[],
				},
				list:[],
			},
		}
		data_jixuan.value=jixuan
		
		// 通过e判断是否需要添加初始化数据
		if(e==1){
			data_jixuan.value.note = num.value
			data_jixuan.value.money = num.value*2
			for(var i=0;i<=num.value-1;i++){
				var reddata = common.quickSort(common.GetRandomArray(1,35,5))
				var bluedata =common.quickSort(common.GetRandomArray(1,12,2))
				var arr = {
					red:reddata,
					blue:bluedata
				}
				data_jixuan.value.data.list.push(arr)
			}
		}else if(e==2){
			data_jixuan.value.note = num.value
			data_jixuan.value.money = num.value*2
			for(var i=0;i<=num.value-1;i++){
				
				var count = 0
				for(;;){
					count+=1
					var reddata = common.quickSort(common.GetRandomArray(1,35,5-data.red.length))
					var bluedata =common.quickSort(common.GetRandomArray(1,12,2-data.blue.length))
					
					
					
					
					var newdata = reddata.concat(data.red)
					newdata = common.quickSort(newdata)
					var newdata02 = bluedata.concat(data.blue)
					newdata02 = common.quickSort(newdata02)
					
					// console.log('执行'+count)
					var list1= newdata.filter((item, index) => newdata.indexOf(item) === index)
					var list2= newdata02.filter((item, index) => newdata02.indexOf(item) === index)
					if(list1.length==5 && list2.length==2){
						break
					}else{
						reddata=[]
						bluedata=[]
					}
					
				}
				
				
				var arr = {
					red:newdata,
					blue:newdata02
				}
				data_jixuan.value.data.list.push(arr)
			}
			
			// console.log(data_jixuan.value);
		}	
		forceRefresh.value = false
		//强制刷新
		proxy.$nextTick(() => {
			forceRefresh.value = true
		})
	}
	const initzixuan=()=>{
		var zixuan = {
			note:0,
			money:0,
			beilv:1,
			name:"大乐透",
			yeimian:'daletou',
			Type:'zixuan',
			Deadline:null,
			data:{
				dan:{
					red:[],
					blue:[],
				},
				list:{
					red:[],
					blue:[],
				},
			},
		}
		data_zixuan.value=zixuan
	}
	
	// 选择器切换
	const current = ref(0)
	const groupitems = reactive(['机选', '自选']) //选择选或自选
	const clickItem = (e) => {
		if (current.value != e.currentIndex) {current.value = e.currentIndex;}
		if(current.value==0){
			initjixuan(1)//机选初始化
		}else{
			initzixuan()//自选初始化
		}
	}
	
	// 机选n注按钮
	const num =ref(5)//机选展示的注数
	const localdata =reactive([{value:'1注',number:1},{value:'3注',number:3},{value:'5注',number:5}])
	const change = (e)=>{  e//是组件传过来的机选几注
		num.value = e
		jixuanNote_select.value = 0
		initjixuan(1)
	}
	// 机选定胆弹出层
	const tanchu = ()=>{
		proxy.$refs.tcpopup.open('bottom')
	}
	// 机选定胆返回
	const tcpopupclose = (data)=>{
		if(data!=null){
			initjixuan(2,data)
			data_jixuan.value.data.dan.blue=common.quickSort(data.blue)
			data_jixuan.value.data.dan.red=common.quickSort(data.red)
		}
		proxy.$refs.tcpopup.close('bottom')
	}
	// 机选号码注数选择显示
	const jixuanNote_select = ref(0)
	const jixuanNote_click = (e) =>{
		if(jixuanNote_select.value == 0){
			jixuanNote_select.value = 1
		}else{
			jixuanNote_select.value = 0
		}
	}
	
	
	// 自选样式初始化
	const boxstlye_red = reactive([])
	const boxstlye_blue = reactive([])
	const init = () => {
		boxstlye_red.splice(0, boxstlye_red.length)
		boxstlye_blue.splice(0, boxstlye_blue.length)
		for (var i = 1; i <= 35; i++) {
			boxstlye_red.push(0)
		}
		for (var i = 1; i <= 12; i++) {
			boxstlye_blue.push(0)
		}
	
	}
	
	// 自选选择点击
	const click = (item,type)=>{
		if(type=='red'){
			if(boxstlye_red[item-1]==0){
				data_zixuan.value.data.list.red.push(item)
				boxstlye_red[item-1] = 1
				isnote()
				return
			}
			if(boxstlye_red[item-1]==1){
				// 删除内容
				var index = data_zixuan.value.data.list.red.findIndex(i =>
					i == item 
				)
				data_zixuan.value.data.list.red.splice(index, 1)
				// 判断是否不超过四个增加胆
				if(data_zixuan.value.data.dan.red.length<4){
					data_zixuan.value.data.dan.red.push(item)
					boxstlye_red[item-1] = 2
				}else{
					boxstlye_red[item-1] = 0
				}
				isnote()
				return
			}
			if(boxstlye_red[item-1]==2){
				// 删除胆
				var index = data_zixuan.value.data.dan.red.findIndex(i =>
					i == item 
				)
				data_zixuan.value.data.dan.red.splice(index, 1)
				boxstlye_red[item-1] = 0
				isnote()
				return
			}
		}
		if(type=='blue'){
			if(boxstlye_blue[item-1]==0){
				data_zixuan.value.data.list.blue.push(item)
				boxstlye_blue[item-1] = 1
				isnote()
				return
			}
			if(boxstlye_blue[item-1]==1){
				// 删除内容
				var index = data_zixuan.value.data.list.blue.findIndex(i =>
					i == item 
				)
				data_zixuan.value.data.list.blue.splice(index, 1)
				// 判断是否不超过1个增加胆
				if(data_zixuan.value.data.dan.blue.length<1){
					data_zixuan.value.data.dan.blue.push(item)
					boxstlye_blue[item-1] = 2
				}else{
					boxstlye_blue[item-1] = 0
				}
				isnote()
				return
			}
			if(boxstlye_blue[item-1]==2){
				// 删除胆
				var index = data_zixuan.value.data.dan.blue.findIndex(i =>
					i == item 
				)
				data_zixuan.value.data.dan.blue.splice(index, 1)
				boxstlye_blue[item-1] = 0
				isnote()
				return
			}
		}
	}
	// 自选计算注数
	const isnote =()=>{
		var num_red = data_zixuan.value.data.list.red.length
		var num_blue = data_zixuan.value.data.list.blue.length
		var dannum_red = data_zixuan.value.data.dan.red.length
		var dannum_blue = data_zixuan.value.data.dan.blue.length
		if(num_red+dannum_red>=5 && num_blue+ dannum_blue>=2){
			data_zixuan.value.note = common.TakeMN(num_red, 5 - dannum_red)*common.TakeMN(num_blue, 2 - dannum_blue)
			data_zixuan.value.money = data_zixuan.value.note * 2
		}else{
			data_zixuan.value.note = 0
			data_zixuan.value.money = data_zixuan.value.note * 2
		}
		
	}
	// 点击提交
	const messageToggle=()=>{
		if(!bouttmBoole.value){
			uni.showToast({title:'本期已截止、请等待下期开启后在进行投注~',icon:'none',position:'center'})
			return
		}
		if(current.value==0){
			data_jixuan.value['list']=data_jixuan.value.data.list
			var jixuan_arr = {
				note:1,
				money:2,
				beilv:1,
				name:"大乐透",
				yeimian:'daletou',
				Type:'jixuan',
				data:{
					list:[]
				}
			}
			for(var j = 0 ; j <= data_jixuan.value['list'].length-1 ; j++){
				jixuan_arr['data']['list'] = data_jixuan.value['list'][j]
				counter.submitNewData.push(jixuan_arr)
				jixuan_arr = {
					note:1,
					money:2,
					beilv:1,
					name:"大乐透",
					yeimian:'daletou',
					Type:'jixuan',
					data:{
						list:[]
					}
				}
			}
			uni.navigateTo({
				url: '/pages/main/submit/submit_shuzi?&nowDeadline='+daelDateArr.daelDate+'&lssue='+designatedTime.value,
				animationType: 'pop-in',
				animationDuration: 200
			});
			initjixuan(1)
		}if(current.value==1){
			if(data_zixuan.value.note > 0 || counter.submitNewData.length > 0){
				if(data_zixuan.value.data.list.red.length+data_zixuan.value.data.dan.red.length >= 5 && data_zixuan.value.data.list.blue.length+data_zixuan.value.data.dan.blue.length >= 2){
					counter.submitData.push(data_zixuan.value)
					data_zixuan.value['beilv']=1
					counter.submitNewData.push(data_zixuan.value)
					initzixuan()
					init()
					uni.navigateTo({
						url: '/pages/main/submit/submit_shuzi?&nowDeadline='+daelDateArr.daelDate+'&lssue='+designatedTime.value,
						animationType: 'pop-in',
						animationDuration: 200
					});
				}else{
					uni.navigateTo({
						url: '/pages/main/submit/submit_shuzi?&nowDeadline='+daelDateArr.daelDate+'&lssue='+designatedTime.value,
						animationType: 'pop-in',
						animationDuration: 200
					});
				}
			}else{
				uni.showToast({
					title:"请先完成选号!",
					icon:"none",
				})
			}
		}
	}
	const addNumber =()=>{//加入选号
		if(!bouttmBoole.value){
			uni.showToast({title:'本期已截止、请等待下期开启后在进行投注~',icon:'none',position:'center'})
			return
		}
		if(current.value==0){
			data_jixuan.value['list']=data_jixuan.value.data.list
			var jixuan_arr = {
				note:1,
				money:2,
				beilv:1,
				name:"大乐透",
				yeimian:'daletou',
				Type:'jixuan',
				data:{
					list:[]
				}
			}
			counter.submitData.push(data_jixuan.value)
			uni.showToast({
				icon:'none',
				title: '加入成功',
				duration: 2000
			});
			for(var j = 0 ; j <= data_jixuan.value['list'].length-1 ; j++){
				jixuan_arr['data']['list'] = data_jixuan.value['list'][j]
				counter.submitNewData.push(jixuan_arr)
				jixuan_arr = {
					note:1,
					money:2,
					beilv:1,
					name:"大乐透",
					yeimian:'daletou',
					Type:'jixuan',
					data:{
						list:[]
					}
				}
			}
			initjixuan(1)
		}
		if(current.value==1){
			if(data_zixuan.value.note > 0 || counter.submitNewData.length > 0){
				if(data_zixuan.value.data.list.red.length+data_zixuan.value.data.dan.red.length >= 5 && data_zixuan.value.data.list.blue.length+data_zixuan.value.data.dan.blue.length >= 2){
					counter.submitData.push(data_zixuan.value)
					counter.submitNewData.push(data_zixuan.value)
					uni.showToast({
						icon:'none',
						title: '加入成功',
						duration: 2000
					});
					initzixuan()
					init()
				}else{
					uni.navigateTo({
						url: '/pages/main/submit/submit_shuzi?&nowDeadline='+daelDateArr.daelDate+'&lssue='+designatedTime.value,
						animationType: 'pop-in',
						animationDuration: 200
					});
				}
			}else{
				uni.showToast({
					title:"请先完成选号!",
					icon:"none",
				})
			}
		}
	}
	
	// 点击清空
	const clear=()=>{
		if(current.value==0){
			initjixuan(0)
		}
		if(current.value==1){
			initzixuan()
			init()
		}
	}
	// 返回按钮
	const back = () => {
		counter.submitNewData = []
		counter.submitData = []
		uni.navigateBack({
			delta:1,
			animationType: 'pop-out',
			animationDuration: 200
		})
	}
	const ssqff = (itme) =>{ //给数字加0
		if(itme<10){
			var a = '0' + itme
		}else{
			a = itme
		}
		return a
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
		var daelWeek=['星期一','星期三','星期六']
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
			if(nowDate.getFullYear()==daelDate.getFullYear()){
				//当天时间与截止时间是同一年的话执行
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
	.blueBall{
		width:70rpx;
		height:70rpx;
		font-size:23rpx;
		align-items: center;
		justify-content: center;
		display: flex;
		font-weight:700;
		background:radial-gradient(#eaf1ff,#eaf1ff);
		color: #1e8bff;
		margin:15rpx;
		border-radius:50rpx;
	}
	.pitchBlueBall{
		width:70rpx;
		height:70rpx;
		font-size:23rpx;
		align-items: center;
		justify-content: center;
		display: flex;
		font-weight:700;
		background:radial-gradient(#7dabff,#1e8bff);
		color: #ffffff;
		margin:15rpx;
		border-radius:50rpx;
	}
	.pitchRedBall{
		width:70rpx;
		height:70rpx;
		font-size:23rpx;
		align-items: center;
		justify-content: center;
		display: flex;
		background:radial-gradient(#ff7373,#ff4f4f);
		color: #ffffff;
		border-radius:50rpx;
		margin:15rpx;
	}
	.redBall{
		width:70rpx;
		height:70rpx;
		font-size:23rpx;
		align-items: center;
		justify-content: center;
		display: flex;
		background:radial-gradient(#ffeeee,#ffeeee);
		color: #ff4f4f;
		border-radius:50rpx;
		margin:15rpx;
	}
	.card{
		background-color: white;
		margin-top: 30rpx;
		padding:20rpx;
	}
	body{
		background-color: #f9f9f9;
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
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-shadow: 0 5rpx 15rpx -8rpx #ebebeb;
	}
	
	.boxss {
		display: flex;
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.topshuzhi {
		margin: 0rpx 5rpx;
		background-color: red;
		width: 45rpx;
		height: 45rpx;
		color: white;
		text-align: center;
		border-radius: 50rpx;
	}
	
	.dataJixian-list{
		display: flex;
		flex-direction: row;
		margin-top: -20rpx;
		opacity:0;
		margin-left: 30rpx;
		animation:subside 1s ease;
		animation-fill-mode:forwards;
		}.textshuzhi {
		align-items: center;
		justify-content: center;
		display: flex;
		margin: 0rpx 8rpx;
		background-color: red;
		width: 65rpx;
		height: 65rpx;
		color: white;
		text-align: center;
		border-radius: 50rpx;
		animation: run 1s ease-out;
		animation-fill-mode:forwards;
	}
	.textshuzhi2 {
		margin: 0rpx -2rpx;
		border-radius: 50rpx;
		width: 65rpx;
		height: 65rpx;
		color: white;
		text-align: center;
		
	}

	.shuzhi {
		display: flex;
		flex-direction: row;
		flex-flow: wrap;
		margin-top: 10rpx;
		margin-right: 20rpx;
		margin-left: 30rpx;
	}

	.tt {
		font-size: 15px;
		font-weight: 700;
		justify-content: center;
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.tt2 {
		font-size: 15px;
		font-weight: 700;
		justify-content: center;
		display: flex;
		align-items: center;
		justify-content: center;

	}


	.left {
		display: flex;
	}

	.biaoti1 {
		font-size: 120%;
		margin-top: 45rpx;
	}

	
	.xuanzeyangshi {
		background: linear-gradient(45deg, #f04b49, #f37335);
		border-radius: 10px;
		width: 200rpx;
		height: 80rpx;
		margin-left: -27rpx;
	}

	.dingdanwenzi {
		font-size: 15px;
		margin-left: 5rpx;
		margin-right: 5rpx;
		font-weight: 700;
	}

	.claer {
		margin-right: 15rpx;
		color: #4f4f4f;
		font-size: 10px;
		display: flex;
		width: 100rpx;
		height: 50rpx;
		border: 1px solid #e2e2e2;
		border-radius: 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}


	.lanqiuwenzi {
		font-size: 30rpx;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		display: flex;
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
	
	
	/* 球旋转动画 */
	@keyframes run{
		from{transform: rotate(0deg);}
		to{transform: rotate(3600deg);}
	}
	
	@keyframes subside{
		form{}
		to{margin-top: 40rpx;opacity: 1;}
	}
	
</style>
