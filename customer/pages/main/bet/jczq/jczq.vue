<template>
	<view class="topBer">
		<view class="statusBar" />
		<uni-nav-bar @clickLeft="back()" height="100rpx" left-icon="left" mark="false">
			<view class="" style="margin: auto;">
				<!-- 从下往上的选择栏 -->
				<view @click="change">
					<text style="font-size: 36rpx;">{{title}}</text>
					<uni-icons class="input-uni-icon" type="bottom" size="22" color="#999" />
				</view>
				<!-- 弹窗下拉选择 -->
				<JarvisPicker mode="bottom" :show.sync="show" :range="Nav" @confirm="confirm" @cancel="cancel" />
			</view>
		</uni-nav-bar>
	</view>
	<view class="nogame" v-if="matchInfoList.length==0">
		<image src="@/static/img/main/ico-game-no.png" mode="aspectFit" style="width:500rpx;height:500rpx;"></image>
	</view>
	<classify :select_arr="tabsArr" @click_select="user_select"></classify>
	<template class="content_box"  v-for="item,index in matchInfoList" :key="item.businessDate">
		<view class="content_box" v-show="item.businessDate==tabsArr[showData_index].businessDate">
			<view class="content_itme" v-for="item2,index2 in item.subMatchList">
				<view class="left">
					<view style="display:flex;flex-direction: column; margin: auto; text-align:center;">
						<view v-show="noshowdan(item2.sell_status[play],play)" style="justify-content: center; text-align: center;">
							<text class="dan_lable">单关</text>
						</view>
						<text style="margin: 2rpx;">{{item2.issue_num}}</text>
						<text style="margin: 2rpx;">{{item2.short_comp}}</text>
						<text style="margin: 2rpx; color: #909399;">
							{{item2.businessTiem}}截止
						</text>
					</view>
				</view>
				<view class="right" style="display: flex;flex-direction: column;">
					<view class="right_title"
						style="">
						<view style="width: 45%; font-size: 30rpx;font-weight: bolder;">
							{{item2.short_home}}
							<text :class="item2.rq.goalLine-0 >0?'red':'green'"
								style="margin-left: 20rpx; font-size: 30rpx;font-weight: bolder;">
								{{item2.rq.goalLine}}</text>
						</view>
						<view style=" width: 10%;">
							<text style="font-size: 30rpx;">VS</text>
						</view>
						<view style="width: 45%; font-size: 30rpx;font-weight: bolder;">
							{{item2.short_away}}
						</view>
					</view>
					<hhggcheckbox 
						v-if="play==0" :Refresh="forceRefresh" :fixSelectData="item2" 
						@getSelectList="
							getChildrenSelectList($event,item2.businessDate+' '+item2.businessTiem+':00')
						" 
						ref='childRef' 
					/>
											
					<spfcheckbox 
						v-else-if="play==1" :Refresh="forceRefresh" :fixSelectData="item2" 
						@getSelectList="
							getChildrenSelectList($event,item2.businessDate+' '+item2.businessTiem+':00')
						" 
						ref='childRef' 
					/>
											
					<crscheckbox 
						v-else-if="play==2" :Refresh="forceRefresh" :fixSelectData="item2" 
						@getSelectList="
							getChildrenSelectList($event,item2.businessDate+' '+item2.businessTiem+':00')
						" 
						ref='childRef' 
					/>
											
					<ttgcheckbox 
						v-else-if="play==3" :Refresh="forceRefresh" :fixSelectData="item2"
						@getSelectList="
							getChildrenSelectList($event,item2.businessDate+' '+item2.businessTiem+':00')
						" 
						ref='childRef' 
					/>
					<hafucheckbox 
						v-else :Refresh="forceRefresh" :fixSelectData="item2" 
						@getSelectList="
							getChildrenSelectList($event,item2.businessDate+' '+item2.businessTiem+':00')
						" 
						ref='childRef' 
					/>
				</view>
			</view>
		</view>
	</template>
	<!-- 底部导航 -->
	<view class="footer" style="">
		<Footer :isdan="isdan" :count="count" @clickbutton="onclickbutton()" @clickempty="initialization" />
	</view>
	
	<fuiDialog 
		:show="ShowTIPS" title="温馨提示" 
		content="暂时没有数据,可以去看看其他玩法哦 ; )" 
		:buttons="fuiButtons" :maskClosable='false' 
		@click='back()'>
	</fuiDialog>
