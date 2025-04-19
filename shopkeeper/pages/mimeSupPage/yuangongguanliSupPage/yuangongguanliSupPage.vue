<template>
	<view class="status_bar"></view>
	<uni-nav-bar title="员工彩种管理" leftIcon="closeempty" @clickLeft="back"/>
	
	<scroll-view scroll-y="true" :style="{height:common.scrollH()-160-statusBarHeight+'rpx'}">
		<view 
			class="yuangongList" 
			v-for="itme,index in gameState" 
			@click="popupGame(index)"
		>
			<view style="display: flex;height:100%;align-items: center;">
				<image :src="counter.baseUrl+itme.game.image" style="width:80rpx;height:80rpx;" mode="scaleToFill"></image>
				<view style="margin-left:20rpx;">
					<text>{{itme.game.title}}</text><br>
					<text style="font-size:26rpx;color:#909090;">{{buttomData[itme.data['state']]}}</text>
				</view>
			</view>
			<view>
				<uni-icons type="forward"></uni-icons>
			</view>
		</view>
	</scroll-view>
	<uni-popup ref="gameStateRef" type="center" :isMaskClick="false">
		<view class="popupStyle2">
			<view style="text-align: center;font-weight:bold;">
				<text style="text-align: center;font-size:32rpx;">{{selectGameData.game.title}}</text>
			</view>
			<radio-group @change="clickSelect">
				<view class="buttomStyle" v-for="itme,index in buttomData">
					<radio :value="String(index)" :checked="selectGameData.data.state==index">
						<text>{{itme}}</text>
					</radio>
				</view>
			</radio-group>
			<view style="display: flex;align-items: center;" v-if="submitSelectValue==2">
				<uni-number-box 
					:min="2" 
					v-model="selectGameData.data.minMoney" 
					:max="999998"  :step='10'
				/>
				<text>~</text>
				<uni-number-box 
					v-model="selectGameData.data.maxMoney" 
					:max="999999" :step='10'
				/>
			</view>
			<view class="buttonBox">
				<view class="customButtonStyle" style="background-color: #eeeeee;color:#888888;" @click="closePopup">
					取消
				</view>
				<view class="customButtonStyle" style="background-color:#FDC830;" @click="submit">
					保存
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import common from '@/common/common'
	import api from '@/common/vmeitime-http/mine/mine.js';
	import {useCounterStore} from '@/stores/counter'
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const gameState=reactive([])//全部玩法的基础数据
	const statusBarHeight=ref(0)
	const buttomData=reactive(['不限制金额','拒绝接单','允许接单但要限制金额'])
	const selectGameData=ref([])//点击玩法的信息
	const selectIndex=ref(0)
	
	onBeforeMount(()=>{
		for(var i=0;i<counter.EmployeeData.clerkConfig.gamelist.length;i++){
			gameState.push(counter.EmployeeData.clerkConfig.gamelist[i])
		}
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight//获取手机状态栏高度
	})
	const back=()=>{//返回
		uni.navigateBack()
	}
	
	const popupGame=(index)=>{//点击玩法打开弹窗
		selectGameData.value=[]
		selectGameData.value=gameState[index]
		selectIndex.value=index
		submitSelectValue.value=gameState[index].data.state
		uni.showLoading({title:'加载中',mask:true})
		setTimeout(()=>{
			console.log(selectGameData.value);
			uni.hideLoading()
			proxy.$refs.gameStateRef.open()
		},200)
	}
	
	const submitSelectValue=ref(0)//存储用户点击的选项的index
	
	const closePopup=()=>{
		proxy.$refs.gameStateRef.close()
	}
	const clickSelect=(e)=>{
		submitSelectValue.value=Number(e.detail.value)
	}
	const submit=()=>{//提交
		uni.showLoading({title: '加载中~'})
		api.GetColorEditing({
			"id":counter.EmployeeData.id,
			"gameIndex":selectGameData.value.game.id,
			"value":submitSelectValue.value,
			"minMoney":selectGameData.value.data.minMoney,
			"maxMoney":selectGameData.value.data.maxMoney
		}).then((res)=>{
			uni.hideLoading()
			closePopup()
			if(res.data.code==1){
				gameState[selectIndex.value].data.state=submitSelectValue.value
				uni.showToast({
					title:'提交成功~',
					icon:'success'
				})
			}else{
				uni.showToast({
					title:'提交失败~',
					icon:'error'
				})
			}
		})
	}
</script>

<style>
	.buttonBox{
		display: flex;
		justify-content: space-between;
		margin-top:40rpx;
		transition:.2s;
	}
	.customButtonStyle{
		width:280rpx;
		height:70rpx;
		text-align: center;
		border-radius:5rpx;
		line-height:70rpx;
		color: white;
		
	}
	.buttomStyle{
		margin:20rpx 0rpx;
		display: flex;
		width:700rpx;
		justify-content: space-between;
	}
	.popupStyle2{
		width:680rpx;
		padding:20rpx;
		background-color: white;
		border-radius:25rpx;
	}
	.yuangongList{
		width:680rpx;
		height:110rpx;
		margin:auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom:1rpx solid #f1f1f1;
	}
	.status_bar{
		background-color:white;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
