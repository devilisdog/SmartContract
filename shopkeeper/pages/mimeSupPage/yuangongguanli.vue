<template>
	<view class="statusBar"></view>
	<uni-nav-bar leftIcon="back" @clickLeft="back" title="员工管理" leftText="返回">
		<template v-slot:right>
			<view @click="proxy.$refs.popup.open()">
				<text>{{stateValue==1?'已启用':'已停用'}}</text>
				<!-- <uni-icons type="bottom"></uni-icons> -->
			</view>
		</template>
	</uni-nav-bar>
	
	<view class="topTitle">
		<text :style="stateValue==0?'color:red;':''">员工列表({{stateValue==1?'已启用':'已停用'}})</text>
	</view>
	<yc-yuangong-card
		v-show="itme.clerkConfig.state==stateValue"
		:stateValue='stateValue' 
		v-for="itme,index in staffDatat.data"
		:name='itme.nickname'
		:id='itme.id'
		:money='itme.money'
		:logo='itme.avatar'
		@alterSetff='clickAlter'
		@click='configuration(itme)'
		@clickCard='starffData'
	/>
	
	<uni-transition mode-class="slide-bottom" :show="showBottomButtom" style="width:100%;position:fixed;padding:20rpx;bottom:0;box-sizing: border-box;" >
		<view class="buttomStyle" @click="addPage">新增员工</view>
	</uni-transition>
		
	

	<uni-popup ref="popup" type="bottom">
		<view class="popupCard">
			<view 
				class="popupButtom" 
				:style="index==buttomValue?'background-color:#dadada;color:#4d4d4d;':''" 
				@click="clickButtom(index)"
				v-for="itme,index in 2">
				<text>{{index==0?'已启用':'已停用'}}</text>
			</view>
			<view class="popupButtom" @click="close()">
				<text>取消</text>
			</view>
		</view>
	</uni-popup>
	
	
	<!-- 对话框 -->
	<fui-dialog :show="show" @click="clickDialogButton" :content="dialogData.closeData"></fui-dialog>
</template>

<script setup>
	import common from '@/common/common'
	import api from '@/common/vmeitime-http/mine/mine.js';
	import {useCounterStore} from '@/stores/counter'
	import {onShow,onPageScroll} from "@dcloudio/uni-app"
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
	const buttomValue=ref(0)//查看的员工列表状态
	const stateValue=ref(1)//员工是否启用按钮状态
	const staffDatat=reactive([])//获取到的员工数据
	
	const showBottomButtom=ref(true)//底部新增员工按钮显示
	
	const show=ref(false)//对话框显示
	const dialogData=reactive({//对话框点击操作需要的数据
		'state':null,
		'id':null,
		'closeData':null
	})
	
	const clickDialogButton=(e)=>{//对话框按钮操作
		if(e.index==1){
			uni.showLoading({
				title:'修改中~'
			})
			api.GetAlterSetff({"id":dialogData.id,"state":dialogData.state=='stop'?'0':'1',}).then(async(res)=>{
				uni.hideLoading()
				if(res.data.code==1){
					 uni.showToast({
						title:'操作成功~'
					})
				}else{
					uni.showToast({
						title:'操作失败~',
						icon:'error'
					})
				}
				await requestStaffData()
			})
		}
		show.value=false
	}
	const requestStaffData=()=>{
		uni.showLoading({
			title: '加载中~'
		})
		api.GetStaffList({}).then((res)=>{
			staffDatat.data=res.data.data
			// console.log(res.data.data);
			uni.hideLoading()
		})
	}
	const starffData=(id)=>{
		uni.navigateTo({
			url:'/pages/mimeSupPage/yuangongguanliSupPage/addYuangong?id='+id+'&state=1',
			"animationType":"slide-in-bottom",
		})
	}
	const close=()=>{//关闭启动按钮弹窗
		proxy.$refs.popup.close()
	}
	
	onPageScroll((e)=>{
		if(e.scrollTop==0){
			showBottomButtom.value=true
		}else{
			showBottomButtom.value=false
		}
	})
	const configuration=(data)=>{//跳转至彩种编辑页面
		counter.EmployeeData=data
		uni.navigateTo({
			url:'/pages/mimeSupPage/yuangongguanliSupPage/yuangongguanliSupPage'
		})
	}
	const addPage=()=>{
		uni.navigateTo({
			url:'/pages/mimeSupPage/yuangongguanliSupPage/addYuangong',
			"animationType":"slide-in-bottom",
		})
	}
	onShow(()=>{
		requestStaffData()
	})
	
	const clickAlter=(e,name,id)=>{//更改店员状态（停用/启用）
		show.value=true
		dialogData.closeData='确定停用 '+name+'('+id+')'+' 吗？'
		dialogData.id=id
		dialogData.state=e
	}
	const back=()=>{//放回
		uni.navigateBack()
	}
	const clickButtom=(index)=>{//启用/停用弹窗选项
		if(buttomValue.value!=index){
			buttomValue.value=index
			close()
			requestStaffData()
		}
		if(index==0){
			stateValue.value=1
		}else{
			stateValue.value=0
		}
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
	}

	.topTitle{
		width:100%;
		height:80rpx;
		display: flex;
		border-bottom:1rpx solid #f3f3f3;
		align-items: center;
		background-color:white;
		padding-left:20rpx;
		margin-bottom:20rpx;
		box-sizing: border-box;
		 
	}
	.popupCard2{
		width:700rpx;
		height:470rpx;
		background-color: white;
		border-radius:20rpx;
		padding-top:10rpx;
	}
	.popupButtom{
		margin:10rpx 0rpx;
		height:80rpx;
		width:100%;
		text-align: center;
		line-height:80rpx;
		border-radius:10rpx;
	}
	.popupCard{
		width:100%;
		height:300rpx;
		background-color:white;
		display:flex;
		flex-flow: column;
		align-items: center;
		border-top-left-radius:20rpx;
		border-top-right-radius:20rpx;
	}
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
	}
	body{
		background-color:#f3f3f3;
	}

</style>
