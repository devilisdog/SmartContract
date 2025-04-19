<template>
	<view class="status_bar"></view>
	<!-- 头部 -->
	<uni-nav-bar title="订单" @clickRight="openScreen()" rightIcon="settings-filled"></uni-nav-bar>
	<!-- 导航 -->
	<scroll-view scroll-y="true" class="navigation">
		<view style="display: flex;">
			<view v-for="itme,index in daohang" :key="index" @click="dianji_qiehuan(index)">
				<view class="box" :style="index==daohang_value?'color:#FDC830;':''">
					<text>{{itme}}</text>
					<uni-badge :text="index==0?listCount1:index==1?listCount2:index==2?listCount3:listCount4"
						absolute="rightTop" :offset='[-5,-7]' :is-dot='daohang_value==index'>
					</uni-badge>
				</view>
			</view>
		</view>
		<view class="xiabiao" :style="daohang_value==1 ? 'left:232rpx;'
			: false || daohang_value==2 ?  'left:420rpx;' 
			: false || daohang_value==3 ?  'left:605rpx;' 
			: false " >
		</view>
	</scroll-view>
	<!-- 内容 -->
	<swiper @change="onChangeTab" 
			:current="daohang_value"
			easing-function='easeInOutCubic'
			:style="{height:common.scrollH()-209-statusBarHeight+'rpx'}" 
			duration="300"
	>
		<!-- 待接单 -->
		<swiper-item style="display: flex;">
			<z-paging @query='list' ref="refresh" v-model="orderListData" :fixed='false' :use-page-scroll="false"
				:auto-show-back-to-top='true' :back-to-top-bottom='40'> 
				<template v-for="item,index in orderListData" :key="item.order_id">
					<yc-dingd-jiedanCard
						@orderReceiving='clickOrderReceiving(item)' 
						@clickOrder='clickOrder(index,1)'
						v-if="screen[0].value==0?true:screen[0].text==item.Type" 
						:order_list='item'>
					</yc-dingd-jiedanCard>
				</template>
			</z-paging>
		</swiper-item>
		<swiper-item style="display: flex;"><!-- 待出票 -->
			<z-paging @query='listX' ref="refreshX" v-model="orderListDataX" :fixed='false' :use-page-scroll="false"
				:auto-show-back-to-top='true' :back-to-top-bottom='40'>
				<template v-for="item,index in orderListDataX" :key="item.order_id">
					<yc-dingd-jiedanCard
						@OrderDetails='clickOrderDetails(item)' 
						@clickOrder='clickOrder(index,2)'
						v-if="screen[0].value==0?true:screen[0].text==item.Type" 
						:order_list='item'>
					</yc-dingd-jiedanCard>
				</template>
			</z-paging>
		</swiper-item>
		<swiper-item><!-- 合买订单 -->
			<z-paging @query='clickOrder_together' ref="Order_together" v-model="Order_togetherData" :fixed='false'
				:use-page-scroll="false" :auto-show-back-to-top='true' :back-to-top-bottom='40'> 
				<template v-for="item,index in Order_togetherData" :key="item.order_id">
					<yc-dingd-jiedanCard
						@OrderDetails='clickOrderDetails(item)' @clickOrder='clickOrder(index,3)'
						v-if="screen[0].value==0?true:screen[0].text==item.Type"
						:order_list='item'>
					</yc-dingd-jiedanCard>
				</template>
			</z-paging>
		</swiper-item>
		<swiper-item><!-- 合作订单 -->
			<z-paging @query='CooperativeOrderList' ref="CooperativeOrder" v-model="order_CooperativeOrderData" 
			:fixed='false' :use-page-scroll="false" :auto-show-back-to-top='true' :back-to-top-bottom='40'> 
				<template v-for="item,index in order_CooperativeOrderData" :key="item.order_id">
					<yc-dingd-jiedanCard
						@OrderDetails='clickOrderDetails(item)' 
						@clickOrder='clickOrder(index,4)'
						v-if="screen[0].value==0?true:screen[0].text==item.Type" 
						:CooperativeOrderState='1'
						:order_list='item'>
					</yc-dingd-jiedanCard>
				</template> 	
			</z-paging>
		</swiper-item>
	</swiper>
	<uni-popup ref="popupScreen" type="right"><!-- 筛选 -->
		<yc-order-popup @closeValue='closeScreen' :timeValue='timeData' :caiValue='screen'/>
	</uni-popup>