</template>

<script setup>
	import hhggcheckbox from "@/components/main/bet/jczq/hhgg-checkbox.vue"
	import spfcheckbox from "@/components/main/bet/jczq/spf-checkbox.vue"
	import hafucheckbox from "@/components/main/bet/jczq/hafu-checkbox.vue"
	import ttgcheckbox from "@/components/main/bet/jczq/ttg-checkbox.vue"
	import crscheckbox from "@/components/main/bet/jczq/crs-checkbox.vue"
	import getdatetime from "@/common/getdatetime.js"
	import fuiDialog from '@/components/fui-dialog/fui-dialog.vue'
	import JarvisPicker from "@/components/common/jarvis-picker/jarvis-picker.vue"
	import Footer from "@/components/main/bet/jczq/footer.vue"
	import api from '@/common/vmeitime-http/index.js'
	import {useCounterStore} from '@/stores/counter'	
	import submit from '@/pages/main/submit/submit_ticai.vue'
	import {onBeforeMount,ref,reactive,getCurrentInstance,watch} from 'vue';
	import transitionTime from "@/common/getdatetime.js"
	import classify from "@/components/main/classifySelect/classifySelect.vue"
	import date from "@/common/getdatetime.js"
	import common from "@/common/common.js"
	const counter = useCounterStore(); //状态管理
	const {proxy,ctx} = getCurrentInstance()
	const matchInfoList = reactive([])	// 比赛信息
	const tabsArr=reactive([])//tabs选择器数据
	const showData_index=ref(0)//tabs默认选择值
	onBeforeMount(() => {
		matchInfoList.length=0//初始化数据
		uni.showLoading({title: '加载中'});
		api.GetNewGameList({'type':0,'jctype':1}).then((res)=>{
			if(res.data.code==1){
				match_init(res.data.data)
				// console.log('matchInfoList',matchInfoList);
			}else{
				uni.showToast({
					title:'数据获取失败，请联系平台~',
					icon:'none',
					position:'center'
				})
			}
		})
	})

	//温馨提示显示值
	const ShowTIPS = ref(false)
	//温馨提示的两个按钮 *可以增减
	const fuiButtons = ref([
		{
			text:'好的',
			color:'#333',
		},
		{
			text:'确定',
			color:'#ffba58',
		}
	])
	const user_select=(e)=>{showData_index.value=e}
	const match_init=(initData)=>{//获取到的格式调整
		var weekArr=['周日','周一','周二','周三','周四','周五','周六']
		var newWeekArr=['','周一','周二','周三','周四','周五','周六','周日']
		var nowDate=new Date().getTime()//当前时间戳
		for(var key in common.objectOrder(initData)){
			var weekF=key+' '+'00:00:00'
			var strWeek=new Date(weekF.replace(/-/g,'/')).getDay()
			var newData=[]
			var newArr=[]
			initData[key].forEach((itme,index)=>{
				// console.log(itme.id);
				newArr.push(itme.id)
				if(itme['spf']!='' || itme['bf']!='' || itme['bqc']!='' || itme['jq']!='' || itme['rq']!=''){
					itme['businessDate']=key//投注截止日期赋值
					itme['businessTiem']=getjiezhitime(itme['businessDate'],weekArr[strWeek],itme.match_time)
					var gameOv=new Date((itme['businessDate']+' '+itme['businessTiem']).replace(/-/g,'/')).getTime()
					if(nowDate<gameOv){
						itme['spf']=itme['spf'].split(',')
						itme['bf']=itme['bf'].split(',')
						itme['bqc']=itme['bqc'].split(',')
						itme['jq']=itme['jq'].split(',')
						var rqObj={
							0:itme['rq'].split(',')[1],
							1:itme['rq'].split(',')[2],
							2:itme['rq'].split(',')[3],
							goalLine:itme['rq'].split(',')[0]
						}
						itme['rq']=rqObj
						itme['sell_status']=itme['sell_status'].split(',')
						var gameWeek=newWeekArr[String(itme['issue_num']).substring(0,1)]
						var gameNumber=String(itme['issue_num']).substring(1,4)
						itme['issue_num']=gameWeek+gameNumber
						//以上是数据结构，后续好对接数据
						newData.push(itme)
					}
				}
			})
			var newOjb={
				businessDate:key,
				matchCount:newData.length,
				subMatchList:newData,
				weekday:weekArr[strWeek]
			}
			var tbas={
				businessDate:key,
				matchNumber:newData.length,
				weekday:weekArr[strWeek],
				selectNumber:0,
				selectGameArr:newArr
			}
			if(newData.length!=0){matchInfoList.push(newOjb);tabsArr.push(tbas);}
		}
		uni.hideLoading()
	}
	// 顶部选择器弹窗是否显示
	const show = ref(false)
	// 顶部选择器弹窗显示内容
	const title = ref('混合过关')

	// 顶部选择器内容list
	const Nav = reactive([
		[{
				label: '混合过关',
				value: 0
			},
			{
				label: '胜平负',
				value: 1
			},
			{
				label: '比分',
				value: 2
			},
			{
				label: '总进球数',
				value: 3
			},
			{
				label: '半全场',
				value: 4
			},
		]
	])

	// 选择器选择的玩法Nav.value 传值给子组件
	const play = ref(0)
	// 顶部游戏选择器弹窗点击 开启弹窗
	const change = () => {
		show.value = true
	}
	// 顶部游戏选择器弹窗点击取消按钮 关闭弹窗
	const cancel = () => {
		show.value = false
	}

	// 顶部游戏选择器弹窗点击确定 初始化
	const confirm = (e) => {
		show.value = false
		title.value = Nav[0][e[0]].label
		play.value = Nav[0][e[0]].value
		BettingContent['gametype'] = title.value
		// 因为不同玩法折页高度不一致 刷新折页高度 
		initialization()
	}
	// 投注内容 传到下一个页面的数据模板
	const BettingContent = reactive({
		'type': '竞彩足球',
		'gametype': '混合过关',
		'remarks': [],
		'Content': [],
		'lssue' :counter.gameAstrict.systemsgamelist.Issue_no,
	})

	
	const count = ref(0)//选择场次的数量
	const isdan = ref(true)//是否单场
	const getChildrenSelectList = (data,time) => {//点击选项子组件提交的数据处理
		data.gameData.orderDeadline=time//投注截止时间赋值
		if(data.selectBoole){
			if(BettingContent.Content==''){
				count.value++
				tabsArr[showData_index.value].selectNumber++
				BettingContent.Content.push(data.gameData)
			}else{
				var index = BettingContent.Content.findIndex(item =>item.matchId == data.gameData.matchId)
				if(index == -1){
					count.value++
					tabsArr[showData_index.value].selectNumber++
					BettingContent.Content.push(data.gameData)
				}else{
					BettingContent.Content[index]=data.gameData
				}
			}
		}else{
			count.value--
			tabsArr[showData_index.value].selectNumber--
			var index = BettingContent.Content.findIndex(item =>item.matchId == data.gameData.matchId)
			BettingContent.Content.splice(index,1)
		}
		for(var i=0;i<BettingContent.Content.length;i++){//判断已选玩法是否是单关
			for(var v=0;v<BettingContent.Content[i].data.length;v++){
				if(BettingContent.Content[i].data[v].poolEs==0){
					isdan.value=false
					break
				}else{
					isdan.value=true
				}
			}
			if(!isdan.value){break}
		}
	}
	// 点击提交
	const onclickbutton = () => {// 向子组件提供数据
		BettingContent.Content = BettingContent.Content.sort((a,b)=>a.matchId - b.matchId)//排序
		counter.BettingContent = BettingContent
		if (count.value === 0) {
			uni.showToast({
				icon: "error",
				title: '请选择比赛',
				duration: 2000
			});
			return
		}
		if (count.value === 1 && isdan.value === false) {
			uni.showToast({
				icon: "error",
				title: '还需再选1场',
				duration: 2000
			});
		} else {
			uni.navigateTo({
				url: '/pages/main/submit/submit_ticai',
				animationType: 'pop-in',
				animationDuration: 200
			});
		}
	}
	const forceRefresh=ref(false)
	function initialization() {//初始化
		count.value = 0
		forceRefresh.value = !forceRefresh.value
		BettingContent['Content'] = []
		for(var key in tabsArr){//循环清除角标
			tabsArr[key].selectNumber=0
		}
	}
	const systime = ref(5)// systime后续接入店铺自定义时间
	const getjiezhitime = (businessDate,week,matchTime) => {
		//businessDate==投注截止日期
		//week==周几
		//matchTime==比赛时间
		var newBusinessDate=new Date(businessDate.replace(/-/g,'/')).getTime()
		if(counter.gameAstrict.advance != undefined){systime.value = counter.gameAstrict.advance}
		var allTime=''//最终返回的数据
		if(week=='周日' || week=='周六'){
			var businessDate_ldo=businessDate+' '+'23:00:00'
			var newBusinessDate_ldo=new Date(businessDate_ldo.replace(/-/g,'/'))
			newBusinessDate_ldo.setMinutes(newBusinessDate_ldo.getMinutes()-systime.value)
			var newMinute=newBusinessDate_ldo.getMinutes()//分钟
			var newHour=newBusinessDate_ldo.getHours()//小时
			allTime=newHour+':'+newMinute
		}else{
			var businessDate_ldo=businessDate+' '+'22:00:00'
			var newBusinessDate_ldo=new Date(businessDate_ldo.replace(/-/g,'/'))
			newBusinessDate_ldo.setMinutes(newBusinessDate_ldo.getMinutes()-systime.value)
			var newMinute=newBusinessDate_ldo.getMinutes()//分钟
			var newHour=newBusinessDate_ldo.getHours()//小时
			allTime=newHour+':'+newMinute
		}
		var ovrTime=new Date((businessDate+' '+allTime).replace(/-/g,'/'))
		if((matchTime*1000)<ovrTime.getTime()){
			var newMatchTime=new Date(matchTime*1000)
			allTime=newMatchTime.getHours()+':'+newMatchTime.getMinutes()
		}
		return allTime
	}
	
	const noshowdan = (item,id) => {//判断是否是单关
		if(item=='2'|| id==2 || id==3 || id==4){
			return true
		}else{
			return false
		}
	}
	const childRef=ref(null)
	const deleStyle =()=>{//被上一个页面调用
		for(var i=0;i<tabsArr.length;i++){
			var findBoole=tabsArr[i].selectGameArr.includes(counter.styleData.data[0])
			if(findBoole){tabsArr[i].selectNumber--;break}
		}
		for(var i=0;i<childRef.value.length;i++){
			if(childRef.value[i].deleteId == counter.styleData.data[0]){
				childRef.value[i].init()
				break
			}
		}
		tabsArr
		BettingContent.Content=counter.BettingContent.Content
		count.value = BettingContent.Content.length
		counter.styleData.data=[]
	}
	watch(()=>counter.styleData.data.length,(newValue,oldValue)=>{
		if(newValue > 0 ){
			deleStyle()
		}
	})
	const back = () => {uni.navigateBack()}	//返回
