<template>
	<view class="topBer">
		<view class="statusBar" />
		<view class="my_navBer">
			<view class="left_navBer"><uni-icons type="back" color="#fff" size="42rpx" @click="back()"></uni-icons></view>
			<view class="middle_navBer" @click="change">
				{{Nav[0][play_id].label}}
				<uni-icons :type="show?'top':'bottom'" color="#fff" size="38rpx" style="transition: all 0.5s;"></uni-icons>
			</view>
			<view class="rigth_navBer"></view>
		</view>
	</view>
	<classify :select_arr="tabsData" @click_select="user_select"></classify>
	<template style="padding-bottom:100rpx;"  v-for="item,index in matchInfoList" :key="item.businessDate">
		<view style="padding-bottom:100rpx;" v-show="item.businessDate===tabsData[showData_index].businessDate">
			<view class="content_itme" v-for="item2,index2 in item.subMatchList" v-show="item2.MatchStatus=='Selling'">
				<view class="left">
					<view style="display:flex;flex-direction: column; margin: auto; text-align:center;">
						<text style="margin: 2rpx;">{{item2.MatchNumStr}}</text>
						<text style="margin: 2rpx;">{{item2.LeagueAbbName}}</text>
						<text style="margin: 2rpx; color: #909399;">
							{{getdatetime.getNowFormatDate(3,item2.shopSetExpiration)+':'+getdatetime.getNowFormatDate(5,item2.shopSetExpiration)}}截止
						</text>
						<text style="margin: 2rpx;color:#ffaa00;" @click="sikp_scoer(item2.newMatchId)" v-show="item2.newMatchId">
							分析
						</text>
					</view>
				</view>
				<view class="right" style="display: flex;flex-direction: column;">
					<view
						style="display: flex; flex-direction: row; margin-top: 20rpx; align-items: center;justify-content: center; text-align: center;">
						<view style="width: 45%; font-size:30rpx;font-weight: bolder;">
							<text style="color: red;font-size: 25rpx;font-weight: bolder;">(客)</text>
							{{item2.AwayTeamAbbName}}
						</view>
						<view style=" width: 10%;">
							<text style="font-size:30rpx;">VS</text>
						</view>
						<view style="width: 45%; font-size: 30rpx;font-weight: bolder;">
							<text style="color: red;font-size: 25rpx;font-weight: bolder;">(主)</text>
							{{item2.HomeTeamAbbName}}
						</view>
					</view>
					<view>
						<hhggcheckbox 
							v-if="play_id==0" :Refresh="forceRefresh" 
							:fixSelectData="item2" ref="childRef"
							@getSelectList="
								getChildrenSelectList($event,getdatetime.getNowFormatDate(0,item2.shopSetExpiration))
							" 
						/>
						<mnlcheckbox 
							v-if="play_id==1" :Refresh="forceRefresh"  
							:fixSelectData="item2" :listIndex="index2"
							:index='index' ref="childRef" 
							@getSelectList="
								getChildrenSelectList($event,getdatetime.getNowFormatDate(0,item2.shopSetExpiration))
							"
						/>
						<hdccheckbox 
							v-if="play_id==2" :Refresh="forceRefresh" 
							:fixSelectData="item2"  ref="childRef" 
							@getSelectList="
								getChildrenSelectList($event,getdatetime.getNowFormatDate(0,item2.shopSetExpiration))
							" 
						/>
						<hilocheckbox 
							v-if="play_id==3" :Refresh="forceRefresh" 
							:fixSelectData="item2" ref="childRef" 
							@getSelectList="
								getChildrenSelectList($event,getdatetime.getNowFormatDate(0,item2.shopSetExpiration))
							" 
						/>
						<wnmcheckbox 
							v-if="play_id==4" :Refresh="forceRefresh" 
							:fixSelectData="item2" ref="childRef" 
							@getSelectList="
								getChildrenSelectList($event,getdatetime.getNowFormatDate(0,item2.shopSetExpiration))
							" 
						/>
					</view>
				</view>
			</view>
		</view>
	</template>
	<view class="nogame" v-show="matchInfoList.length==0">
		<image src="@/static/img/main/ico-game-no.png" mode="aspectFit" style="width:500rpx;height:500rpx;"></image>
	</view>
	
	<fuiDialog 
		:show="ShowTIPS" title="温馨提示" 
		content="暂时没有数据,可以去看看其他玩法吧 ; )" 
		:buttons="fuiButtons" :maskClosable='false' 
		@click='back'>
	</fuiDialog>
	
	<!-- 底部导航 -->
	<view class="footer" style="">
		<Footer :isdan="isdan" :count="count" @clickbutton="onclickbutton" @clickempty="initialization"></Footer>
	</view>
	
	<!-- 弹窗下拉选择 -->
	<JarvisPicker mode="bottom" :show.sync="show" :range="Nav" @confirm="confirm" @cancel="cancel"></JarvisPicker>
