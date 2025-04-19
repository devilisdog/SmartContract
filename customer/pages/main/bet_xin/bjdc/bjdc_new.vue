<template>
	<!-- 导航 -->
	<view class="navigation">
		<view class="statusBar"></view>
		<view style="height: 100rpx;display: flex;align-items: center;justify-content: center;">
			<uni-icons type="back" @click="back()" color="#fff" size="21" style='position: absolute;left: 30rpx;'></uni-icons>
			<view @click="change">
				<text style="color: #484848;font-size: 36rpx;font-weight: bold;margin-left: 40rpx;color: #fff;">{{title}}</text>
				<uni-icons type="bottom" color="#fff" size="15"></uni-icons>
			</view>
			<text style="position: absolute;right: 30rpx;color: #3b3b3b;font-size: 30rpx;color: #fff;" 
				@click="proxy.$refs.screenPopup.open()">
				筛选
			</text>
		</view>
	</view>
	<view style="height: var(--status-bar-height);padding-top: 115rpx"></view>
	<view class="nogame" v-show="DataList.length==0">
		<image src="@/static/img/main/ico-game-no.png" mode="aspectFit" style="width:500rpx;height:500rpx;"></image>
	</view>
	<classify :select_arr="tabsData" @click_select="user_select"></classify>
	<template style="padding-bottom:100rpx;"  v-for="item,index in DataList" :key="index">
		<view style="padding-bottom:100rpx;" v-show="index==tabsData[showData_index].businessDate">
			<view class="content_itme" v-for="item02,index02 in item" v-show="pitchShow(item02.LeagueName)">
				<view class="card_left">
					<text style="font-weight: bold;color: #434343;">{{item02.MatchNo}}</text>
					<text style="padding: 10rpx 0;font-weight: bold;color: #434343;">
						{{item02.LeagueName.replace(/[^\u4E00-\u9FA5]/g,'')}}
					</text>
					<text style="color: #868686;">{{common.dateFormat(item02.shopSetExpiration,2)}}(截)</text>
				</view>
				<view class="card_right">
					<view style="display: flex;padding:0rpx 10rpx;">
						<view style="flex:1;">
							<text style="font-size:30rpx;font-weight: bold;">
								{{item02.HostFull}}
							</text>
							<text v-show="play==0" :style="Number(item02.Handicap)>0?'color:red;':'color:green;'">
								{{item02.Handicap && item02.Handicap!='0'?'('+item02.Handicap+')':''}}
							</text>
						</view>
						<text style="width: 20%;flex:0.3;">VS</text>
						<text style="font-size: 30rpx;width: 40%;font-weight: bold;flex:1;">{{item02.GuestFull}}</text>
					</view>
					<spfcheckbox
						v-if="play==0" :Refresh="forceRefresh" 
						:fixSelectData="item02"  ref="childRef" 
						@getSelectList="getChildrenSelectList($event,common.dateFormat(item02.shopSetExpiration,3))" 
						:count="count" 
					/>
					<sxdscheckbox 
						v-else-if="play==1" :count="count" 
						ref="childRef" :Refresh="forceRefresh" 
						:fixSelectData="item02"  
						@getSelectList="getChildrenSelectList($event,common.dateFormat(item02.shopSetExpiration,3))" 
						
					/>
					
					<ttgcheckbox 
						v-else-if="play==2" ref="childRef" 
						:fixSelectData="item02" :count="count" 
						:Refresh="forceRefresh"
						@getSelectList="getChildrenSelectList($event,common.dateFormat(item02.shopSetExpiration,3))" 
					 
					/>
					<hafucheckbox 
						v-else-if="play==3" :Refresh="forceRefresh" 
						:fixSelectData="item02" ref="childRef" 
						@getSelectList="getChildrenSelectList($event,common.dateFormat(item02.shopSetExpiration,3))" 
						:count="count"
					/>
					<crscheckbox 
						v-else :Refresh="forceRefresh" 
						:fixSelectData="item02" ref="childRef"
						@getSelectList="getChildrenSelectList($event,common.dateFormat(item02.shopSetExpiration,3))" 
						:count="count" 
					/>
				</view>
			</view>
		</view>
	</template>
	<fuiDialog
		:show="ShowTIPS" title="温馨提示" 
		content="暂时没有数据,可以去看看其他玩法吧 ; )" 
		:buttons="fuiButtons" :maskClosable='false' 
		@click='back'>
	</fuiDialog>
	<!-- 弹窗下拉选择 -->
	<JarvisPicker mode="bottom" :show.sync="show" :range="Nav" @confirm="confirm" @cancel="cancel"></JarvisPicker>
	<!-- 底部导航 -->
	<view class="footer" style="">
		<Footer :isdan="isdan" :count="count" @clickbutton="onclickbutton" @clickempty="initialization"></Footer>
	</view>
	<uni-popup ref="screenPopup" type="bottom">
		<view class="popupBox">
			<view class="buttonBox">
				<view class="buttonStyle" @click="automaticSelection(0)">
					<text>全选</text>
				</view>
				<view class="buttonStyle" @click="automaticSelection(1)">
					<text>反选</text>
				</view>
				<view class="buttonStyle" @click="automaticSelection(2)">
					<text>五大联赛</text>
				</view>
			</view>
			<scroll-view :scroll-y="true" class="cntenteBox">
				<view
					:class="itme.pitch==0?'cntent_button':'cntent_button_true'" 
					v-for='itme,index in screenData'
					@click="screen_pitch(index)"
					:key="itme.title.replace(/[^\u4E00-\u9FA5]/g,'')"
				>
					{{itme.title}}
				</view>
			</scroll-view>
			<view class="screen_button" @click="proxy.$refs.screenPopup.close()">关闭</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import spfcheckbox from "@/components/main/bet/bjdc/spf-checkbox.vue"
	import sxdscheckbox from "@/components/main/bet/bjdc/sxds-checkbox.vue"
	import ttgcheckbox from "@/components/main/bet/bjdc/ttg-checkbox.vue"
	import hafucheckbox from "@/components/main/bet/bjdc/hafu-checkbox.vue"
	import crscheckbox from "@/components/main/bet/bjdc/crs-checkbox.vue"
	
	import Footer from "@/components/main/bet/bjdc/footer.vue"
	import JarvisPicker from "@/components/common/jarvis-picker/jarvis-picker.vue"
	import common from "@/common/common.js"
	import { useCounterStore } from '@/stores/counter'
	import {onBeforeMount,ref,reactive,getCurrentInstance,watch} from 'vue';
	import classify from "@/components/main/classifySelect/classifySelect.vue"
	import api from "@/common/vmeitime-http/index.js"
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	//页面数据
	const DataList = ref({})
	
	//筛选按钮数据
	const screenData=reactive([])
	//用户已选择的筛选数据
	const pitchScreenData=reactive([])
	const loke=ref(true)//空图显示控制
	const tabsData=reactive([])
	const showData_index=ref(0)
	// 投注内容 传到下一个页面的数据模板
	const BettingContent = reactive({
		'type': '北京单场',
		'gametype': '胜平负',
		'remarks': [],
		'Content': [],
		'lssue':'',
	})
	onBeforeMount(()=>{
		getData()
	})
	const ShowTIPS = ref(false)//温馨提示显示值控制
	const user_select=(e)=>{showData_index.value=e}
	const automaticSelection=(e)=>{//筛选
		if(e==0){//全选
			screenData.forEach(function(itme,index){
				if(itme.pitch==0){
					pitchScreenData.push(itme.title)
					itme.pitch=1
				}
			})
		}else if(e==1){//反选
			screenData.forEach(function(itme,index){
				if(itme.pitch==0){
					pitchScreenData.push(itme.title)
					itme.pitch=1
				}else{
					var dataIndex=pitchScreenData.indexOf(itme.title,0)
					pitchScreenData.splice(dataIndex,1)
					itme.pitch=0
				}
			})
		}else{//五大联赛
			uni.showToast({
				title:'此功能暂未开放',
				icon:'none',
				position:'center'
			})
		}
	}
	const pitchShow=(title)=>{//判断已选中的筛选条件，是否选中内容
		if(pitchScreenData==''){
			return title
		}else{
			var index=pitchScreenData.indexOf(title,0)
			if(index != -1){
				return pitchScreenData[index]
			}else{
				return false
			}
		}
	}
	const screen_pitch=(index)=>{//选项弹窗按钮选中(手点)
		if(screenData[index].pitch==0){
			screenData[index].pitch=1
			pitchScreenData.push(screenData[index].title)
		}else{
			screenData[index].pitch=0
			var deleteIndex=pitchScreenData.indexOf(screenData[index].title,0)
			pitchScreenData.splice(deleteIndex,1)
		}
	}
	
	const getData = () =>{//获取比赛数据并处理数据格式
		uni.showLoading({title: '加载中'});
		DataList.value = {}
		uni.request({//获取比赛数据
			url:`http://8.210.175.179:8383/odds.php?type=bjdc_spf&key=qhkj&secret=a4f71eaa25a00144c35eb0a457e636c`,
			timeout:10000,
			method:'POST',
			success(res){
				if(res.statusCode==200){
				if(res.data.list.length==0){
					ShowTIPS.value=true
					return
				}
					BettingContent.lssue=res.data.list.IssueId//期数赋值
					gameDataInit(res.data.list.MatchInfoList)
					if(DataList.length==0){ShowTIPS.value=true}
				}
				
			},
			fail(err){
				uni.hideLoading()
				uni.showToast({
					title:'数据获取失败~',
					icon:'none',
					position:'center',
				})
			}
		})
	}
	const gameDataInit=(initData)=>{//数据初始化
		var copyData=JSON.parse(JSON.stringify(initData))//数据克隆
		var nowTime=new Date().getTime()//用户当前时间
		for(var key in copyData){
			var newArr=[]
			var newData=[]
			if (copyData[key] && copyData[key].SubMatchList && Array.isArray(copyData[key].SubMatchList))
			copyData[key].SubMatchList.forEach((itme,index)=>{
				itme['shopSetExpiration']=getjiezhitime(itme.EndTime)
				if(itme['shopSetExpiration']>nowTime){
					newArr.push(itme.MatchNo)
					newData.push(itme)
					var screenDataBoole=false
					for(var i=0;i<screenData.length;i++){
						if(screenData[i].title==itme.LeagueName){screenDataBoole=true;break}
					}
					if(!screenDataBoole){
						var newOjb={
							title:itme.LeagueName,
							pitch:0
						}
						screenData.push(newOjb)
					}
				}
			})
			if(newData.length>0){
				DataList.value[copyData[key].MatchTime]=newData
				var tabs={
					businessDate:copyData[key].MatchTime,
					matchNumber:newData.length,
					weekday:'',
					selectNumber:0,
					selectGameArr:newArr
				}
				tabsData.push(tabs)
			}
		}
		uni.hideLoading()
	}
	// 顶部选择器弹窗显示内容
	const title = ref('胜平负')
	// 顶部选择器弹窗是否显示
	const show = ref(false)
	// 顶部游戏选择器弹窗点击 开启弹窗
	const change = () => {
		show.value = true
	}
	// 顶部游戏选择器弹窗点击取消按钮 关闭弹窗
	const cancel = () => {
		show.value = false
	}
 	const confirm = (e) => {// 顶部游戏选择器弹窗点击确定 初始化
		show.value = false
		title.value = Nav[0][e[0]].label
		play.value = Nav[0][e[0]].value
		BettingContent['gametype'] = title.value;
		tabsData.length = 0
		getData()
		initialization()
	}
	// 顶部选择器内容list
	const Nav = reactive([
		[{
				label: '胜平负',
				value: 0,
				string:'spf'
			},
			{
				label: '上下单双',
				value: 1,
				string:'sxds'
			},
			{
				label: '总进球',
				value: 2,
				string:'zjq'
			},
			{
				label: '半全场',
				value: 3,
				string:'bqc'
			},
			{
				label: '比分',
				value: 4,
				string:'bf'
			},
		]
	])
	
	const play = ref(0) // 选择器选择的玩法Nav.value 传值给子组件
	const forceRefresh = ref(true)
	function initialization() {//选择数据初始化
		count.value = 0
		forceRefresh.value = !forceRefresh.value
		BettingContent['Content'] = []
		for(var key in tabsData){//循环清除角标
			tabsData[key].selectNumber=0
		}
	}
	const count = ref(0)// 选择场次的数量
	const isdan = ref(true)// 是否单场
	const getChildrenSelectList = (data,time) => {// 点击选项  子组件提交的数据处理
		data.gameData.orderDeadline=time//投注截止时间赋值
		if(data.selectBoole){
			if(BettingContent.Content==''){
				count.value++
				tabsData[showData_index.value].selectNumber++
				BettingContent.Content.push(data.gameData)
			}else{
				var index = BettingContent.Content.findIndex(item =>item.matchId == data.gameData.matchId)
				if(index == -1){
					count.value++
					tabsData[showData_index.value].selectNumber++
					BettingContent.Content.push(data.gameData)
				}else{
					BettingContent.Content[index]=data.gameData
				}
			}
		}else{
			count.value--
			tabsData[showData_index.value].selectNumber--
			var index = BettingContent.Content.findIndex(item =>item.matchId == data.gameData.matchId)
			BettingContent.Content.splice(index,1)
		}
	}
	const onclickbutton = () => {// 点击提交
		BettingContent.Content = BettingContent.Content.sort((a,b)=>a.matchId - b.matchId)//排序
		counter.BettingContent = BettingContent
		if(count.value===0){
			uni.showToast({
				icon:"error",
				title: '请选择比赛',
				duration: 2000
			});
		}else{
			uni.navigateTo({
				url: '/pages/main/submit/submit_ticai',
				animationType: 'pop-in',
				animationDuration: 200
			});
		}
	}
	const systime = ref(10)
	const getjiezhitime = (time) => {//比赛截止时间计算
		if(counter.gameAstrict.advance){systime.value = counter.gameAstrict.advance}
		var date=new Date(time.replace(/-/g,'/'))
		date.setMinutes(date.getMinutes()-systime.value)
		var newTime=date.getTime()
		return newTime
	}
	const childRef=ref(null)
	const deleStyle =(e)=>{	//被上一个页面调用
		for(var i=0;i<tabsData.length;i++){
			var findBoole=tabsData[i].selectGameArr.includes(counter.styleData.data[0])
			if(findBoole){tabsData[i].selectNumber--;break}
		}
		for(var i=0;i<childRef.value.length;i++){
			if(childRef.value[i].deleteId == counter.styleData.data[0]){
				childRef.value[i].init()
				break
			}
		}
		BettingContent.Content=counter.BettingContent.Content
		count.value = BettingContent.Content.length
		counter.styleData.data=[]
	}
	watch(()=>counter.styleData.data.length,(newValue,oldValue)=>{
		if(newValue>0){
			deleStyle()
		}
	})
	const back = () =>{
		uni.navigateBack()
	}
