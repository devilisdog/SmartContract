<template>
	<view class="navBar">
		<view class="navBar_left" @click="back">
			<uni-icons color="#fff" type="back" size="40rpx"></uni-icons>
			<text style="color: #fff;">返回</text>
		</view>
		<view class="navBar_centre" style="color: #fff;">投注单</view>
		<view class="navBar_right"></view>
	</view>
	<!-- 添加赛事 发起合买 动态添加按钮-->
	<view class="head">
		<view class="button" @click="action(item.id)" v-for="item,index in headButton" :key="item.id" >
			{{item.text}}
		</view>
	</view>
	<view class="game_content_box">
		<uni-swipe-action>
			<uni-swipe-action-item class="content-list" v-for="(itme,index) in cardContent"  :key="index"
				:right-options='options' 
				@click='options_Click(index)'
			>
				<view style="margin:15rpx 0rpx 15rpx 15rpx;">
					{{itme.leagueAbbName}} / {{itme.matchNumStr}}
				</view>
				<view class="game_title">
					<view class="title_itme">
						<text style="font-size:32rpx;">{{itme.homeTeamAbbName}}</text>
						<text v-if="itme.goal" :style="Number(itme.goal)>0?'color:red;':'color:green;'">{{itme.goal}}</text><br>
						<text v-if="itme.size" style="color:blue;">{{itme.size}}</text>
					</view>
					<view class="title_itme" style="flex:0.3;">VS</view>
					<view class="title_itme">{{itme.awayTeamAbbName}}</view>
				</view>
				<view class="game_content">
					<text v-for="(item2,index2) in itme.data" style="margin:20rpx;">{{item2.res}}</text>
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
		<uni-group class="lastCard">
			<view v-if="cardContent.length!=0">您已选择{{cardContent.length}}场比赛</view>
			<view v-else>还未选择比赛</view>
			<view v-show="counter.BettingContent.type == '北京单场'|| counter.BettingContent.type == '胜负过关'">
				温馨提示：北单奖金计算公式=2X所有场次的开奖sp值X0.65X倍数
			</view>
		</uni-group>
	</view>
	
		<!-- 底部选项卡 -->
	<uni-popup ref="popup">
		<SubmitPay :type="counter.BettingContent.type"  :money="betmoney" 
				   :balance="counter.user_money-betmoney" @ConfirmPayment="getNewMoney()">
		</SubmitPay>
	</uni-popup>
	
	<uni-popup ref="infopopup">
		<!-- <view style="background-color:#f3f3f3;height:95vh;border-radius:30rpx 30rpx 0 0;"> -->
			<orderPopup @close='closeOrder()'></orderPopup>
		<!-- </view> -->
	</uni-popup>
	<!-- 底部导航 -->
	<view class="footer">
		<Goodnav 
			:ismnshow="ismnshow" 
			:hidetext="hidetext" 
			:mnhideList="mnhideListdata" 
			:hideList="hideListdata" 
			:valuesdata="valuesdata" 
			:Type = "counter.BettingContent.type"
			@hidelick="hidelick" 
			@mnhidelick="mnhidelick" 
			@changMultiple="changMultiple" 
			@buttonClick="buttonClick"
			@initData="emptyData"
			@savePlan="savePlan"
			:BonusOptimization='counter.gameAstrict.BonusOptimization'
			v-if="show_DataList">
		</Goodnav>
	</view>
</template>

