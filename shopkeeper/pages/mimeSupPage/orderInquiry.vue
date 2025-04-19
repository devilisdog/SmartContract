<template>
	<view class="status_bar"></view>
	<uni-nav-bar title="订单查询" leftIcon="left" @clickLeft="fanghui" rightIcon="tune" @clickRight="open()"  leftText="返回"/>
	<!-- 分段条 -->
	<scroll-view scroll-x="true" class="navigation">
		<view class="bg">
			<view v-for="itme,index in tita" :key="index" @click="dianji_qiehuan(index)" style="margin: auto;">
				<view class="box" :style="index==daohang_value?'color:#FDC830;':''">{{itme}}</view>
			</view>
			<view class="xiabiao" :style="daohang_value==0 ? 'left:80rpx;' : daohang_value==1 ?'left:330rpx;':'left:580rpx;'">
			</view>
		</view>
	</scroll-view>
	<!-- 内容 -->
	<swiper @change="onChangeTab" :current="daohang_value" :style="{height:common.scrollH()-210-statusBarHeight+'rpx'}"
		easing-function="linear" duration="300">
		
		<swiper-item style="display: flex;"><!-- 内容1 -->
			<z-paging ref="shop_order" @query='shop_list' v-model="shopOrderList" :auto-show-back-to-top='true'>
				<template v-slot:top>
					<view style="background-color: white;">
						<uni-search-bar @input="searchValue" placeholder="通过订单号进行搜索"/>
					</view>
				</template>
				<template v-for="itme,index in shopOrderList" :key="index">
					<yc-mime-orderCard
						v-show="lastTimeData['彩种'].title=='全部订单'?true:itme.Type==lastTimeData['彩种'].title"
						:order_list='itme'
					/>
				</template>
			</z-paging>
			
		</swiper-item>
		
		<swiper-item style="display: flex;"><!-- 内容2 -->
			<z-paging ref="receive_order" 
					  @query='receive_list' 
					  v-model="receiveOrderList" 
					  :auto-show-back-to-top='true'
					  :auto='false'>
			    <template v-slot:top>
					<view style="background-color: white;">
						<uni-search-bar @input="receiveValue" placeholder="通过订单号进行搜索"/>
					</view>
			    </template>
				<template v-for="itme,index in receiveOrderList" :key="index">
					<yc-mime-orderCard
						v-if="lastTimeData['彩种'].title=='全部订单'?true:itme.Type==lastTimeData['彩种'].title"
						:order_list='itme'
					/>
				</template>
				
			</z-paging>
		</swiper-item>
		
		<swiper-item style="display: flex;"><!-- 内容3 -->
			<z-paging ref="sd_order" 
					  @query='sd_list' 
					  v-model="sdOrderList" 
					  :auto-show-back-to-top='true'
					  :auto='false'>
			    <template v-slot:top>
					<view style="background-color: white;">
						<uni-search-bar @input="receiveValue" placeholder="通过订单号进行搜索"/>
					</view>
			    </template>
				<template v-for="itme,index in sdOrderList" :key="index">
					<yc-mime-orderCard
						v-if="lastTimeData['彩种'].title=='全部订单'?true:itme.Type==lastTimeData['彩种'].title"
						:order_list='itme'
					/>
				</template>
				
			</z-paging>
		</swiper-item>
	</swiper>
	<uni-popup ref="popup" type="right">
		<!-- 弹窗 -->
		<view style="margin-top:var(--status-bar-height);">
			<yc-all-Sizer @confirm='classifyConfirm' :lastTimeData='lastTimeData'/>
		</view>
	</uni-popup>
</template>

