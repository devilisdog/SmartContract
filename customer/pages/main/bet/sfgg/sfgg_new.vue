<template>
	<view class="navigation">
		<view class="statusBar"/>
		<view style="height: 100rpx;display: flex;align-items: center;justify-content: center;background-color: #f04b49;">
			<uni-icons color="#fff" type="back" @click="back()" size="21" style='position: absolute;left: 30rpx;'></uni-icons>
			<view>
				<text style="width: 100%;color:#fff; 36rpx;font-weight: bold;">胜负过关</text>
			</view>
		</view>
	</view>
	<view class="nogame" v-show="DataList.length==0">
		<image src="@/static/img/main/ico-game-no.png" mode="aspectFit" style="width:500rpx;height:500rpx;"></image>
	</view>
	<classify :select_arr="tabsData" @click_select="user_select"></classify>
	<template style="padding-bottom:100rpx;"  v-for="item,index in DataList" :key="index">
		<view style="padding-bottom:100rpx;" v-show="index==tabsData[showData_index].businessDate">
			<view class="content_itme" v-for="itme02,index02 in item">
				<view class="card_left">
					<text style="font-weight: bold;color: #434343;">{{itme02.MatchNo}}</text>
					<text style="padding: 10rpx 0;font-weight: bold;color: #434343;">
						{{itme02.LeagueName.replace(/[^\u4E00-\u9FA5]/g,'')}}
					</text>
					<text style="color: #868686;">{{common.dateFormat(itme02.shopSetExpiration,2)}}(截)</text>
				</view>
				<view class="card_right">
					<view style="display: flex;justify-content: center;align-items: center;text-align: center;margin-top:20rpx;">
						<view style="width: 45%;">
							<text style="font-size: 30rpx;font-weight:bold;">{{itme02.HostFull}}</text>
							<text style="font-size: 30rpx;margin-left:10rpx;" :style="Number(itme02.Handicap)>0?'color:red;':'color:green;'">{{itme02.Handicap}}</text>
						</view>
						<text style="width:10%;">VS</text>
						<text style="font-size: 30rpx;width: 45%;font-weight:bold;">{{itme02.GuestFull}}</text>
					</view>
					<sfggcheckbox
						:Refresh="forceRefresh" :count="count" 
						ref="childRef" :fixSelectData="itme02" 
						@getSelectList="
							getChildrenSelectList($event,common.dateFormat(itme02.shopSetExpiration,3))
						" 
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
	<!-- 底部导航 -->
	<view class="footer" style="">
		<Footer :count="count" @clickbutton="onclickbutton" @clickempty="initialization"></Footer>
	</view>
</template>

<script setup>
	import sfggcheckbox from "@/components/main/bet/sfgg/sfgg-checkbox.vue"
	import Footer from "@/components/main/bet/sfgg/footer.vue"
	import common from "@/common/common.js"
	import {useCounterStore} from '@/stores/counter'
	import {onBeforeMount,ref,reactive,watch} from 'vue';
		import fuiDialog from '@/components/fui-dialog/fui-dialog.vue'
	import classify from "@/components/main/classifySelect/classifySelect.vue"
	import api from "@/common/vmeitime-http/index.js"
	const counter = useCounterStore(); //状态管理
	// 投注内容 传到下一个页面的数据模板
	const BettingContent = reactive({
		'type': '胜负过关',
		'gametype': null,
		'remarks': [],
		'Content': [],
		'lssue' :'',
	})
	onBeforeMount(() => {
		Getbjdcdata()
	})
	const ShowTIPS = ref(false)//温馨提示显示值控制
	const showData_index=ref(0)//tabs默认选择值
	const user_select=(e)=>{showData_index.value=e}
	
	const DataList = ref({})//页面数据
	
	const tabsData=reactive([])
	const Getbjdcdata=()=>{//获取比赛数据并处理数据格式
		uni.showLoading({title: '加载中'});
		DataList.value = {}
		uni.request({//获取比赛数据
			url:uni.getStorageSync('dataapi')+'/api.SportDataV1/odds?type=sfgg&key=yabokj&secret=33ee2210341c057c2638bc3dfc90dfa7',
			timeout:5000,
			method:'GET',
			success(res){
				uni.hideLoading()
				if(res.statusCode==200){
					if(res.data.list.length==0){
						ShowTIPS.value=true
						return
					}
					BettingContent.lssue=res.data.list.IssueId//期数赋值
					gameDataInit(res.data.list.MatchInfoList)
				}
				if(DataList.length==0){ShowTIPS.value=true}
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
			// console.log(copyData[key])
			copyData[key].SubMatchList.forEach((itme,index)=>{
				itme['shopSetExpiration']=getjiezhitime(itme.EndTime)
				if(itme['shopSetExpiration']>nowTime){
					newArr.push(itme.MatchNo)
					newData.push(itme)
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

	const count = ref(0)// 选择场次的数量
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

	// 点击提交
	const onclickbutton = () => {
		BettingContent.Content = BettingContent.Content.sort((a,b)=>a.matchId - b.matchId)//排序
		counter.BettingContent = BettingContent	// 向子组件提供数据
		if(count.value<3){
			uni.showToast({
				icon:"error",
				title: '至少选择3场比赛',
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
	// 强制刷新key
	const forceRefresh = ref(true)
	function initialization() {//初始化
		count.value = 0
		forceRefresh.value = !forceRefresh.value
		BettingContent['Content'] = []
		for(var key in tabsData){//循环清除角标
			tabsData[key].selectNumber=0
		}
	}
	
	// systime后续接入店铺自定义时间
	const systime = ref(10)
	const getjiezhitime = (time) => {
		if(counter.gameAstrict.advance){systime.value = counter.gameAstrict.advance}
		var date=new Date(time.replace(/-/g,'/'))
		date.setMinutes(date.getMinutes()-systime.value)
		var newTime=date.getTime()
		return newTime
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

<style>
	.card_right{
		flex-direction: column;
		border-left: 1rpx solid #e3e3e3;
		border-right: none;
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
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
	}
	body{
		background-color:#fbfbfb;
	}
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
	}
	/* 导航 */
	.navigation{
		z-index:999;
		position: -webkit-sticky;
		position: sticky;
		top:0rpx;
		background-color:white;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
	}
	
	.right .red {
		color: red;
	}

	.right .green {
		color: green;
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
	.nogame {
		position: fixed;
		top:calc(50% - 350rpx);
		left:calc(50% - 250rpx);
	}
</style>