<script setup>
	import Goodnav from "@/components/main/nav/yc-submit-nav.vue"
	import SubmitPay from "@/components/main/nav/yc-submit-pay.vue"
	import orderPopup from "@/components/common/yc-common-BettingInfo/yc-common-BettingInfo.vue"
	import api from '@/common/vmeitime-http/beting.js'
	import {useCounterStore} from '@/stores/counter';
	import {onBeforeMount,ref,reactive,defineProps,defineEmits,getCurrentInstance,nextTick} from 'vue';
	import {onShow} from "@dcloudio/uni-app"
	import common from '@/common/common'
	const {proxy,ctx} = getCurrentInstance()
	const emits = defineEmits(['deleStyle','close','openPage'])
	const counter = useCounterStore() //状态管理
	onShow(()=>{
		showSpell() //是否显示跟单
		if(counter.BettingContent.type == '任选九' || counter.BettingContent.type == '胜负彩'){
			newNoteinit()//任选九||胜负彩的note计算对照表
			var gameLength=counter.BettingContent.type=='任选九'?9:counter.BettingContent.type=='胜负彩'?14:1
			valuesdata.Note = common.NoteCompute(newNoteData,gameLength)
			valuesdata.Amount = common.ComputeAmount(valuesdata.Note,valuesdata.Multiple)
		}else{
			hidetextInit()//过关方式生成
		}
	})
	const isComplex=()=>{//判断此订单是否为复杂玩法
		var bool=false
		for(var a=0;a<counter.BettingContent.Content.length;a++){
			for(var c=0;c<counter.BettingContent.Content[a].data.length;c++){
				var index=null
				for(var s=0;s<game[counter.BettingContent.type].length;s++){
					var index2 = game[counter.BettingContent.type][s].findIndex(item =>
						item == counter.BettingContent.Content[a].data[c].res
					)
					if(index2!=-1){break}
				}
				if(c==0){
					index=index2
				}else{
					bool=index==index2?false:true
				}
			}
		}
		return bool
	}
	// 卡片内容.从jczq页面获取的
	const cardContent = reactive(counter.BettingContent.Content) //接收到提交的数据
	// 用于渲染卡片数据的信息
	const hideListdata = reactive([])
	const mnhideListdata = reactive([])
	const ismnshow = ref(false)
	const mndata = reactive([{//多串过关字典
			id: 3,
			data: ['3串3', '3串4'],
			mndata:['2串1','2串1,3串1'],
			rcc:[1,1],
			mnmoney:[6,8]
		},
		{
			id: 4,
			data: ['4串4', '4串5', '4串6', '4串11'],
			mndata:['3串1','3串1,4串1','2串1','2串1,3串1,4串1'],
			rcc:[1,1,2,2],
			mnmoney:[8,10,12,22]
		},
		{
			id: 5,
			data: ['5串5', '5串6', '5串10', '5串16', '5串20', '5串26'],
			mndata:['4串1','4串1,5串1','2串1','3串1,4串1,5串1','2串1,3串1','2串1,3串1,4串1,5串1'],
			rcc:[1,1,3,2,3,3],
			mnmoney:[10,12,20,32,40,52]
		},
		{
			id: 6,
			data: ['6串6', '6串7', '6串15', '6串20', '6串22', '6串35', '6串42', '6串50', '6串57'],
			mndata:['5串1','5串1,6串1','2串1','3串1','4串1,5串1,6串1','2串1,3串1','3串1,4串1,5串1,6串1','2串1,3串1,4串1','2串1,3串1,4串1,5串1,6串1'],
			rcc:[1,1,4,3,2,4,3,4,4],
			mnmoney:[12,14,30,40,44,70,84,100,114]
			
		},
		{
			id: 7,
			data: ['7串7', '7串8', '7串21', '7串35', '7串120'],
			mndata:['6串1','6串1,7串1','5串1','4串1','2串1,3串1,4串1,5串1,6串1,7串1'],
			rcc:[1,1,2,3,5],
			mnmoney:[14,16,42,70,240]
		},
		{
			id: 8,
			data: ['8串8', '8串9', '8串28', '8串56', '8串70', '8串247'],
			mndata:['7串1','7串1,8串1','6串1','5串1','4串1','2串1,3串1,4串1,5串1,6串1,7串1,8串1'],
			rcc:[1,1,2,3,4,5],
			mnmoney:[16,18,56,112,140,494]
		}
	])
	const hidelist = reactive(['1单关1', '2串1', '3串1', '4串1', '5串1', '6串1', '7串1', '8串1','9串1','10串1','11串1','12串1','13串1','14串1','15串1'])
	
	const game=reactive({//玩法字典
		'竞彩足球':[
			['胜','平','负'],
			['让胜','让平','让负'],
			['0','1','2','3','4','5','6','7+'],
			['胜-胜','胜-平','胜-负','平-胜','平-平','平-负','负-胜','负-平','负-负'],
			['1:0','2:0','2:1','3:0','3:1','3:2','4:0','4:1','4:2','5:0','5:1','5:2','胜其它','0:0','1:1','2:2','3:3','平其它','0:1','0:2','1:2','0:3','1:3','2:3','0:4','1:4','2:4','0:5','1:5','2:5','负其它']
		],
		'竞彩篮球':[
			['胜','负'],
			['让胜','让负'],
			['大','小'],
			['客胜1~5','客胜6~10','客胜11~15','客胜16~20','客胜21~25','客胜26+','主胜1~5','主胜6~10','主胜11~15','主胜16~20','主胜21~25','主胜26+'],
		],
		'胜负过关':[
			['胜','负']
		],
		'北京单场':[
			['胜','平','负'],
			['上单','上双','下单','下双'],
			['0','1','2','3','4','5','6','7+'],
			['胜-胜','胜-平','胜-负','平-胜','平-平','平-负','负-胜','负-平','负-负'],
			['1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2','胜其它','0:0', '1:1', '2:2', '3:3', '平其它', '0:1', '0:2', '1:2', '0:3', '1:3', '2:3', '0:4', '1:4','2:4','负其它']
		]
	})
	const headButton = reactive([// 头部按钮的控制信息
		{
			id: 0,
			text: "+添加赛事",
			show: true
		},
		{
			id: 1,
			text: "发起合买",
			show: true
		},
		{
			id: 2,
			text: "发起跟单",
			show: true
		},
	])
	const emptyData=()=>{
		uni.showLoading({title:'删除中',mask:true})
		var timeovr=200
		var newTime=200*counter.BettingContent.Content.length
		for(var i=0;i<counter.BettingContent.Content.length;i++){
			timeovr=timeovr+100
			setTimeout(()=>{
				counter.styleData.data=[]
				counter.styleData.data.push(counter.BettingContent.Content[0].matchId)
				counter.BettingContent.Content.splice(0,1)
			},timeovr)
		}
		hideListdata.splice(0,hideListdata.length)
		hidetext.splice(0,hidetext.length)
		mnhideListdata.splice(0,mnhideListdata.length)
		valuesdata.Amount=0
		valuesdata.bonusmax=0
		valuesdata.bonusmin=0
		valuesdata.Note=0
		setTimeout(()=>{
			uni.hideLoading()
		},newTime)
	}
	const showSpell = () =>{//是否显示跟单
		if(counter.gameAstrict.Issuing_switch == 1){
			if(counter.BettingContent.type == '任选九' || counter.BettingContent.type == '胜负彩'){
				headButton.splice(headButton.length-1,1)//删除跟单选项
			}
		}else{
			headButton.splice(headButton.length-1,1)//删除跟单选项
		}
	}
	const action = (id) => {// 头部按钮组点击事件
		valuesdata.reachType = hidetext
		counter.BettingContent.remarks = valuesdata
		delete counter.BettingContent.bonusOptimize
		if (id == 0) {back()}//选择赛事
		if (id == 1) {
			if(hidetext.length===0 && counter.BettingContent.type != '任选九' && counter.BettingContent.type != '胜负彩'){
				uni.showToast({
					icon:"error",
					title: '请选择过关方式',
					duration: 2000
				});
			}else if(valuesdata.Amount < 10){
				uni.showToast({
					icon:"none",
					title: '订单金额不能小于10元',
					duration: 2000
				});
			}else{
				uni.navigateTo({
					url: '../submit/buyTogether?Amount='+valuesdata.Amount+'&Note='+valuesdata.Note+'&bonusmin='+valuesdata.bonusmin * valuesdata.Multiple+'&bonusmax='+valuesdata.bonusmax * valuesdata.Multiple+'&lssue='+counter.BettingContent.lssue,
				});  
				counter.BettingContent.remarks = valuesdata
			}
		}
		if (id == 2) {
			if(hidetext.length==0){
				uni.showToast({
					icon:"error",
					title: '请选择过关方式',
					duration: 2000
				});
			}else if(valuesdata.Amount < 100){
				uni.showToast({
					icon:"none",
					title: '发单投注金额最小100元！',
					duration: 2000
				});
			}else{
				uni.navigateTo({
					url: '../submit/spell?Amount='+valuesdata.Amount+'&Note='+valuesdata.Note+'&bonusmin='+valuesdata.bonusmin * valuesdata.Multiple+'&bonusmax='+valuesdata.bonusmax * valuesdata.Multiple+'&lssue='+counter.BettingContent.lssue,
				});
			}
		}
	}
	
	const back = () => {uni.navigateBack()} //返回到上一个页面

	
	const hidetext = reactive([])// 自由过关选择
	const hidelick = (e) => {//选择样式变化 和 注数计算
		if(e.isActive == false){//如果多串过关不等于空
			if(mntext.value!==''){
				// 把所有的多串过关取消选择
				for (var i = 0; i <= mnhideListdata.length - 1; i++) {
					mnhideListdata[i].isActive = false
				}
				hidetext.splice(hidetext.indexOf(mntext.value), 1)
				valuesdata.Note = 0
				mntext.value=''
			}
			//计算金额 点击 = 加
			hidetext.push(e.text)
			var data=mnhidelickNote(counter.BettingContent.Content,hidetext,valuesdata.Multiple,counter.gameAstrict.Repeat)
			valuesdata.Note=data.note
			valuesdata.Amount=data.betMoney
			valuesdata.bonusmax=data.maxMoney
			valuesdata.bonusmin=data.minMoney
		}else{
			//计算金额 取消 = 减
			hidetext.splice(hidetext.indexOf(e.text),1)
			var data=mnhidelickNote(counter.BettingContent.Content,hidetext,valuesdata.Multiple,counter.gameAstrict.Repeat)
			valuesdata.Note=data.note
			valuesdata.Amount=data.betMoney
			valuesdata.bonusmax=data.maxMoney
			valuesdata.bonusmin=data.minMoney
		}
		hideListdata[e.id].isActive = !hideListdata[e.id].isActive
	}
	
	// 多串过关选择
	const mntext = ref([])
	const mnhidelick = (e) => {
		hidetext.splice(0, hidetext.length)//每次点击清空已选择的选项
		if(e.isActive==false){
			for (var i = 0; i <= hideListdata.length - 1; i++) {
				// 把所有的自由过关取消选择
				hideListdata[i].isActive = false
			}
			for (var i = 0; i <= mnhideListdata.length - 1; i++) {
				// 把所有的多串过关取消选择
				mnhideListdata[i].isActive = false
			}
			hidetext.push(e.text)//过关方式选择并push
			mnhideListdata[e.id].isActive=true
			var data=mnhidelickNote(counter.BettingContent.Content,hidetext,valuesdata.Multiple,counter.gameAstrict.Repeat)
			valuesdata.Note=data.note
			valuesdata.Amount=data.betMoney
			valuesdata.bonusmax=data.maxMoney
			valuesdata.bonusmin=data.minMoney
		}else{
			hidetext.splice(hidetext.indexOf(e.text),1)//过关方式删除
			mnhideListdata[e.id].isActive=false
			var data=mnhidelickNote(counter.BettingContent.Content,hidetext,valuesdata.Multiple,counter.gameAstrict.Repeat)
			valuesdata.Note=data.note
			valuesdata.Amount=data.betMoney
			valuesdata.bonusmax=data.maxMoney
			valuesdata.bonusmin=data.minMoney
		}
		mntext.value=e.text
	}
	
	
	const mnhidelickNote=(orderData,hidetextArr,beilv,repeat)=>{//注数计算总方法
		// orderData==初始数据/hidetextArr==过关方式/beilv==订单倍率/repeat==是否允许重复
		var betInfo={//返回的最终数据
			'note':0,//注数
			'maxMoney':0,//预测最大中奖金额
			'minMoney':0,//预测最小中奖金额
			'betMoney':0//投注金额
		}
		if(orderData.length==1 && hidetextArr[0]=='单关'){//如果只有一场比赛并选中的是单关将直接计算
			betInfo.note=0
			var moneyArr=[]
			orderData[0].data.forEach((itme,index)=>{
				betInfo.note++
				moneyArr.push(itme.rate*2)
			})
			betInfo.betMoney=(betInfo.note*2)*beilv
			betInfo.maxMoney=Math.max(...moneyArr)
			betInfo.minMoney=Math.min(...moneyArr)
			return betInfo
		}
		
		if(hidetextArr.length==0){//如果没有选择过关方式直接拦截返回默认数据
			return betInfo
		}
		var hidetextBoole=false
		for (var ii = 0; ii <= hidetextArr.length - 1; ii++) {
			if(hidetextArr[ii].split('串')[1] != 1){//判断是否为多串过关
				hidetextBoole=true
			}
		}
		
		var formattedOrderData=initDispose(orderData)//初始数据格式化
		var formattedHidetextArr=initHidetext(hidetextArr)//过关方式转换
	
		var oneCombinationData=[]//拆单后的数据
		if(repeat==0 && !hidetextBoole){//不允许重复
			oneCombinationData=nonredundantData(formattedOrderData,formattedHidetextArr)
		}else{//允许重复
			oneCombinationData=repetitive(formattedOrderData,formattedHidetextArr)
		}
		
		return noteMoney(oneCombinationData,beilv,repeat,hidetextBoole)//执行注数计算函数
	
	}
	const noteMoney=(data,beilv,repeat,hidetextBoole)=>{//注数计算函数
		var initArr={
			'note':0,//注数
			'maxMoney':0,//预测最大中奖金额
			'minMoney':0,//预测最小中奖金额
			'betMoney':0//投注金额
		}
		var iData=JSON.parse(JSON.stringify(data))
		var initData=CombinationFormatted(iData)//数据拆分
		var newCombinationData=[]//按过关方式组合后的数据
		initData.forEach(function(itme,index){
			var combinationData=[]
			itme.Hidetext.forEach(function(Xitme,Xindex){//循环过关方式并执行组合算法
				var number=Xitme.split('串')[0]
				combinationData.push(combinationFunction(itme.data,number))
			})
			var arr2 = combinationData.reduce(function (a, b) { return a.concat(b)});
			newCombinationData.push(arr2)
		})
		newCombinationData.forEach(function(itme,index){//注数计算
			initArr.note+=itme.length
		})
		var money=noteFuncion(data,beilv,repeat)//最大最小金额计算
		if(counter.BettingContent.type=='北京单场'||counter.BettingContent.type=='胜负过关'){
			initArr.maxMoney=money.max*0.65
			initArr.minMoney=money.min*0.65
		}else{
			initArr.maxMoney=money.max
			initArr.minMoney=money.min
		}
		initArr.betMoney=(initArr.note*2)*beilv
		return initArr
	}
	const CombinationFormatted=(arr)=>{//拆单后的数据拆分
		var allData=[]//最终拆分后的数据
		arr.forEach(function(itme,index){
			var newArr={
				data:[],
				Hidetext:itme.Hidetext
			}
			itme.data.forEach(function(Xitme,Xindex){
				Xitme.split(',')[1].split('|').forEach(function(Ditme,Dindex){
					if(Ditme!=''){
						newArr.data.push(Xitme.split(',')[0]+','+Ditme)
					}
				})
			})
			allData.push(newArr)
		})
		return allData
	}
	const nonredundantData=(data,reachTypeArr)=>{//不重复拆单算法
		var typeArr=[]
		// console.log(data,reachTypeArr)
		reachTypeArr.hidetext.forEach(function(itme,index){
			//拆分过关方式
			typeArr.push(itme.split('串')[0])
			// console.log(typeArr)
		})
		var maxType=Math.max(...typeArr)//找出最大的过关方式
		// console.log(maxType)
		var oneOrder=[]//第一张票
		var oneControlGroup=[]//第一张票的对照组
		for(var i=oneOrder.length;i<maxType;i++){
			var bool=false
			for(var f=0;f<oneOrder.length;f++){//循环push第一张票(条件是不同场次的)
				if(oneOrder[f].substring(0,5)==data[i].substring(0,5)){
					bool=true
					maxType++
					break
				}
			}
			if(!bool){
				oneOrder.push(data[i])
			}
		}
		typeArr.forEach(function(itme,index){
			//拿出第一张单的所有过关方式的组合，push到第一张票对照组
			oneControlGroup.push(combinationFunction(oneOrder,itme))
		})
		var newOneControlGroup=oneControlGroup.flat()//第一张单的对照组转一维数组
		var newTwoOrder=[]//其他票的
		typeArr.forEach(function(Citme,Cindex){
			//循环排出其他票的组合(条件是不能右于第一张票的相同的，不相同push到newTwoOrder)
			var twoOrder=combinationFunction(data,Citme)
			twoOrder.forEach(function(itme,index){
				var bool=false
				for(var t=0;t<newOneControlGroup.length;t++){
					if(newOneControlGroup[t].toString()==itme.toString()){
						bool=true
						break
					}
				}
				if(!bool){
					var init={
						data:itme,
						Hidetext:Array(Citme+'串1')
					}
					newTwoOrder.push(init)
				}
			})
		})
	
		var allData=newTwoOrder
		allData.unshift({data:oneOrder,Hidetext:reachTypeArr.hidetext})//合并到showdata里的最终数组里
		return allData
	}
	const repetitive=(data,HidetextArr)=>{//允许重复拆单算法
		var minLength=[]//每次执行组合的长度
		var minData=[]//每次执行组合的值
		for(var i=1;i<=10;i++){
			if(combinationFunction(data,i).length==0){
				break
			}else{
				minLength.push(combinationFunction(data,i).length)
				minData.push(i)
			}
		}
		var minIndex=minLength.indexOf(Math.min(...minLength))//拿到最小的组合长度
		var minData=combinationFunction(data,minData[minIndex])
		var maxHideText=Math.max(...HidetextArr.number)
		if(minData[0].length<maxHideText){
			var minData=combinationFunction(data,maxHideText)
		}
		var allData=[]
		minData.forEach(function(itme,index){
			var dataOjd={
				data:itme,
				Hidetext:HidetextArr.hidetext
			}
			allData.push(dataOjd)
		})
		return allData
	}
	const initHidetext=(arr)=>{//过关方式格式化函数
		var newArr={//过关方式格式化
			hidetext:[],//数组（字符串类型）的过关方式
			number:[]//数组（数字）的过关方式
		}
		arr.forEach(function(itme,index){
			if(itme=='1单关1'){
				newArr.hidetext.push('1串1')
			}else if(itme.split('串')[1]!=1){
				for(var i=0;i<mndata.length;i++){
					var hidetextIndex=mndata[i].data.indexOf(itme,0)
					if(hidetextIndex != -1){
						newArr.hidetext=mndata[i].mndata[hidetextIndex].split(',')
						break
					}
				}
			}else{
				newArr.hidetext.push(itme)
			}
		})
		newArr.hidetext.forEach(function(itme,index){
			newArr.number.push(Number(itme.split('串')[0]))
		})
		return newArr
	}
	const initDispose=(data)=>{//数据格式化
		var initData=data
		var oneData=[]
		initData.forEach(function(itme,index){
			itme.data.forEach(function(Xitme,Xindex){
				if(counter.BettingContent.type=='胜负过关' || counter.BettingContent.type=='北京单场'){
					oneData.push(
						'00'+itme.matchId+'&'+gameTypeIndex(Xitme.res)+','+Xitme.res+'/'+Xitme.rate+'|'
					)
				}else{
					oneData.push(
						itme.matchNumStr+'&'+gameTypeIndex(Xitme.res)+','+Xitme.res+'/'+Xitme.rate+'|'
					)
				}
			})
		})
		var list=[]
		oneData.forEach(function(itme,index){
			list.push(itme.split(','))
		})
		var newList=sortClass(list,0)//数组分类排序
		var newOneData=[]
		newList.forEach(function(itme,index){
			var newnew=itme[0][0]
			var text=''
			itme.forEach(function(Xitme,Xindex){
				text+=Xitme[1]
			})
			newOneData.push(newnew+','+text)
		})
		return newOneData
	}
	const noteFuncion=(data,beilv,repeat)=>{//预测中奖金额计算
		var newData={
			max:0,
			min:0
		}
		var initArr=data//数组降维
		var combinationArr=[]
		initArr.forEach(function(itme,index){
			//将没张票里它的所有过关方式的组合方法
			var arr=[]
			itme.Hidetext.forEach(function(Xitme,Xindex){
				arr.push(combinationFunction(itme.data,Xitme.split('串')[0]))
			})
			var arr2=arr.reduce(function (a, b) { return a.concat(b)});
			combinationArr.push(arr2)
		})
		var max_duizhao={}//关闭重复辅助计算数据
		var min_arr=[]
		combinationArr.forEach(function(itme,index){//循环每张票
			var minRepeat=[]//每注票的最小
			itme.forEach(function(p_itme,p_index){
				var all_max=1
				var all_min=1
				var objKey=''
				p_itme.forEach(function(i_itme,i_index){
					var itemBlv=i_itme.split(',')[1].split('|')
					if(i_index==0){objKey=i_itme.split('&')[0]}else{objKey+='|'+i_itme.split('&')[0]}
					var max_number=0
					var min_number=0
					itemBlv.forEach(function(x_itme,x_index){
						if(x_itme!=''){
							var newNumber=Number(x_itme.split('/')[1])
							max_number=newNumber>max_number?newNumber:max_number
							if(x_index==0){min_number=newNumber}else{min_number=newNumber<min_number?newNumber:min_number}
						}
					})
					all_max*=max_number
					all_min*=min_number
				})
				if(!max_duizhao[objKey]){max_duizhao[objKey]=[]}
				var xianzhi_max=all_max*2;
				if(p_itme.length==1 && xianzhi_max>100000){
					xianzhi_max=100000
				}else if(p_itme.length>=2 && p_itme.length<=3 && xianzhi_max>200000){
					xianzhi_max=200000
				}else if(p_itme.length>=4 && p_itme.length<=5 && xianzhi_max>500000){
					xianzhi_max=500000
				}else if(p_itme.length>=6 && xianzhi_max>1000000){
					xianzhi_max=1000000
				}
				max_duizhao[objKey].push(xianzhi_max)
				newData.max+=xianzhi_max//允许重复正常累加
				var xianzhi_min=all_min*2;
				if(p_itme.length==1 && xianzhi_min>100000){
					xianzhi_min=100000
				}else if(p_itme.length>=2 && p_itme.length<=3 && xianzhi_min>200000){
					xianzhi_min=200000
				}else if(p_itme.length>=4 && p_itme.length<=5 && xianzhi_min>500000){
					xianzhi_min=500000
				}else if(p_itme.length>=6 && xianzhi_min>1000000){
					xianzhi_min=1000000
				}
				min_arr.push(xianzhi_min)
				minRepeat.push(xianzhi_min)
			})
			newData.min+=Math.min(...minRepeat)
		})
		if(repeat=='0'){//关闭重复计算
			newData.max=0
			for(var key in max_duizhao){
				newData.max+=Math.max(...max_duizhao[key])
			}
			newData.min=Math.min(...min_arr)
		}
		return newData
	}
	
	function gameTypeIndex(title){//查找玩法下标
		for(var d=0;d<game[counter.BettingContent.type].length;d++){
			for(var e=0;e<game[counter.BettingContent.type][d].length;e++){
				var index = game[counter.BettingContent.type][d].findIndex(item =>
					item == title
				)
				if(index != -1){
					return d
					break
				}
			}
		}
	}
	const sortClass = (sortData,number) => {//数组分类
		const groupBy = (array, f) => {
		let groups = {};
		array.forEach((o) => {
			let group = JSON.stringify(f(o));
			groups[group] = groups[group] || [];
			groups[group].push(o);
		});
		return Object.keys(groups).map((group) => {
			return groups[group];
		});
		};
		const sorted = groupBy(sortData, (item) => {
			return item[number]; // 返回需要分组的对象
		});
			return sorted;
	};
	function combinationFunction(arr, m) {//数据组合
		let r = [];
		temporary([], arr, m);
		var repetition=[];
		
		for(var o=0;o<r.length;o++){
			var arr = []
			for(var p=0;p<r[o].length;p++){
				arr.push(r[o][p].substring(0,5))
			}
			if(!isRepeat(arr)){
				repetition.push(r[o])
			}
		}
		function isRepeat(ary) {
			var a=false
			for (var i = 0; i < ary.length; i++) {
				if(ary.indexOf(ary[i]) != i) {
					a = true
				}
			}
			return a
		}
		return repetition;
		function temporary(t, a, m) {
			//t:临时数组 a:目标数组 m：多少个数进行组合
			if (m === 0) {
				r[r.length] = t; //相当于push
				return;
			}
			for (let i = 0; i <= a.length - m; i++) {
				//从0开始 到n-m
				let b = t.slice(); //将t赋值给b 不能用=赋值，使用slice会形成新的数组赋值
				b.push(a[i])
				temporary(b, a.slice(i + 1), m - 1);
			}
		}
	}
	const buttonClick = () =>{//底部提交按钮条件判断
		if(counter.BettingContent.type == '任选九' && counter.BettingContent.Content.length==9){
			betmoney.value = valuesdata.Amount
			user_money.value = counter.user_money
			proxy.$refs.popup.open("bottom")
		}else if(counter.BettingContent.type == '胜负彩' && counter.BettingContent.Content.length==14){
			betmoney.value = valuesdata.Amount
			user_money.value = counter.user_money
			proxy.$refs.popup.open("bottom")
		}else{
			if(counter.BettingContent.type == '任选九' || counter.BettingContent.type == '胜负彩'){
				uni.showToast({
					title:'未选够比赛场次',
					icon:'error'
				})
			}else{
				if(hidetext.length > 0){
					betmoney.value = valuesdata.Amount
					user_money.value = counter.user_money
					proxy.$refs.popup.open("bottom")
				}else{
					uni.showToast({
						title:'请选择过关方式',
						icon:'error',
						position:'center'
					})
				}
			}
		}
	}
	const valuesdata = reactive({// 底部组件数据
		Note: 0, //注数
		Multiple: 50, //倍数
		Amount: 0, //金额
		reachType:[],
		//预测奖金额
		bonusmin: 0, 
		bonusmax: 0,
		isComplex:false,//是否为复杂玩法
		Repeat:'0',//是否允许重复
	})
	const changMultiple = (e)=>{// 数字倍数变化
		valuesdata.Multiple =e
		valuesdata.Amount = common.ComputeAmount(valuesdata.Note,valuesdata.Multiple)
	}
	const user_money = ref(0)
	const betmoney = ref(0)
	const orderid = ref(0)
	const getNewMoney=()=>{//确认支付
		proxy.$refs.popup.close("bottom")
		delete counter.BettingContent.bonusOptimize
		
		if(betmoney.value<counter.gameAstrict.MinBetAmount){
			uni.showToast({
				title:'店主限制最小投注金额'+counter.gameAstrict.MinBetAmount+'元',
				position:"center",
				icon:'none',
				duration:3000
			})
			return
		}
		uni.showLoading({title:'提交中~',mask:true})
		uni.request({
			url:counter.baseUrl+'/api/bettingend.mine.Transaction/notWithdraw',
			header:{'server':1,'ba-user-token':counter.access_token,},
			success(res){
				counter.user_money=Number(res.data.data.withdraw)+Number(res.data.data.not_withdraw)
				ConfirmPayment()
			},
			fail(err){
				uni.showToast({
					title:'获取金额失败',
					icon:'none',
					position:'center'
				})
				ConfirmPayment()
			}
		})
	}
	const ConfirmPayment = ()=>{//提交订单
		valuesdata.reachType = JSON.parse(JSON.stringify(hidetext))//克隆过关方式数组
		valuesdata.Repeat=counter.gameAstrict.Repeat
		counter.BettingContent.remarks = valuesdata
		if(betmoney.value>counter.user_money){//余额不足拦截
		uni.hideLoading()
			uni.showModal({
				title: '注意',
				content: '余额不足！',
				confirmText:'立即充值',
				confirmColor:'#f04b49',
				success: function (res) {
					if (res.confirm) {
						uni.navigateTo({
							url:'/pages/home/HomeTopUp/HomeTopUp',
							animationType:'slide-in-bottom'
						})
					}
				}
			});
			return
		}
		var delIndex=counter.BettingContent.remarks.reachType.indexOf('1单关1')
		if(delIndex != -1){
			counter.BettingContent.remarks.reachType[delIndex]='单关'
		}
		var type = common.playType(counter.BettingContent.type)
		// console.log(common.minTiem(counter.BettingContent.Content),common.maxTiem(counter.BettingContent.Content));
		if(type=='任选九' || type=='胜负彩'){
			var Deadline= common.minTiem(counter.BettingContent.Content)-(60*60)
		}else{
			var Deadline= common.minTiem(counter.BettingContent.Content)
		}
		api.Betjczq({
			"default": 0,
			"Type": type,
			"BetContent": counter.BettingContent,
			"bonusmin": valuesdata.bonusmin * valuesdata.Multiple,
			"bonusmax": valuesdata.bonusmax * valuesdata.Multiple,
			// "BuyingContent": "[]",  //合买
			// "FollowContent": "[]", //跟单
			"BetMoney":valuesdata.Amount,
			'Deadline':Deadline,
			"drawDeadine":common.maxTiem(counter.BettingContent.Content),
			'lssue' : counter.BettingContent.lssue,
			'Note' :valuesdata.Note
			//"ForecastMoney": valuesdata.bonusmax,
		}).then((res)=>{
			uni.hideLoading()
			if(res.data.code == 1){
				orderid.value = res.data.data.order_id
				counter.allOrderData=res.data.data.orderInfo
				counter.setMoney('Dele',valuesdata.Amount)
				proxy.$refs.infopopup.open("bottom")
			}else{
				uni.showToast({
					title:res.data.msg,
					icon:'error'
				})
			}
		})
	}
	
	const closeOrder=()=>{//关闭订单弹窗
		proxy.$refs.infopopup.close()
		setTimeout(()=>{
			uni.navigateBack({
				delta: 1,
				success:(res)=>{
					setTimeout(()=>{
						counter.BettingContent=[]
					},60)
				}
			});
		},300)
		
	}
	const newNoteData=reactive([])//任选九||胜负彩的note计算对照数据
	const newNoteinit =()=>{//任选九||胜负彩的note计算对照表
		newNoteData.splice(0,newNoteData.length)
		//先判断有几场比赛
		var number = counter.BettingContent.Content.length //场次数量
		for(var i = 0;i<=number-1;i++){
			//判断i场次里面有几个投注内容 添加到Notefactor参数
			var count = counter.BettingContent.Content[i].data.length
			newNoteData.push(count)
		}
	}
	const hidetextInit=()=>{//自由过关生成（初始化）
		hidetext.length=0
		hideListdata.length=0
		var newIsDan=!isDan()
		var game_length_number=counter.BettingContent.Content.length//共选了多少比赛
		if(game_length_number<3){//如只有两场比赛拦截生成自由过关
			if(counter.BettingContent.type=='胜负过关'){
				if(game_length_number<3){
					back()
					uni.showToast({
						title:'请再选择一场比赛',
						icon:"none",
						position:'center'
					})
				}else{
					for(var i=0;i<game_length_number;i++){
						hideListdata.push({id:newIsDan?i-2:i,text: hidelist[i],isActive: false})
					}
					if(newIsDan){hideListdata.splice(0,2)}//单关和2串1删除
					hidelick(hideListdata[hideListdata.length-1])
				}
				return
			}
		}
		if(counter.BettingContent.type=='竞彩足球' && isAstrict_football()){
			if(game_length_number>4){
				for(var i=0;i<4;i++){hideListdata.push({id:newIsDan?i-1:i,text: hidelist[i],isActive: false})}
				uni.showToast({
					title:'四场以上比分、半全场不允许4串以上的玩法喔~',
					icon:'none',
					position:'center'
				})
			}else{
				for(var i=0;i<game_length_number;i++){
					hideListdata.push({id:newIsDan?i-1:i,text: hidelist[i],isActive: false})
				}
				mnhideListdataInit()
			}
			if(newIsDan){hideListdata.splice(0,1)}//单关删除
			hidelick(hideListdata[hideListdata.length-1])
			return
		}
		if(counter.BettingContent.type=='竞彩足球' && iszjq()){
			if(game_length_number>6){
				for(var i=0;i<6;i++){hideListdata.push({id:newIsDan?i-1:i,text: hidelist[i],isActive: false})}
				uni.showToast({
					title:'总进球不允许6串以上的玩法喔~',
					icon:'none',
					position:'center'
				})
			}else{
				for(var i=0;i<game_length_number;i++){
					hideListdata.push({id:newIsDan?i-1:i,text: hidelist[i],isActive: false})
				}
				mnhideListdataInit()
			}
			if(newIsDan){hideListdata.splice(0,1)}//单关删除
			hidelick(hideListdata[hideListdata.length-1])
			return
		}
		var newArr=['半全场','上下单双','总进球']
		if(counter.BettingContent.type=='北京单场' && newArr.indexOf(counter.BettingContent.gametype) != -1){
			if(game_length_number>6){
				for(var i=0;i<6;i++){
					hideListdata.push({id:i,text: hidelist[i],isActive: false})
				}
			}else{
				for(var i=0;i<game_length_number;i++){
					hideListdata.push({id:i,text: hidelist[i],isActive: false})
				}
			}
			hidelick(hideListdata[hideListdata.length-1])
			return
		}else if(counter.BettingContent.type=='北京单场' && counter.BettingContent.gametype=='比分'){
			if(game_length_number>3){
				for(var i=0;i<3;i++){
					hideListdata.push({id:i,text: hidelist[i],isActive: false})
				}
			}else{
				for(var i=0;i<game_length_number;i++){
					hideListdata.push({id:i,text: hidelist[i],isActive: false})
				}
			}
			hidelick(hideListdata[hideListdata.length-1])
			return
		}
		if(counter.BettingContent.type=='竞彩篮球'&&isAstrict_basketball()){
			if(game_length_number>4){
				for(var i=0;i<4;i++){
					hideListdata.push({id:newIsDan?i-1:i,text: hidelist[i],isActive: false})
				}
				uni.showToast({
					title:'四场以上存在胜负差，不允许4串以上的玩法喔~',
					icon:'none',
					position:'center'
				})
			}else{
				for(var i=0;i<game_length_number;i++){
					hideListdata.push({id:newIsDan?i-1:i,text: hidelist[i],isActive: false})
				}
				mnhideListdataInit()
			}
			if(newIsDan){hideListdata.splice(0,1)}//单关删除
			hidelick(hideListdata[hideListdata.length-1])
			return
		}
		if(counter.BettingContent.type=='胜负过关'){
			for(var i=0;i<game_length_number;i++){
				hideListdata.push({id:newIsDan?i-2:i,text: hidelist[i],isActive: false})
			}
			if(newIsDan){hideListdata.splice(0,2)}//单关和2串1删除
			hidelick(hideListdata[hideListdata.length-1])
			return
		}
		
		for(var i=0;i<game_length_number;i++){
			hideListdata.push({id:newIsDan?i-1:i,text: hidelist[i],isActive: false})
		}
		mnhideListdataInit()
		if(newIsDan){hideListdata.splice(0,1)}//单关删除
		hidelick(hideListdata[hideListdata.length-1])
		
		function mnhideListdataInit(){
			for(var i=0;i<mndata.length;i++){
				if(mndata[i].id==hideListdata.length){
					for(var j=0;j<mndata[i].data.length;j++){
						mnhideListdata.push({id:j,text:mndata[i].data[j],isActive:false})
					}
					ismnshow.value=true//显示多串过关
					break
				}
			}
		}
		function iszjq(){//足球总进球限制超过6串1
			var arr=['jq']
			var isAstr=false
			for(var i = 0 ; i < counter.BettingContent.Content.length ; i++){
				for(var j = 0 ; j < counter.BettingContent.Content[i].data.length ; j++){
					if(arr.indexOf(counter.BettingContent.Content[i].data[j].gameState) != -1){
						isAstr=true
						break
					}
				}
				if(isAstr){break}//符合条件后退出循环
			}
			return isAstr
		}
		
		function isAstrict_football(){//足球是否需要限制生成自由过关
			var arr=['bf','bqc']
			var isAstr=false
			for(var i = 0 ; i < counter.BettingContent.Content.length ; i++){
				for(var j = 0 ; j < counter.BettingContent.Content[i].data.length ; j++){
					if(arr.indexOf(counter.BettingContent.Content[i].data[j].gameState) != -1){
						isAstr=true
						break
					}
				}
				if(isAstr){break}//符合条件后退出循环
			}
			return isAstr
		}
		function isAstrict_basketball(){//篮球是否需要限制生成自由过关
			var isAstr=false
			for(var i = 0 ; i < counter.BettingContent.Content.length ; i++){
				for(var j = 0 ; j < counter.BettingContent.Content[i].data.length ; j++){
					if(counter.BettingContent.Content[i].data[j].gameState=='sfc'){
						isAstr=true
						break
					}
				}
				if(isAstr){break}//符合条件后退出循环
			}
			return isAstr
		}
	}
	function isDan(){//是否可以单关
		var newIsDan=true
		for(var i=0; i < counter.BettingContent.Content.length ; i++){
			for(var j=0; j < counter.BettingContent.Content[i].data.length ; j++){
				if(counter.BettingContent.Content[i].data[j].poolEs!=1){
					newIsDan=false
					break
				}
				if(!newIsDan){break}//符合条件后退出循环
			}
		}
		return newIsDan
	}
	
	const show_DataList =ref(true)//这里是滑动删除 控制
	const options_Click = (e) =>{//这里是滑动删除 控制
		counter.styleData.data.push(counter.BettingContent.Content[e].matchId)
		counter.BettingContent.Content.splice(e,1)
		hideListdata.splice(0,hideListdata.length)
		hidetext.splice(0,hidetext.length)
		mnhideListdata.splice(0,mnhideListdata.length)
		if(counter.BettingContent.type == '竞彩足球' || counter.BettingContent.type == '竞彩篮球'){
			if(counter.BettingContent.Content.length < 2 && !isDan()){
				back()
				uni.showToast({
					title:'请再选择一场比赛',
					icon:"none",
					position:'center'
				})
			}else if(counter.BettingContent.Content.length == 0){
				back()
			}else{
				hidetextInit()//过关方式生成
			}
			return
		}
		
		if(counter.BettingContent.type == '任选九' || counter.BettingContent.type == '胜负彩'){
			newNoteinit()//任选九||胜负彩的note计算对照表
		}else{
			hidetextInit()//过关方式生成
		}
		show_DataList.value = false
		nextTick(() => {
			show_DataList.value = true
		})
	}
	
	const options=reactive([//滑动删除
		{
			text:'删除',
			style:{
				backgroundColor: '#ff4c4c',
			}
		}
	])
	
	
	//保存方案
	const savePlan =()=>{
		var bool = false
		if(counter.BettingContent.type == '任选九' && counter.BettingContent.Content.length==9){
			bool =true
		}else if(counter.BettingContent.type == '胜负彩' && counter.BettingContent.Content.length==14){
			bool=true
		}else{
			if(counter.BettingContent.type == '任选九' || counter.BettingContent.type == '胜负彩'){
				uni.showToast({
					title:'未选够比赛场次',
					icon:'error'
				})
			}else{
				if(hidetext.length > 0){
					bool = true
				}else{
					uni.showToast({
						title:'请选择过关方式',
						icon:'error',
						position:'center'
					})
				}
			}
		}
		
		if(bool){
			valuesdata.reachType = JSON.parse(JSON.stringify(hidetext))//克隆过关方式数组
			valuesdata.Repeat=counter.gameAstrict.Repeat
			counter.BettingContent.remarks = valuesdata
			
			var delIndex=counter.BettingContent.remarks.reachType.indexOf('1单关1')
			if(delIndex != -1){
				counter.BettingContent.remarks.reachType[delIndex]='单关'
			}
			
			var type = common.playType(counter.BettingContent.type)
			if(type=='任选九' || type=='胜负彩'){
				var Deadline= common.minTiem(counter.BettingContent.Content)-(60*60)
			}else{
				var Deadline= common.minTiem(counter.BettingContent.Content)
			}
			
			api.Betjczq({
				"default": 3,
				"Type": type,
				"BetContent": counter.BettingContent,
				"bonusmin": valuesdata.bonusmin * valuesdata.Multiple,
				"bonusmax": valuesdata.bonusmax * valuesdata.Multiple,
				// "BuyingContent": "[]",  //合买
				// "FollowContent": "[]", //跟单
				"BetMoney":valuesdata.Amount,
				'Deadline':Deadline,
				"drawDeadine":common.maxTiem(counter.BettingContent.Content),
				'lssue' : counter.BettingContent.lssue,
				'Note' :valuesdata.Note
				//"ForecastMoney": valuesdata.bonusmax,
			}).then((res)=>{
				uni.hideLoading()
				if(res.data.code == 1){
					uni.showToast({
						title:'提交成功~',
						position:'center',
						icon:"success"
					})
					uni.navigateTo({
						url:'/pages/home/recordPages/recordPages?tabIndex=2&user_id='+counter.user_id,
						animationType:'slide-in-bottom'
					})
				}else{
					uni.showToast({
						title:res.data.msg,
						icon:'error'
					})
				}
			})
		}
	}