</template>

<script setup>
	import hhggcheckbox from "@/components/main/bet/jclq/hhgg-checkbox.vue"
	import mnlcheckbox from "@/components/main/bet/jclq/mnl-checkbox.vue"
	import hdccheckbox from "@/components/main/bet/jclq/hdc-checkbox.vue"
	import hilocheckbox from "@/components/main/bet/jclq/hilo-checkbox.vue"
	import wnmcheckbox from "@/components/main/bet/jclq/wnm-checkbox.vue"
	import fuiDialog from '@/components/fui-dialog/fui-dialog.vue'
	import JarvisPicker from "@/components/common/jarvis-picker/jarvis-picker.vue"
	import Footer from "@/components/main/bet/jczq/footer.vue"
	import api from '@/common/vmeitime-http/index.js'
	import getdatetime from "@/common/getdatetime.js"
	import {useCounterStore} from '@/stores/counter'
	import {onBeforeMount,ref,reactive,getCurrentInstance,nextTick,watch} from 'vue';
	import classify from "@/components/main/classifySelect/classifySelect.vue"
	import common from "@/common/common.js"
	const counter = useCounterStore(); //状态管理
	const {proxy,ctx} = getCurrentInstance()
	// 比赛信息
	const matchInfoList = reactive([])//比赛数据
	const tabsData=reactive([])//tabs选择器数据
	const showData_index=ref(0)//tabs默认选择值
	onBeforeMount(() => {
		matchInfoList.length=0//初始化数据
		uni.showLoading({title:'数据获取中',mask:true})
		uni.request({//获取比赛数据
			url:'http://8.210.175.179:8383/odds.php?type=jclq&key=qhkj&secret=a4f71eaa25a00144c35eb0a457e636c',
			timeout:10000,
			method:'POST',
			success(res){
				uni.hideLoading()
				if(res.statusCode==200){
					if(res.data.list.length==0){
						ShowTIPS.value=true
						return
					}
					match_init(res.data.list)
				}
				if(matchInfoList.length==0){
					ShowTIPS.value=true
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
	})
	const user_select=(e)=>{showData_index.value=e;getNewMatchId()}
	const match_init=(initData)=>{//获取到的数据格式调整
		var copyData=JSON.parse(JSON.stringify(initData))//数据克隆
		var userNowTime=new Date().getTime()//用户当前时间
		copyData.forEach(function(itme,index){
			var newGameData=[]
			var gameIdArr=[]
			for(var i=0;i<itme.SubMatchList.length;i++){
				itme.SubMatchList[i]['shopSetExpiration']=getjiezhitime(itme.SubMatchList[i].BusinessDate,itme.SubMatchList[i].MatchDate,itme.SubMatchList[i].MatchWeek,itme.SubMatchList[i].MatchTime)
				if(userNowTime<itme.SubMatchList[i]['shopSetExpiration']){
					gameIdArr.push(itme.SubMatchList[i].MatchId)
					newGameData.push(itme.SubMatchList[i])
					var newPoolList={}
					for(var v=0;v<itme.SubMatchList[i].PoolList.length;v++){
						var poolList={
							BettingSingle:itme.SubMatchList[i].PoolList[v].BettingSingle,
							PoolId:itme.SubMatchList[i].PoolList[v].PoolId,
							Single:itme.SubMatchList[i].PoolList[v].Single
						}
						newPoolList[itme.SubMatchList[i].PoolList[v].PoolCode]=poolList
					}
					itme.SubMatchList[i].PoolList=newPoolList
				}
			}
			var newObj={
				businessDate:itme.BusinessDate,
				subMatchList:newGameData,
			}
			var tbas={
				businessDate:itme.BusinessDate,
				matchNumber:itme.MatchCount,
				weekday:itme.Weekday,
				selectNumber:0,
				selectGameArr:gameIdArr
			}
			if(newGameData.length>0){
				matchInfoList.push(newObj)
				tabsData.push(tbas)
			}
		})
		getNewMatchId()
	}
	const sikp_scoer=(newMatchId)=>{//跳转只比分分析页面
		uni.navigateTo({
			url:`/pages/score/score_ticai/gameParticulars?info_id=${newMatchId}&gameType=lq`,
			animationType:'slide-in-bottom'
		})
	}
	const getNewMatchId=()=>{//获取每场比赛的的比赛id
		if(matchInfoList[showData_index.value].subMatchList[0]['newMatchId']){return}
		uni.request({
			url:'https://data.uniapp8.top/MatchData',
			timeout:10000,
			method:'POST',
			data:{
				apiName:'getBkMatchListByDate',
				game:'406',//玩法ud
				key:'jmkj',
				secret:'500e2f2775ddf6b0b355eac5c4e162cb',
				date:tabsData[showData_index.value].businessDate,
				matchStatus:'',
				pageNo:1,
				pageSize:100,
			},
			success(suss){
				if(suss.statusCode==200){
					for(var i=0;i<matchInfoList[showData_index.value].subMatchList.length;i++){
						for(var x=0;x<suss.data.matchList.length;x++){
							if(suss.data.matchList[x].matchNoCn==matchInfoList[showData_index.value].subMatchList[i].MatchNumStr){
								matchInfoList[showData_index.value].subMatchList[i]['newMatchId']=suss.data.matchList[x].matchId
								break
							}
						}
					}
				}
			},
		})
	}
	
	const ShowTIPS = ref(false)//温馨提示显示值控制
	const fuiButtons = ref([{text:'好的退出',color:'#333',}])//温馨提示的两个按钮 *可以增减
	const show = ref(false)	// 顶部选择器弹窗是否显示控制
	// 顶部游戏选择器弹窗点击取消按钮 关闭弹窗
	const cancel = () => {
		show.value = false
	}
	// 顶部选择器弹窗显示内容
	const title = ref('混合过关')

	// 顶部选择器内容list
	const Nav = reactive([
		[{
				label: '混合过关',
				value: 0
			},
			{
				label: '胜负',
				value: 1
			},
			{
				label: '让分胜负',
				value: 2
			},
			{
				label: '大小分',
				value: 3
			},
			{
				label: '胜负差',
				value: 4
			},
		]
	])
	// 选择器选择的玩法Nav.value 传值给子组件
	const play_id = ref(0)
	// 顶部游戏选择器弹窗点击 开启弹窗
	const change = () => {
		show.value = true
	}
	const confirm = (e) => {// 顶部游戏选择器弹窗点击确定 初始化
		show.value = false
		title.value = Nav[0][e[0]].label
		play_id.value = Nav[0][e[0]].value
		BettingContent['gametype'] = title.value
		initialization()
	}


	// 投注内容 传到下一个页面的数据模板
	const BettingContent = reactive({
		'type': '竞彩篮球',
		'gametype': '混合过关',
		'remarks': [],
		'Content': [],
		'lssue' : counter.gameAstrict.systemsgamelist.Issue_no,
	})
	const count = ref(0)//选择场次的数量
	const isdan = ref(true)//是否单场
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
	
	const onclickbutton = () => {// 点击提交
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
	// 强制刷新key
	const forceRefresh = ref(true)
	function initialization() {//初始化（全部清空数据）
		count.value = 0
		forceRefresh.value = !forceRefresh.value
		BettingContent['Content'] = []
		for(var key in tabsData){//循环清除角标
			tabsData[key].selectNumber=0
		}
	}
	
	const systime = ref(5)// systime后续接入店铺自定义时间
	const getjiezhitime = (businessDate,matchDate,week,matchTime) => {
		//businessDate==投注截止日期
		//matchDate==比赛开始日期
		//week==周几
		//matchTime==比赛时间
		if(counter.gameAstrict.advance){systime.value = counter.gameAstrict.advance}
		var newBusinessDate=new Date(businessDate.replace(/-/g,'/'))//投注截止日期
		matchDate=matchDate.replace(/-/g,'/')
		var newMatchDate=new Date(matchDate+' '+matchTime)//比赛日期拼接比赛时间赋值完整的比赛时间戳
		var allTime=''//最终返回的数据
		if(week=='周日' || week=='周六'){
			var nowHours=23//当前周对应的投注截止时间中的小时
			newBusinessDate.setHours(nowHours)
			if(newMatchDate.getTime()>newBusinessDate.getTime()){//比赛时间大于投注截止时间
				allTime=newBusinessDate.setMinutes(newBusinessDate.getMinutes()-systime.value)
			}else{
				allTime=newMatchDate.setMinutes(newMatchDate.getMinutes()-systime.value)
			}
		}else{
			var nowHours=22//当前周对应的投注截止时间中的小时
			newBusinessDate.setHours(nowHours)
			if(newMatchDate.getTime()>newBusinessDate.getTime()){//比赛时间大于投注截止时间
				allTime=newBusinessDate.setMinutes(newBusinessDate.getMinutes()-systime.value)
			}else{
				allTime=newMatchDate.setMinutes(newMatchDate.getMinutes()-systime.value)
			}
		}
		return allTime
	}
	const childRef=ref(null)//被上一个页面调用
	const deleStyle =(e)=>{
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
	// 返回按钮
	const back = () => {
		uni.navigateBack()
	}
</script>

<style lang="scss">
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
		z-index:999;
	}
	.my_navBer{
		width:100%;
		height:90rpx;
		display: flex;
		align-items: center;
		padding:0rpx 20rpx;
		box-sizing: border-box;
		background-color: #202736; 
		.rigth_navBer{
			text-align: right;
		}
		.middle_navBer{
			text-align: center;
			font-weight: bold;
			color:#fff;
		}
		view{
			flex:1;
		}
	}
	.content_itme{
		display: flex;
		width:720rpx;
		margin:0rpx auto 15rpx auto;
		background-color:white;
		border-radius:15rpx;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
	}
	.topBer{
		z-index:999;
		position: -webkit-sticky;
		position: sticky;
		top:0rpx;
		background-color: #FFFFFF;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
	}
	body{
		background-color:#fbfbfb;
	}
	.buttomStyle{
		width:100%;
		height:80rpx;
		background-color:#519a67;
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
	.status_bar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
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
		border:1rpx solid #edf0f3;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
	.right {
		width: 80%;
		/* 边框 */
		border: 1rpx solid #edf0f3;
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
		padding-bottom: 300rpx;
		/* background-color: #F5F5F5; */
		padding: 0px 0;
		margin-bottom: 30rpx;
	}
	.nogame {
		position: fixed;
		top:calc(50% - 350rpx);
		left:calc(50% - 250rpx);
	}
</style>