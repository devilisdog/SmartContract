<template>
	<view class="statusBar"></view>
	<uni-nav-bar :title="Props.state==1?'修改员工信息':'新增员工'" leftIcon="closeempty" @clickLeft="back"/>
	
	<scroll-view scroll-y="true" :style="{height:common.scrollH()-125+'rpx'}">
		<view class="bigCard">
			<view class="fromStyle" v-for="itme,index in staffListArr" v-show="index==0&&Props.state==1?false:true">
				<text style="width:240rpx;">{{itme.title}}	
					<br />
					<text v-if="index==0" style="font-size: 25rpx;color: red;"> 账号不支持纯数字</text>
				</text>
				
				<input :placeholder="itme.placeholder" v-model="itme.value"/>
			</view>
		<!-- 	<view class="fromStyle">
				<text style="width:240rpx;">图形验证码：</text>
				<input placeholder="请输入图形验证码"/>
			</view>
			<view class="fromStyle">
				<text style="width:260rpx;">短信验证码：</text>
				<input placeholder="请输入短信验证码"/>
				<view class="authCode">
					发送
				</view>
			</view> -->
		</view>
		<view class="bigCard">
			<view class="fromStyle" style="justify-content: space-between;" v-for="itme,index in staffSwitch" v-show="index==1&&Props.state!=1?false:true">
				<text>{{itme.title}}</text>
				<switch style="transform:scale(0.8)" 
					:checked="itme.switchState==1" 
					@change="clickSwitch(index,itme.switchState)"
					/>
			</view>
		</view>
	</scroll-view>
	<view style="position: fixed;bottom:0rpx;width:100%;padding:20rpx;box-sizing: border-box;">
		<view class="buttomStyle" @click="saveButton">{{Props.state==1?'保存并修改':'确认新增'}}</view>
		<!-- <view style="padding:0rpx 20rpx;">
			<button type="primary" @click="saveButton">
				<text>{{Props.state==1?'保存并修改':'确认新增'}}</text>
			</button>
		</view> -->
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
		defineProps,
	} from 'vue';
	import api from '@/common/vmeitime-http/mine/mine.js';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	import common from "@/common/common.js"
	const Props=defineProps(['id','state'])
	const staffListArr=reactive([
		{title:'员工账号(必填)：',placeholder:'点击修改员工账号',value:null},
		{title:'员工密码(必填)：',placeholder:'点击修改员工密码',value:null},
		{title:'真实姓名：',placeholder:'请输入员工姓名',value:null},
		{title:'身份证号：',placeholder:'请输入员工身份证号码',value:null},
		{title:'备注：',placeholder:'请输入备注',value:null},
		{title:'密码错误次数：',placeholder:'',value:0},
		// {title:'手机号码：',placeholder:'如已有可重新输入更改号码',value:''}
	])
	const staffSwitch=reactive([
		// {title:'允许重复登录',switchState:true},
		// {title:'允许账号密码登录',switchState:true},
		{title:'允许查看用户列表',switchState:'0'},
		{title:'允许查看合作',switchState:'0'},
		// {title:'允许查看用户手机号码',switchState:false},
		{title:'允许派奖',switchState:'0'},
	])
	const clickSwitch=(index,switchState)=>{//监听用户点击开关的index以及点击后的状态，并且进行修改
		if(switchState==0){
			staffSwitch[index].switchState='1'
		}else{
			staffSwitch[index].switchState='0'
		}
	}
	const back=()=>{
		uni.navigateBack()
	}
	onBeforeMount(()=>{
		if(Props.state==1){
			uni.showLoading({
					title: '加载中~'
				})
			api.GetClerkInfo({"id":Props.id}).then((res)=>{
				staffListArr[2].value=res.data.data.clerkConfig.realName
				staffListArr[5].value=res.data.data.loginfailure
				staffListArr[4].value=res.data.data.clerkConfig.remarks
				staffListArr[3].value=res.data.data.clerkConfig.sfz
				staffSwitch[0].switchState=res.data.data.clerkConfig.viewUserlist
				staffSwitch[1].switchState=res.data.data.clerkConfig.cooperation
				staffSwitch[2].switchState=res.data.data.clerkConfig.award
				uni.hideLoading()
				// console.log('获取员工信息',res);
			})
		}
	})
	const saveButton=()=>{
		if(Props.state!=1){
			uni.showLoading({
				title: '新增中~'
			})
			api.GetAddClerk({
				"username": staffListArr[0].value,
				"password":staffListArr[1].value,
				"realName":staffListArr[2].value,
				"sfzID":staffListArr[3].value,
				"remarks":staffListArr[4].value,
				
				"viewUserlist":staffSwitch[0].switchState,
				"award":staffSwitch[2].switchState,
				"cooperation":staffSwitch[1].switchState,
			}).then((res)=>{
				if(res.data.code==1){
					uni.hideLoading()
					uni.showToast({
						title:'新增成功~'
					})
				}else{
					uni.hideLoading()
					uni.showToast({
						title:res.data.data,
						icon:'error'
					})
				}
				// console.log('新增员工回调',res);
			})
		}else{
			uni.showLoading({
				title: '编辑中~'
			})
			api.GetEditClerk({
				"id":Props.id,
				"password":staffListArr[1].value,
				"realName":staffListArr[2].value,
				"sfzID":staffListArr[3].value,
				"remarks":staffListArr[4].value,
				"viewUserlist":staffSwitch[0].switchState,
				"award":staffSwitch[2].switchState,
				"cooperation":staffSwitch[1].switchState,
			}).then((res)=>{
				uni.hideLoading()
				if(res.data.code==1){
					uni.showToast({
						title:'编辑成功~'
					})
					// console.log(res);
				}else{
					uni.showToast({
						title:'编辑失败~',
						icon:'error'
					})
				}
			})
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
	.authCode{
		width:130rpx;
		height:60rpx;
		background-color:#4586ff;
		border-radius:5rpx;
		text-align: center;
		line-height:50rpx;
		color: white;
		margin-left:10rpx;
	}
	.fromStyle{
		display: flex;
		height:90rpx;
		align-items: center;
		border-bottom:1rpx solid #ebebeb;
	}
	.bigCard{
		width:680rpx;
		padding:20rpx;
		background-color:white;
		border-radius:15rpx;
		margin:20rpx auto;
	}
	body{
		background-color:#f3f3f3;
	}
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
	}
</style>
