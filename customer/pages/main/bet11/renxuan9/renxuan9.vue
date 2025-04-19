<template>
	<view class="navigation">
		<view class="status_bar"></view>
		<!-- 导航栏 -->
		<uni-nav-bar @clickLeft="back" height="100rpx" left-icon="left" mark="false">
			<view class="" style="margin: auto;">
				<!-- 从下往上的选择栏 -->
				<text style="font-size: 36rpx;">任选9</text>
			</view>
		</uni-nav-bar>
	</view>
	<view class="nogame" v-show="!data.matchList">
		<image src="@/static/img/main/ico-game-no.png" mode="aspectFit" style="width:500rpx;height:500rpx;"></image>
	</view>
	<classify :select_arr="tabsData"></classify>
	<view style="padding-bottom:100rpx;">
		<view class="content_box" v-for="itme,index in data.matchList">
			<view class="left">
				<view style="display:flex;flex-direction: column; margin: auto; text-align:center;">
					<text style="margin: 2rpx;">场次{{index+1}}</text>
					<text style="margin: 2rpx;">{{itme.matchName}}</text>
					<text style="margin: 2rpx; color: #909399;font-size: 24rpx;">{{itme.startTime}}</text>
				</view>
			</view>
			<view class="right" style="display: flex;flex-direction: column;">
				<view style="display: flex;margin-top: 20rpx; align-items: center;justify-content: center;">
					<view style="width: 45%; font-size: 25rpx;font-weight: bolder;text-align: center;">
						<text style="color: red;font-size: 25rpx;font-weight: bolder;">(主)</text>
						{{itme.masterTeamName}}
					</view>
					<view style=" width: 10%;text-align: center;">
						<text style="font-size: 25rpx; font-weight: bolder;">VS</text>
					</view>
					<view style="width: 45%; font-size: 25rpx;font-weight: bolder;text-align: center;">
						<text style="color: red;font-size: 25rpx;font-weight: bolder;">(客)</text>
						{{itme.guestTeamName}}
					</view>
				</view>
				<view>
					<renxuan9checkbox :Refresh="forceRefresh" 
						:fixSelectData="itme"
						:Tiemsort = "data.lotterySaleEndtime" 
						ref="childRef" 
						@getSelectList="getChildrenSelectList($event,common.getNowFormatDate(0,getjiezhitime(data.lotterySaleEndtime)))"
					/>
				</view>
			</view>
		</view>
	</view>
	<fuiDialog
		:show="ShowTIPS" title="温馨提示"
		content="暂时没有数据,可以去看看其他玩法哦 ; )"
		:buttons="fuiButtons" 
		:maskClosable='false'
		@click='fuiClick'>
	</fuiDialog>
	<view class="footer" style="">
		<Footer :count="count" @clickbutton="onclickbutton" @clickempty="onclickempty"></Footer>
	</view>
</template>

