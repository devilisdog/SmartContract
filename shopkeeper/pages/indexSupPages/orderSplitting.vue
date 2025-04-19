<template>
	<view class="statusBar"></view>
	<uni-nav-bar title="拆单明细" leftIcon="closeempty" @clickLeft="back"></uni-nav-bar>
	<view class="topHint" v-if="showListType==0 || showListType==2">
		<text>共{{showListType==0?1:showData.length}}张票</text>
		<text style="color: red;">{{Props.money}}</text>
		<text>元</text>
	</view>
	<!-- 主体 -->
	<view v-if="showListType==0">
		<view class="table-tr">
			<view style="width:10%;">序号</view>
			<view style="width:10%;border-left:none;border-right: none;">过关</view>
			<view style="width:45%;">拆单内容</view>
			<view style="width:10%;border-left:none;border-right: none;">倍数</view>
			<view style="width:10%;">票数</view>
			<view style="width:25%;font-size:24rpx;border-left:none;">理论最高金额</view>
		</view>
		<view class="table-td">
			<view style="width:10%;">1</view>
			<view style="width:10%;border-left:none;border-right: none;">{{repetitionData.remarks.reachType[0]}}</view>
			<view style="width:45%;display: flex;flex-flow: column;">
				<view style="border: none;padding:0;" v-for="itme,index in repetitionData.Content">
					<text>{{itme.matchNumStr}}</text>
					<view style="border: none;display: flex;flex-flow: column;margin:0rpx 10rpx;">
						<text v-for="xitme,xindex in itme.data">{{xitme.res}}</text>
					</view>
				</view>
			</view>
			<view style="width:10%;border-left:none;border-right: none;">{{repetitionData.remarks.Multiple}}</view>
			<view style="width:10%;">1</view>
			<view style="width:25%;font-size:24rpx;border-left:none;">
				{{(repetitionData.remarks.bonusmax*repetitionData.remarks.Multiple).toFixed(2)}}
			</view>
		</view>
	</view>
	<view  v-if="showListType==1">
		<view v-for="itme,index in repetitionData">
			<view class="table-tr">
				<view style="width:10%;">序号</view>
				<view style="width:12%;border-left:none;border-right: none;">过关</view>
				<view style="width:50%;">拆单内容</view>
				<view style="width:18%;border-left:none;">注数分布</view>
				<view style="width:20%;font-size:24rpx;border-left:none;">投注金额</view>
			</view>
			<view>
				<view class="table-td" @click="showTable(index)">
					<view style="width:10%;">{{index+1}}</view>
					<view style="width:12%;border-left:none;border-right: none;">{{itme.data[0][5]}}</view>
					<view style="width:50%;display: flex;flex-flow: column;" v-if="itme.data.length>1">
						<text>
							{{itme.data[0][0].substring(2)+itme.data[0][1]+' | '+itme.data[0][3]+'('+itme.data[0][4]+')'}}
						</text>
						<text>
							{{itme.data[1][0].substring(2)+itme.data[1][1]+' | '+itme.data[1][3]+'('+itme.data[1][4]+')'}}
						</text>
						<uni-icons type="bottom"></uni-icons>
					</view>
					<view style="width:50%;display: flex;flex-flow: column;" v-else>
						<text>
							{{itme.data[0][0].substring(2)+itme.data[0][1]+' | '+itme.data[0][3]+'('+itme.data[0][4]+')'}}
						</text>
						<uni-icons type="bottom"></uni-icons>
					</view>
					<view style="width:18%;border-left:none;">{{itme.note}}</view>
					<view style="width:20%;font-size:28rpx;border-left:none;">{{itme.money}}</view>
				</view>
				
				<view v-show="showList==index"  style="background-color:#fde6d6;">
					<view class="table-tr-show">
						<view style="width:22%;">场次</view>
						<view style="width:25%;border-left:none;border-right: none;">主队</view>
						<view style="width:25%;">客队</view>
						<view style="width:38%;border-left:none;">投注内容</view>
					</view>
					<view class="table-td" v-for="xitme,xindex in itme.data">
						<view style="width:22%;">{{xitme[0]}}</view>
						<view style="width:25%;border-left:none;">{{xitme[1]}}</view>
						<view style="width:25%;border-left:none;">{{xitme[2]}}</view>
						<view style="width:38%;font-size:24rpx;border-left:none;">{{xitme[3]}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	
	<view  v-if="showListType==2">
		<view class="table-tr">
			<view style="width:10%;">序号</view>
			<view style="width:10%;border-left:none;border-right: none;">过关</view>
			<view style="width:45%;">拆单内容</view>
			<view style="width:10%;border-left:none;border-right: none;">倍数</view>
			<view style="width:10%;">票数</view>
			<view style="width:25%;font-size:24rpx;border-left:none;">理论最高金额</view>
		</view>
		<view  v-for="itme,index in showData">
			<view class="table-td">
				<view style="width:10%;">{{index+1}}</view>
				<view style="width:10%;border-left:none;border-right: none;display: flex;flex-flow: column;">
					<text v-for="Xitme,Xindex in itme.reachType">{{Xitme=='1单关1'?'单关':Xitme}}</text>
				</view>
				<view style="width:45%;display: flex;flex-flow: column;">
					<view v-for="Citme,Cindex in itme.content" style="border: none;">
						<text>{{Citme.time}}</text>
						<view style="display: flex;flex-flow: column;margin-left:20rpx;border: none;">
							<text v-for="Titme,Tindex in Citme.game">{{Titme}}</text>
						</view>
					</view>
				</view>
				<view style="width:10%;border-left:none;">{{itme.multiplying}}</view>
				<view style="width:10%;border-left:none;">1</view>
				<view style="width:25%;font-size:28rpx;border-left:none;">{{itme.money}}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {useCounterStore} from '@/stores/counter'
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		getCurrentInstance,
		defineProps
	} from 'vue'
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const Props=defineProps(['money'])//接收此订单的金额
	const showList = ref(null)//折叠面板是否实现判断值
	const showListType=ref(0)//显示状态
	const repetitionData=ref([])//简单玩法存储数据
	const showData=ref([])//拆单的数据arr
	const whetherRepetition=ref(false)//是否允许重复
	const game=reactive([//玩法字典
		['胜','平','负'],
		['让胜','让平','让负'],
		['0','1','2','3','4','5','6','7+'],
		['胜-胜','胜-平','胜-负','平-胜','平-平','平-负','负-胜','负-平','负-负'],
		['1:0','2:0','2:1','3:0','3:1','3:2','4:0','4:1','4:2','5:0','5:1','5:2','胜其它','0:0','1:1','2:2','3:3','平其它','0:1','0:2','1:2','0:3','1:3','2:3','0:4','1:4','2:4','0:5','1:5','2:5','负其它']
	])
	const mndata = reactive([//过关字典
		{
			data: ['3串3', '3串4'],
			mndata:['2串1','2串1,3串1'],
		},
		{
			data: ['4串4', '4串5', '4串6', '4串11'],
			mndata:['3串1','3串1,4串1','2串1','2串1,3串1,4串1'],
		},
		{
			data: ['5串5', '5串6', '5串10', '5串16', '5串20', '5串26'],
			mndata:['4串1','4串1,5串1','2串1','3串1,4串1,5串1','2串1,3串1','2串1,3串1,4串1,5串1'],
		},
		{
			data: ['6串6', '6串7', '6串15', '6串20', '6串22', '6串35', '6串42', '6串50', '6串57'],
			mndata:['5串1','5串1,6串1','2串1','3串1','4串1,5串1,6串1','2串1,3串1','3串1,4串1,5串1,6串1','2串1,3串1,4串1','2串1,3串1,4串1,5串1,6串1'],
			
		},
		{
			data: ['7串7', '7串8', '7串21', '7串35', '7串120'],
			mndata:['6串1','6串1,7串1','5串1','4串1','2串1,3串1,4串1,5串1,6串1,7串1'],
		},
		{
			data: ['8串8', '8串9', '8串28', '8串56', '8串70', '8串247'],
			mndata:['7串1','7串1,8串1','6串1','5串1','4串1','2串1,3串1,4串1,5串1,6串1,7串1,8串1'],
		}
	])
	
	onBeforeMount(()=>{
		whetherRepetition.value=JSON.parse(counter.orderData.BetContent).remarks.Repeat=='0'?false:true//初始化是否重复
		if(JSON.parse(counter.orderData.BetContent).bonusOptimize!=undefined){
			repetitionData.value=JSON.parse(counter.orderData.BetContent).bonusOptimize
			showListType.value=1
		}else if(JSON.parse(counter.orderData.BetContent).remarks.isComplex=='0'){
			repetitionData.value=JSON.parse(counter.orderData.BetContent)
			showListType.value=0
		}else{
			showListType.value=2
			orderDispose()
		}
		whetherRepetition.value=true
	})
	const orderDispose=()=>{
		//数据总处理
		var data=JSON.parse(counter.orderData.BetContent)//原始数据
		var reachType=JSON.parse(counter.orderData.BetContent).remarks.reachType//过关方式
		var Multiple=JSON.parse(counter.orderData.BetContent).remarks.Multiple//倍率
		var initData=initDispose(data)//initDispose数据拼接
		if(reachType.length>1){
			//判断是否为自由过关
			var reachTypeDan=false
			reachType.forEach(function(itme,index){
				//判断自由过关是否包含单关
				if(itme=='1单关1' || itme=='单关'){
					reachTypeDan=true
				}
			})
			if(reachTypeDan){
				//如果包含单关就先执行其他的过关方式的组合算法，最后在执行单关组合算法
				var danArr=[]
				var elseArr=[]
				reachType.forEach(function(itme,index){
					if(itme=='1单关1' || itme=='单关'){
						danArr.push(itme)
					}else{
						elseArr.push(itme)
					}
				})
				if(whetherRepetition.value){
					repetitive(initData,elseArr)
				}else{
					nonredundantData(initData,elseArr)	
				}
				DanFuncion(initData,danArr)
			}else{
				//不包含就正常判断此订单是否允许重复
				if(whetherRepetition.value){
					repetitive(initData,reachType)//拆单算法(允许重复)
				}else{
					nonredundantData(initData,reachType)//拆单算法(不重复)	
				}
			}
		}else{
			//如果只有一个过关方式判断是自由过关还是多串过关
			if(reachType[0].split('串')[1]==1){
				if(whetherRepetition.value){
					repetitive(initData,reachType)//拆单算法(允许重复)
				}else{
					nonredundantData(initData,reachType)//拆单算法(不重复)	
				}
			}else if(reachType[0]=='1单关1' || reachType[0]=='单关'){
				DanFuncion(initData,reachType)//拆单算法(单关)	
			}else{
				repetitive(initData,reachType)//拆单算法(允许重复)
			}
		}
		noteFuncion(reachType,Multiple)//注数计算
		dataResolution(showData.value)//数据拆分
	}
	const dataResolution=(data)=>{//最终数据拆分
		var initData=data
		initData.forEach(function(itme,index){
			var arr=[]
			itme.content.forEach(function(Xitme,Xindex){
				//分割投注信息
				var gameArr=[]
				var newaRound=Xitme.split(',')
				var newTime=newaRound[0].split('&')
				var newGame=newaRound[1].split('|')
				for(var i=0;i<newGame.length;i++){
					if(newGame[i]!=''){
						gameArr.push(newGame[i].split('/')[0])
					}
				}
				var obj={
					'time':newTime[0],
					'game':gameArr
					
				}
				arr.push(obj)
			})
			itme.content=arr
		})
		showData.value=initData
	}
	const DanFuncion=(data,reachType)=>{//单关组合方法(同一场同一个玩法类型为一张票)
		var initArr=data
		var newinitArr=[]
		initArr.forEach(function(itme,index){
			//把数据拆分为二维(方便后续进行分类)
			var newArr=[]
			var itmeValue=itme.split(',')
			newArr.push(itmeValue[0].split('&')[0])
			newArr.push(itmeValue[0].split('&')[1])
			newArr.push(itmeValue[1])
			newinitArr.push(newArr)
		})
		var classify=sortClass(newinitArr,1)//执行分类(按玩法类型分类)
		var overData=[]
		classify.forEach(function(itme,index){
			//分类完后把同一类型归为一张票
			var initArr={
				'content':[],
				'multiplying':null,
				'money':null,
				'reachType':reachType
			}
			itme.forEach(function(Xitme,Xindex){
				initArr.content.push(Xitme[0]+'&'+Xitme[1]+','+Xitme[2])
			})
			overData.push(initArr)
		})
		overData.forEach(function(itme,index){
			//可能会有两个方法同时执行，所以单关数据已插入的形式添加到最终数组中
			showData.value.unshift(itme)
		})
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
	const noteFuncion=(reachType,Multiple)=>{//注数计算
		showData.value.forEach(function(itme,index){
			var eachOrder=[]
			itme.reachType.forEach(function(Xitem,Xindex){
				//解析过关方式
				if(Xitem=='1单关1' || Xitem=='单关'){
					//如果是单关就push默认1
					eachOrder.push(combinationFunction(itme.content,1))//combinationFunction排列组合算法
				}else if(Xitem.split('串')[1]==1){
					//如果是自由过关方式就把串前面的数值作为执行
					eachOrder.push(combinationFunction(itme.content,Xitem.split('串')[0]))//combinationFunction排列组合算法
				}else{
					//如果是多串过关，需要去mndata找到对应的自由过关方式，如何再循环转换后的自由过关方式来执行
					for(var i=0;i<mndata.length;i++){
						if(mndata[i].data.indexOf(Xitem) != -1){
							var index=mndata[i].data.indexOf(Xitem)
							var mndataIndex=mndata[i].mndata[index].split(',')
							mndataIndex.forEach(function(Citme,Cindex){
								eachOrder.push(combinationFunction(itme.content,Citme.split('串')[0]))
							})
							break
						}
					}
				}
			})
			var neweachOrder=eachOrder.flat()//转一维数组
			neweachOrder.forEach(function(Xitme,Xindex){
				var multiplying=1//单场比赛赔率*2
				Xitme.forEach(function(Citme,Cindex){
					var maxRes=0//最大倍率
					Citme.split(',')[1].split('|').forEach(function(Ditme,Dindex){
						//如果是一场比赛同一个玩法就找出最大值来计算
						if(Ditme!=''){
							maxRes=Number(Ditme.split('/')[1])>=maxRes?Number(Ditme.split('/')[1]):maxRes
						}
					})
					multiplying*=maxRes
				})
				var oneMultipLyingMoney=multiplying*2//当前票单注金额
				if(Xitme.length==1 && oneMultipLyingMoney>100000){//判断单注金额是否超过限制值
					itme.money=100000*Multiple
				}else if(Xitme.length>=2 && Xitme.length<=3 && oneMultipLyingMoney>200000){
					itme.money=200000*Multiple
				}else if(Xitme.length>=4 && Xitme.length<=5 && oneMultipLyingMoney>500000){
					itme.money=500000*Multiple
				}else if(Xitme.length>=6 && oneMultipLyingMoney>1000000){
					itme.money=1000000*Multiple
				}else{
					itme.money+=oneMultipLyingMoney*Multiple
				}
			})
			itme.money=Number(itme.money).toFixed(2)
			itme.multiplying=Multiple
		})
	}
	
	const repetitive=(data,reachType)=>{//允许重复拆单算法
		var combinationArr=[]//组合数据
		var accomplishData=[]//格式化数据
		var reachTypeState=[]//过关方式
		if(reachType[0].split('串')[1]==1){reachTypeState=reachType}else{//过关方式转换
			for(var v=0;v<mndata.length;v++){
				var mndataIndex=mndata[v].data.indexOf(reachType[0])
				if(mndataIndex != -1){
					reachTypeState=mndata[v].mndata[mndataIndex].split(',')
					break
				}
			}
		}
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
		combinationArr=combinationFunction(data,minData[minIndex])
		var maxReachType=0//最大过关方式
		for(var i=0;i<reachTypeState.length;i++){//取出最大过关方式number
			var newNumbr=Number(reachTypeState[i].split('串')[0])
			maxReachType=maxReachType<newNumbr?newNumbr:maxReachType
		}
		if(combinationArr[0].length<maxReachType){//兜底，如循环算法出错执行按最大过关方式来排列
			combinationArr=combinationFunction(data,maxReachType)
		}
		combinationArr.forEach(function(itme,index){
			var initArr={
				'content':itme,
				'multiplying':null,
				'money':null,
				'reachType':reachType
			}
			accomplishData.push(initArr)
		})
		showData.value=accomplishData
	}
	
	const nonredundantData=(data,reachTypeArr)=>{//不重复拆单算法
		var typeArr=[]
		reachTypeArr.forEach(function(itme,index){
			//拆分过关方式
			typeArr.push(itme.split('串')[0])
		})
		var maxType=Math.max(...typeArr)//找出最大的过关方式
		var oneOrder=[]//第一张票
		var oneControlGroup=[]//第一张票的对照组
		for(var i=oneOrder.length;i<maxType;i++){
			var bool=false
			for(var f=0;f<oneOrder.length;f++){
				//循环push第一张票(条件是不同场次的)
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
		typeArr.forEach(function(itme,index){//拿出第一张单的所有过关方式的组合，push到第一张票对照组
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
					var initArr={
						'content':itme,
						'multiplying':null,
						'money':null,
						'reachType':Array(Citme+'串1')
					}
					newTwoOrder.push(initArr)
				}
			})
		})
		var initArr={
			'content':oneOrder,
			'multiplying':null,
			'money':null,
			'reachType':reachTypeArr
		}
		showData.value=newTwoOrder
		showData.value.unshift(initArr)//合并到showdata里的最终数组里
	}
	function combinationFunction(arr, m) {//初数据组合
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
	const initDispose=(data)=>{//数据初处理
		var initData=data
		var oneData=[]
		initData.Content.forEach(function(itme,index){
			itme.data.forEach(function(Xitme,Xindex){
				oneData.push(itme.matchNumStr+'&'+gameTypeIndex(Xitme.res)+','+Xitme.res+'/'+Xitme.rate+'|')
			})
		})
		var list=[]
		oneData.forEach(function(itme,index){
			list.push(itme.split(','))
		})
		var newList=sortClass(list,0)
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
	
	function gameTypeIndex(title){//查找玩法下标
		for(var d=0;d<game.length;d++){
			for(var e=0;e<game[d].length;e++){
				var index = game[d].findIndex(item =>
					item == title
				)
				if(index != -1){
					return d
					break
				}
			}
		}
	}
	const showTable=(e)=>{
		if(showList.value==e){
			showList.value=null
		}else{
			showList.value=e
		}
	}
	const back=()=>{
		uni.navigateBack()
	}
</script>

<style lang="scss">
	.statusBar {
		width: 100%;
		height: var(--status-bar-height);
		background-color:white;
	}
	.topHint{
		display: flex;
		padding:15rpx;
		justify-content: flex-end;
		align-items: center;
	}
	.table-td{
		display: flex;
		view{
			text-align: center;
			font-size:28rpx;
			border:1rpx #b9b9b9 solid;
			padding:10rpx 0rpx;
			display: flex;
			align-items: center;justify-content: center;
		}
		
	}
	.table-tr{
		display: flex;
		view{
			text-align: center;
			font-size:28rpx;
			font-weight:bold;
			border:1rpx #b9b9b9 solid;
			border-bottom:none;
			padding:10rpx 0rpx;
		}
	}
	.table-tr-show{
		display: flex;
		view{
			text-align: center;
			font-size:28rpx;
			font-weight:bold;
			border:1rpx #b9b9b9 solid;
			border-top: none;
			border-bottom:none;
			padding:10rpx 0rpx;
		}
	}
</style>