</script>

<style>
	.right_title{
		display: flex;
		flex-direction: row;
		margin-top: 20rpx;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	.dan_lable{
		background-color: #ff0000;
		color: #FFFFFF;
		padding:5rpx;
		border-radius:10rpx;
		font-size:26rpx;
	}
	.content_box{
		padding-bottom:100rpx;
	}
	.content_itme{
		display: flex;
		width:720rpx;
		margin:0rpx auto 15rpx auto;
		background-color:white;
		border-radius:15rpx;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
	}
	body{
		background-color:#fbfbfb;
	}
	.buttomStyle{
		width:100%;
		height:80rpx;
		background-color:#f04b49;
		border-radius:15rpx;
		text-align: center;
		line-height:80rpx;
		color: white;
	}
	.userCard{
		width:680rpx;
		padding:20rpx;
		background-color:white;
		border-radius:20rpx;
		font-size:32rpx;
		max-height:1200rpx;
		line-height:60rpx;
		margin:20rpx 0;
	}
	.topBer{
		z-index:999;
		position: -webkit-sticky;
		position: sticky;
		top:0rpx
	}
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
		z-index:999;
	}
	.right .red {
		color: red;
	}

	.right .green {
		color: green;
	}

	.left {
		width: 20%;

		display: -webkit-box;
		-webkit-box-orient: horizontal;
		-webkit-box-pack: center;
		-webkit-box-align: center;
		/* 边框 */
		border-right:1rpx solid #edf0f3;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}

	.right {
		width: 80%;
		/* 边框 */
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}
	.box-bg {
		display: flex;
		flex-direction: column;
		width: 100%;
		/* background-color: #F5F5F5; */
		margin-bottom: 30rpx;
	}
	.nogame {
		position: fixed;
		top:calc(50% - 350rpx);
		left:calc(50% - 250rpx);
	}
</style>