<script setup>
	import common from '@/common/common'
	import api from '@/common/vmeitime-http/mine/mine.js';
	import {useCounterStore} from '@/stores/counter'
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		defineProps,
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const daohang_value = ref(0)//swiper页面默认值
	const tita = reactive(['店内订单', '接单订单','甩单订单']) //分段器title数据
	const shopOrderList=ref([])
	const receiveOrderList=ref([])
	const sdOrderList=ref([])
	const Props=defineProps(['orderState'])
	const fanghui = () => { //返回按钮
		uni.navigateBack()
	}
	const statusBarHeight=ref(0)
	onBeforeMount(()=>{
		if(Props.orderState!=undefined){
			lastTimeData.value['状态'].index=Props.orderState
			lastTimeData.value['状态'].title='已派奖'
		}
		uni.showLoading({title:'加载中~'})
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight//获取手机状态栏高度
	})
	
	const shop_list = (ye,allye) => {//店内订单刷新
		var dictionaries=['99','1','2','9','3','8','9',"10"]
		api.GetAllOrderList({
			"state":dictionaries[lastTimeData.value['状态'].index],
			"per_page":allye,
			"type":"0",
			"search":shopSearch.value,
			"current_page":ye,
			"startTime":lastTimeData.value['时间'][0],
			"endTime":lastTimeData.value['时间'][1],
		}).then((res)=>{
			proxy.$refs.shop_order.complete(res.data.data.data)
			uni.hideLoading()
		}).catch(res=>{
			proxy.$refs.shop_order.complete(false)
			uni.hideLoading()
		})
	}
	const shopSearch=ref(null)//店内搜索框值
	const searchValue=(e)=>{//店内搜索框值变化执行
		shopSearch.value=e
		proxy.$refs.shop_order.reload()
	}
	const recevieSearch=ref(null)
	const receiveValue=(e)=>{
		recevieSearch.value=e
		proxy.$refs.receive_order.reload()
	}
	const receive_list = (ye,allye) => {//刷新
		var dictionaries=['99','1','2','9','3','8','9',"10"]
		api.GetAllOrderList({
			"state":dictionaries[lastTimeData.value['状态'].index],
			"per_page":allye,
			"type": "1",
			"current_page":ye,
			"search":recevieSearch.value,
			"startTime":lastTimeData.value['时间'][0],
			"endTime":lastTimeData.value['时间'][1],
		}).then((res)=>{
			proxy.$refs.receive_order.complete(res.data.data.data)
			uni.hideLoading()
		}).catch(res=>{
			proxy.$refs.receive_order.complete(false)
			uni.hideLoading()
		})
	}
	
	const sd_list = (ye,allye) => {//刷新
		var dictionaries=['99','1','2','9','3','8','9',"10"]
		api.GetAllOrderList({
			"state":dictionaries[lastTimeData.value['状态'].index],
			"per_page":allye,
			"type": "2",
			"current_page":ye,
			"search":recevieSearch.value,
			"startTime":lastTimeData.value['时间'][0],
			"endTime":lastTimeData.value['时间'][1],
		}).then((res)=>{
			proxy.$refs.sd_order.complete(res.data.data.data)
			uni.hideLoading()
		}).catch(res=>{
			proxy.$refs.sd_order.complete(false)
			uni.hideLoading()
		})
	}
	
	
	const lastTimeData=ref({
		'彩种':{
			title:'全部订单',
			index:0
		},
		'时间':[],
		'状态':{
			title:'全部订单',
			index:0
		}
	})
	
	
	const classifyConfirm=(screenArr)=>{
		uni.showLoading({title:'加载中~'})
		lastTimeData.value['彩种'].index=screenArr['彩种'].index
		lastTimeData.value['彩种'].title=screenArr['彩种'].title
		lastTimeData.value['状态'].index=screenArr['状态'].index
		lastTimeData.value['状态'].title=screenArr['状态'].title
		proxy.$refs.shop_order.refresh()
		proxy.$refs.popup.close()
	}
	
	const receive_order_refresh=ref(false)//此页面是否加载了数据（加载过后续再次滑动到此页面就不会触发获取数据）
	
	const dianji_qiehuan = (index) => { //点击切换导航
		if (daohang_value == index) {
			return
		} else {
			if(index==1 && receive_order_refresh.value==false){
				uni.showLoading({title:'加载中~'})
				receive_order_refresh.value=true
				proxy.$refs.receive_order.refresh()
			}
			daohang_value.value = index
		}
	}
	
	
	
	const onChangeTab = (e) => { //滑动导航栏跟随
		dianji_qiehuan(e.detail.current)
	}

	const clickIndex = (e) => { //分段器的判断
		proxy.index = e
	}
	
	const open = () => { //弹窗控制(开)
		proxy.$refs.popup.open()
	}
</script>

<style>
	.box {
		width: 186rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		transition: .3s;
	}

	.navigation {
		width: 100%;
		height: 80rpx;
		background-color: #fff;
	}

	.bg {
		display: flex;
	}

	.xiabiao {
		position: absolute;
		width: 90rpx;
		height: 7rpx;
		background-color: #FDC830;
		/* z-index: -1; */
		border-radius: 50rpx;
		top: 73rpx;
		left: 140rpx;
		transition: .3s;
	}

	.bottmStyle {
		display: flex;

		justify-content: space-around;
		bottom: 0rpx;
		position: fixed;
		margin-left: 45rpx;
	}

	.caibottom {
		width: 175rpx;
		height: 55rpx;
		font-size: 22rpx;
		display: flex;
		justify-content: center;
		margin: 7rpx 7rpx;
		border-radius: 7rpx;
	}

	.caibuttom {
		width: 175rpx;
		height: 55rpx;
		font-size: 22rpx;
		display: flex;
		justify-content: center;
		margin: 7rpx 7rpx;
		border-radius: 7rpx;

	}

	.popup {
		width: 600rpx;
		height: 100%;
		background-color: white;
		border-top-left-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
		padding: 50rpx 10rpx;
	}

	.status_bar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}

	body {
		background-color: #f3f3f3;
	}
</style>
