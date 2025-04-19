<template>
	<view class="topBer">
		<view class="statusBar" />
		<view class="my_navBer">
			<view class="left_navBer"><uni-icons color="#fff"  type="back" size="42rpx" @click="back()"></uni-icons></view>
			<view class="middle_navBer" @click="change">
				{{Nav[0][play_id].label}}
				<uni-icons color="#fff" :type="nav_show?'top':'bottom'" size="38rpx" style="transition: all 0.5s;"></uni-icons>
			</view>
			<view class="rigth_navBer"></view>
		</view>
	</view>
	<view class="nogame" v-if="matchInfoList.length==0">
		<image src="@/static/img/main/ico-game-no.png" mode="aspectFit" style="width:500rpx;height:500rpx;"></image>
	</view>
	<classify :select_arr="tabsArr" @click_select="user_select"></classify>
	<template class="content_box"  v-for="item,index in matchInfoList" :key="item.businessDate">
		
		<view class="content_box" v-show="tabsArr[showData_index].businessDate===item.businessDate">
			<view class="content_itme" v-for="item2,index2 in item.subMatchList" v-show="item2.MatchStatus=='Selling'">
				
				<view class="left">
					<view style="display:flex;flex-direction: column; margin: auto; text-align:center;">
						<view v-show="noshowdan(Nav[0][play_id].gameType,item2.PoolList)" style="justify-content: center; text-align: center;">
							<text class="dan_lable">单关</text>
						</view>
						<text style="margin: 2rpx;">{{item2.MatchNumStr}}</text>
						<text style="margin: 2rpx;">{{item2.LeagueAbbName}}</text>
						<text style="margin: 2rpx; color: #909399;">
							{{getdatetime.getNowFormatDate(3,item2.shopSetExpiration)}}:{{getdatetime.getNowFormatDate(5,item2.shopSetExpiration)}}截止
						</text>
						<text style="margin: 2rpx;color:#f04b49;" @click="sikp_scoer(item2.newMatchId)" v-show="item2.newMatchId">
							分析
						</text>
					</view>
				</view>
				<view class="right" style="display: flex;flex-direction: column;">
					<view class="right_title"
						style="">
						<view style="width: 45%; font-size: 30rpx;font-weight: bolder;">
							{{item2.HomeTeamAbbName}}
							<text :class="item2['HHAD'].GoalLine >0?'red':'green'"
								style="margin-left: 20rpx; font-size: 30rpx;font-weight: bolder;">
								{{item2['HHAD'].GoalLine}}</text>
						</view>
						<view style=" width: 10%;">
							<text style="font-size: 30rpx;">VS</text>
						</view>
						<view style="width: 45%; font-size: 30rpx;font-weight: bolder;">
							{{item2.AwayTeamAbbName}}
						</view>
					</view>
					<hhggcheckbox 
						v-if="play_id==0" :Refresh="forceRefresh" :fixSelectData="item2" 
						@getSelectList="
							getChildrenSelectList($event,getdatetime.getNowFormatDate(0,item2.shopSetExpiration))
						" 
						ref='childRef' 
					/>
											
					<spfcheckbox 
						v-else-if="play_id==1" :Refresh="forceRefresh" :fixSelectData="item2" 
						@getSelectList="
							getChildrenSelectList($event,getdatetime.getNowFormatDate(0,item2.shopSetExpiration))
						" 
						ref='childRef' 
					/>
					<crscheckbox 
						v-else-if="play_id==2" :Refresh="forceRefresh" :fixSelectData="item2" 
						@getSelectList="
							getChildrenSelectList($event,getdatetime.getNowFormatDate(0,item2.shopSetExpiration))
						" 
						ref='childRef' 
					/>
					<ttgcheckbox 
						v-else-if="play_id==3" :Refresh="forceRefresh" :fixSelectData="item2"
						@getSelectList="
							getChildrenSelectList($event,getdatetime.getNowFormatDate(0,item2.shopSetExpiration))
						" 
						ref='childRef' 
					/>
					<hafucheckbox 
						v-else :Refresh="forceRefresh" :fixSelectData="item2" 
						@getSelectList="
							getChildrenSelectList($event,getdatetime.getNowFormatDate(0,item2.shopSetExpiration))
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
	<JarvisPicker mode="bottom" :show.sync="nav_show" :range="Nav" @confirm="confirm" @cancel="cancel" />
	<fuiDialog 
		:show="ShowTIPS" title="温馨提示" 
		content="暂时没有数据,可以去看看其他玩法哦 ; )" 
		:buttons="fuiButtons" :maskClosable='false' 
		@click='back()'>
	</fuiDialog>
</template>

