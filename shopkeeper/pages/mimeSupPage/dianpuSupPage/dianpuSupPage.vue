<template>
	<view class="status_bar"></view>
	<uni-nav-bar title="店铺详细" leftIcon="back" @clickLeft="back" rightText="历史记录" @clickRight="lishi" leftText="返回" />
	<view class="topCard">
		<view style="display: flex;align-items: center;justify-content: space-between;padding-top:20rpx;">
			<view style="display: flex;margin-left:20rpx;">
				<image 
					:src="Props.pageIndex==0?counter.cooperationShopData.mainStore.avatar:counter.cooperationShopData.branchStore.avatar" 
					style="width:110rpx;height:110rpx;border-radius:10rpx;" />
				<view style="display: flex;flex-flow: column;justify-content: space-between;margin-left:10rpx;">
					<view>{{Props.pageIndex==0?counter.cooperationShopData.mainStore.nickname:counter.cooperationShopData.branchStore.nickname}}</view>
					<view style="color: #888888;font-size: 26rpx;">ID：
						{{Props.pageIndex==0?counter.cooperationShopData.mainStore.id:counter.cooperationShopData.branchStore.id}}
					</view>
				</view>
			</view>
			<view style="color:#FDC830;margin-right:20rpx;" 
				  @click="phone(Props.pageIndex==0?counter.cooperationShopData.mainStore.mobile:counter.cooperationShopData.branchStore.mobile)">
				<uni-icons type="phone-filled" color="#FDC830"></uni-icons>
				<text>联系店主</text>
			</view>
		</view>
		<view style="display: flex;justify-content: space-between;width:725rpx;margin:30rpx auto;" @click="shopDetail">
			<text>合作店铺余额</text>
			<view>
				<text style="font-weight: 600;">￥ {{counter.cooperationShopData.CooperativeStoresMoney}}</text>
				<uni-icons type="forward"></uni-icons>
			</view>
		</view>
		<view class="buttonStyle">
			<view class="button"  style="background-color: #eeeeee;" @click="open(1)">
				<text style="color:#888888;">
					{{Props.pageIndex==1?'扣款':'提现'}}
				</text>
			</view>
			<view style="width:2rpx;height:50rpx;background-color: #b0b0b0;"></view>
			<view class="button" style="background-color:#FDC830;" @click="open(0)">
				<text style="color:white;">
					{{Props.pageIndex==1?'加款':'充值'}}
				</text>
			</view>
		</view>
	</view>
	<view style="width:100%;height:50rpx;background-color: #fdf2ea;font-size:26rpx;line-height:50rpx;">
		<text style="margin-left:20rpx;">点击玩法右滑可取消合作玩法</text>
	</view>
	<scroll-view :scroll-y="true" style="background-color: #FDC830;max-height:1000rpx;">
		<uni-swipe-action>
			<uni-swipe-action-item 
				v-for="itme,index in counter.cooperationShopData.gamelist" 
				:right-options="options"
				@click='cancelGame(itme,index,itme.id)'
			>
				<yc-dianpuxiaoxi-card
					:gameList='itme'
					:gameIndex='index'
					:pageIndex='Props.pageIndex'
				/>
			</uni-swipe-action-item>
		</uni-swipe-action>
	</scroll-view>
	<view style="position: fixed;bottom:10rpx;width:100%;" v-if="Props.pageIndex==0">
		<view style="padding:0rpx 30rpx;">
			<view class="buttomStyle" @click="addGame">添加合作玩法</view>
		</view>
	</view>
	
	<uni-popup type="center" ref="popup" v-if="Props.pageIndex==1">
		<view class="popupCard">
			<view style="display: flex;justify-content:flex-end;margin-top:10rpx;width:730rpx;">
				<uni-icons type="closeempty" size="48rpx" @click="proxy.$refs.popup.close()"></uni-icons>
			</view>
			<view style="text-align: center;font-weight:600;">
				<text v-show="popupValue==0" style="color: red;">加款需谨慎，慎防p图，及时核实是否到账</text>
				<text v-show="popupValue==1">扣款</text>
			</view>
			<view style="display: flex;margin:20rpx 20rpx;height:80rpx;align-items: center;border-bottom: 1rpx solid #d8d8d8;">
				<text style="color:#888888;">金额：</text>
				<input placeholder="请输入金额,最高5万" type="number" style="margin-left:100rpx;" v-model="setMoney"/>
			</view>
			<view style="display: flex;margin:20rpx 20rpx;height:80rpx;align-items: center;border-bottom: 1rpx solid #d8d8d8;">
				<text style="color:#888888;">备注：</text>
				<input placeholder="请输入备注" type="text" style="margin-left:100rpx;" v-model="remark"/>
			</view>
			<view style="width:600rpx;margin:auto;padding-top:20rpx;" >
				<view class="buttomStyle" @click="operation(popupValue)" v-show="popupValue==0">提交</view>
				<button type="warn" v-show="popupValue==1" @click="operation(popupValue)">提交</button>
			</view>
		</view>
	</uni-popup>
	
	<!-- 对话框 -->
	<fui-dialog :show="show" @click="clickDialogButton" :content="closeData"></fui-dialog>
</template>