<script setup>
	import Footer from "@/components/main/bet/renxuan9/footer.vue"
	import renxuan9checkbox from "@/components/main/bet/renxuan9/renxuan9-checkbox.vue"
	import fuiDialog from '@/components/fui-dialog/fui-dialog.vue'
	import common from "@/common/getdatetime.js"
	import api from "@/common/vmeitime-http/sporttery.js"
	import {ref,onBeforeMount,reactive,watch} from 'vue'
	import {useCounterStore} from '@/stores/counter'
	import classify from "@/components/main/classifySelect/classifySelect.vue"
	const counter = useCounterStore(); //状态管理

	const nogame = ref(true)
	const data = ref([])
	const fixSelectData = reactive([])
	const tabsData=reactive([])
	onBeforeMount(()=>{
		uni.showLoading({title: '加载中'});
		api.Getctzq({"param": "90",}).then((res) => {
			uni.hideLoading();
			if (res.data.code === 1) {
				BettingContent.lssue=res.data.data.sfcMatch.lotteryDrawNum
				data.value = res.data.data.sfcMatch
				tabsData.push({
					businessDate:common.getNowFormatDate(0,getjiezhitime(res.data.data.sfcMatch.lotterySaleEndtime)),
					matchNumber:res.data.data.sfcMatch.matchList.length,
					weekday:'截止'
				})
			} else {
				uni.showToast({
					title:'往期中奖数据获取失败~',
					position:"center",
					icon:"error"
				})
				ShowTIPS.value = true
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
	//温馨提示的两个按钮点击
	const fuiClick = (e) =>{back()}
	
	// 投注内容 传到下一个页面的数据模板
	const BettingContent = reactive({
		'type': '任选九',
		'gametype': '混合过关',
		'remarks': [],
		'Content': [],
		'lssue' :'',
	})
	
	
	// 选择场次的数量
	const count = ref(0)
	
	const getChildrenSelectList = (data,time) => {
		if (data.selectBoole) { //增加
			data.gameData.orderDeadline=time
			// 判断是不是空  空的话直接添加
			if (BettingContent.Content.length == 0) {
				BettingContent.Content.push(data.gameData)
			} else {
				// 判断有没有该场次存在
				for (var i = 0; i <= BettingContent.Content.length - 1; i++) {
					if (data.gameData.matchId == BettingContent.Content[i].matchId) {
						var a = true
						break; //跳出循环
					} else {
						var a = false
					}
				}
				//如果存在则添加投注参数而不新增场次  不存在直接新增
				if (a == true) {
					var index = BettingContent.Content.findIndex(item =>item.matchId == data.gameData.matchId)
					BettingContent.Content[index].data.push({
						res: data.gameData.data[0].res,
						rate: data.gameData.data[0].rate,
					})
				} else {
					BettingContent.Content.push(data.gameData)
				}
			}
			count.value = BettingContent.Content.length
		} else { //减少
			// 先找到场次index
			var index = BettingContent.Content.findIndex(item =>item.matchId == data.gameData.matchId)
			
			//然后找到对应的选项
			var index2 = BettingContent.Content[index].data.findIndex(item =>item.res == data.gameData.data[0].res)
			
			// 删除掉里面的投注内容
			BettingContent.Content[index].data.splice(index2, 1)
			// 判断该场次是不是清空了  如果没有投注内容了就删除该场次减少资源
			
			if (BettingContent.Content[index].data.length == 0) {
				// 通过场次id找到索引
				var index3 = BettingContent.Content.findIndex(item =>item.matchId == BettingContent.Content[index].matchId)
				BettingContent.Content.splice(index3, 1)
			}
		}
		// 判断有几场比赛
		count.value = BettingContent.Content.length
	}
	
	// 点击提交
	const onclickbutton = () => {
		BettingContent.Content = BettingContent.Content.sort((a,b)=>a.matchId - b.matchId)//排序
		counter.BettingContent = BettingContent
		if(count.value<9){
			uni.showToast({
				icon:"none",
				position:'center',
				title: '请选择9场比赛',
				duration: 2000
			});
		}else if(count.value>9){
			uni.showToast({
				icon:"none",
				position:'center',
				title: '只能选择9场比赛',
				duration: 2000
			});
		}else{
			uni.navigateTo({url: '/pages/main/submit/submit_ticai',})
		}
	}
	
	const forceRefresh = ref(false)
	// 清空按钮
	const onclickempty = () => {
		count.value = 0
		forceRefresh.value = !forceRefresh.value
		BettingContent['Content'] = []
	}
	
	
	// systime后续接入店铺自定义时间
	const systime = ref(10)
	const getjiezhitime=(time)=>{
		if(counter.gameAstrict.advance != undefined){systime.value = counter.gameAstrict.advance}
		var date=new Date(time.replace(/-/g,'/'))
		date.setMinutes(date.getMinutes()-systime.value)
		var newTime=date.getTime()
		return newTime
	}
	
	
	const childRef=ref(null)
	const deleStyle =(e)=>{	//被上一个页面调用(滑动删除)
		childRef.value[counter.styleData.data[0]-1].init()
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
	.content_box{
		display: flex;
		width:720rpx;
		background-color: white;
		margin:0rpx auto 15rpx auto;
		border-radius:15rpx;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		padding:10rpx 0;
	}
	body{
		background-color:#fbfbfb;
	}
	.navigation{
		z-index:2;
		position:-webkit-sticky;
		position:sticky;
		top:0rpx
	}
	.status_bar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
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
	
	.left {
		width: 25%;
		display: -webkit-box;
		-webkit-box-orient: horizontal;
		-webkit-box-pack: center;
		-webkit-box-align: center;
		/* 边框 */
		/* border: 3rpx solid #edf0f3; */
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
	
	.right {
		width: 75%;
		/* 边框 */
		border-left:1rpx solid #edf0f3;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
	
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}
	
	.nogame{
		position: fixed;
		top:calc(50% - 350rpx);
		left:calc(50% - 250rpx);
	}
</style>