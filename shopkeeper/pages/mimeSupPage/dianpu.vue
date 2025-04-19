<template>
	<view class="status_bar"></view>
	<!-- <uni-nav-bar title="合作店铺" leftIcon="back" @clickLeft="back()" rightIcon="notification" @clickRight="xinxi" leftText="返回"/> -->
	<pyh-nv :config="config" @nvBtnTap="xinxi"></pyh-nv>

	<scroll-view scroll-x="true" class="navigation">
		
		<view class="bg">
			<view v-for="itme,index in tita" :key="index" @click="dianji_qiehuan(index)" style="margin: auto;">
				<view class="box" :style="index==daohang_value?'color:#FDC830;':''">{{itme}}</view>
			</view>
			<view class="xiabiao" :style="daohang_value==1 ? 'left:515rpx;' : false"></view>
		</view>
	</scroll-view>
	<!-- 内容 -->
	<swiper @change="onChangeTab" :current="daohang_value" :style="{height:common.scrollH()-209-statusBarHeight+'rpx'}"
		easing-function="linear" duration="300">
		<swiper-item>
			<!-- 内容1 -->
			<z-paging ref="IssueShopList" v-model="IssueShopData" @query='IssueShopRefresh'>
				<template v-slot:top>
					<view style="width:100%;background-color: white;">
						<uni-search-bar placeholder="搜索店铺昵称" @input="searchApi(0)" v-model="searchValuer" />
					</view>
					<view class="tishi">
						<text>合作店铺数量({{IssueShopData.length}})</text>
						<!-- <text>总额：0.00</text> -->
					</view>
				</template>
				<yc-dianpu-xinxiCard @clickCard="clickCard(0,itme)" @clickClose='closeShop' :value='0'
					v-for="itme,index in IssueShopData" :shopMoney='itme.CooperativeStoresMoney'
					:shopName='itme.mainStore.nickname' :gameList='itme.gamelist' :shopID='itme.MainStore_id'
					:shopLogo='itme.mainStore.avatar' />
				<template v-slot:bottom>
					<view style="padding:0rpx 20px;">
						<view class="buttomStyle" @click="clickAddShop">添加合作店铺</view>
					</view>
				</template>
			</z-paging>
		</swiper-item>
		<swiper-item>
			<!-- 内容2 -->
			<z-paging ref="IssueShopListTwo" v-model="IssueShopDataTwo" @query='IssueShopRefreshTwo'>

				<template v-slot:top>
					<view style="width:100%;background-color: white;">
						<uni-search-bar placeholder="搜索店铺昵称" @input="searchApi(1) " v-model="searchValuer" />
					</view>
					<view class="tishi">
						<text>合作店铺数量({{IssueShopDataTwo.length}})</text>
						<text>总额：{{jShopMoney.toFixed(2)}}</text>
					</view>
				</template>
				<yc-dianpu-xinxiCard @clickCard="clickCard(1,itme)" @clickClose='closeShop' :value='0'
					v-for="itme,index in IssueShopDataTwo" :shopMoney='itme.CooperativeStoresMoney'
					:shopName='itme.branchStore.nickname' :gameList='itme.gamelist' :shopID='itme.BranchStore_id'
					:shopLogo='itme.branchStore.avatar' />
			</z-paging>

		</swiper-item>
	</swiper>

	<img src="" alt="" />

	<!-- 对话框 -->
	<fui-dialog :show="show" @click="clickDialogButton" :content="closeData"></fui-dialog>
</template>