<script setup>
	import common from '@/common/common'
	import api from "@/common/vmeitime-http/mine/mine.js"
	import {ref,onBeforeMount,reactive,getCurrentInstance,defineProps} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	import {useCounterStore} from '@/stores/counter'
	const counter = useCounterStore(); //状态管理
	const Props=defineProps(['pageIndex'])
	const show=ref(false)//对话框显示
	const closeData=ref(null)//对话框提示内容
	const closeGameData=ref([])//选择取消合作玩法数据
	const closeGanmeIndex=ref(null)//选择取消合作玩法index
	const options=reactive([//右滑按钮
		{
			text:'取消此玩法',
			style:{
				 backgroundColor: 'red'
			}
		}
	])
	const clickDialogButton=(e)=>{
		if(e.index==1){
			uni.showLoading({title:'解除中~'})
				api.PostRemove({
					"shop_id":Props.pageIndex==0?closeGameData.value.MainStore_id:closeGameData.value.BranchStore_id,
					"type":Number(Props.pageIndex)+1,
					"game_id":closeGameData.value.game_id
				}).then((res)=>{
					uni.hideLoading()
					uni.showToast({
						title:res.data.data,
						icon:res.data.msg
					})
					if(res.data.code==1){
						// console.log(closeGanmeIndex.value);
						counter.cooperationShopData.gamelist.splice(closeGanmeIndex.value,1)
					}
				})
		}
		show.value=false
	}
	const cancelGame=(gameData,index,id)=>{
		closeGameData.value=gameData
		closeGanmeIndex.value=index
		
		closeData.value='确定解除'+'('+gameData.gameInfo.title+')'+'玩法的合作吗？'
		show.value=true
	}
	const back=()=>{
		uni.navigateBack()
	}
	const lishi=()=>{
		var id=0
		if(Props.pageIndex==0){
			id=counter.cooperationShopData.MainStore_id
		}else{
			id=counter.cooperationShopData.branchStore.id
		}
		uni.navigateTo({
			url:'/pages/mimeSupPage/dianpuSupPage/historyPage?shop_id='+id+ '&pageIndex='+Props.pageIndex
		})
	}
	
	const popupValue=ref()
	const open=(e)=>{
		if(Props.pageIndex==0){
			if(e==0){
				uni.navigateTo({//充值页面
					url:'../../mimeSupPage/balancePage/rechargePage?transferShopData='+JSON.stringify(counter.cooperationShopData)
				})
			}else{
				uni.navigateTo({//提现页面
					url:'../../mimeSupPage/balancePage/drawMoney/drawMoney?shop_id='+counter.cooperationShopData.mainStore.id+'&shop_money='+counter.cooperationShopData.CooperativeStoresMoney
				})
				
			}
		}else{
			proxy.$refs.popup.open()
			popupValue.value=e
			setMoney.value=''
			remark.value=''
		}
		
	}
	const setMoney=ref('')
	const remark=ref('')
	const operation=(e)=>{
		var buttonState=e==0?'Add':'Del'
		var id=0
		if(Props.pageIndex==0){
			id=counter.cooperationShopData.MainStore_id
		}else{
			id=counter.cooperationShopData.branchStore.id
		}
		if(setMoney.value!='' && Props.pageIndex==1){
			uni.showLoading({title:'操作中~'})
			api.PostEditBalance({
				"shop_id":id,
				"type":buttonState,
				"value":setMoney.value
			}).then((res)=>{
				if(res.data.code==1){
					uni.hideLoading()
					uni.showToast({title:'操作成功~'})
					var numberMoney=Number(setMoney.value)
					counter.cooperationShopData.CooperativeStoresMoney=e==0? Number(counter.cooperationShopData.CooperativeStoresMoney)+Number(setMoney.value):counter.cooperationShopData.CooperativeStoresMoney-Number(setMoney.value)
					//console.log(counter.cooperationShopData.CooperativeStoresMoney+);
				}else{
					uni.hideLoading()
					uni.showToast({title:'操作失败~',icon:'error'})
				}
				// console.log(res);
			})
		}else{
			
		}
		proxy.$refs.popup.close()
	}
	const shopDetail=()=>{//跳转至合作店铺余额明细
		var idValue=Props.pageIndex==0?counter.cooperationShopData.mainStore.id:counter.cooperationShopData.branchStore.id
		uni.navigateTo({
			url:'/pages/mimeSupPage/dianpuSupPage/shopDetail/shopDetail?pageIndex='+Props.pageIndex+'&shop_id='+idValue
		})
	}
	const phone=(e)=>{//点击联系店主
		uni.makePhoneCall({
			phoneNumber:e,
		})
	}
	const addGame=()=>{//跳转至添加合作玩法页面
		uni.navigateTo({
			url:'/pages/mimeSupPage/dianpuSupPage/addGameState/addGameState',
			animationType: "slide-in-bottom",
		})
	}
</script>

<style>
	.buttomStyle{
		width:100%;
		height:80rpx;
		background-color:#FDC830;
		border-radius:15rpx;
		text-align: center;
		line-height:80rpx;
		color: white;
		margin:20rpx 0rpx;
		transition: show 0.5s;
	}
	.buttonStyle{
		width:100%;
		margin:auto;
		display: flex;
		align-items: center;
		justify-content:space-evenly;
	}
	.topCard{
		width:100%;
		background-color: white;
		margin-bottom:20rpx;
		padding-bottom:20rpx;
	}
	.popupCard{
		width:100%;
		height:470rpx;
		background-color: white;
		border-radius:30rpx;
		padding-top:10rpx;
	}
	.button{
		width:200rpx;
		height:70rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius:10rpx;
		font-weight: bold;
	}
	
	.button:active{
		transition:.2s;
		transform: scale(0.9);
	}
	body{
		background-color: #f3f3f3;
	}
	.status_bar{
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