</script>

<style lang="less">
	.navBar{
		width:100%;
		height:80rpx;
		display: flex;
		background-color: #202736; 
		line-height:80rpx;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		justify-content: space-between;
		padding-top:var(--status-bar-height);
		z-index:2;
		position: -webkit-sticky;
		position: sticky;
		top:0rpx
		.navBar_left{
			display: flex;
			align-items: center;
			width:120rpx;
			margin-left:20rpx;
		}
		.navBar_right{
			width:120rpx;
			margin-right:20rpx;
		}
	}


	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}
	.head {
		display: flex;
		margin:20rpx 0;
		flex-direction: row;
		justify-content: space-around;
	}
	.head .button {
		text-align: center;
		line-height: 70rpx;
		font-size: 34rpx;
		margin: 0 10rpx;
		height: 70rpx;
		width: 80%;
		border-radius:15rpx;
		background-color: #fff;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
	}
	.game_content_box{
		padding-bottom:220rpx;
	}
	.game_content{
		width: 685rpx;
		background-color: #f5f5f5;
		margin:15rpx auto;
		border-radius:10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		color: #f04b49;
		text-align: center;
	}
	.lastCard {
		text-align: center;
		color: #666;
		padding-bottom: 10rpx;
		border-bottom: 3rpx dashed #777;
		background-color:white;
		border-radius:15rpx 15rpx 0 0;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
	}
	.game_title{
		display: flex;
		.title_itme{
			flex:1;
			text-align: center;
			margin:0rpx 15rpx;
			font-size:32rpx;
			font-weight: bold;
			color: #313131;
			text{
				font-size:32rpx;
				font-weight: bold;
				color: #313131;
			}
		}
	}
	.content-list{
		width:730rpx;
		border-radius:15rpx;
		background-color: #ffffff;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		margin:20rpx auto;
	}
	body{
		background-color: #fbfbfb;
	}
</style>