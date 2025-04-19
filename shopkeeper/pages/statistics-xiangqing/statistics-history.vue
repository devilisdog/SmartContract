<template>
	<view class="status_bar"></view>
	<!-- 头部 -->
	<uni-nav-bar title="历史记录" leftIcon="back" right-text="状态" @clickLeft="back()" @clickRight="open()" leftText="返回"/>
	<!-- 弹出层内容 -->
	<uni-popup ref="popup" type="bottom" :animation="true" @click.stop mask-background-color='rgba(50, 50, 50, 0.5)'>
		<view style="width: 100%;height: 300rpx;background-color: #ffffff;border-radius: 30rpx 30rpx 0 0;">
			<view class="xz" @click="open_01(index)"
				:style="clickText == index ? 'color:#cacaca;pointer-events:none;' : 'color:#000000;' "
				v-for="itme,index in open_text" :key="index"
			>
				{{itme}}
			</view>
			<!-- 取消 -->
			<view style="width: 100%;height:22rpx ;background-color: #f4f4f4;"></view>
			<view class="qx" @click="proxy.$refs.popup.close()">
				<text style="color: #535353 ;">取消</text>
			</view>
		</view>
	</uni-popup>

	<!-- 导航 -->
	<view style="width: 100%;height: 100rpx;background-color: #fff;">
		<scroll-view>
			<view class="tab">
				<view
					@click="dianji_qiehuan(0)"
					class="dh" 
					:style="daohang_value == 0 ? 'background-color: #FDC830;color:#fff;border-radius: 25rpx 0 0 25rpx;'
					: 'border-radius: 25rpx 0 0 25rpx;'"
				>
					<text>{{daohang[0]}}</text>
				</view>
			
				<view
					@click="dianji_qiehuan(1)"
					class="dh" 
					:style="daohang_value == 1 ? 'background-color: #FDC830;color:#fff;border-radius: 0rpx 25rpx 25rpx 0rpx;'
					: 'border-radius: 0rpx 25rpx 25rpx 0rpx;'"
				>
					<text>{{daohang[1]}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
	<swiper 
		@change="onChangeTab" 
		:current="daohang_value" 
		easing-function='easeInOutCubic' 
		:style="{height:common.scrollH()-209-statusBarHeight+'rpx'}"
		duration="300"
	>
		<swiper-item>
			<z-paging ref="drawings" v-model="drawingsData" @query='drawingsList'>
				<yc-all-tixiangCard 
					v-for="itme,index in drawingsData"
					:data="itme"
					>
				</yc-all-tixiangCard>
			</z-paging>
		</swiper-item>
		
		
		<swiper-item>
			<z-paging ref="drawingsShop" v-model="drawingsShopData" @query='drawingsShopList'>
				<yc-all-tixiangCard
					v-for="itme,index in drawingsShopData"
					:data="itme"
					>
				</yc-all-tixiangCard>
			</z-paging>
		</swiper-item>
	</swiper>

</template>
<script setup>
	import api from "@/common/vmeitime-http/satistics/satistcs.js"
	import common from "@/common/common.js"
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
		defineProps
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	// 返回到上一个页面
	const back = () => {//放回
		uni.navigateBack()
	}
	const topup = ref(false) //弹出层点击关闭
	// 弹出层点击
	const open_text = ref(['已结算','已撤销'])//状态弹窗数据
	const clickText=ref(0)//弹窗点击后选项的index
	
	const drawingsData=ref([])//店内提现数据
	const drawingsShopData=ref([])//合作店铺数据
	const statusBarHeight=ref(0)//状态栏高度
	const Props=defineProps(['time'])
	const drawingsList=(pageNo,pageSize)=>{//店内提现
		api.GetHistory({
			"type":"1",
			"state":clickText.value+1,
			"startTime":Props.time!=undefined?Props.time.split(',')[0]:'',
			"endTime":Props.time!=undefined?Props.time.split(',')[1]:'',
			"per_page":pageSize,
			"current_page":pageNo
		}).then((res)=>{
			proxy.$refs.drawings.complete(res.data.data.data)
		}).catch(res=>{
			proxy.$refs.drawings.complete(false)
		})
	}
	
	const drawingsShopList=(pageNo,pageSize)=>{//店内提现
		api.GetHistory({
			"type":"2",
			"state":clickText.value+1,
			"startTime":Props.time!=undefined?Props.time.split(',')[0]:'',
			"endTime":Props.time!=undefined?Props.time.split(',')[1]:'',
			"per_page":pageSize,
			"current_page":pageNo
		}).then((res)=>{
			proxy.$refs.drawingsShop.complete(res.data.data.data)
		}).catch(res=>{
			proxy.$refs.drawingsShop.complete(false)
		})
	}
	
	const open_01 = (e) => {//弹窗点击选项
		clickText.value=e
		proxy.$refs.drawings.refresh()
		proxy.$refs.drawingsShop.refresh()
		proxy.$refs.popup.close()

	}
	// 弹出层
	const open = () => {//弹出状态弹窗
		proxy.$refs.popup.open()
	}
	onBeforeMount(()=>{
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight//获取手机状态栏高度
	})
	//导航栏
	const daohang_value = ref(0)
	const daohang = reactive(['店内提现','合作店铺提现'])//tab数据
	
	//导航栏点击
	// const daohang_moren =ref(0) 
	const dianji_qiehuan = (index) =>{ //点击切换导航
		daohang_value.value=index
	}
	const onChangeTab = (e) =>{		//滑动导航栏跟随
		dianji_qiehuan(e.detail.current)
	}

	
</script>
<style>
	.tab{
		display: flex;
		flex-direction: row;
		width: 690rpx;
		margin:20rpx auto;
		font-size: 28rpx;
		color: #FDC830;
		justify-content: center;
	}
	button::after {
		border: initial;
	}

	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}

	body {
		background-color: #f7f7f7;
	}

	.xz {
		width: 600;
		height: 95rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 30rpx 30rpx 0 0;
	}

	.xz:active {
		background: rgba(104, 104, 104, 0.1);
	}

	.qx {
		width: 100%;
		height: 90rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.qx:active {
		background: rgba(104, 104, 104, 0.1);
	}
	.dh {
		width: 260rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1rpx solid #FDC830;
	}
	.dh_02 {
		background-color: #FDC830;
		color:#fff;
		border-radius: 25rpx 0 0 25rpx;
		border: 1rpx solid #FDC830;
	}
</style>