<script setup>
	
	import common from '@/common/common'
	import api from '@/common/vmeitime-http/mine/mine.js';
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		watch
	} from 'vue';
	import {
		useCounterStore
	} from '@/stores/counter'
	
	import {
		onShow
	} from "@dcloudio/uni-app"
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const back = () => {
		uni.navigateBack()
	}
	
	
	const IssueShopData = ref([]) //甩单管理的刷新数据
	const IssueShopDataTwo = ref([]) //接单管理的刷新数据
	const counter = useCounterStore(); //状态管理
	const statusBarHeight = ref(0) //手机状态栏高度
	const closeData = ref(null) //对话框内容
	const show = ref(false) //对话框显示
	const clickShopId = ref(null) //解除合作店铺的id
	
	const config = ref({
		title:'合作店铺',
		back:{
			hide:false,
			icon:back,
		},
		btn:[
			{text:'',icon:'../../static/img/mimeImg/tuisong.png',badge:{text:counter.shopBasicsData.count.CooperationLog,style:''}},
		]
	})
	
	onBeforeMount(() => {
		uni.showLoading({
			title: '加载中~'
		})
		statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight //获取手机状态栏高度
	})
	const searchValuer = ref("")
	const searchApi = (e) => {
		//搜索框内容变化执行
		proxy.$refs.IssueShopListTwo.refresh()
		proxy.$refs.IssueShopList.refresh()
	}
	const clickDialogButton = (e) => {
		if (e.index == 1) {
			uni.showLoading({
				title: '加载中~'
			})
			api.PostRemove({
				"shop_id": clickShopId.value,
				"type": Number(daohang_value.value) + 1,
				"game_id": ""
			}).then((res) => {
				uni.hideLoading()
				uni.showToast({
					title: res.data.data,
					icon: res.data.msg
				})
				proxy.$refs.IssueShopListTwo.refresh()
				proxy.$refs.IssueShopList.refresh()
			})
		}
		show.value = false
	}

	const closeShop = (shop_id, shopName) => {
		clickShopId.value = shop_id
		closeData.value = '确定解除与(' + shopName + ')的合作吗？'
		show.value = true
	}

	const IssueShopRefresh = () => { //甩单管理的刷新数据
		api.GetIssueShop({
			"search": searchValuer.value,
		}).then((res) => {
			proxy.$refs.IssueShopList.complete(res.data.data)
			uni.hideLoading()
		}).catch(res => {
			proxy.$refs.IssueShopList.complete(false)
			uni.hideLoading()
		})
	}

	const sShopMoney = ref(0)
	const sShopMoneyState = ref(false)
	const jShopMoney = ref(0)
	const jShopMoneyState = ref(false)


	const IssueShopRefreshTwo = () => { //接单管理的刷新数据
		api.GetReceivingStore({
			"search": searchValuer.value,
		}).then((res) => {
			proxy.$refs.IssueShopListTwo.complete(res.data.data)
		}).catch(res => {
			proxy.$refs.IssueShopListTwo.complete(false)
		})
	}
	const dianji_qiehuan = (index) => { //点击切换导航
		if (daohang_value == index) {
			return
		} else {
			daohang_value.value = index
		}
	}

	watch(() => IssueShopData.value, (newValue, oldValue) => { //甩单管理计算出票总金额
		if (sShopMoneyState.value == false) {
			for (var a = 0; a < IssueShopData.value.length; a++) {
				sShopMoney.value += Number(IssueShopData.value[a].CooperativeStoresMoney)
			}
			sShopMoneyState.value = true
		}
	})

	watch(() => IssueShopDataTwo.value, (newValue, oldValue) => { //接单计算出票总金额
		if (jShopMoney.value == false) {
			for (var a = 0; a < IssueShopDataTwo.value.length; a++) {
				jShopMoney.value += Number(IssueShopDataTwo.value[a].CooperativeStoresMoney)
			}
			jShopMoneyState.value = true
		}
	})


	const daohang_value = ref(0)
	const onChangeTab = (e) => { //滑动导航栏跟随
		dianji_qiehuan(e.detail.current)
	}
	const tita = reactive(['甩单管理', '接单管理']) //分段器title数据

	const clickCard = (pageIndex, itme) => { //店铺详细
		counter.cooperationShopData = itme
		uni.navigateTo({
			url: '/pages/mimeSupPage/dianpuSupPage/dianpuSupPage?pageIndex=' + pageIndex
		})
	}

	const xinxi = () => { //合作申请记录
		uni.navigateTo({
			url: '/pages/mimeSupPage/dianpuSupPage/applicationPage',
			animationType: "slide-in-bottom",
		})
	}
	const clickAddShop = () => { //点击添加合作店铺
		uni.navigateTo({
			url: 'dianpuSupPage/addShop/addShop',
			animationType: "slide-in-bottom",
		})
	}
</script>

<style>
	.buttomStyle {
		width: 100%;
		height: 80rpx;
		background-color: #FDC830;
		border-radius: 15rpx;
		text-align: center;
		line-height: 80rpx;
		color: white;
		margin: 20rpx 0rpx;
	}

	.tishi {
		width: 710rpx;
		height: 50rpx;
		font-size: 22rpx;
		color: #818181;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: auto;
	}

	.leftData {
		display: flex;
		align-items: flex-start;
		width: 670rpx;
		justify-content: space-between;
		margin-left: 10rpx;
	}

	.userCard {
		width: 100%;
		height: 160rpx;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #d1d1d1;
	}

	.navigation {
		width: 100%;
		height: 80rpx;
		background-color: #fff;
	}

	.box {
		width: 186rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		transition: .3s;
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

	body {
		background-color: #f3f3f3;
	}



	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>