<script setup>
	import hhggcheckbox from "@/components/main/bet/jczq/new/hhgg-checkbox.vue"
	import spfcheckbox from "@/components/main/bet/jczq/new/spf-checkbox.vue"
	import hafucheckbox from "@/components/main/bet/jczq/new/hafu-checkbox.vue"
	import ttgcheckbox from "@/components/main/bet/jczq/new/ttg-checkbox.vue"
	import crscheckbox from "@/components/main/bet/jczq/new/crs-checkbox.vue"
	
	import getdatetime from "@/common/getdatetime.js"
	import fuiDialog from '@/components/fui-dialog/fui-dialog.vue'
	import JarvisPicker from "@/components/common/jarvis-picker/jarvis-picker.vue"
	import Footer from "@/components/main/bet/jczq/footer.vue"
	import classify from "@/components/main/classifySelect/classifySelect.vue"
	import common from "@/common/common.js"
	import {useCounterStore} from '@/stores/counter'	
	import {onBeforeMount,ref,reactive,getCurrentInstance,watch} from 'vue';
	
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const matchInfoList = reactive([])	// 比赛信息
	const tabsArr=reactive([])//tabs选择器数据
	const showData_index=ref(0)//tabs默认选择值
	const nav_show = ref(false)	// 顶部选择器弹窗是否显示
	const systime = ref(5)// systime后续接入店铺自定义时间
	const ShowTIPS = ref(false)//温馨提示显示控制
	const fuiButtons = ref([//温馨提示的两个按钮 
		{
			text:'好的退出',
			color:'#f04b49',
		},
	])
	const Nav = reactive([	// 顶部选择器内容list
		[{
				label: '混合过关',
				value: 0,
				gameType:'HAD'
			},
			{
				label: '胜平负',
				value: 1,
				gameType:'HAD'
			},
			{
				label: '比分',
				value: 2,
				gameType:'CRS'
			},
			{
				label: '总进球数',
				value: 3,
				gameType:'TTG'
			},
			{
				label: '半全场',
				value: 4,
				gameType:'HAFU'
			},
		]
	])
	const play_id = ref(0)//nav玩法id
	const count = ref(0)//选择场次的数量
	const isdan = ref(true)//是否单场
	onBeforeMount(() => {
		matchInfoList.length=0//初始化数据
		uni.showLoading({title:'数据获取中',mask:true})
		uni.request({//获取比赛数据
			url:'https://data.uniapp8.top/api.SportDataV1/odds?type=jczq&key=qhkj&secret=a4f71eaa25a00144c35eb0a457e636c',
			method:'POST',
			success(res){
				uni.hideLoading()
				if(res.statusCode==200){
					if(res.data.list.length==0){
						ShowTIPS.value=true
						return
					}
					gameDataInit(res.data.list)
					
				}
				if(matchInfoList.length==0){
					ShowTIPS.value=true
				}
			},
			fail(err){
				uni.hideLoading()
				uni.showToast({
					title:'数据处理失败~',
					icon:'none',
					position:'center',
				})
			}
		})
	})
	
	const sikp_scoer=(newMatchId)=>{//跳转只比分分析页面
		uni.navigateTo({
			url:`/pages/score/score_ticai/gameParticulars?info_id=${newMatchId}`,
			animationType:'slide-in-bottom'
		})
	}
	const gameDataInit=(data)=>{//服务器数据格式化
		var copyData=JSON.parse(JSON.stringify(data))//数据克隆
		var userNowTime=new Date().getTime()//用户当前时间
		copyData.forEach(function(itme,index){
			var newGameData=[]
			var gameIdArr=[]
			for(var i=0;i<itme.SubMatchList.length;i++){
				itme.SubMatchList[i]['shopSetExpiration']=getjiezhitime(itme.SubMatchList[i].BusinessDate,itme.SubMatchList[i].MatchDate,itme.SubMatchList[i].MatchWeek,itme.SubMatchList[i].MatchTime)
				if(userNowTime<itme.SubMatchList[i]['shopSetExpiration']){
					gameIdArr.push(itme.SubMatchList[i].MatchId)
					// console.log(itme.SubMatchList[i]);
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
				tabsArr.push(tbas)
			}
		})
		uni.hideLoading()
		getNewMatchId()
	}
	const getNewMatchId=()=>{//获取每场比赛的的比赛id
		if(matchInfoList[showData_index.value].subMatchList[0]['newMatchId']){return}
		uni.request({
			url:'https://data.uniapp8.top/MatchData',
			timeout:10000,
			method:'POST',
			data:{
				apiName:'getMatchListByDate',
				game:'407',//玩法ud
				key:'admin000',
				secret:'6d4e2f2775ddf6b0b355eac5c4or843k',
				date:tabsArr[showData_index.value].businessDate,
				matchStatus:'',
				pageNo:1,
				pageSize:100,
			},
			success(suss){
				for(var x=0;x<matchInfoList[showData_index.value].subMatchList.length;x++){
					for(var y=0;y<suss.data.matchList.length;y++){
						if(suss.data.matchList[y].matchNoCn==matchInfoList[showData_index.value].subMatchList[x].MatchNumStr){
							matchInfoList[showData_index.value].subMatchList[x]['newMatchId']=suss.data.matchList[y].matchId
							break
						}
					}
				}
			},
		})
	}
	
	
	
	const user_select=(e)=>{showData_index.value=e;getNewMatchId()} //用户点击时间分段器触发
	// 顶部游戏选择器弹窗点击 开启弹窗
	const change = () => {
		nav_show.value = true
	}
	// 顶部游戏选择器弹窗点击取消按钮 关闭弹窗
	const cancel = () => {
		nav_show.value = false
	}
	// 顶部游戏选择器弹窗点击确定 初始化
	const confirm = (e) => {
		nav_show.value = false
		play_id.value = Nav[0][e[0]].value
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
	const forceRefresh=ref(false)//
	function initialization() {//初始化
		count.value = 0
		forceRefresh.value = !forceRefresh.value
		BettingContent['Content'] = []
		for(var key in tabsArr){//循环清除角标
			tabsArr[key].selectNumber=0
		}
	}
	const getjiezhitime = (businessDate,matchDate,week,matchTime) => {
		//businessDate==投注截止日期
		//matchDate==比赛开始日期
		//week==周几
		//matchTime==比赛时间
		if(counter.gameAstrict.advance){systime.value = counter.gameAstrict.advance}
		var sbIphone=businessDate.replace(/-/g,'/')
		var newBusinessDate=new Date(sbIphone)//投注截止日期
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
	
	const noshowdan = (nowGame,allGameList) => {//判断是否是单关
		if(allGameList[nowGame] && allGameList[nowGame].BettingSingle==1){
			return true
		}
		return false
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

<style lang="scss">
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
			color: #fff;
		}
		view{
			flex:1;
		}
	}
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
		top:0rpx;
		background-color:white;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
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