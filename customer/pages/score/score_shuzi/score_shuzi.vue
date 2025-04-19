<template>
	<z-paging ref="dataList" v-model="allData" @query='uploadFunction'>
		<template v-slot:top>
			<view class="status_bar"></view>
			<uni-nav-bar :title="titleStr" leftIcon="back" @clickLeft="back"></uni-nav-bar>
		</template>
		<view class="ContentCard" v-for="itme,index in allData">
			<view class="top">
				<view class="top_title">第{{itme.code}}期</view>
				<view class="top_time">{{itme.SaleEndtime}}</view>
			</view>
			<view class="content" v-if="gameType.state=='体彩'">
				<view class="content_main">
					<view class="redBall" v-for="itmeX,indexX in itme.lotteryDrawResult">
						{{itmeX}}
					</view>
					<view class="buleBall" v-for="itmeX,indexX in itme.blue" v-show="itme.blue!=''">
						{{itmeX}}
					</view>
				</view>
				<uni-icons type="bottom"></uni-icons>
			</view>
			<view class="content" v-else>
				<view class="content_main">
					<view class="redBall" v-for="itmeX,indexX in itme.red">
						{{itmeX}}
					</view>
					<view class="buleBall" v-for="itmeX,indexX in itme.blue" v-show="itme.blue!=''">
						{{itmeX}}
					</view>
				</view>
				<uni-icons type="bottom"></uni-icons>
			</view>
		</view>
	</z-paging>

</template>

<script setup>
	import { useCounterStore } from '@/stores/counter'
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		defineProps,
		getCurrentInstance
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	
	const Props=defineProps([
		'title'//Taber的title
	])
	
	const titleStr=ref('')//最终显示的title内容
	
	const tic=reactive(['85','35','350133','04'])//接口参数(体彩)
	const ticChinese=reactive(['大乐透','排列三','排列五','七星彩'])//接口参数对应的玩法(体彩)
	
	const fuli=reactive(['ssq','3d','kl8','qlc'])//接口参数(福利)
	const fuliChinese=reactive(['双色球','福彩3D','快乐8','七乐彩'])//接口参数对应的玩法(福利)
	
	
	const gameType=ref(null)//玩法分类信息{state:xxx,type:xxx,}
	
	const allData=ref([])//获取到的接口数据
	
	const fuliNumber=ref(0)//福彩获取数据次数(用于分页)
	
	onBeforeMount(()=>{
		titleStr.value=Props.title==undefined?'开奖公告':Props.title
		apiFunction(titleStr.value)
	})
	const uploadFunction=(pageNo,pageSize)=>{//获取详细数字彩开奖数据
		if(gameType.value.state=='体彩'){
			uni.request({
				url:counter.baseUrl+'/api/bettingend.bet.Betinfo/getHistory',
				header:{
					'server':'1',
					'ba-user-token':counter.access_token,
				},data:{
					"gameNo":gameType.value.type,
					"pageSize":pageSize,
					"pageNo":pageNo
				},
				success(res){
					if(gameType.value.type=='85'){
						proxy.$refs.dataList.complete(dltBlueSet(res.data.data.data))
					}else{
						proxy.$refs.dataList.complete(res.data.data.data)
					}
				},fail(){
					proxy.$refs.dataList.complete(false)
				}
			})
		}else{
			uni.request({
				url:counter.baseUrl+'/api/bettingend.bet.Betinfo/GetWelfareKJ',
				header:{
					'server':'1',
					'ba-user-token':counter.access_token,
				},data:{
					"name":gameType.value.type,
					"issueCount":pageNo*pageSize,
					"issueStart": "",
					"issueEnd": "",
					"dayStart": "",
					"dayEnd": ""
				},
				success(res){
					if(fuliNumber.value==0){
						fuliNumber.value++
						proxy.$refs.dataList.complete(res.data.data.data)
					}else{
						//如果是下拉加载更多操作，再次获取数据后删除已经存在的数据
						var dataArr=res.data.data.data//初始数据
						dataArr.splice(0,(pageNo*pageSize)-10)
						proxy.$refs.dataList.complete(dataArr)
					}
				},fail(){
					proxy.$refs.dataList.complete(false)
				}
			})
		}
	}
	
	
	
	const dltBlueSet=(data)=>{
		var newData=data
		for(var i=0;i<newData.length;i++){
			//去除数组中最后两位添加到blue(大乐透)
			newData[i].blue=newData[i].lotteryDrawResult.slice(-2)
			newData[i].lotteryDrawResult.splice(5,6)//取出后删除
		}
		return newData
	}
	
	const apiFunction=(title)=>{//初始化时判断所接收的title是属于哪个彩种的，并返回到gameType
		var index=ticChinese.indexOf(title,0)
		if(index == -1){
			index=fuliChinese.indexOf(title,0)
			var odj={
				'state':'福利',
				'type':fuli[index]
			}
			gameType.value=odj
		}else{
			var odj={
				'state':'体彩',
				'type':tic[index]
			}
			gameType.value=odj
		}
	}
	
	const back=()=>{//返回
		uni.navigateBack()
	}
</script>

<style lang="scss">
	.content{
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top:10rpx;
		.content_main{
			display: grid;
			grid-template-columns: repeat(8,70rpx);
			grid-template-rows: repeat(auto,70rpx);
			grid-column-gap:10rpx;
			grid-row-gap:10rpx;
		}
	}
	.redBall{
		width:70rpx;
		height:70rpx;
		color: white;
		text-align: center;
		line-height:70rpx;
		background-image: radial-gradient(#ff9999, #ff3333, #ff3333);
		font-weight: bold;
		border-radius:50%;
	}
	.buleBall{
		width:70rpx;
		height:70rpx;
		color: white;
		text-align: center;
		line-height:70rpx;
		background-image: radial-gradient(#5acdf0, #00a0f0, #00a0f0);
		font-weight: bold;
		border-radius:50%;
	}
	
	.top{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.top_title{
			font-weight:bold;
		}
		.top_time{
			font-size:26rpx;
			color:#9c9c9c;
		}
	}
	.ContentCard{
		width:100%;
		padding:20rpx;
		box-sizing: border-box;
		background-color:white;
		margin:10rpx auto;
	}
	body{
		background-color:#f9f9f9;
	}
	.status_bar {
		background-color:white;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
