<template>
	<view class="navigation">
		<view class="status_bar"></view>
		<!-- 导航栏 -->
		<uni-nav-bar background-color="#f04b49" @clickLeft="back" title="任选9" height="100rpx" color="#fff" left-icon="left" mark="false">
			
		</uni-nav-bar>
	</view>
	<view class="nogame" v-show="!data.MatchList">
		<image src="@/static/img/main/ico-game-no.png" mode="aspectFit" style="width:500rpx;height:500rpx;"></image>
	</view>
	<classify :select_arr="tabsData"></classify>
	<view style="padding-bottom:100rpx;">
		<view class="content_box" v-for="itme,index in data.MatchList">
			<view class="left">
				<view style="display:flex;flex-direction: column; margin: auto; text-align:center;">
					<text style="margin: 2rpx;">场次{{itme.MatchNum}}</text>
					<text style="margin: 2rpx;">{{itme.matchName}}</text>
					<text style="margin: 2rpx; color: #909399;font-size: 24rpx;">{{itme.StartTime}}</text>
				</view>
			</view>
			<view class="right" style="display: flex;flex-direction: column;">
				<view style="display: flex;margin-top: 20rpx; align-items: center;justify-content: center;">
					<view style="width: 45%; font-size: 30rpx;font-weight: bolder;text-align: center;">
						{{itme.MasterTeamName}}
						<text style="color: red;font-size: 20rpx;font-weight: bolder;">(主)</text>
					</view>
					<view style=" width: 10%;text-align: center;">
						<text style="font-size: 25rpx; font-weight: bolder;">VS</text>
					</view>
					<view style="width: 45%; font-size: 30rpx;font-weight: bolder;text-align: center;">
						<text style="color: red;font-size: 25rpx;font-weight: bolder;">(客)</text>
						{{itme.GuestTeamName}}
					</view>
				</view>
				<view>
					<renxuan9checkbox :Refresh="forceRefresh" 
						:fixSelectData="itme"
						:Tiemsort = "data.LotterySaleEndtime" 
						ref="childRef" 
						@getSelectList="getChildrenSelectList($event,common.getNowFormatDate(0,getjiezhitime(data.LotterySaleEndtime)))"
					/>
				</view>
			</view>
		</view>
	</view>
	<view class="footer" style="">
		<Footer :count="count" @clickbutton="onclickbutton" @clickempty="onclickempty"></Footer>
	</view>
</template>

<script setup>
	import Footer from "@/components/main/bet/renxuan9/new/footer.vue"
	import renxuan9checkbox from "@/components/main/bet/renxuan9/new/renxuan9-checkbox.vue"
	import fuiDialog from '@/components/fui-dialog/fui-dialog.vue'
	import common from "@/common/getdatetime.js"
	import api from "@/common/vmeitime-http/sporttery.js"
	import {ref,onBeforeMount,reactive,watch} from 'vue'
	import {useCounterStore} from '@/stores/counter'
	import classify from "@/components/main/classifySelect/classifySelect.vue"
	const counter = useCounterStore(); //状态管理
	const data = ref([])
	const tabsData=reactive([])
	// 投注内容 传到下一个页面的数据模板
	const BettingContent = reactive({
		'type': '任选九',
		'gametype': '混合过关',
		'remarks': [],
		'Content': [],
		'lssue' :'',
	})
	onBeforeMount(()=>{
		uni.showLoading({title: '加载中'});
		uni.request({//获取比赛数据(任选九)
			url:'http://8.210.175.179:8383/odds.php?type=rx9&key=aaz6wu&secret=a4f71eaa25a00144c35eb0a457e636c',
			timeout:10000,
			method:'POST',
			success(res){
				if(!pdtime(res.data.list.LotterySaleEndtime)){
					data.value=res.data.list
					BettingContent.lssue=res.data.list.LotteryDrawNum
					tabsData.push({
						businessDate:common.getNowFormatDate(0,getjiezhitime(res.data.list.LotterySaleEndtime)),
						matchNumber:res.data.list.MatchList.length,
						weekday:'截止'+' '+res.data.list.LotteryDrawNum+'期'
					})
				}
				
				uni.hideLoading()
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
		uni.hideLoading()
	})
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
	// 选择场次的数量
	const count = ref(0)
	
	const getChildrenSelectList = (data,time) => {//选择
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
	
	
	const pdtime = (e)=>{
		var nowDate = new Date()
		var newtime = new Date(e)
		// console.log(nowDate.getTime(),newtime.getTime());
		if(nowDate.getTime()>newtime.getTime()){
			return true
		}else{
			return false
		}
		
	}

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
		z-index:999;
		position:-webkit-sticky;
		position:sticky;
		top:0rpx;
		background-color: #f04b49;
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