</script>

<style>
	.card_right{
		display: flex;
		flex-direction: column;
		border-left: 1rpx solid #e3e3e3;
		border-right: none;
		width:100%;
		text-align: center;
	}
	.card_left{
		padding:0rpx 20rpx;
		flex-direction: column;
		display:flex;
		align-items:center;
		justify-content:space-evenly;
	}
	.content_itme{
		display: flex;
		width:720rpx;
		margin:0rpx auto 15rpx auto;
		background-color:white;
		border-radius:15rpx;
		padding:20rpx 0;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
	}
	.screen_button{
		width:720rpx;
		margin: 0rpx auto;
		border-radius:20rpx 20rpx 0 0;
		padding:20rpx 0rpx;
		background-color: #ececec;
		text-align: center;
	}
	.cntenteBox{
		margin-bottom:20rpx;
		max-height:900rpx;
		width:100%;
		/* background-color: #FDC830; */
	}
	.cntent_button{
		display: inline-block;
		width:225rpx;
		border-radius:10rpx;
		height:70rpx;
		margin:10rpx 10rpx;
		border:1rpx solid #cccccc;
		text-align: center;
		font-size:26rpx;
		line-height:70rpx;
		transition:all 0.2s;
	}
	.cntent_button_true{
		display: inline-block;
		width:227rpx;
		border-radius:10rpx;
		height:72rpx;
		margin:10rpx 10rpx;
		text-align: center;
		font-size:26rpx;
		line-height:70rpx;
		transition:all 0.2s;
		color:white;
		background-color: #FDC830;
	}
	.buttonBox{
		display: flex;
		justify-content: center;
		padding:30rpx 0rpx;
	}
	.buttonStyle{
		padding:8rpx 40rpx;
		background-color: #ececec;
		border:1rpx solid #cccccc;
	}
	.popupBox{
		width:100%;
		background-color: white;
		border-radius:20rpx 20rpx 0 0;
		box-sizing: border-box;
	}
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
	}
	/* 导航 */ 
	.navigation{
		width: 100%;
		background-color: white;
		position: fixed;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 1;
		box-shadow: 0 5rpx 15rpx -8rpx #ebebeb;
		background-color: #f04b49;
	}
	
	/* 游戏玩法选择弹窗 */
	.GameTypePopup{
		width: 100%; 
		height: 520rpx;
		border-radius: 25rpx 25rpx 0 0;
		background-color: white;
		display: flex;
		}.GameTypePopup-button{
			margin: 0 auto;
			width: 620rpx;
			height: 120rpx;
			padding: 0 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #fafafa;
		}.GameTypePopup-button text{
			font-size: 44rpx;
	}
	
	/* 内容卡片 */
	.content{
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		}.content-Two{
			width: 750rpx;
			height: 100%;
			display: flex;
			align-items: center;
		}.content-Two view{
			display: flex;
			align-items: center;
			justify-content: center;
		}.Type-bottom{
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			flex-direction: row;
		}.Type-bottom view{
			width: 165rpx;
			height: 60rpx;
			border: 1rpx solid #e3e3e3;
	}
	
	.nogame {
		position: fixed;
		top:calc(50% - 350rpx);
		left:calc(50% - 250rpx);
	}
		
	/* 提交栏 */
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}
</style>

	