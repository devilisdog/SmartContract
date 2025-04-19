<template>
	<view class="status_bar"></view>
	<!-- 头部 -->
	<uni-nav-bar title="彩种管理" leftIcon="back" @clickLeft="back()" leftText="返回"/>
	<!-- 提示 -->
	<view style="width: 100%; height: 50rpx;background-color: #fffacf ;">
		<text style="line-height: 50rpx;font-size: 24rpx;margin-left: 20rpx; color: #2f2f2f ;">
			彩种管理：开关彩种功能后，将对用户开启/关闭相应功能
		</text>
	</view>
	<!-- 玩法开启 -->
	<view class="topTitle">
		<text style="font-size: 24rpx;padding-left: 20rpx;">玩法开启</text>
	</view>
	<!-- 内容 -->
	<template v-for="itme,index in playingSetList" :key="index" >
		<view class="biaoqian"
			  @click="open(itme,index)"
			  v-if="itme.gamestate=='1' && itme.systemsgamelist.state=='1'"
			>
			<view style="width: 150rpx;height: 125rpx;display: flex;align-items: center;justify-content: center;">
				<image :src='counter.baseUrl+itme.systemsgamelist.image' style="width: 80rpx;height: 80rpx;"></image>
			</view>
			<view style="display: flex;flex-direction: column;line-height: 50rpx;width: 500rpx;">
				<text style="font-size: 26rpx; color: #303030;">{{itme.systemsgamelist.title}}</text>
				<view style="color: #9e9e9e;font-size:22rpx;">
					<text style="font-size:22rpx;">最小投注金额</text>
					<text style="color: red;font-size:22rpx;">{{itme.MinBetAmount}}</text>
					<text style="font-size:22rpx;">元, 停售前{{itme.advance}}分钟截止投注</text>
				</view>
			</view>
			<view style="height: 125rpx;line-height: 125rpx;margin-left: 45rpx;">
				<uni-icons type="right" color="#9e9e9e"></uni-icons>
			</view>
		</view>
	</template>
	
	<!-- 玩法关闭 -->
	<view style="width: 100%;height: 50rpx;background-color: #eeeeee;line-height: 50rpx;">
		<view class="topTitle">
			<text style="font-size: 24rpx;padding-left: 20rpx;">玩法关闭</text>
		</view>
		<template v-for="itme,index in playingSetList" :key="index" >
			<view class="biaoqian"
				  @click="open(itme,index)"
				  v-if="itme.gamestate=='0' || itme.systemsgamelist.state=='0'"
				>
				<view style="width: 150rpx;height: 125rpx;display: flex;align-items: center;justify-content: center;">
					<image :src='counter.baseUrl+itme.systemsgamelist.image' style="width: 80rpx;height: 80rpx;"></image>
				</view>
				<view style="display: flex;flex-direction: column;line-height: 50rpx;width: 500rpx;">
					<text style="font-size: 26rpx; color: #303030;">{{itme.systemsgamelist.title}}</text>
					<view style="color: #9e9e9e ; font-size:22rpx;">
						<text>最小投注金额</text>
						<text style="color: red;">{{itme.systemsgamelist.MinBetAmount}}</text>
						<text>元, 停售前{{itme.systemsgamelist.advance}}分钟截止投注</text>
					</view>
				</view>
				<view style="height: 125rpx;line-height: 125rpx;margin-left: 45rpx;"
					><uni-icons type="right" color="#9e9e9e"></uni-icons>
				</view>
			</view>
		</template>
	</view>
	<!-- 弹出层内容 -->
	<uni-popup ref="popup" 
			   type="bottom" 
			  :animation="true" 
			  @click.stop mask-background-color='rgba(0, 0, 0, 0.8)' 
			  @change="clickClose">
			  
		<view style="width: 100%;background-color: #fff;border-radius: 25rpx 25rpx 0 0;padding:0 0 80rpx 0;">
			<yc-CategoryManagement-open :switchData='switchValue'></yc-CategoryManagement-open>
		</view>
	</uni-popup>
</template>

<script setup>
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
		defineProps, // 接收
		defineEmits, // 发送
	} from 'vue';
	import api from '@/common/vmeitime-http/mine/mine.js';
	import {useCounterStore} from '@/stores/counter'
	const counter = useCounterStore(); //状态管理
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	// 返回到上一个页面
	const back = () => {
		uni.switchTab({
			url: '/pages/index/mine',
			animationType: 'none',
			animationDuration: 0
		});
	}
	// 弹出层
	const switchValue=reactive([])
	const open = (item,e) => {
		switchValue.data=item
		proxy.$refs.popup.open('bottom')
	}
	const playingSetList=ref([])
	const gitdata=()=>{
		uni.showLoading({title:'加载中~'})
		api.GetplayingSetList({}).then((res)=>{
			playingSetList.value=res.data.data
			uni.hideLoading()
		})
	}
	onBeforeMount(()=>{
		gitdata()
	})
	const clickClose=(e)=>{
		if(e.show==false){
			gitdata()
		}
	}
	
</script>

<style>
	.topTitle{
		width: 100%;
		height: 50rpx;
		background-color: #eeeeee;
		line-height: 50rpx;
		position: -webkit-sticky;
		position: sticky;
		top:var(--status-bar-height);
		z-index: 2;
	}
	.biaoqian{
		width:100%;
		height: 125rpx;
		border-bottom: 1rpx solid #eaeaea;
		display: flex;
		align-items: center;
	}
	.biaoqian:active{
		background-color: #f4f4f4;
	}
	.status_bar{
		background-color:white;
		height: var(--status-bar-height);
		width: 100%;
		position: -webkit-sticky;
		position: sticky;
		top:0;
		z-index: 2;
	}
</style>
 