</template>
<script setup>
	import popupOrderCard from "@/components/common/yc-common-BettingInfo/yc-common-BettingInfo.vue"
	import common from "@/common/common.js";
	import {useCounterStore} from '@/stores/counter'
	import {onShow,onHide} from "@dcloudio/uni-app"
	import api from "@/common/vmeitime-http/index/index.js"
	import {ref,reactive,getCurrentInstance,onBeforeMount,watch} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const orderListData = ref([]) //待接单卡片数据
	const orderListDataX = ref([]) //待出票卡片数据
	const Order_togetherData = ref([]) //合买订单数据
	const order_CooperativeOrderData=ref([])//合作订单数据
	const listCount1 = ref(0) //数字角标的值（待接单）
	const listCount2 = ref(0) //数字角标的值（带出票）
	const listCount3 = ref(0) //数字角标的值（合买）
	const listCount4 = ref(0) //数字角标的值（合作）
	const daohang = reactive(['待接单', '待出票', '合买', '合作']) //分段器title数据
	const daohang_value = ref(0) // 导航默认
	
	const timer=ref(null)//定时器参数
	const statusBarHeight=ref(0)//状态栏高度
	onBeforeMount(()=>{
		counter.clickOrderState=false
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight//获取手机状态栏高度
	})
	onHide(()=>{
		closeClear()
	})
	const openClear=()=>{//开启定时器
		// console.log('✅开启定时器加载');
		if(timer.value==null){
			timer.value=setInterval(()=>{
				try {
					proxy.$refs.refresh.refresh()
				}
				catch(err) {
					closeClear()
				}
			},5000)
		}
	}
	const closeClear=()=>{//关闭定时器
		// console.log('❗关闭定时器加载');
		clearInterval(timer.value)
		timer.value=null
	}
	const list = (pageNo,pageSize) => { //刷新（待接单）
		closeClear()
		api.GetOrderList({
			'state': 1,
			'per_page': pageSize,
			'current_page': pageNo,
			'order':timeData[0].value==0?'PayTime':'Deadline',
		}).then((res) => {
			openClear()
			proxy.$refs.refresh.complete(res.data.data.data)
			listCount1.value = res.data.data.total //待接单的数字角标数据
			counter.shopBasicsData.count.OrderCount=listCount1.value+listCount2.value//设置全局订单角标
			if(res.data.data.total>0){
				uni.setTabBarBadge({
					index:0,
					text:String(counter.shopBasicsData.count.OrderCount)
				})
			}
			if(counter.shopBasicsData.count.OrderCount<=0){uni.removeTabBarBadge({index:0})}
		}).catch(res => {//关闭定时器
			closeClear()
			proxy.$refs.refresh.complete(false)
		})
	}
	const listX = async (pageNo, pageSize) => { //刷新（待出票）
		api.GetOrderList({
			'state': 2,
			'per_page': pageSize,
			'current_page': pageNo,
			'order':timeData[0].value==0?'PayTime':'Deadline',
		}).then((res) => {
			proxy.$refs.refreshX.complete(res.data.data.data)
			listCount2.value = res.data.data.total
			counter.shopBasicsData.count.OrderCount=listCount1.value+listCount2.value//设置全局订单角标
			if(res.data.data.total>0){
				uni.setTabBarBadge({
					index:0,
					text:String(counter.shopBasicsData.count.OrderCount)
				})
			}
			if(counter.shopBasicsData.count.OrderCount<=0){uni.removeTabBarBadge({index:0})}
		}).catch(res => {
			proxy.$refs.refreshX.complete(false)
		})
	}
	const clickOrder_together =(e, t) => { //刷新（合买）
		api.GetOrder_together({
			"state": "0",
			"per_page": t,
			"current_page": e,
			'order':timeData[0].value==0?'PayTime':'Deadline',
		}).then((res) => {
			proxy.$refs.Order_together.complete(res.data.data.data)
			listCount3.value = res.data.data.total
		}).catch(res => {
			proxy.$refs.Order_together.complete(false)
		})
	}
	const CooperativeOrderList=(pageNo,pageSize)=>{//刷新（合作）
		api.GetCooperativeOrderlist({
			"per_page":pageSize,
			"current_page":pageNo,
			'order':timeData[0].value==0?'PayTime':'Deadline',
		}).then((res)=>{
		proxy.$refs.CooperativeOrder.complete(res.data.data.data)
		listCount4.value = res.data.data.total //待接单的数字角标数据
		}).catch(res=>{
			proxy.$refs.CooperativeOrder.complete(false)
		})
	}
	const dianji_qiehuan = (index) => { //点击切换导航
		if (daohang_value != index) {
			daohang_value.value = index
		}
	}
	const onChangeTab = (e) => { //滑动导航栏跟随
		dianji_qiehuan(e.detail.current)
		if(e.detail.current==0){//页面滑动并刷新
			proxy.$refs.refresh.refresh()
		}else if(e.detail.current==1){
			closeClear()
			proxy.$refs.refreshX.refresh()
		}else if(e.detail.current==2){
			closeClear()
			proxy.$refs.Order_together.refresh()
		}else{
			closeClear()
			proxy.$refs.CooperativeOrder.refresh()
		}
	}
	const clickOrderReceiving = (data) => { //点击接单
		closeClear()
		uni.showLoading({title: '接单中~'})
		api.GetOrderReceiving({"order_id": data.order_id}).then((res) => {
			uni.hideLoading()
			if(res.data.code==1){
				counter.orderData = data
				counter.orderData.orderReceivingTime = res.data.data.Receivingtime
				uni.showToast({title:'接单成功',	icon:"success",})
				counter.orderData.State="2"
				uni.navigateTo({
					url:'/pages/indexSupPages/indexSupPages',
					animationType: "slide-in-bottom",
				})
			}else{
				uni.showToast({
					title:'接单失败!',
					icon:'error'
				})
			}
		})
		clickTabValue.value = 1
	}

	/*
	*	onShow一开始就调用刷新会报错，所以搞了一个值点击订单时改变回来就可以刷新页面数据了
	*	不用担心Tab切换会报错，因为Tab切回来会恢复默认值
	*/
	const clickTabValue = ref(0)
	onShow(() => {//页面显示（生命周期）
		if (clickTabValue.value != 0) {
			if(daohang_value.value==0){
				proxy.$refs.refresh.refresh()
			}else if(daohang_value.value==1){
				proxy.$refs.refreshX.refresh()
			}else if(daohang_value.value==2){
				proxy.$refs.Order_together.refresh()
			}else{
				proxy.$refs.CooperativeOrder.refresh()
			}
		}
	})
	watch([listCount1,listCount2],([newValue1,oldValue1],[newValue2,oldValue2])=>{
		//监听数据变化，如是自动接单会等数据加载完在执行自动接单
		if(counter.clickOrderState == true){
			 setTimeout(()=>{
				 orderJudge()
			 },300)
		}
	
	})
	const orderJudge = () => { //自动接单判断
		if(counter.clickOrderState == true){
			if(daohang_value.value==0){
				clickOrder(0,1)
			}else if(daohang_value.value==1){
				clickOrder(0,2)
			}else if(daohang_value.value==2){
				clickOrder(0,3)
			}else{
				counter.clickOrderState==false
				return
			}
		}
	}
	const clickOrderDetails = (data) => { //点击订单详情、
		counter.orderData = data
		uni.navigateTo({
			url: '/pages/indexSupPages/indexSupPages',
			animationType: "slide-in-bottom",
		})

	}
	const clickOrder =(index, e) => { //点击订单空白区域
		if(e==1){
			counter.orderData = orderListData.value[index]
		}else if(e==2){
			counter.orderData = orderListDataX.value[index]
		}else if(e==3){
			counter.orderData = Order_togetherData.value[index]
		}else{
			counter.orderData = order_CooperativeOrderData.value[index]
		}
		if(counter.orderData!=undefined){
			var pageLock=daohang_value.value==3?1:0
			uni.navigateTo({
				url: '/pages/indexSupPages/indexSupPages?order_lock='+pageLock,
				animationType: "slide-in-bottom",
			})
		}else{
			uni.showToast({
				title: '没有订单咯~',
				icon: 'none'
			})
			counter.clickOrderState=false
		}
		clickTabValue.value = 1
	}
	const openScreen = () => { //打开筛选弹窗
		proxy.$refs.popupScreen.open()
	}
	const screen = reactive([{ //筛选弹窗选择彩种的值默认是0
		'text':'全部订单',
		'value':0
	}])
	const timeData=reactive([{//筛选弹窗选择时间的值默认是0
		'text':'下单时间',
		'value':0
	}])
	
	const closeScreen=(cai,time)=>{ //关闭筛选弹窗(并保存上次选择的值，以便下次打开还是上次的值)
		screen[0].text=cai[0].text
		screen[0].value=cai[0].value
		timeData[0].text=time[0].text
		timeData[0].value=time[0].value
		if(daohang_value.value==0){
			proxy.$refs.refresh.reload()
		}else if(daohang_value.value==1){
			proxy.$refs.refreshX.reload()
		}else if(daohang_value.value==2){
			proxy.$refs.Order_together.reload()
		}else{
			proxy.$refs.CooperativeOrder.reload()
		}
		proxy.$refs.popupScreen.close()
	}
	const getdata = (type, index, e) => { //获取订单信息判断取值
		var data = e == 0 ? orderListData.value : e == 1 ? orderListDataX.value :e == 2?Order_togetherData.value:e==3?order_CooperativeOrderData.value:null
		if (type == 'money') {
			return data[index].BetMoney
		}
		if (type == 'title') {
			return data[index].Type
		}
		if (type == 'bei') {
			if (data[index].Type == '竞彩足球' ||
				data[index].Type == '竞彩篮球' ||
				data[index].Type == "北京单场" ||
				data[index].Type == '胜负过关' ||
				data[index].Type == '任选9' ||
				data[index].Type == '胜负彩'
			) {
				return JSON.parse(data[index].BetContent).remarks.Multiple
			} else {
				return 1
			}
		}
		if (type == 'zhu') {
			if (data[index].Type == '竞彩足球' ||
				data[index].Type == '竞彩篮球' ||
				data[index].Type == "北京单场" ||
				data[index].Type == '胜负过关' ||
				data[index].Type == '任选9' ||
				data[index].Type == '胜负彩'
			) {
				return JSON.parse(data[index].BetContent).remarks.Note
			} else {
				if (JSON.parse(data[index].BetContent).length > 0) {
					return JSON.parse(data[index].BetContent).length
				} else {
					return 1
				}
			}
		}
	}
</script>
<style>
	body {
		background-color: #f3f3f3;
	}

	.navigation {
		width: 100%;
		height: 80rpx;
		background-color: #fff;
		border-bottom:1rpx solid #f7f7f7;
	}

	.box {
		width: 186rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		transition: 0.5s;
	}

	.xiabiao {
		position: absolute;
		width: 90rpx;
		height: 7rpx;
		background-color: #FDC830;
		border-radius: 50rpx;
		top: 73rpx;
		left: 45rpx;
		transition: .3s;
	}

	.status_bar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}
</style>
